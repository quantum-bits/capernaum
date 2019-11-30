import { Request, Controller, Post, UseGuards, Get } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from "./auth/auth.service";

@Controller()
export class AppController {
  constructor(private readonly authService: AuthService) {}

  @Get("ping")
  ping(@Request() req) {
    console.log("USER", req.user);
    return "pong";
  }

  @UseGuards(AuthGuard("local"))
  @Post("auth/login")
  login(@Request() req) {
    console.log("REQ BODY", req.body);
    return this.authService.login(req.user);
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("profile")
  getProfile(@Request() req) {
    return req.user;
  }
}
