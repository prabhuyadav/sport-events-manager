import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Document, Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dtos/login.dto';
import { SignUpDto } from './dtos/sign-up.dto';
import { Event } from 'src/events/schemas/event.schema';
import { getConflictingEvent } from 'src/utils';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async signUp(data: SignUpDto): Promise<{ token: string }> {
    const { name, email, password } = data;

    const user = await this.userModel.create({
      name,
      email,
      password,
    });

    const token = this.jwtService.sign({ id: user._id });

    return { token };
  }

  async login(loginDto: LoginDto): Promise<{ token: string }> {
    const { email, password } = loginDto;

    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new UnauthorizedException('Invalid email');
    }

    const isPasswordMatched = password === user.password;

    if (!isPasswordMatched) {
      throw new UnauthorizedException('Invalid password');
    }

    const token = this.jwtService.sign({ id: user._id });

    return { token };
  }

  async findById(id: string): Promise<User> {
    const user = await this.userModel.findById(id);

    if (!user) {
      throw new InternalServerErrorException(
        'Requested User could not be found',
      );
    }

    return user;
  }

  async findByIdAndUpdate(id: string, data: User): Promise<User> {
    const updatedUser = this.userModel.findByIdAndUpdate(id, data, {
      runValidators: true,
      new: true,
    });

    if (!updatedUser) {
      throw new InternalServerErrorException(
        'Error occurred while trying to register user for the event',
      );
    }

    return updatedUser;
  }

  async registerUserForEvent(
    event: Event,
    registeredEvents: Event[],
    data: User,
  ): Promise<User> {
    if (registeredEvents.length == 3) {
      throw new InternalServerErrorException(
        'You are already registered for three events. You can only be registered for a maximum of 3 events at a time.',
      );
    }

    const { _id: eventId } = event as Event & Document;
    const conflictingEvent = getConflictingEvent(event, registeredEvents);

    if (conflictingEvent) {
      throw new InternalServerErrorException(
        `You cannot register for this event. Event timings conflicting with one of your registered events: ${conflictingEvent.name}`,
      );
    }

    const user = await this.findById(data._id as string);

    user.registeredEvents.push(eventId as string);
    const { _id, ...rest } = user;

    const updatedUser = await this.findByIdAndUpdate(
      _id as string,
      rest as User,
    );

    return updatedUser;
  }

  async deRegisterUserForEvent(eventId: string, data: User): Promise<User> {
    const user = await this.findById(data._id as string);

    user.registeredEvents = user.registeredEvents.filter(
      (id) => id.toString() !== eventId,
    );

    const { _id, ...rest } = user;

    const updatedUser = await this.findByIdAndUpdate(
      _id as string,
      rest as User,
    );

    return updatedUser;
  }
}
