import { bot } from "#bot";
import { Component } from "#structs/Component";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, type ButtonInteraction, type CacheType } from "discord.js";
import { icons } from "../../constants/icons.ts";
import { container, text } from "../../utils/builders.ts";
import { createLobbyButtons, createLobbyContainer } from "../../ui/veil.ts";

export default class extends Component<"Button"> {
  public kind = "Button" as const;
  public name = "veil-join";

  public async execute(interaction: ButtonInteraction<CacheType>, args: string[]) {
    const match = bot.veil.get(args[0]!);
    if (!match || !match.addPlayer(interaction.user.id)) {
      await interaction.reply({ content: "Não foi possivel entrar nessa partida.", flags: ["Ephemeral"] });
      return;
    }

    const components = [createLobbyContainer(match), createLobbyButtons(match)];    
    await interaction.update({ components, flags: ["IsComponentsV2"] });
    await interaction.followUp({ content: `> ${icons.icon_ok} **|** ${interaction.user}, **você entrou** na **partida** com **sucesso**.`, flags: ["Ephemeral"] });
  }
}
