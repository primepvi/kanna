import type { VeilMatch } from "#structs/VeilMatch";
import { container, text } from "../utils/builders.ts";
import { icons } from "../constants/icons.ts";
import { bot } from "#bot";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";

export const createLobbyContainer = (match: VeilMatch) => container([
  text(
    `## ${icons.icon_veil} Veil — Partida \`${match.id}\``,
    `-# *Para começar a partida é necessário pelo menos ${match.config.minPlayers} jogadores.*`,
    `### ${icons.icon_users} — Jogadores [ \`${match.players.size}/${match.config.maxPlayers}\` ]:`,
    ...match.players.values().map((p, i) => {
      const user = bot.users.cache.get(p.id);
      const icon = p.id === match.host ? icons.icon_king : icons.icon_user;
      return `> ${i + 1}. ${icon} *${user?.username || "Desconhecido"}*`;
    }),
  )
]);

export const createLobbyButtons = (match: VeilMatch) => new ActionRowBuilder<ButtonBuilder>()
  .addComponents(
    new ButtonBuilder()
      .setCustomId(`veil-start/${match.id}`)
      .setLabel("Começar")
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId(`veil-join/${match.id}`)
      .setLabel("Entrar")
      .setStyle(ButtonStyle.Secondary),
  );
