import { type ClientBot, type Command } from '../classes/index';
import { Collection, type Interaction } from 'discord.js';
const cooldowns: Map<string, Collection<string, number>> = new Map();

export default {
    name: 'interactionCreate',
    listener: (client: ClientBot, interaction: Interaction) => {
        if (interaction.isChatInputCommand()) {
            const commands: Command | undefined = client.commands.get(interaction.commandName);
            if (!commands) return;
                try {
                    if (!cooldowns.has(commands.options.builder.name)) cooldowns.set(commands.options.builder.name, new Collection());
                        const current_time: number | Date = Date.now();
                        const time_stamps: Collection<string, number> = cooldowns.get(commands.options.builder.name)!;
                        const cooldown_amount: number = (commands.options.cooldown || 1) * 1000;
                        const cooldown_timeout: string = (((time_stamps.get(interaction.user.id)! + cooldown_amount) - current_time) / 1000).toFixed(1);
                        
                    if (time_stamps?.has(interaction.user.id) && (current_time < time_stamps?.get(interaction.user.id)! + cooldown_amount)) 
                        return interaction.reply({ embeds: [{ title: `❌ - Wait ${cooldown_timeout}` }], ephemeral: true });
                    time_stamps?.set(interaction.user.id, current_time);
                    setTimeout(() => time_stamps?.delete(interaction.user.id), cooldown_amount);
                return commands.callback(client, interaction);
            } catch (error: unknown) {
                return void (interaction.deferReply().then(() => interaction.deleteReply()));
            };
        };
    },
};