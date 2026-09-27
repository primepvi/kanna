import { type ClientEvents } from "discord.js";

export abstract class Event<T extends keyof ClientEvents = keyof ClientEvents> {
  abstract readonly name: T;
  abstract readonly once: boolean;

  public shouldExecute(...args: ClientEvents[T]): boolean { return true; }
  abstract execute(...args: ClientEvents[T]): Promise<void> | void;
}
