import { Message } from "discord.js";

export abstract class PrefixCommand {
  abstract readonly name: string;
  abstract execute(message: Message<boolean>, args: string[]): Promise<void> | void;
  
  public shouldExecute(message: Message<boolean>, args: string[]): boolean { return true; }
  public isSubCommand(): this is PrefixSubCommand { return false; }
}

export abstract class PrefixSubCommand extends PrefixCommand {
  abstract readonly parent: string;  
  public isSubCommand(): this is PrefixSubCommand { return true; }
}
