import {
  Controller,
  Headers,
  Post,
  RawBodyRequest,
  Request,
} from '@nestjs/common';
import { StripeService } from './stripe.service';

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('/webhook')
  async handleWebhook(
    @Request() { rawBody }: RawBodyRequest<Request>,
    @Headers('stripe-signature') signature: string,
  ) {
    await this.stripeService.handleWebhook(rawBody, signature);
  }
}
