import {
  IsAlphanumeric,
  IsEmail,
  IsEmpty,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

export class SignUpDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsEmail({}, { message: 'Please enter a valid email address' })
  email: string;

  @IsNotEmpty()
  @IsAlphanumeric()
  @IsString()
  @MinLength(6)
  password: string;

  @IsEmpty({ message: 'You cannot pass event ids' })
  registeredEvents: string[];
}
