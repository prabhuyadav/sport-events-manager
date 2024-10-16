import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Sport, Details, Status } from '../types';

@Schema({ timestamps: true })
export class Event {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  startTime: string;

  @Prop({ required: true })
  endTime: string;

  @Prop({ required: true })
  sport: Sport;

  @Prop(
    raw({
      organizer: { type: String },
      description: { type: String },
    }),
  )
  details?: Details;

  @Prop()
  availableSlots: number;

  @Prop()
  numOfRegistrations: number;

  @Prop({ default: Status.Open })
  status: Status;
}

export const EventSchema = SchemaFactory.createForClass(Event);
