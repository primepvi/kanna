export interface VeilConfig {
  maxPlayers: number;
  minPlayers: number;
  maxHandCards: number,
  maxTurnCards: number,
  maxPoints: number,
  allowNegativePoints: boolean;
  minPointsToGuess: number,
  wrongGuessPointPenalty: number,
  correctGuessPointReward: number,
};

export const CONFIG: VeilConfig = {
  // Game Limits
  maxPlayers: 5,
  minPlayers: 2,
  maxHandCards: 5,
  maxTurnCards: 3,
  maxPoints: 2,
  allowNegativePoints: false,

  // Guess Goal
  minPointsToGuess: 1,  
  wrongGuessPointPenalty: 1,
  correctGuessPointReward: 1,
};

export interface VeilCard {
  id: string;
  value: number;
  emoji: string;
};

export const CARDS: Array<VeilCard> = [
  {
    id: "minus_1",
    value: -1,
    emoji: "<:minus_1:1573735914604335195>",
  },
  {
    id: "minus_2",
    value: -2,
    emoji: "<:minus_2:1573735916831244298>",
  },
  {
    id: "minus_3",
    value: -3,
    emoji: "<:minus_3:1573735919557804173>",
  },
  {
    id: "plus_1",
    value: 1,
    emoji: "<:plus_1:1573735927656743085>",
  },
  {
    id: "plus_2",
    value: 2,
    emoji: "<:plus_2:1573735929305243658>",
  },
  {
    id: "plus_3",
    value: 3,
    emoji: "<:plus_3:1573735931138150540>",
  },
  {
    id: "zero",
    value: 0,
    emoji: "<:zero:1573735933436764250>",
  }
];
