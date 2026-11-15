import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Message } from "discord.js";
import { PrefixSubCommand } from "../../structs/PrefixCommand.ts";
import { bot } from "#bot";
import { VeilMatch } from "#structs/VeilMatch";

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

    const startMatchBtn = new ButtonBuilder()
      .setCustomId(`veil-start/${match.id}`)
      .setLabel("Começar")
      .setStyle(ButtonStyle.Primary);

    const joinMatchBtn = new ButtonBuilder()
      .setCustomId(`veil-join/${match.id}`)
      .setLabel("Entrar")
      .setStyle(ButtonStyle.Secondary);

    const row = new ActionRowBuilder<ButtonBuilder>()
      .setComponents(startMatchBtn, joinMatchBtn);

    const board = [
      `Id: ${match.id}`,
      `Anfitrião: ${message.author}`,
      `Jogadores: \n${match.players.map(p => `- <@${p.id}>`).join('\n')}`
    ];

    await message.reply({ content: board.join("\n"), components: [row] });
  }
}
