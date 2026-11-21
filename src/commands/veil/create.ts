import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ContainerBuilder, Message } from "discord.js";
import { PrefixSubCommand } from "../../structs/PrefixCommand.ts";
import { bot } from "#bot";
import { VeilMatch } from "#structs/VeilMatch";
import { container, text } from "../../utils/builders.ts";
import { icons } from "../../constants/icons.ts";
import { createLobbyButtons, createLobbyContainer } from "../../ui/veil.ts";

export default class extends PrefixSubCommand {
  public parent = "veil";
  public name = "create";

  public async execute(message: Message<boolean>, args: string[]): Promise<void> {
    const playerInMatch = bot.veil.find(m => m.host === message.author.id || m.players.has(message.author.id));
    if (playerInMatch) {
      await message.reply(`> :x: **| Erro!**, ${message.author} **você** já **está** em **uma partida**.`);
      return;
    }

    const match = new VeilMatch(message.author.id);
    match.addPlayer(message.author.id);
    bot.veil.set(match.id, match);

    const components = [createLobbyContainer(match), createLobbyButtons(match)];    
    await message.reply({ components, flags: ["IsComponentsV2"] });
  }
}
