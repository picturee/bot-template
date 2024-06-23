import { GuildModel, type IGuildDocument } from '#structures/database/GuildModel.js';
import { Listeners, type Commands, type Components, type DiscordClient, type InteractionComponent } from '#structures/index.js';
import { Collection, EmbedBuilder, Events, resolveColor, type ButtonInteraction, type ChatInputCommandInteraction, type Interaction, type Message } from 'discord.js';

const cooldowns: Map<string, Collection<string, number>> = new Map();

type CooldownResponse = {
     onCooldown: boolean;
     remainingTime?: number;
};
type PremiumResponse = {
     isPremium: boolean;
};
type TResponses = CooldownResponse | PremiumResponse;

export default class InteractionCreate extends Listeners<Events.InteractionCreate> {
     constructor() {
          super({
               name: Events.InteractionCreate
          });
     }
     public override async run(client: DiscordClient, interaction: Interaction): Promise<void> {
          try {
               if (interaction.isChatInputCommand()) {
                    await this.handleCommandInteraction(client, interaction as ChatInputCommandInteraction);
               } else if (interaction.isButton()) {
                    await this.handleButtonInteraction(client, interaction as ButtonInteraction); // as InteractionComponent
               }
          } catch (error: unknown) {
               console.error(`[INFORMATION | ERROR] - An error occurred during interaction | ERROR: ${error}`);
          }
     };

     private async handleCommandInteraction(client: DiscordClient, interaction: ChatInputCommandInteraction): Promise<void | Message<boolean>> {
          const commands: Commands | void = client.commands.get(interaction.commandName);
          if (!commands || !interaction.guildId) return;

          await interaction.deferReply({ ephemeral: true });

          const cooldownResponse: TResponses = await this.handleCooldown(commands.builder.name, interaction.user.id, (commands.cooldown || 1) * 1000);
          if ('onCooldown' in cooldownResponse && cooldownResponse.onCooldown) {
               const embed: EmbedBuilder = this.embedConstructor(
                    `🛑 You need to wait **${cooldownResponse.remainingTime}** seconds before trying again. Thank you for your patience!`
               );
               return interaction.followUp({ embeds: [embed], ephemeral: true });
          }
          if (commands.isPremium) {
               const premiumResponse: TResponses = await this.checkPremium(interaction);
               if ('isPremium' in premiumResponse && !premiumResponse.isPremium) {
                    const embed: EmbedBuilder = this.embedConstructor(
                         `Unfortunately, this feature is part of the Premium package ✨ and cannot be used on non-Premium servers 🚫.`
                    );
                    return interaction.followUp({ embeds: [embed], ephemeral: true });
               }
          }
          return commands.run(client, interaction);
     };

     private async handleButtonInteraction(client: DiscordClient, interaction: ButtonInteraction): Promise<void | Message<boolean>> {
          const components: Components<InteractionComponent> | void = client.components.get(interaction.customId);
          if (!components) return;
          await interaction.deferReply({ ephemeral: true });

          const cooldownResponse: TResponses = await this.handleCooldown(components.name, interaction.user.id, (components.cooldown || 1) * 1000);
          if ('onCooldown' in cooldownResponse && cooldownResponse.onCooldown) {
               const embed: EmbedBuilder = this.embedConstructor(
                    `🛑 You need to wait **${cooldownResponse.remainingTime}** seconds before trying again. Thank you for your patience!`
               );
               return interaction.followUp({ embeds: [embed], ephemeral: true });
          }
          if (components.isPremium) {
               const premiumResponse: TResponses = await this.checkPremium(interaction);
               if ('isPremium' in premiumResponse && !premiumResponse.isPremium) {
                    const embed: EmbedBuilder = this.embedConstructor(
                         `Unfortunately, this feature is part of the Premium package ✨ and cannot be used on non-Premium servers 🚫.`
                    );
                    return interaction.followUp({ embeds: [embed], ephemeral: true });
               }
          }
          return components.run(client, interaction);
     };

     private async handleCooldown(interactionType: string, userId: string, cooldownDuration: number): Promise<TResponses> {
          if (!cooldowns.has(interactionType)) cooldowns.set(interactionType, new Collection());

          const currentTime: number = Date.now();
          const timestamps: Collection<string, number> = cooldowns.get(interactionType)!;

          if (timestamps.has(userId) && currentTime < timestamps.get(userId)! + cooldownDuration) {
               const cooldownTimeout: number = Math.round((timestamps.get(userId)! + cooldownDuration - currentTime) / 1000);
               return { onCooldown: true, remainingTime: cooldownTimeout };
          }

          timestamps.set(userId, currentTime);
          setTimeout(() => timestamps.delete(userId), cooldownDuration);
          return { onCooldown: false };
     };

     private async checkPremium(interaction: ChatInputCommandInteraction | ButtonInteraction): Promise<TResponses> {
          try {
               const data: IGuildDocument | null = await GuildModel.findOne({ guildId: interaction.guildId }).exec();
               return { isPremium: !!data?.isPremium };
          } catch (error: unknown) {
               console.error('An error occurred while checking the premium status:', error);
               return { isPremium: false };
          }
     };

     private embedConstructor(description: string): EmbedBuilder {
          return new EmbedBuilder()
               .setTitle('⚠️ System Notification: Access Attempt Error.')
               .setDescription(description)
               .setColor(resolveColor(parseInt(process.env.DISCORD_EMBED_COLOR ?? 'FFFFFF', 16)));
     };
};
