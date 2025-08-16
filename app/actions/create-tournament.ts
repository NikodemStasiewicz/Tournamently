"use server";

import { prisma } from "@/app/lib/prisma";
import { createBracketInDb } from "@/app/lib/createBracketInDb";

type Params = {
  name: string;
  game: string;
  startDate: Date;
  endDate: Date;
  participantLimit: number;
  format: "SINGLE_ELIMINATION" | "DOUBLE_ELIMINATION";
  ownerId: string;
  participants: string[]; // usernames
};

export async function createTournament(params: Params) {
  const {
    name,
    game,
    startDate,
    endDate,
    participantLimit,
    format,
    ownerId,
    participants,
  } = params;

  // Stwórz turniej
  const tournament = await prisma.tournament.create({
    data: {
      name,
      game,
      startDate,
      endDate,
      participantLimit,
      format,
      ownerId,
      participants: {
        create: participants.map((email) => ({
          user: { connect: { email } }, // zakładamy unikalne username
        })),
      },
    },
  });

  // Wygeneruj drabinkę w bazie
  await createBracketInDb(tournament.id, participants, format);

  return tournament;
}
