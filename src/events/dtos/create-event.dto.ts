import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

import { Details, Sport, Status } from '../types';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  startTime: string;

  @IsString()
  @IsNotEmpty()
  endTime: string;

  @IsNotEmpty()
  @IsEnum(Sport, { message: 'Error Occurred.' })
  sport: Sport;

  @IsOptional()
  details: Details;

  @IsNumber()
  @IsOptional()
  availableSlots: number;

  @IsNumber()
  @IsOptional()
  numOfRegistrations: number;

  @IsOptional()
  status: Status;
}
