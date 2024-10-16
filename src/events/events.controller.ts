import { AuthService } from './../auth/auth.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';

import { EventsService } from './events.service';
import { Event } from './schemas/event.schema';
import { CreateEventDto } from './dtos/create-event.dto';
import { UpdateEventDto } from './dtos/update-event.dto';
import { AuthGuard } from '@nestjs/passport';
import { RegisterEventDto } from './dtos/register-event.dto';
import { User } from 'src/auth/schemas/user.schema';

@Controller()
export class EventsController {
  constructor(
    private eventsService: EventsService,
    private authService: AuthService,
  ) {}

  @Get('events')
  async listAllEvents(): Promise<Event[]> {
    return this.eventsService.findAll();
  }

  @Get('events/:id')
  @UseGuards(AuthGuard())
  async getEvent(@Param('id') id: string): Promise<Event> {
    return this.eventsService.findById(id);
  }

  @Post('events')
  @UseGuards(AuthGuard())
  async createEvent(@Body() event: CreateEventDto): Promise<Event> {
    return this.eventsService.createEvent(event);
  }

  @Put('events/:id')
  @UseGuards(AuthGuard())
  async updateEvent(
    @Param('id') id: string,
    @Body() event: UpdateEventDto,
  ): Promise<Event> {
    return this.eventsService.findByIdAndUpdate(id, event);
  }

  @Delete('events/:id')
  @UseGuards(AuthGuard())
  async cancelEvent(@Param('id') id: string): Promise<Event> {
    return this.eventsService.cancelEvent(id);
  }

  @Post('events/register')
  @UseGuards(AuthGuard())
  async registerEvent(
    @Body() { eventId }: RegisterEventDto,
    @Req() req,
  ): Promise<Event> {
    const eventToBeRegistered = await this.eventsService.findById(eventId);
    const registeredEvents = await this.eventsService.findAllByIds(
      (req.user as User).registeredEvents ?? [],
    );
    await this.authService.registerUserForEvent(
      eventToBeRegistered,
      registeredEvents,
      req.user,
    );
    return this.eventsService.findById(eventId);
  }

  @Post('events/deregister')
  @UseGuards(AuthGuard())
  async deRegisterEvent(
    @Body() { eventId }: RegisterEventDto,
    @Req() req,
  ): Promise<Event> {
    await this.authService.deRegisterUserForEvent(eventId, req.user);
    return this.eventsService.findById(eventId);
  }

  @Get('/listAvailableEvents')
  @UseGuards(AuthGuard())
  async listAvailableEvents(@Req() req): Promise<Event[]> {
    const { user } = req;

    return this.eventsService.findAllExcludingIds(
      (user as User).registeredEvents ?? [],
    );
  }

  @Get('/listRegisteredEvents')
  @UseGuards(AuthGuard())
  async listRegisteredEvents(@Req() req): Promise<Event[]> {
    const { user } = req;
    const ids = (user as User).registeredEvents;

    return ids.length === 0 ? [] : this.eventsService.findAllByIds(ids);
  }
}
