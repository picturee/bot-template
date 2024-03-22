import { type DiscordClient, type Commands, Listeners } from '../structures/index.js';

import { CacheType, Collection, Events, InteractionResponse, type Interaction } from 'discord.js';
const cooldowns: Map<string, Collection<string, number>> = new Map();

export default class interactionCreate extends Listeners<Events.InteractionCreate> {
     constructor() {
          super({
               name: Events.InteractionCreate
          });
     };
     public override async run(client: DiscordClient, interaction: Interaction<CacheType>): Promise<void | InteractionResponse<boolean>> {
          if (interaction.isChatInputCommand()) {
               const command: Commands | undefined = client.commands.get(interaction.commandName);
               if (!command || !interaction.guild) return;
               try {
                    if (!cooldowns.has(command.builder.name)) cooldowns.set(command.builder.name, new Collection());
                         const current_time: number | Date = Date.now();
                         const time_stamps: Collection<string, number> = cooldowns.get(command.builder.name)!;
                         const cooldown_amount: number = (command.cooldown || 1) * 1000;
                         const cooldown_timeout: string = (((time_stamps.get(interaction.user.id)! + cooldown_amount) - current_time) / 1000).toFixed(1);
                    
                    if (time_stamps?.has(interaction.user.id) && (current_time < time_stamps?.get(interaction.user.id)! + cooldown_amount)) 
                    return void (await interaction.deferReply({ ephemeral: true })
                         .then(() => interaction.followUp({ content: `\`[INFORMATION | TIMEOUT] - ❌ Wait ${cooldown_timeout} ⌚\`` }))
                         .catch(() => interaction.deleteReply()));

                         time_stamps?.set(interaction.user.id, current_time);
                         setTimeout(() => time_stamps?.delete(interaction.user.id), cooldown_amount);
                    return command.run(client, interaction);
               } catch (error: unknown) {
                    return console.error(`[INFORMATION | ERROR] - An error occurred while interacting with the command ${command.builder.name} | ERROR: ${error}`);
               };
          };
     };
};