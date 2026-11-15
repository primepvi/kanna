import { Message, codeBlock } from "discord.js";
import { inspect } from "node:util";
import { PrefixCommand } from "../../structs/PrefixCommand.ts";
import { bot } from "#bot";

export default class extends PrefixCommand {
  public name = "eval";

  public async execute(
    message: Message<boolean>,
    args: string[]
  ): Promise<void> {
    if (message.author.id !== "1318285413957238819") {
      await message.reply("Você não tem permissão para executar este comando.");
      return;
    }

    const code = args.join(" ")
      .trim()
      .replace(/^```(?:js|javascript)?\s*\n([\s\S]*?)\n```$/i, "$1")
      .trim();

    if (!code) {
      await message.reply("Informe o código que deseja executar.");
      return;
    }

    try {
      const result = await eval(code);
      const output = inspect(result, {
        depth: 2,
        colors: false,
      });

      await message.reply(codeBlock("js", output).slice(0, 1900));
    } catch (error) {
      const output = inspect(error, {
        depth: 1,
        colors: false,
      });

      await message.reply(codeBlock("js", output).slice(0, 1900));
    }
  }
}
