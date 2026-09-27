import { Event } from "./Event.ts";
import { Client, Collection, GatewayIntentBits } from "discord.js";
import { readdirSync } from "node:fs";
import path from "node:path";
import { TwinDB } from "twin-db";
import { PrefixCommand } from "./PrefixCommand.ts";

export interface BotOptions {
  prefix: string;
  token: string;  
  intents: GatewayIntentBits[];
};

export class Bot extends Client<true> {
  public db: TwinDB = new TwinDB();
  public commands: Collection<string, PrefixCommand> = new Collection();
  public prefix: string;

  declare token: string;

  public constructor(options: BotOptions) {
    super({ intents: options.intents });

    this.prefix = options.prefix;
    this.token = options.token;
  }

  public async setup() {
    await this.loadCommands();
    await super.login(this.token);
    await this.loadEvents();
  }

  private async loadFiles(folderPath: string) {
    const filesExtensions = [".js", ".ts"];
    const files = readdirSync(folderPath, { recursive: true, withFileTypes: true })
      .filter(file => file.isFile() && filesExtensions.includes(path.extname(file.name)))
      .map(file => path.join(import.meta.dirname, "../..", file.parentPath, file.name))
    
    return files;
  }

  private async loadEvents() {
    const files = await this.loadFiles("src/events");
    
    for (const file of files) {
      const module = await import(file);
      const event: Event = new module.default();
      
      super.on(event.name, (...args) => {
        if (!event.shouldExecute(...args)) return;
        event.execute(...args)
      });
      
      console.log(`[sucesso] O evento "${event.name}" foi carregado.`);
    }
  }

  private async loadCommands() {
    const files = await this.loadFiles("src/commands");
    
    for (const file of files) {
      const module = await import(file);
      const command: PrefixCommand = new module.default();
      this.commands.set(command.name, command);
      console.log(`[sucesso] O comando "${command.name}" foi carregado.`);
    }
  }
}
