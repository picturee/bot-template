import { Collection } from 'discord.js';
import { Commands } from './classes/Commands';
import { Components, InteractionComponent } from './classes/Components';

declare global {
     namespace NodeJS {
          interface ProcessEnv {
               DISCORD_BOT_TOKEN: string;
               DISCORD_DATABASE: string;
               DISCORD_EMBED_COLOR: string;
          }
     }
}

declare module 'discord.js' {
     export interface Client {
          commands: Collection<string, Commands>;
          components: Collection<string, Components<InteractionComponent>>;
     }
}