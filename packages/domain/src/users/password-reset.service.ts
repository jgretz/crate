import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import {InjectIn} from '@crate/iocdi';
import {getUsersCollection} from './repository';
import {ObjectId} from 'mongodb';

export interface RequestPasswordResetInput {
  email: string;
}

export interface ResetPasswordInput {
  token: string;
  email: string;
  newPassword: string;
}

export const createPasswordResetService = InjectIn(
  function () {
    return function () {
      const usersCollection = getUsersCollection();

      return {
        async requestPasswordReset(input: RequestPasswordResetInput): Promise<{
          userExists: boolean;
          resetToken?: string;
        }> {
          const user = await usersCollection.findOne({email: input.email});
          
          if (!user) {
            return {userExists: false};
          }

          const resetToken = crypto.randomBytes(32).toString('hex');
          const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

          await usersCollection.updateOne(
            {_id: user._id},
            {
              $set: {
                resetToken,
                resetTokenExpiry,
                updatedAt: new Date(),
              },
            },
          );

          return {
            userExists: true,
            resetToken,
          };
        },

        async validateResetToken(token: string, email: string): Promise<{
          valid: boolean;
          user?: {id: string; email: string};
        }> {
          const user = await usersCollection.findOne({
            email,
            resetToken: token,
            resetTokenExpiry: {$gt: new Date()},
          });

          if (!user) {
            return {valid: false};
          }

          return {
            valid: true,
            user: {
              id: user._id!.toString(),
              email: user.email,
            },
          };
        },

        async resetPassword(input: ResetPasswordInput): Promise<{
          success: boolean;
          error?: string;
        }> {
          const validation = await this.validateResetToken(input.token, input.email);
          
          if (!validation.valid) {
            return {
              success: false,
              error: 'Invalid or expired reset token',
            };
          }

          const hashedPassword = await bcrypt.hash(input.newPassword, 10);

          const result = await usersCollection.updateOne(
            {
              email: input.email,
              resetToken: input.token,
              resetTokenExpiry: {$gt: new Date()},
            },
            {
              $set: {
                password: hashedPassword,
                updatedAt: new Date(),
              },
              $unset: {
                resetToken: '',
                resetTokenExpiry: '',
              },
            },
          );

          if (result.matchedCount === 0) {
            return {
              success: false,
              error: 'Reset token has expired or is invalid',
            };
          }

          return {success: true};
        },
      };
    };
  },
  {callbackName: 'createPasswordResetService'},
);