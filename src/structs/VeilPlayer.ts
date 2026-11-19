import { randomInt } from "node:crypto";
import { CARDS, type VeilCard } from "../constants/veil.ts";
import { shuffleArray } from "../utils/rng.ts";

export class VeilPlayer {
  public id: string;
  public index: number;
  public goal: number;
  
  public points: number = 0;
  public cards: VeilCard[] = [];
  
  public constructor(id: string, index: number, goal: number) {
    this.id = id;
    this.index = index;
    this.goal = goal;
  }

  public giveRandomCards(amount: number): void {
    for (let i = 0; i < amount; i++) {
      const deck = shuffleArray(CARDS);
      const card = deck[randomInt(deck.length)]!;
      this.cards.push(card);
    }
  }

  public removeCards(cards: string[]): VeilCard[] {
    const result: VeilCard[] = [];
    
    for (const card of cards) {
      const index = this.cards.findIndex(c => c.id === card);
      if (index >= 0) {
        const removed = this.cards.splice(index, 1)[0]!;
        result.push(removed);
      }
    }

    return result;
  }
};
