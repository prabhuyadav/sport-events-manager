import { IsNotEmpty, IsString } from 'class-validator';

export class RegisterEventDto {
  @IsString()
  @IsNotEmpty()
  eventId: string;
}
