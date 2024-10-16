import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop()
  name: string;

  @Prop({ unique: [true, 'This email is already in use.'] })
  email: string;

  @Prop()
  password: string;

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'Event' })
  registeredEvents: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
