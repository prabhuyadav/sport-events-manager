import { isValidObjectId, Model } from 'mongoose';

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Event } from './schemas/event.schema';
import { Status } from './types';

@Injectable()
export class EventsService {
  constructor(@InjectModel(Event.name) private eventModel: Model<Event>) {}

  validateId(id: string): void {
    const isValidId = isValidObjectId(id);

    if (!isValidId) {
      throw new BadRequestException('Please provide a valid id');
    }
  }

  async findAll(): Promise<Event[]> {
    const events = this.eventModel.find();

    return events;
  }

  async findAllByIds(ids: string[]): Promise<Event[]> {
    const events = this.eventModel.find({ _id: { $in: ids } });

    return events;
  }

  async findAllExcludingIds(ids: string[]): Promise<Event[]> {
    const events = this.eventModel.find({ _id: { $nin: ids } });

    return events;
  }

  async findById(id: string): Promise<Event> {
    this.validateId(id);
    const event = this.eventModel.findById(id);

    if (!event) {
      throw new NotFoundException(`Event ${id} not found`);
    }

    return event;
  }

  async findByIdAndUpdate(id: string, event: Event): Promise<Event> {
    const data = this.eventModel.findByIdAndUpdate(id, event, {
      runValidators: true,
      new: true,
    });

    if (!data) {
      throw new NotFoundException(`Event ${id} not found`);
    }

    return data;
  }

  async createEvent(event: Event): Promise<Event> {
    const data = this.eventModel.create(event);

    return data;
  }

  async cancelEvent(id: string): Promise<Event> {
    const event = await this.eventModel.findById(id);

    if (!event) {
      throw new NotFoundException(`Event ${id} not found`);
    }

    event.status = Status.Cancelled;
    const { id: eventId, ...updatedEvent } = event;

    return this.findByIdAndUpdate(eventId, updatedEvent);
  }
}
