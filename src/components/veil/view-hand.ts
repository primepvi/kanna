import { bot } from "#bot";
import { Component } from "#structs/Component";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, type ButtonInteraction, type CacheType } from "discord.js";

export default class extends Component<"Button"> {
  public kind = "Button" as const;
  public name = "veil-view-hand";

  public async execute(interaction: ButtonInteraction<CacheType>, args: string[]) {
    const match = bot.veil.get(args[0]!);
    if (!match || !match.players.has(interaction.user.id)) {
      await interaction.reply({ content: "Você não está nessa partida.", flags: ["Ephemeral"] });
      return;
    }

    const player = match.players.get(interaction.user.id)!;
    const cards = player.cards.map(c => c.id).join(", ");

    const menuOptions = player.cards.map((c,i) => new StringSelectMenuOptionBuilder()
      .setValue(`${c.id}/${i}`)
      .setLabel(c.id)
      .setDescription("Clique aqui para jogar esta carta")
    );

    const menu = new StringSelectMenuBuilder()
      .setCustomId(`veil-play/${match.id}`)
      .setPlaceholder("Clique aqui para jogar cartas")
      .setMaxValues(2)
      .setMinValues(1)
      .setOptions(menuOptions)
      .setRequired(true);

    const row = new ActionRowBuilder<StringSelectMenuBuilder>()
      .setComponents(menu);

    const board = [
      `**Pontos**: ${player.points}`,
      `**Meta**: ${player.goal}`,
      `**Cartas**: ${cards}`
    ].join("\n");
    
    await interaction.reply({ content: board, flags: ["Ephemeral"], components: [row] });
  }
}
