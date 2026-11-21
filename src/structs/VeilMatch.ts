import { Collection, Message } from "discord.js";
import { VeilPlayer } from "./VeilPlayer.ts";
import { shuffleArray } from "../utils/rng.ts";
import { CONFIG, type VeilCard, type VeilConfig } from "../constants/veil.ts";

export interface VeilMatchRound {
  index: number;
  turn: number;
  counter: number;
  previousCards: VeilCard[];
  cards: VeilCard[];
};

export type VeilMatchStatus = "lobby" | "playing" | "ended";

export class VeilMatch {
  public id: string;
  public winner: string = "";
  public host: string;
  public goals: number[];
  public round: VeilMatchRound;
  public players: Collection<string, VeilPlayer>;
  public config: VeilConfig;
  public message?: Message<true>;
  public status: VeilMatchStatus;

  public constructor(host: string, config: VeilConfig = CONFIG) {
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
      previousCards: [],
    };

    this.players = new Collection();
    this.config = config;
    this.status = "lobby";
  }

  public addPlayer(id: string): boolean {
    const playerCanJoin = !this.players.find(p => p.id === id) && this.players.size < 5 && this.status === "lobby";
    if (!playerCanJoin) return false;

    const goal = this.goals.pop()!;
    this.players.set(id, new VeilPlayer(id, this.players.size, goal));
    return true;
  }

  public removePlayer(id: string): boolean {
    return this.players.sweep(p => p.id === id) > 0;
  }

  public renderBoard(): string {
    const currentPlayer = this.players.find(p => p.index === this.round.turn)!;
    
    const previousTable = this.round.previousCards.map(c => c.emoji)
      .join(" ");
    const table = this.round.cards.map(c => c.emoji)
      .join(" ");

    const board = [
      `**Rodada**: ${this.round.index}`,
      `**Jogador**: <@${currentPlayer.id}>`,
      `**Última Rodada**: ${previousTable}`,
      `**Mesa**: ${table}`,
      `**Contador**: ${this.round.counter}`,
    ].join("\n");

    return board;
  }

  public start(): boolean {
    const canStart = this.players.size <= this.config.maxPlayers
      && this.players.size >= this.config.minPlayers && this.status === "lobby";
    if (!canStart) return false;

    this.status = "playing";

    return this.initializeRound();
  }

  public initializeRound(): boolean {
    if (this.status !== "playing") return false;
    
    this.round.index += 1;
    for (let i = 0; i < this.players.size; i++) {
      const player = this.players.find(p => p.index === this.round.turn)!;
      const cardCount = Math.max(this.config.maxHandCards - player.cards.length + this.config.maxTurnCards, 0);
      player.giveRandomCards(cardCount);

      this.round.turn = (this.round.turn + 1) % this.players.size;
    }

    return true;
  }

  public playTurn(cards: string[]): boolean {
    if (this.status !== "playing") return false;
    
    const player = this.players.find(p => p.index === this.round.turn)!;
    const playedCards = player.removeCards(cards);
    for (const card of playedCards) {
      this.round.cards.push(card);
      this.round.counter += card.value;
    }

    this.round.turn += 1;
    if (this.round.turn >= this.players.size) {
      this.finalizeRound();
    }

    return true;
  }

  public finalizeRound() {
    this.round.turn = 0;
    this.round.previousCards = this.round.cards;
    this.round.cards = [];

    const scorer = this.players.find(p => p.goal === this.round.counter);
    if (scorer) {
      scorer.points += 1;
    }

    if (scorer && scorer.points >= this.config.maxPoints) {
      this.round.index = -1;
      this.winner = scorer.id;
      this.status = "ended";
      
      return;
    }

    this.initializeRound();
  }
}
