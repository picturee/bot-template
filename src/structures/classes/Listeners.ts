import type { ClientEvents } from 'discord.js';
import type { DiscordClient } from '../index.js';

export abstract class Listeners<Key extends keyof ClientEvents> implements ClientEvent<Key> {
     readonly name: Key;
     readonly once: boolean;
     readonly disabled: boolean;

     protected constructor(event: ClientEvent<Key>) {
          this.name = event.name;
          this.once = event.once ?? false;
          this.disabled = event.disabled ?? false;
     };

     public abstract run(client: DiscordClient, ...args: ClientEvents[Key]): void; // Awaitable<void>;
};

interface ClientEvent<Key extends keyof ClientEvents> {
     name: Key;
     once?: boolean;
     disabled?: boolean;
};