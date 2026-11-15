import type { ButtonInteraction, StringSelectMenuInteraction } from "discord.js";

export type ComponentKind = "Button" | "StringMenu";
export interface ComponentInteraction {
  Button: ButtonInteraction,
  StringMenu: StringSelectMenuInteraction
}

export abstract class Component<T extends ComponentKind = ComponentKind> {
  abstract readonly kind: ComponentKind;
  abstract readonly name: string;
  
  abstract execute(interaction: ComponentInteraction[T], args: string[]): Promise<void> | void;
  public shouldExecute(interaction: ComponentInteraction[T], args: string[]): boolean { return true; }
}
