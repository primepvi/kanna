import { ContainerBuilder, TextDisplayBuilder, type AnyComponentBuilder } from "discord.js";

export function text(...fragments: string[]) {
  return new TextDisplayBuilder().setContent(fragments.join("\n"));
}

export type ContainerInnerComponentBuilder = TextDisplayBuilder;
export function container(components: ContainerInnerComponentBuilder[]) {
  return new ContainerBuilder({
    components: components.map(c => c.toJSON())
  }).setAccentColor([0, 0, 10]);
}
