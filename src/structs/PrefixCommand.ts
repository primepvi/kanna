import { Message } from "discord.js";

export abstract class PrefixCommand {
  abstract readonly name: string;

  public shouldExecute(message: Message<boolean>, args: string[]): boolean { return true; }
  abstract execute(message: Message<boolean>, args: string[]): Promise<void> | void;  
}
