import { Message } from "discord.js";
import { Event } from "../structs/Event.ts";
import { bot } from "#bot";

export default class extends Event<"messageCreate"> {
  public name = "messageCreate" as const;
  public once = true;

  public override shouldExecute(message: Message<boolean>) {
    return !message.author.bot && message.inGuild() && message.content.startsWith(bot.prefix);
  }

  public async execute(message: Message<boolean>): Promise<void> {
    const items = message.content.slice(bot.prefix.length).split(" ");
    const command = bot.commands.get(`${items[0]} ${items[1]}`) || bot.commands.get(items[0]!);
    if (!command) {
      await message.reply(`> ❌ **| Erro!** ${message.author}, o **comando** não **foi encontrado**.`);
      return;
    }

    const args = command.isSubCommand() ? items.splice(2) : items.splice(1);
    if (!command.shouldExecute(message, args)) return;
    await command.execute(message, args);
  }
}
