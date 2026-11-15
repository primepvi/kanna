import { ButtonInteraction, Client, StringSelectMenuInteraction, type Interaction } from "discord.js";
import { Event } from "../structs/Event.ts";
import { bot } from "#bot";

export default class extends Event<"interactionCreate"> {
  public name = "interactionCreate" as const;
  public once = true;

  public override shouldExecute(interaction: Interaction) {
    return interaction.isStringSelectMenu() || interaction.isButton();
  }

  public async execute(interaction: StringSelectMenuInteraction | ButtonInteraction) {
    const [componentName, ...args] = interaction.customId.split("/");
    const component = bot.components.get(componentName!);
    if (!component) {
      await interaction.reply(`> ❌ **| Erro!** ${interaction.user}, o **componente** não **foi encontrado**.`);
      return;
    }
    
    if (!component.shouldExecute(interaction, args)) return;
    await component.execute(interaction, args);
  }
}
