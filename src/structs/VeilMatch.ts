import { Collection } from "discord.js";
import { VeilPlayer } from "./VeilPlayer.ts";
import { shuffleArray } from "../utils/rng.ts";

export interface VeilMatchRound {
  index: number;
  turn: number;
  counter: number;
  cards: string[];
};

export class VeilMatch {
  public id: string;
  public host: string;
  public goals: number[];
  public round: VeilMatchRound;
  public players: Collection<string, VeilPlayer>;

  public constructor(host: string) {
    this.id = String(Date.now() + parseInt(host));
    this.host = host;    
    this.goals = shuffleArray(Array.from(
      { length: 16 },
      (_, i) => i > 7 ? (i % 8) * -1 - 1 : i + 1
    ));

    this.round = {
      index: 0,
      turn: 0,
      counter: 0,
      cards: [],
    };

    this.players = new Collection();
  }

  public addPlayer(id: string): boolean {
    const playerCanJoin = !this.players.find(p => p.id === id) && this.players.size < 5;
    if (!playerCanJoin) return false;

    const goal = this.goals.pop()!;
    this.players.set(id, new VeilPlayer(id, goal));
    return true;
  }

  public removePlayer(id: string): boolean {
    return this.players.sweep(p => p.id === id) > 0;
  }
}
