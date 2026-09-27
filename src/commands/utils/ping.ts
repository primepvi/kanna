import { Message } from "discord.js";
import { PrefixCommand } from "../../structs/PrefixCommand.ts";
import { bot } from "#bot";

export default class extends PrefixCommand {
    public name = "ping";  
    public async execute(message: Message<boolean>, args: string[]): Promise<void> {
      await message.reply(`> 🏓 **| Pong!** ${message.author}, minha latência atual é de \`${bot.ws.ping}\` ms.`);
    }
}
