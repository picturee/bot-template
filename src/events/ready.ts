import { Listeners, type Commands, type DiscordClient } from '#structures/index.js';
import { Events, type ApplicationCommandDataResolvable } from 'discord.js';

import mongoose from 'mongoose';

export default class Ready extends Listeners<Events.ClientReady> {
     constructor() {
          super({
               name: Events.ClientReady,
               once: true
          });
     };
     public override async run(client: DiscordClient): Promise<void> {
          console.clear();
          console.log(`[INFORMATION] - The bot is running. Authorized as ${client.user?.tag} | Servers: ${client.guilds.cache?.size} | Users: ${client.users.cache?.size}`);
          console.log(`[INFORMATION] - Time: ${new Date().toLocaleTimeString('ru-RU', { timeZone: 'Europe/Moscow'})}`);
          console.log(`[INFORMATION] - RAM: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`);

          const commands: ApplicationCommandDataResolvable[] = [];
          commands.push(...client.commands.filter((command: Commands) => !command.disabled).map((command: Commands) => command.builder));
          // await client.application?.commands.set(commands, 'Guild ID'); # Registration of local commands in the guild
          // await client.application?.commands.set(commands); # Registration of global commands
          
          const errorTypes: NodeJS.Process[] | string[] = ['unhandledRejection', 'uncaughtException', 'uncaughtExceptionMonitor'];
          errorTypes.forEach((error: string) => {
               process.on(error, (e: unknown): void => {
                    console.error(`[INFORMATION | AntiCrash] - An error has occurred: ${e}`);
               });
          });

          (await mongoose.connect(process.env.DISCORD_DATABASE)
               .then(() => console.log(`[INFORMATION | DATABASE] - Бот ${client.user?.tag} successfully connected to the underlying data 🍃`))
               .catch((error: unknown) => console.error(`[INFORMATION | DATABASE] - An error has occurred: ${error}`)));
     };
};
