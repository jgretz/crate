import bcrypt from 'bcryptjs';
import {getUsersCollection} from './repository';
import {validateResetToken} from './validate-reset-token.service';

export interface ResetPasswordInput {
  token: string;
  email: string;
  newPassword: string;
}

export async function resetPassword(input: ResetPasswordInput): Promise<{
  success: boolean;
  error?: string;
}> {
  const usersCollection = getUsersCollection();

  const validation = await validateResetToken(input.token, input.email);

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
}