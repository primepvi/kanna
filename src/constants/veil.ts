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
  maxPoints: 5,
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
    emoji: "veil_minus_1",
  },
  {
    id: "minus_2",
    value: -2,
    emoji: "veil_minus_2",
  },
  {
    id: "minus_3",
    value: -3,
    emoji: "veil_minus_3",
  },
  {
    id: "plus_1",
    value: 1,
    emoji: "veil_plus_1",
  },
  {
    id: "plus_2",
    value: 2,
    emoji: "veil_plus_2",
  },
  {
    id: "plus_3",
    value: 3,
    emoji: "veil_plus_3",
  },
  {
    id: "zero",
    value: 0,
    emoji: "veil_zero",
  }
];
