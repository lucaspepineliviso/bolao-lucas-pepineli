export function calculatePoints(
  betHome: number,
  betAway: number,
  realHome: number,
  realAway: number
): number {
  if (betHome === realHome && betAway === realAway) return 10;

  const betWinner = betHome > betAway ? "HOME" : betAway > betHome ? "AWAY" : "DRAW";
  const realWinner = realHome > realAway ? "HOME" : realAway > realHome ? "AWAY" : "DRAW";

  if (betWinner === realWinner) {
    if (betHome === realHome || betAway === realAway) return 5;
    return 3;
  }

  return 0;
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    dateStyle: "long",
    timeStyle: "short",
  }).format(new Date(date));
}
