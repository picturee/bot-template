import { ActivityType, Client, GatewayIntentBits, Partials, ClientEvents, Collection } from 'discord.js';
import { readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import 'dotenv/config';

import { Commands, Listeners } from '../index.js';

export class DiscordClient extends Client<true> {
     public readonly commands: Collection<String, Commands> = new Collection();
     constructor() {
          super({
               allowedMentions: { parse: ['users', 'roles', 'everyone'], repliedUser: false },
               intents: Object.keys(GatewayIntentBits) as [],
               partials: Object.keys(Partials) as [],
               failIfNotExists: false,
               presence: {
                    activities: [{
                         name: 'Приветствую',
                         type: ActivityType.Listening,
                    }], status: 'idle'
               },
          });
     };
     public override async login(token: string | undefined): Promise<string> {
          await Promise.all([
               await this.setEventsHandler(process.cwd() + '/dist/events'), // # Path to folder directory events
               await this.setCommandsHandler(process.cwd() + '/dist/commands'), // # Path to folder directory commands
          ]);
          return (await super.login(token));
     };
     private async setEventsHandler(paths: string): Promise<void> {
          if ((await stat(paths)).isDirectory()) {
               const files: string[] = (await readdir(path.resolve(paths), { recursive: true })).filter((name: string) => name.endsWith('.js'));
               if (files.length === 0) return console.log('1');
               await Promise.all(files.map(async (file: string) => {
                    const event: Listeners<keyof ClientEvents> = new ((await import(path.resolve(paths, file)))?.default);
                    if (!event || !event.name || event.disabled) return;
                    event.once ? 
                         this.once(event.name, (...args) => event.run(this, ...args)) : 
                         this.on(event.name, (...args) => event.run(this, ...args));
                    return delete require.cache[require.resolve(path.resolve(paths, file))];
               }));
          };
     };
     private async setCommandsHandler(paths: string): Promise<void> {
          if ((await stat(paths)).isDirectory()) {
               const categories: string[] = (await readdir(path.resolve(paths)));
               await Promise.all(categories.map(async (category: string) => {
                    const commands: string[] = (await readdir(path.resolve(paths, category), { recursive: true })).filter((name: string) => name.endsWith('.js'));
                    await Promise.all(commands.map(async (file: string) => {
                         const command: Commands = new ((await import(path.resolve(paths, category, file)))?.default);
                         this.commands.set(command.builder.name, command);
                         return delete require.cache[require.resolve(path.resolve(paths, category, file))];
                    }));
               }));
          };
     };
};