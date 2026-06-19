export function isBetOpen(matchDate: Date | string): boolean {
  return new Date() < new Date(matchDate);
}

export function timeUntilKickoff(matchDate: Date | string): string {
  const now = new Date();
  const kickoff = new Date(matchDate);
  const diff = kickoff.getTime() - now.getTime();

  if (diff <= 0) return "Encerrado";

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) return `Fecha em ${days}d ${hours}h`;
  if (hours > 0) return `Fecha em ${hours}h ${minutes}min`;
  return `Fecha em ${minutes}min`;
}
