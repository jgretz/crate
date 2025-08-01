import nodemailer from 'nodemailer';
import {resolveDependency} from '@stashl/iocdi';
import type {EmailConfig} from './types';

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail(options: SendEmailOptions): Promise<void> {
  const emailConfig = resolveDependency<EmailConfig>('emailConfig');
  
  const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: emailConfig.gmail.user,
      pass: emailConfig.gmail.appPassword,
    },
  });

  try {
    await transport.sendMail({
      from: emailConfig.from,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });
  } catch (error) {
    console.error('Failed to send email:', error);
    throw new Error('Failed to send email');
  }
}