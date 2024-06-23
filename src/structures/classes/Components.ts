import type { DiscordClient } from '#structures/index.js';
import type { ButtonInteraction, ModalSubmitInteraction, StringSelectMenuComponent } from 'discord.js';

// Определите тип InteractionComponent, который может быть одним из возможных типов взаимодействий
export type InteractionComponent = ButtonInteraction | ModalSubmitInteraction | StringSelectMenuComponent;

export abstract class Components<T extends InteractionComponent> implements ComponentsOptions {
     readonly name: string;
     readonly description: string;
     readonly cooldown: number;
     readonly disabled: boolean;
     readonly isPremium: boolean;
     
     protected constructor(components: ComponentsOptions) {
          this.name = components.name;
          this.description = components.description ?? 'Описание компонента взаимодействия не указано';
          this.cooldown = components.cooldown ?? 1;
          this.disabled = components.disabled ?? false ;
          this.isPremium = components.isPremium ?? false;
     };


     public abstract run(client: DiscordClient, interaction: T): void; // Awaitable<void>;
};

export interface ComponentsOptions {
     readonly name: string;
     readonly description: string;
     readonly cooldown?: number;
     readonly disabled?: boolean;
     readonly isPremium?: boolean;
};