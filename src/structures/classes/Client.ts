import type { Commands, Components, InteractionComponent, Listeners } from '#structures/index.js';
import { ActivityType, Client, Collection, GatewayIntentBits, Partials, PresenceUpdateStatus, type ClientEvents } from 'discord.js';

import 'dotenv/config';
import { readdir, stat } from 'node:fs/promises';
import path from 'node:path';

export class DiscordClient extends Client<true> {
     public readonly commands: Collection<string, Commands> = new Collection();
     public readonly components: Collection<string, Components<InteractionComponent>> = new Collection();

     constructor() {
          super({
               allowedMentions: {
                    parse: ['users', 'roles', 'everyone'],
                    repliedUser: false
               },
               intents: Object.keys(GatewayIntentBits) as [],
               partials: Object.keys(Partials) as [],
               failIfNotExists: false,
               presence: {
                    activities: [
                         {
                              name: 'Window',
                              type: ActivityType.Listening
                         }
                    ],
                    status: PresenceUpdateStatus.Idle
               }
          });
     }
     public override async login(): Promise<string> {
          await Promise.all([
               this.setEventsHandler(process.cwd() + '/dist/events'), // # Path to folder directory events
               this.setCommandsHandler(process.cwd() + '/dist/commands'), // # Path to folder directory commands
               this.setComponentsHandler(process.cwd() + '/dist/events/components') // # Path to folder directory components
          ]);
          return await super.login(process.env.DISCORD_BOT_TOKEN);
     }
     private async setEventsHandler(paths: string): Promise<void> {
          const directoryStats = await stat(paths);
          if (directoryStats.isDirectory()) {
               const eventFiles: string[] = (await readdir(path.resolve(paths))).filter((name: string) => !name.startsWith('-') && name.endsWith('.js'));

               for (const files of eventFiles) {
                    const eventInstance: Listeners<keyof ClientEvents> = new ((await import(path.resolve(paths, files)))?.default)();
                    if (!eventInstance || !eventInstance.name || eventInstance.disabled) continue;

                    eventInstance.once
                         ? this.once(eventInstance.name, (...args) => eventInstance.run(this, ...args))
                         : this.on(eventInstance.name, (...args) => eventInstance.run(this, ...args));

                    delete require.cache[require.resolve(path.resolve(paths, files))];
               }
          }
     };
     private async setCommandsHandler(paths: string): Promise<void> {
          const directoryStats = await stat(paths);
          if (directoryStats.isDirectory()) {
               const categories: string[] = await readdir(path.resolve(paths));

               for (const category of categories) {
                    const commandFiles: string[] = await readdir(path.resolve(paths, category), { recursive: true });
                    const commands: string[] = commandFiles.filter((name: string) => !name.startsWith('-') && name.endsWith('.js'));

                    for (const file of commands) {
                         const commandInstance: Commands = new ((await import(path.resolve(paths, category, file)))?.default)();
                         if (!commandInstance.builder || !commandInstance.builder.name || commandInstance.disabled) continue;

                         this.commands.set(commandInstance.builder.name, commandInstance);
                         delete require.cache[require.resolve(path.resolve(paths, category, file))];
                    }
               }
          }
     };
     private async setComponentsHandler(paths: string): Promise<void> {
          const directoryStats = await stat(paths);
          if (directoryStats.isDirectory()) {
               const componentFiles: string[] = (await readdir(path.resolve(paths))).filter((name: string) => !name.startsWith('-') && name.endsWith('.js'));

               for (const files of componentFiles) {
                    const componentInstance: Components<InteractionComponent> = new ((await import(path.resolve(paths, files)))?.default)();
                    if (!componentInstance || !componentInstance.name || componentInstance.disabled) continue;

                    this.components.set(componentInstance.name, componentInstance);
                    delete require.cache[require.resolve(path.resolve(paths, files))];
               }
          }
     };
};