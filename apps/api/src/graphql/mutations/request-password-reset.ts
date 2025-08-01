import {InjectIn} from '@stashl/iocdi';
import {createPasswordResetService} from '@stashl/domain';
import {createEmailService} from '@stashl/email';

export const requestPasswordResetTypeDef = `
  type RequestPasswordResetResponse {
    message: String!
  }

  extend type Mutation {
    requestPasswordReset(email: String!): RequestPasswordResetResponse!
  }
`;

export const requestPasswordResetResolver = InjectIn(
  function () {
    return function () {
      const passwordResetService = createPasswordResetService();
      const emailService = createEmailService();

      return {
        Mutation: {
          async requestPasswordReset(_: any, {email}: {email: string}) {
            const result = await passwordResetService.requestPasswordReset({email});

            if (result.userExists && result.resetToken) {
              const emailConfig = {
                gmail: {
                  user: process.env.GMAIL_USER!,
                  appPassword: process.env.GMAIL_APP_PASSWORD!,
                },
                from: process.env.EMAIL_FROM || process.env.GMAIL_USER!,
              };

              const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

              try {
                await emailService.sendPasswordResetEmail(
                  email,
                  result.resetToken,
                  baseUrl,
                );
              } catch (error) {
                console.error('Failed to send password reset email:', error);
              }
            }

            return {
              message: 'If an account with that email exists, a password reset link has been sent.',
            };
          },
        },
      };
    };
  },
  {callbackName: 'requestPasswordResetResolver'},
);