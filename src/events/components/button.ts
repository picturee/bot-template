import { Components, type ComponentsOptions, type DiscordClient } from '#structures/index.js';
import { type ButtonInteraction } from 'discord.js';

export default class Button extends Components<ButtonInteraction> implements ComponentsOptions {
     constructor() {
          super({
               name: 'variation-role',
               description: '[Button | Components] - Example of interaction with a button component',
               cooldown: 5,
               isPremium: true
          });
     }
     public override async run(_client: DiscordClient, interaction: ButtonInteraction): Promise<void> {
          await interaction.deferReply({ ephemeral: true });
          await interaction.followUp({ content: 'Hello' });
     }
};