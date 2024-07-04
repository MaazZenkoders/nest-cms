import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { Course } from 'src/courses/entities/course';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(
  ) {
    this.stripe = new Stripe((process.env.STRIPE_SECRET_KEY),
      { 
        apiVersion: '2024-06-20',
      },
    );
}

  async createCheckoutSession(course: Course) {
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: course.name,
            },
            unit_amount: parseInt(course.price) * 100,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'https://docs.stripe.com/testing?testing-method=card-numbers#cards',
      cancel_url: 'https://medium.com/@emmanuelodii80/how-to-setup-stripe-within-nestjs-application-61b7509a66dc',
    });
    return session;
  }
}
