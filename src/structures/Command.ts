import { Collection, SlashCommandBuilder, CommandInteraction, Interaction, InteractionResponse, ChatInputApplicationCommandData, SlashCommandSubcommandBuilder, SharedSlashCommandOptions, ApplicationCommandDataResolvable, APIApplicationCommandInteractionDataSubcommandGroupOption, SlashCommandSubcommandGroupBuilder, SlashCommandOptionsOnlyBuilder, } from 'discord.js';
import Client from './Client';

const cooldowns: Map<string, Collection<string, number>> = new Map();

export default abstract class Command {
    isStructured: isCommandOptions;
    constructor(isStructured: isCommandOptions) {
        this.isStructured = isStructured;
    };
    public abstract callback(client: Client, interaction: CommandInteraction): void;
    static async isCommandHandler(client: Client, interaction: Interaction): Promise<void | InteractionResponse<boolean>> {
        if (interaction.isChatInputCommand()) {
            const getCommands: Command = client.commands.get(interaction.commandName)!;
            if (!getCommands) return;
                try {
                    if (!cooldowns.has(getCommands.isStructured.data.name)) cooldowns.set(getCommands.isStructured.data.name, new Collection());
                        const current_time: number | Date = Date.now();
                        const time_stamps: Collection<string, number> = cooldowns.get(getCommands.isStructured.data.name)!;
                        const cooldown_amount: number = (getCommands.isStructured.cooldown || 1) * 1000;

                    if (time_stamps?.has(interaction.user.id) && (current_time < time_stamps?.get(interaction.user.id)! + cooldown_amount)) 
                        return interaction.reply({ embeds: [{
                            title: `❌ - Wait ${(((time_stamps.get(interaction.user.id)! + cooldown_amount) - current_time) / 1000).toFixed(1)}`
                        }], ephemeral: true
                    });
                    time_stamps?.set(interaction.user.id, current_time);
                    setTimeout(() => time_stamps?.delete(interaction.user.id), cooldown_amount);
                return getCommands.callback(client, interaction);
            } catch (error: unknown) {
                return void (interaction.deferReply().then(() => interaction.deleteReply()));
            };  
        };
    };
};

export type isValidationType = Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>;
export interface isCommandOptions {
    data: isValidationType;
    cooldown?: number;
};