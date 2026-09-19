import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { db } from 'src/db';
import { users } from 'src/db/schema';

@Injectable()
export class UsersService {
  async findOne(username: string) {
    return await db.query.users.findFirst({
      where: eq(users.username, username),
    });
  }
}
