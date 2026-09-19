/* eslint-disable @typescript-eslint/no-unsafe-call */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import bcrypt from 'bcrypt';
import { db } from 'src/db';
import { users } from 'src/db/schema';
import { SignUpDto } from './dtos/sign-up.dto';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UsersService) { }

  // TODO: create a dto and validation
  async signUp({ username, password }: SignUpDto) {
    const exists = await this.userService.findOne(username);

    if (exists) {
      throw new HttpException('Username already exists.', HttpStatus.CONFLICT);
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const hash: string = await bcrypt.hash(password, 10);

    await db.insert(users).values({
      username,
      password: hash,
    });

    return {
      message: 'User registered successfully.',
      username,
    };
  }
}
