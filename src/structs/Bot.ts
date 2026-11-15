import { Event } from "./Event.ts";
import { Client, Collection, GatewayIntentBits } from "discord.js";
import { readdirSync } from "node:fs";
import path from "node:path";
import { TwinDB } from "twin-db";
import { PrefixCommand, PrefixSubCommand } from "./PrefixCommand.ts";
import { Component } from "./Component.ts";

import type { VeilMatch } from "./VeilMatch.ts";

export interface BotOptions {
  prefix: string;
  token: string;  
  intents: GatewayIntentBits[];
};

export class Bot extends Client<true> {
  public db: TwinDB = new TwinDB();
  public prefix: string;
  
  public commands  = new Collection<string, PrefixCommand>();
  public components = new Collection<string, Component>();
  public veil = new Collection<string, VeilMatch>();

  declare token: string;
  
  public constructor(options: BotOptions) {
    super({ intents: options.intents });

    this.prefix = options.prefix;
    this.token = options.token;
  }

  public async setup() {
    await this.loadCommands();
    await this.loadComponents();
    await this.loadEvents();
    
    await super.login(this.token);
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
      const commandKey = command.isSubCommand() ? `${command.parent} ${command.name}` : command.name;
      this.commands.set(commandKey, command);
      
      console.log(`[sucesso] O comando "${commandKey}" foi carregado.`);
    }
  }

  private async loadComponents() {
    const files = await this.loadFiles("src/components");
    
    for (const file of files) {
      const module = await import(file);
      const component: Component = new module.default();
      this.components.set(component.name, component);
      
      console.log(`[sucesso] O componente "${component.name}" foi carregado.`);
    }
  }
}
