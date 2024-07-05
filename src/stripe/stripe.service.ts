import { BadRequestException, Injectable, NotFoundException, RawBodyRequest } from '@nestjs/common';
import Stripe from 'stripe';
import { Course } from 'src/courses/entities/course';
import { InjectRepository } from '@nestjs/typeorm';
import { Transactions } from './entities/transactions';
import { Repository } from 'typeorm';
import { Student } from 'src/students/entities/student';
import { Request, Response } from 'express';
import { TransactionStatus } from 'src/enums/transactionstatus';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(
    @InjectRepository(Transactions)
    private readonly transactionRepository: Repository<Transactions>,

    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,

    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-06-20',
    });
  }

  async handleWebhook(
    payload:RawBodyRequest<Request>['rawBody'],
    signature: string
  ) {
    const webhookSecret = process.env.WEBHOOK_SECRET;
    if(!signature){
      throw new NotFoundException("Signature was not gound.")
    }
    let event: Stripe.Event;
      event = this.stripe.webhooks.constructEvent(
        payload,
        signature,
        webhookSecret
      );
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object ;
        await this.handleCheckoutSessionCompleted(session);
        break;
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object ;
        await this.handlePaymentIntentSucceeded(paymentIntent);
        break;
      case 'payment_intent.payment_failed':
        const paymentFailed = event.data.object;
        await this.handlePaymentIntentFailed(paymentFailed);
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
    return({ received: true });
  }

  private async handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
    const course_code = session.metadata.course_code;
    const email = session.metadata.email;
    const course = await this.courseRepository.findOneBy({ course_code });
    const student = await this.studentRepository.findOneBy({ email });
    if (!course || !student) {
      console.error('Course or Student not found');
      return;
    }
    const transaction = this.transactionRepository.create({
      status: TransactionStatus.pending,
      payment_log: session.id,
      course: course,
      student: student,
    });
    await this.transactionRepository.save(transaction);
  }

  private async handlePaymentIntentSucceeded(
    paymentIntent: Stripe.PaymentIntent,
  ) {
    const sessionId = paymentIntent.metadata.session_id;
    const transaction = await this.transactionRepository.findOne({
      where: { payment_log: sessionId },
      relations: ['course', 'student'],
    });
    if (!transaction) {
      console.error('Transaction not found');
      return;
    }
    transaction.status = TransactionStatus.successful;
    await this.transactionRepository.save(transaction);
  }

  private async handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
    const sessionId = paymentIntent.metadata.session_id;
    const transaction = await this.transactionRepository.findOne({
      where: { payment_log: sessionId },
      relations: ['course', 'student'],
    });
    if (!transaction) {
      console.error('Transaction not found');
      return;
    }
    transaction.status = TransactionStatus.failed;
    await this.transactionRepository.save(transaction);
  }

  async createCheckoutSession(course: Course, email: string) {
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      metadata: {
        email: email,
        course_code: course.course_code,
      },
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
      success_url:
        'https://docs.stripe.com/testing?testing-method=card-numbers#cards',
      cancel_url:
        'https://medium.com/@emmanuelodii80/how-to-setup-stripe-within-nestjs-application-61b7509a66dc',
    });
    return session;
  }
}
