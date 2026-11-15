import { bot } from "#bot";
import { Component } from "#structs/Component";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, type ButtonInteraction, type CacheType } from "discord.js";

export default class extends Component<"Button"> {
  public kind = "Button" as const;
  public name = "veil-join";

  public async execute(interaction: ButtonInteraction<CacheType>, args: string[]) {
    const match = bot.veil.get(args[0]!);
    if (!match) return;

    if (!match.addPlayer(interaction.user.id)) {
      await interaction.reply({ content: "Não foi possivel entrar nessa partida.", flags: ["Ephemeral"] });
      return;
    }
    
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
      `Anfitrião: <@${match.host}>`,
      `Jogadores: \n${match.players.map(p => `- <@${p.id}>`).join('\n')}`
    ];

    await interaction.update({ content: board.join("\n"), components: [row] });
    await interaction.followUp({ content: `Você entrou na partida.`, flags: ["Ephemeral"] });
  }
}
