import type { SlashCommandBuilder, SharedNameAndDescription, CommandInteraction } from 'discord.js';
import type { ClientBot } from './getClientBot.js';

export abstract class Command {
    public readonly options: itValidationOptions;
    constructor(options: itValidationOptions) {
        this.options = options; 
    };
    public callback(client: ClientBot, interaction: CommandInteraction): void {
        throw new Error(`[ERROR | ${client} | ${interaction.commandName}] - An error occurred during interaction`);
    };
};

interface itValidationOptions {
    builder: SlashCommandBuilder | SharedNameAndDescription;
    cooldown?: number;
};