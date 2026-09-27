import { Bot } from "./structs/Bot.ts";
import { GatewayIntentBits } from "discord.js";

export const bot = new Bot({
  prefix: "k.",
  token: process.env.BOT_TOKEN!,
  intents: [
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.Guilds,
  ]
});
