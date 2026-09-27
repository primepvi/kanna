import { Message } from "discord.js";
import { PrefixCommand } from "../../structs/PrefixCommand.ts";
import { bot } from "#bot";
import { GuessEquation } from "../../minigames/GuessEquation.ts";
import { emojis } from "../../emojis.ts";

export default class extends PrefixCommand {
  public name = "ge";

  public async execute(message: Message<boolean>, args: string[]): Promise<void> {
    const game = bot.matches.get(message.author.id) || new GuessEquation(message.author.id, "20-4=16");

    const equation = args.join(" ");
    if (equation.length == 0) {
      await message.reply("Coloca equação ai newba.");
      return;
    }

    if (!game.isValidAttempt(equation)) {
      await message.reply("Equação invalida newba.");
      return;
    }

    const row = game.attempt(equation);
    const win = row.every(col => col.startsWith("ok"));

    const board = game.board
      .map(row => row.map(col => emojis[col as keyof typeof emojis] ?? emojis.wrong_empty).join(""))
      .join("\n");

    await message.reply(board);

    if (win) {
      await message.reply("Ganhou bb.");
      bot.matches.delete(message.author.id);

    } else if (game.attempts == row.length) {
      await message.reply("Perdeu newba.");
      bot.matches.delete(message.author.id);
      
    } else {
      bot.matches.set(message.author.id, game);
    }
  }
}
