import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

import { Details, Sport, Status } from '../types';

export class UpdateEventDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  startTime: string;

  @IsString()
  @IsOptional()
  endTime: string;

  @IsOptional()
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
