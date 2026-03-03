import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    try {
      const existing = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });
      if (existing) throw new ConflictException('Email already in use');

      const passwordHash = await bcrypt.hash(dto.password, 12);
      const user = await this.prisma.user.create({
        data: { email: dto.email, name: dto.name, passwordHash },
        select: { id: true, email: true, name: true, role: true },
      });
      const token = this.jwt.sign({ sub: user.id, email: user.email });
      return { user, accessToken: token };
    } catch (err) {
      if (err instanceof ConflictException) throw err;
      throw new Error(`Registration failed: ${err?.message || err}`);
    }
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    const token = this.jwt.sign({ sub: user.id, email: user.email });
    return {
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
      accessToken: token,
    };
  }
}
