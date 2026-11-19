import { bot } from "#bot";
import { Component } from "#structs/Component";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Message, type ButtonInteraction, type CacheType } from "discord.js";

export default class extends Component<"Button"> {
  public kind = "Button" as const;
  public name = "veil-start";

  public async execute(interaction: ButtonInteraction<CacheType>, args: string[]) {
    const match = bot.veil.get(args[0]!);
    if (!match || match.host !== interaction.user.id) {
      await interaction.reply({ content: "Você não pode começar essa partida.", flags: ["Ephemeral"] });
      return;
    }

    const canStart = match.start();
    if (!canStart) {
      await interaction.reply({ content: "Não foi possível começar esta partida.", flags: ["Ephemeral"] });
      return;
    }

    const viewHandBtn = new ButtonBuilder()
      .setCustomId(`veil-view-hand/${match.id}`)
      .setLabel("Ver Cartas")
      .setStyle(ButtonStyle.Secondary);

    const row = new ActionRowBuilder<ButtonBuilder>()
      .setComponents(viewHandBtn);

    await interaction.update({ content: match.renderBoard(), components: [row] });
    await interaction.followUp({ content: `Você começou a partida.`, flags: ["Ephemeral"] });

    match.message = interaction.message as Message<true>;
  }
}
