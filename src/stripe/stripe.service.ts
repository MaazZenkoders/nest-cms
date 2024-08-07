import { Injectable, NotFoundException, RawBodyRequest } from '@nestjs/common';
import Stripe from 'stripe';
import { Course } from 'src/courses/entities/course';
import { InjectRepository } from '@nestjs/typeorm';
import { Transactions } from './entities/transactions';
import { Repository } from 'typeorm';
import { Student } from 'src/students/entities/student';
import { TransactionStatus } from 'src/enums/transactionstatus';
import { EmailsService } from 'src/emails/emails.service';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(
    private readonly emailService: EmailsService,

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

  async createCustomer(email: string, name: string) {
    const customer = await this.stripe.customers.create({
      email,
      name,
    });
    return customer;
  }

  async handleWebhook(
    payload: RawBodyRequest<Request>['rawBody'],
    signature: string,
  ) {
    const webhookSecret = process.env.WEBHOOK_SECRET;
    if (!signature) {
      throw new NotFoundException('Signature was not found.');
    }
    const event = this.stripe.webhooks.constructEvent(
      payload,
      signature,
      webhookSecret,
    );

    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        await this.handleCheckoutSessionCompleted(session);
        break;
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await this.handlePaymentIntentSucceeded(paymentIntent);
        break;
      case 'payment_intent.payment_failed':
        const paymentFailed = event.data.object as Stripe.PaymentIntent;
        await this.handlePaymentIntentFailed(paymentFailed);
        break;
      case 'customer.subscription.created':
        const subscriptionCreated = event.data.object as Stripe.Subscription;
        await this.handleSubsriptionCompleted(subscriptionCreated);
      case 'payment_intent.created':
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
    return { received: true };
  }

  private async handleSubsriptionCompleted(subscriptionCreated: Stripe.Subscription) {
    console.log("Subscription created")
  }

  private async handleCheckoutSessionCompleted(
    session: Stripe.Checkout.Session,
  ) {
    const course_code = session.metadata.course_code;
    const email = session.metadata.email;
    const paymentIntentId = session.payment_intent as string;
    const course = await this.courseRepository.findOneBy({ course_code });
    const student = await this.studentRepository.findOneBy({ email });
    if (!course || !student) {
      console.error('Course or Student not found');
      return;
    }
    const amountInDollars = session.amount_total / 100;
    const transaction = this.transactionRepository.create({
      status: TransactionStatus.pending,
      payment_log: paymentIntentId,
      course: course,
      student: student,
      amount_paid: amountInDollars,
    });
    await this.transactionRepository.save(transaction);
  }

  private async handlePaymentIntentSucceeded(
    paymentIntent: Stripe.PaymentIntent,
  ) {
    const paymentIntentId = paymentIntent.id;
    await new Promise(resolve => setTimeout(resolve, 5000)); 
    const transaction = await this.transactionRepository.findOne({
      where: { payment_log: paymentIntentId },
      relations: ['course', 'student'],
    });
    if (!transaction) {
      console.error('Transaction not found');
      return;
    }
    transaction.status = TransactionStatus.successful;
    await this.transactionRepository.save(transaction);
    await this.emailService.sendTransactionEmail(transaction.student.email, {
      student: transaction.student.name,
      course: transaction.course.name,
      status: TransactionStatus.successful,
    });
  }

  private async handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
    const paymentIntentId = paymentIntent.id;
    await new Promise(resolve => setTimeout(resolve, 5000)); 
    const transaction = await this.transactionRepository.findOne({
      where: { payment_log: paymentIntentId },
      relations: ['course', 'student'],
    });
    if (!transaction) {
      console.error('Transaction not found');
      return;
    }
    transaction.status = TransactionStatus.failed;
    await this.transactionRepository.save(transaction);
    await this.emailService.sendTransactionEmail(transaction.student.email, {
      student: transaction.student.name,
      course: transaction.course.name,
      status: TransactionStatus.failed,
    });
  }

  async createCheckoutSession(course_code: string, email: string) {
    const course = await this.courseRepository.findOneBy({ course_code });
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

  async createSubscriptionSession(email:string, name:string) {
    const customer = await this.createCustomer(email,name)
    const product = await this.stripe.products.retrieve('prod_QSdTPH77Lz1wh5');
    const price = await this.stripe.prices.retrieve(
      product.default_price.toString(),
    );
    const session = await this.stripe.checkout.sessions.create({
      success_url:
        'https://docs.stripe.com/testing?testing-method=card-numbers#cards',
      cancel_url:
        'https://medium.com/@emmanuelodii80/how-to-setup-stripe-within-nestjs-application-61b7509a66dc',
      line_items: [
        {
          price: price.id,
          quantity: 2,
        },
      ],
      mode: 'subscription',
      metadata : {
        customer: customer.name,
        eventType: 'BUY COURSE',
        product: product.name,
      },
    });
    return session
  }
}
