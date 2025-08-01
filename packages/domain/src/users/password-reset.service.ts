import crypto from 'crypto';
import {getUsersCollection} from './repository';
import {createUserService, getAllUsersService} from './index';

export interface RequestPasswordResetInput {
  email: string;
}

export async function requestPasswordReset(
  input: RequestPasswordResetInput,
): Promise<{userExists: boolean; resetToken?: string}> {
  const usersCollection = getUsersCollection();
  let user = await usersCollection.findOne({email: input.email});

  if (!user) {
    // Check if there are no users in the database
    const allUsers = await getAllUsersService();

    if (allUsers.length === 0) {
      // Check if the email matches the admin email from config
      const adminEmail = process.env.EMAIL_USER;

      if (adminEmail && input.email === adminEmail) {
        // Create a user with a random password
        const randomPassword = crypto.randomBytes(16).toString('hex');

        try {
          await createUserService({
            email: input.email,
            name: 'Josh',
            password: randomPassword,
          });
          user = await usersCollection.findOne({email: input.email});
        } catch (error) {
          console.error('Failed to create admin user:', error);
          return {userExists: false};
        }
      } else {
        return {userExists: false};
      }
    } else {
      return {userExists: false};
    }
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
}

