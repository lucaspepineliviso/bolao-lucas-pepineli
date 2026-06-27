export function calculatePoints(
  betHome: number,
  betAway: number,
  realHome: number,
  realAway: number,
  isKnockout: boolean = false,
  betClassified?: string | null,
  realClassified?: string | null
): number {
  let pts = 0;

  // Cálculo clássico (tempo regulamentar)
  if (betHome === realHome && betAway === realAway) {
    pts = 10;
  } else {
    const betWinner = betHome > betAway ? "HOME" : betAway > betHome ? "AWAY" : "DRAW";
    const realWinner = realHome > realAway ? "HOME" : realAway > realHome ? "AWAY" : "DRAW";

    if (betWinner === realWinner) {
      if (betHome === realHome || betAway === realAway) {
        pts = 5;
      } else {
        pts = 3;
      }
    } else {
      pts = 0;
    }
  }

  // Bônus de classificado no mata-mata
  if (isKnockout) {
    let userChoice = betClassified;
    if (!userChoice) {
      if (betHome > betAway) userChoice = "HOME";
      else if (betAway > betHome) userChoice = "AWAY";
    }

    if (userChoice && realClassified && userChoice === realClassified) {
      pts += 3;
    }
  }

  return pts;
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    dateStyle: "long",
    timeStyle: "short",
  }).format(new Date(date));
}
