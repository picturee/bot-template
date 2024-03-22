import type { Awaitable, CacheType, CommandInteraction, ContextMenuCommandBuilder, SharedNameAndDescription, SlashCommandBuilder } from 'discord.js';
import type { DiscordClient } from '../index.js';

export abstract class Commands implements ClientCommand {
     readonly builder: SlashCommandBuilder | SharedNameAndDescription;
     readonly cooldown?: number;
     readonly disabled?: boolean;
     
     constructor(command: ClientCommand) {
          this.builder = command.builder;
          this.cooldown = command.cooldown;
          this.disabled = command.disabled;
     };

	public abstract run(client: DiscordClient, interaction: CommandInteraction<CacheType>): Awaitable<void>;
};

interface ClientCommand {
     builder: SlashCommandBuilder | SharedNameAndDescription;
     cooldown?: number;
     disabled?: boolean;
};