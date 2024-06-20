import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { OtpService } from './otp.service';

@Controller('otp')
export class OtpController {
  constructor(private readonly otpService: OtpService) {}

  @Post('/generate')
  @HttpCode(HttpStatus.OK)
  async generateOTP(@Body('email') email: string) {
    const code = await this.otpService.generateOTP(email);
    return {
      status: HttpCode(HttpStatus.CREATED),
      code,
      message: 'OTP generated',
    };
}
}
