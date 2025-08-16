// // MatchCard.tsx
// import { useEffect, useRef } from "react";
// import { Match } from "../lib/bracket";

// export function MatchCard({
//   match,
//   onRefReady,
// }: {
//   match: Match;
//   onRefReady?: (id: string, el: HTMLDivElement | null) => void;
// }) {
//   const ref = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     if (onRefReady && match.id) {
//       onRefReady(match.id, ref.current);
//     }
//   }, [onRefReady, match.id]);

//   return (
//     <div
//       ref={ref}
//       className="bg-[#2d3848] border border-[#3d495b] rounded-md p-4 shadow-lg text-center relative"
//     >
//       <div className="font-medium">
//         {match.player1 ?? <span className="text-gray-500">wolny los</span>}
//       </div>
//       <div className="my-1 text-gray-400 text-sm">vs</div>
//       <div className="font-medium">
//         {match.player2 ?? <span className="text-gray-500">wolny los</span>}
//       </div>
//     </div>
//   );
// }
