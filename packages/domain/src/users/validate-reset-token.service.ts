import {getUsersCollection} from './repository';

export async function validateResetToken(
  token: string,
  email: string,
): Promise<{
  valid: boolean;
  user?: {id: string; email: string};
}> {
  const usersCollection = getUsersCollection();
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
}