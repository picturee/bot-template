import { Document, model, Schema } from 'mongoose';

export const GuildModel = model<IGuildDocument>('GuildModel', 
     new Schema({
          guildId: { type: String, required: true },
          isPremium: { type: Boolean, default: false },
     })
);

export interface IGuildDocument extends Document {
     guildId: string;
     isPremium: boolean;
};