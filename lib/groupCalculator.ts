export interface TeamStanding {
  team: string;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

export interface GroupResult {
  first: string;
  second: string;
  third: string;
  thirdPoints: number;
  thirdGD: number;
  thirdGF: number;
  standings: TeamStanding[];
}

export function calculateGroupStandings(
  groupLetter: string,
  matches: { homeTeam: string; awayTeam: string; homeScore: number; awayScore: number }[]
): TeamStanding[] {
  const teams = new Map<string, TeamStanding>();

  for (const m of matches) {
    if (!teams.has(m.homeTeam)) {
      teams.set(m.homeTeam, { team: m.homeTeam, played: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 });
    }
    if (!teams.has(m.awayTeam)) {
      teams.set(m.awayTeam, { team: m.awayTeam, played: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 });
    }

    const home = teams.get(m.homeTeam)!;
    const away = teams.get(m.awayTeam)!;

    home.played++;
    away.played++;
    home.goalsFor += m.homeScore;
    home.goalsAgainst += m.awayScore;
    away.goalsFor += m.awayScore;
    away.goalsAgainst += m.homeScore;

    if (m.homeScore > m.awayScore) {
      home.wins++;
      home.points += 3;
      away.losses++;
    } else if (m.homeScore < m.awayScore) {
      away.wins++;
      away.points += 3;
      home.losses++;
    } else {
      home.draws++;
      away.draws++;
      home.points += 1;
      away.points += 1;
    }
  }

  const standings = Array.from(teams.values()).map((t) => ({
    ...t,
    goalDifference: t.goalsFor - t.goalsAgainst,
  }));

  standings.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
    return b.goalsFor - a.goalsFor;
  });

  return standings;
}

export function getGroupResults(
  groupLetter: string,
  matches: { homeTeam: string; awayTeam: string; homeScore: number; awayScore: number }[]
): GroupResult {
  const standings = calculateGroupStandings(groupLetter, matches);
  return {
    first: standings[0]?.team || `1º ${groupLetter}`,
    second: standings[1]?.team || `2º ${groupLetter}`,
    third: standings[2]?.team || `3º ${groupLetter}`,
    thirdPoints: standings[2]?.points || 0,
    thirdGD: standings[2]?.goalDifference || 0,
    thirdGF: standings[2]?.goalsFor || 0,
    standings,
  };
}

export function selectBestThirdPlaced(
  groupResults: Record<string, GroupResult>
): { team: string; group: string; points: number; gd: number; gf: number }[] {
  const thirds = Object.entries(groupResults).map(([letter, result]) => ({
    team: result.third,
    group: letter,
    points: result.thirdPoints,
    gd: result.thirdGD,
    gf: result.thirdGF,
  }));

  thirds.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.gd !== a.gd) return b.gd - a.gd;
    return b.gf - a.gf;
  });

  return thirds.slice(0, 4);
}

export function calculateKnockoutTeams(
  scores: Record<number, { home: string; away: string }>,
  allMatches: { id: number; homeTeam: string; awayTeam: string; stage: string; groupName: string | null }[]
): Record<number, { homeTeam: string; awayTeam: string }> {
  const result: Record<number, { homeTeam: string; awayTeam: string }> = {};

  const groupLetters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];
  const groupResults: Record<string, GroupResult> = {};

  for (const letter of groupLetters) {
    const groupMatches = allMatches
      .filter((m) => m.stage === `GRUPO ${letter}`)
      .map((m) => {
        const s = scores[m.id];
        return {
          homeTeam: m.homeTeam,
          awayTeam: m.awayTeam,
          homeScore: s?.home !== "" && s?.home !== undefined ? parseInt(s.home) : 0,
          awayScore: s?.away !== "" && s?.away !== undefined ? parseInt(s.away) : 0,
        };
      });

    groupResults[letter] = getGroupResults(letter, groupMatches);
  }

  const bestThird = selectBestThirdPlaced(groupResults);
  const bestThirdMap = new Map<string, string>();
  bestThird.forEach((t, i) => {
    bestThirdMap.set(t.team, `3º Melhor ${i + 1}`);
  });

  for (const match of allMatches) {
    if (match.stage === "GRUPO") continue;

    const homeTeam = match.homeTeam;
    const awayTeam = match.awayTeam;

    const resolve = (placeholder: string): string => {
      const groupMatch = placeholder.match(/^([123])º ([A-L])$/);
      if (groupMatch) {
        const [, position, letter] = groupMatch;
        const groupResult = groupResults[letter];
        if (!groupResult) return placeholder;
        if (position === "1") return groupResult.first;
        if (position === "2") return groupResult.second;
        if (position === "3") return groupResult.third;
      }

      if (placeholder === "3º Melhor") {
        const thirdMatch = match.homeTeam === "3º Melhor" ? match.homeTeam : match.awayTeam;
        const mapped = bestThirdMap.get(thirdMatch);
        if (mapped) return mapped;
      }

      return placeholder;
    };

    result[match.id] = {
      homeTeam: resolve(homeTeam),
      awayTeam: resolve(awayTeam),
    };
  }

  return result;
}
