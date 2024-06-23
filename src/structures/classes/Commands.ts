import type { CacheType, CommandInteraction, SharedNameAndDescription, SlashCommandBuilder } from 'discord.js';
import type { DiscordClient } from '../index.js';

export abstract class Commands implements ClientCommand {
     readonly builder: SlashCommandBuilder | SharedNameAndDescription;
     readonly cooldown: number;
     readonly disabled: boolean;
     readonly isPremium: boolean;

     protected constructor(command: ClientCommand) {
          this.builder = command.builder;
          this.cooldown = command.cooldown ?? 1;
          this.disabled = command.disabled ?? false;
          this.isPremium = command.isPremium ?? false;
     };


     public abstract run(client: DiscordClient, interaction: CommandInteraction<CacheType>): void;
};

export interface ClientCommand {
     builder: SlashCommandBuilder | SharedNameAndDescription;
     cooldown?: number;
     disabled?: boolean;
     isPremium?: boolean;
};