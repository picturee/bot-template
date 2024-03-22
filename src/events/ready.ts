import { type ApplicationCommandDataResolvable, Events } from 'discord.js';
import { type DiscordClient, type Commands, Listeners } from '../structures/index.js';

export default class ready extends Listeners<Events.ClientReady> {
     constructor() {
          super({
               name: Events.ClientReady,
               once: true
          });
     };
     public override async run(client: DiscordClient) {
          console.clear();
          console.log(`[INFORMATION] - The bot is running. Authorized as ${client.user?.tag} | Servers: ${client.guilds.cache?.size} | Users: ${client.users.cache?.size}`);
          console.log(`[INFORMATION] - Time: ${new Date().toLocaleTimeString('ru-RU', { timeZone: 'Europe/Moscow'})}`);
          console.log(`[INFORMATION] - RAM: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`);

          const commands: ApplicationCommandDataResolvable[] = [];
          commands.push(...client.commands.filter((command: Commands) =>!command.disabled).map((command: Commands) => command.builder));
          // await client.application?.commands.set(commands, 'Guild ID'); # Registration of local commands in the guild
          // await client.application?.commands.set(commands); # Registration of global commands
          
          const catchs: NodeJS.Process | string[] = ['unhandledRejection', 'uncaughtException', 'uncaughtExceptionMonitor'];
          catchs.forEach((error: string) => {
               process.on(error, function warnUnhandled(e: unknown): void {
                    return console.error(`[AntiCrash] - :: ${e}`);
               });
          });
     };
};