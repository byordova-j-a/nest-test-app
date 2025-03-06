import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(params: {
    login: string;
    tabel: string;
    password: string;
  }): Promise<{ access_token: string }> {
    const user = await this.usersService.getUser(params);
    if (!user) {
      throw new UnauthorizedException();
    }
    const payload = { id: user.id, login: user.login, tabel: user.tabel };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
