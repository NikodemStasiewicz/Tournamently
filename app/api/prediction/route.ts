
// app/api/prediction/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { BracketType } from "@prisma/client";

interface MatchData {
  id: string;
  player1Id: string | null;
  player2Id: string | null;
  winnerId: string | null;
  round: number;
  bracket: BracketType | null;
  matchNumber: number | null;
}

interface PlayerStats {
  playerId: string;
  username: string;
  displayName: string;
  wins: number;
  losses: number;
  played: number;
  winRate: number;
  streak: number;
  form: number; // forma z ostatnich 5 meczów (0-5)
  avgOpponentStrength: number;
  dominance: number; // ocena na podstawie przeciwników
  recentMatches: MatchData[];
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const tournamentId = url.searchParams.get("tournamentId");
    const detailed = url.searchParams.get("detailed") === "true";

    if (!tournamentId) {
      return NextResponse.json({ error: "Missing tournamentId" }, { status: 400 });
    }

    // Pobierz uczestników
    const participants = await prisma.tournamentParticipant.findMany({
      where: { tournamentId },
      include: { user: { select: { id: true, username: true, name: true } } },
    });

    if (!participants || participants.length === 0) {
      return NextResponse.json({ 
        players: [], 
        predictedWinner: null,
        topContenders: [],
        headToHeads: [],
        insights: {},
        meta: { message: "No participants" } 
      });
    }

    const playerIds = participants.map((p) => p.user.id);

    // Pobierz wszystkie mecze turnieju
    const matches = await prisma.match.findMany({
      where: { tournamentId },
      select: {
        id: true,
        player1Id: true,
        player2Id: true,
        winnerId: true,
        round: true,
        bracket: true,
        matchNumber: true,
      },
      orderBy: [
        { round: 'asc' },
        { matchNumber: 'asc' }
      ]
    }) as MatchData[];

    // Inicjuj statystyki graczy
    const playerStatsMap = new Map<string, PlayerStats>();
    
    for (const participant of participants) {
      const id = participant.user.id;
      playerStatsMap.set(id, {
        playerId: id,
        username: participant.user.username,
        displayName: participant.user.name ?? participant.user.username,
        wins: 0,
        losses: 0,
        played: 0,
        winRate: 0,
        streak: 0,
        form: 0,
        avgOpponentStrength: 0,
        dominance: 0,
        recentMatches: []
      });
    }

    // Analizuj mecze
    const finishedMatches = matches.filter(m => m.winnerId);
    
    for (const match of finishedMatches) {
      const { player1Id, player2Id, winnerId } = match;
      
      if (!player1Id || !player2Id || !winnerId) continue;
      
      const winner = playerStatsMap.get(winnerId);
      const loser = playerStatsMap.get(winnerId === player1Id ? player2Id : player1Id);
      
      if (winner && loser) {
        winner.wins += 1;
        winner.played += 1;
        winner.recentMatches.push(match);
        
        loser.losses += 1;
        loser.played += 1;
        loser.recentMatches.push(match);
      }
    }

    // Oblicz dodatkowe metryki
    for (const [playerId, stats] of playerStatsMap) {
      // Win rate
      stats.winRate = stats.played > 0 ? +((stats.wins / stats.played) * 100).toFixed(1) : 0;
      
      // Passa (streak) - ostatnie mecze z rzędu wygrane/przegrane
      stats.streak = calculateStreak(stats.recentMatches, playerId);
      
      // Forma z ostatnich 5 meczów
      stats.form = calculateForm(stats.recentMatches.slice(-5), playerId);
      
      if (detailed) {
        // Średnia siła przeciwników (synchroniczne teraz)
        stats.avgOpponentStrength = calculateAvgOpponentStrength(
          stats.recentMatches, 
          playerId, 
          playerStatsMap
        );
        
        // Dominacja (ocena na podstawie przeciwników i rund)
        stats.dominance = calculateDominance(stats.recentMatches, playerId);
      }
    }

    const players = Array.from(playerStatsMap.values())
      .sort((a, b) => {
        // Sortowanie: winRate -> wins -> form
        if (b.winRate !== a.winRate) return b.winRate - a.winRate;
        if (b.wins !== a.wins) return b.wins - a.wins;
        return b.form - a.form;
      });

    // Predykcja zwycięzcy (bardziej zaawansowana)
    const predictedWinner = calculatePredictedWinner(players);
    
    // Top kandydaci (top 5)
    const topContenders = players.slice(0, Math.min(5, players.length));
    
    // Head-to-head statistics
    const headToHeads = detailed ? calculateHeadToHeads(players, finishedMatches) : [];
    
    // Insights
    const insights = calculateInsights(players);
    
    // Confidence level predykcji
    const confidence = calculatePredictionConfidence(players, finishedMatches);

    return NextResponse.json({
      players,
      predictedWinner,
      topContenders,
      headToHeads,
      insights,
      meta: {
        matchesCount: matches.length,
        algorithm: detailed ? "Advanced ELO + Form Analysis" : "Simple Win Rate",
        confidence
      }
    });

  } catch (err) {
    console.error("API /api/prediction error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// Helper functions

function calculateStreak(matches: MatchData[], playerId: string): number {
  if (!matches.length) return 0;
  
  // Sortuj mecze według rundy i numeru meczu (najnowsze na końcu)
  const sortedMatches = matches
    .filter(m => m.winnerId) // tylko zakończone mecze
    .sort((a, b) => {
      if (a.round !== b.round) return a.round - b.round;
      return (a.matchNumber || 0) - (b.matchNumber || 0);
    })
    .reverse(); // najnowsze pierwsze
  
  let streak = 0;
  let lastResult: boolean | null = null;
  
  for (const match of sortedMatches) {
    const won = match.winnerId === playerId;
    
    if (lastResult === null) {
      lastResult = won;
      streak = won ? 1 : -1;
    } else if (lastResult === won) {
      streak += won ? 1 : -1;
    } else {
      break;
    }
  }
  
  return streak;
}

function calculateForm(recentMatches: MatchData[], playerId: string): number {
  if (!recentMatches.length) return 0;
  
  // Weź ostatnie 5 zakończonych meczów
  const finishedMatches = recentMatches
    .filter(m => m.winnerId)
    .slice(-5);
  
  const wins = finishedMatches.filter(m => m.winnerId === playerId).length;
  return wins; // 0-5 scale
}

function calculateAvgOpponentStrength(
  matches: MatchData[], 
  playerId: string, 
  playerStatsMap: Map<string, PlayerStats>
): number {
  if (!matches.length) return 0;
  
  const opponentStrengths: number[] = [];
  
  for (const match of matches) {
    if (!match.winnerId) continue; // tylko zakończone mecze
    
    const opponentId = match.player1Id === playerId ? match.player2Id : match.player1Id;
    if (opponentId && playerStatsMap.has(opponentId)) {
      const opponent = playerStatsMap.get(opponentId)!;
      opponentStrengths.push(opponent.winRate);
    }
  }
  
  if (!opponentStrengths.length) return 0;
  
  const avgStrength = opponentStrengths.reduce((sum, str) => sum + str, 0) / opponentStrengths.length;
  return +avgStrength.toFixed(1);
}

function calculateDominance(matches: MatchData[], playerId: string): number {
  // Bez konkretnych score'ów, używamy prostszej metryki
  // np. procent wygranych w różnych fazach turnieju
  if (!matches.length) return 0;
  
  const wonMatches = matches.filter(m => m.winnerId === playerId);
  const earlyRoundWins = wonMatches.filter(m => m.round <= 2).length;
  const lateRoundWins = wonMatches.filter(m => m.round > 2).length;
  
  // Wyższe punkty za wygrane w późniejszych rundach
  const dominanceScore = (earlyRoundWins * 1) + (lateRoundWins * 2);
  return dominanceScore;
}

function calculatePredictedWinner(players: PlayerStats[]): PlayerStats | null {
  if (!players.length) return null;
  
  // Zaawansowany algorytm uwzględniający różne czynniki
  const scoredPlayers = players.map(player => {
    let score = 0;
    
    // Główny składnik: win rate (0-100 punktów)
    score += player.winRate;
    
    // Bonus za liczbę meczów (max 20 punktów)
    const experienceBonus = Math.min(player.played * 2, 20);
    score += experienceBonus;
    
    // Bonus/malus za formę (max ±15 punktów)
    const formBonus = (player.form / 5) * 15;
    score += formBonus;
    
    // Bonus za passę (max ±10 punktów)
    const streakBonus = Math.max(-10, Math.min(10, player.streak * 2));
    score += streakBonus;
    
    // Bonus za silnych przeciwników (max 10 punktów)
    if (player.avgOpponentStrength > 0) {
      const opponentBonus = (player.avgOpponentStrength / 100) * 10;
      score += opponentBonus;
    }
    
    return { ...player, predictionScore: score };
  });
  
  // Sortuj po prediction score
  scoredPlayers.sort((a, b) => b.predictionScore - a.predictionScore);
  
  return scoredPlayers[0];
}

function calculateHeadToHeads(players: PlayerStats[], matches: MatchData[]) {
  const h2hMap = new Map<string, any>();
  
  // Znajdź najciekawsze pojedynki (między top graczami)
  const topPlayers = players.slice(0, Math.min(8, players.length));
  
  for (const match of matches) {
    if (!match.winnerId || !match.player1Id || !match.player2Id) continue;
    
    const p1InTop = topPlayers.find(p => p.playerId === match.player1Id);
    const p2InTop = topPlayers.find(p => p.playerId === match.player2Id);
    
    if (!p1InTop || !p2InTop) continue;
    
    const key = [match.player1Id, match.player2Id].sort().join('-');
    
    if (!h2hMap.has(key)) {
      h2hMap.set(key, {
        player1Id: match.player1Id,
        player2Id: match.player2Id,
        player1Name: p1InTop.displayName,
        player2Name: p2InTop.displayName,
        player1Wins: 0,
        player2Wins: 0,
        totalMatches: 0
      });
    }
    
    const h2h = h2hMap.get(key);
    h2h.totalMatches++;
    
    if (match.winnerId === match.player1Id) {
      h2h.player1Wins++;
    } else {
      h2h.player2Wins++;
    }
  }
  
  return Array.from(h2hMap.values())
    .filter(h2h => h2h.totalMatches >= 2) // minimum 2 mecze
    .sort((a, b) => b.totalMatches - a.totalMatches)
    .slice(0, 5); // top 5 pojedynków
}

function calculateInsights(players: PlayerStats[]) {
  if (!players.length) return {};
  
  const insights: any = {};
  
  // Czarny koń: gracz poza top 3, ale z dobrą formą
  const darkHorseCandidate = players
    .slice(3) // poza top 3
    .filter(p => p.form >= 3 && p.played >= 3)
    .sort((a, b) => b.form - a.form)[0];
  
  if (darkHorseCandidate) {
    insights.darkHorse = darkHorseCandidate;
  }
  
  // Weteran: najwięcej meczów
  const veteran = players
    .filter(p => p.played > 0)
    .sort((a, b) => b.played - a.played)[0];
  
  if (veteran && veteran.played >= 5) {
    insights.veteran = veteran;
  }
  
  // Debiutant: mało meczów, ale dobry winrate
  const rookie = players
    .filter(p => p.played >= 2 && p.played <= 4 && p.winRate >= 60)
    .sort((a, b) => b.winRate - a.winRate)[0];
  
  if (rookie) {
    insights.rookie = rookie;
  }
  
  // Największy wzrost: dobra passa
  const mostImproved = players
    .filter(p => p.streak >= 3)
    .sort((a, b) => b.streak - a.streak)[0];
  
  if (mostImproved) {
    insights.mostImproved = mostImproved;
  }
  
  return insights;
}

function calculatePredictionConfidence(players: PlayerStats[], matches: MatchData[]): number {
  if (!players.length) return 0;
  
  const finishedMatches = matches.filter(m => m.winnerId).length;
  const topPlayer = players[0];
  
  let confidence = 0;
  
  // Więcej meczów = wyższa pewność (max 40 punktów)
  confidence += Math.min(finishedMatches * 2, 40);
  
  // Różnica między topem a resztą (max 30 punktów)
  if (players.length > 1) {
    const winRateDiff = topPlayer.winRate - players[1].winRate;
    confidence += Math.min(winRateDiff, 30);
  }
  
  // Liczba meczów top gracza (max 20 punktów)
  confidence += Math.min(topPlayer.played * 3, 20);
  
  // Forma top gracza (max 10 punktów)
  confidence += (topPlayer.form / 5) * 10;
  
  return Math.min(Math.round(confidence), 100);
}