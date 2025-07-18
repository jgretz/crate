import {getUsersCollection} from './repository';
import {ObjectId} from 'mongodb';
import type {User, UpdateUserInput} from '../types';
import {findUserByEmailService} from './get-users.service';
import {authService} from '@crate/domain';

export async function updateUserService(id: string, input: UpdateUserInput): Promise<User | null> {
  if (input.email !== undefined) {
    if (!input.email.trim()) {
      throw new Error('Email cannot be empty');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(input.email)) {
      throw new Error('Invalid email format');
    }

    const existingUser = await findUserByEmailService(input.email);
    if (existingUser && existingUser._id?.toString() !== id) {
      throw new Error('User with this email already exists');
    }
  }

  if (input.name !== undefined && !input.name.trim()) {
    throw new Error('Name cannot be empty');
  }

  return await updateUser(id, input);
}

async function updateUser(id: string, input: UpdateUserInput): Promise<User | null> {
  if (!ObjectId.isValid(id)) {
    return null;
  }

  const collection = getUsersCollection();
  const updateDoc: Partial<User> = {
    updatedAt: new Date(),
  };

  if (input.email !== undefined) updateDoc.email = input.email;
  if (input.name !== undefined) updateDoc.name = input.name;
  if (input.password !== undefined)
    updateDoc.password = await authService.hashPassword(input.password);

  const result = await collection.findOneAndUpdate(
    {_id: new ObjectId(id)},
    {$set: updateDoc},
    {returnDocument: 'after'},
  );

  return result;
}
