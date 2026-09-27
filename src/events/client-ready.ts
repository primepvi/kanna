import { Client } from "discord.js";
import { Event } from "../structs/Event.ts";

export default class extends Event<"clientReady"> {
    public name = "clientReady" as const;
    public once = true;
  
    public execute(client: Client<true>): Promise<void> | void {
      console.log(`[sucesso] Client logado no user: ${client.user.username}.`);
    }
}
