import { bot } from "#bot";
import { Component } from "#structs/Component";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuInteraction, type CacheType } from "discord.js";

export default class extends Component<"StringMenu"> {
  public kind = "StringMenu" as const;
  public name = "veil-play";

  public async execute(interaction: StringSelectMenuInteraction<CacheType>, args: string[]) {
    const match = bot.veil.get(args[0]!);
    if (!match || !match.players.has(interaction.user.id)) {
      await interaction.reply({ content: "Você não pode interagir nessa partida.", flags: ["Ephemeral"] });
      return;
    }

    const turnPlayer = match.players.find(p => p.index === match.round.turn)!;
    if (turnPlayer.id != interaction.user.id) {
      await interaction.reply({ content: "Você não pode jogar cartas fora do seu turno.", flags: ["Ephemeral"] });
      return;
    }

    const player = match.players.get(interaction.user.id)!;
    const cards = interaction.values.map(v => v.split("/")[0]!);
    match.playTurn(cards);

    const viewHandBtn = new ButtonBuilder()
      .setCustomId(`veil-view-hand/${match.id}`)
      .setLabel("Ver Cartas")
      .setStyle(ButtonStyle.Secondary);

    const row = new ActionRowBuilder<ButtonBuilder>()
      .setComponents(viewHandBtn);

    await interaction.update({ content: "Você jogou as cartas.", components: [] });
    
    if (match.status === "ended") {
      bot.veil.delete(match.id);
      match.message!.edit({ content: `${match.winner} ganhou a partida`, components: [] });
    } else {
      await match.message!.edit({ content: match.renderBoard(), components: [row] });
    }
  }
}
