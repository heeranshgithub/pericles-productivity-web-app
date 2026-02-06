import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../users/users.service";
import { RegisterDto } from "./dto/register.dto";
import { UserDocument } from "../users/schemas/user.schema";

export type AuthUser = {
  _id: UserDocument["_id"];
  email: string;
  name: string;
  // allow other public fields (createdAt, updatedAt, themePreference, etc.)
  [key: string]: any;
};

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<AuthUser | null> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      return null;
    }

    const isPasswordValid = await this.usersService.validatePassword(
      password,
      user.password,
    );
    if (!isPasswordValid) {
      return null;
    }

    const { password: _, ...result } = user.toObject();
    return result as AuthUser;
  }

  async login(user: AuthUser) {
    const payload = { email: user.email, sub: user._id };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    };
  }

  async register(registerDto: RegisterDto) {
    const user = await this.usersService.create(
      registerDto.email,
      registerDto.password,
      registerDto.name,
    );

    const { password: _, ...userWithoutPassword } = (user as any).toObject();
    return this.login(userWithoutPassword);
  }
}
