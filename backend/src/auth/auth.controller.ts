import {
  Body,
  Controller,
  Get,
  Res,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "./auth.guard";
import { AuthService } from "./auth.service";
import { Request as ExpressReqest, Response as ExpressResponse } from "express";
import { SignInDto } from "./sign-in.dto";

interface TProfileRequest extends ExpressReqest {
  user: {
    id: number;
    login: string;
    tabel: string;
  };
}

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post("login")
  async signIn(
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true }) response: ExpressResponse,
  ) {
    const { access_token } = await this.authService.signIn(signInDto);
    response.cookie("authorization", `Bearer ${access_token}`, {
      maxAge: 60000,
      httpOnly: true,
    });
    return {
      message: "success",
    };
  }

  @Post("delete")
  delete(@Res({ passthrough: true }) response: ExpressResponse) {
    response.cookie("authorization", "", { maxAge: 0, httpOnly: true });
    return {
      message: "success",
    };
  }

  @UseGuards(AuthGuard)
  @Get("profile")
  getProfile(@Request() req: TProfileRequest) {
    return req.user;
  }
}
