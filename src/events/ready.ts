import { type ApplicationCommandDataResolvable } from 'discord.js';
import type { ClientBot, Command } from '../classes/index.js';

export default {
    name: 'ready',
    listener: async (client: ClientBot) => {
        console.clear();
        console.log(`[INFORMATION] - The bot is running. Authorized as ${client.user?.tag} | Servers: ${client.guilds.cache?.size} | Users: ${client.users.cache?.size}
            [INFORMATION] - Time: ${new Date().toLocaleTimeString('ru-RU', { timeZone: 'Europe/Moscow'})}
            [INFORMATION] - RAM: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`);
        
        const commands: ApplicationCommandDataResolvable[] = [];
        client.commands.each((command: Command) => commands.push(command.options.builder));
        
        // await client.application?.commands.set(commands, 'Guild ID'); // # Registration of local commands in the guild
        // await client.application?.commands.set(commands); // # Registration of global commands

        const catchs: NodeJS.Process | string[] = ['unhandledRejection', 'uncaughtException', 'uncaughtExceptionMonitor'];
        catchs.forEach((error: string) => {
            process.on(error, function warnUnhandled(e: unknown): void {
                return console.error(`[AntiCrash] - :: ${e}`);
            });
        });
    },
};