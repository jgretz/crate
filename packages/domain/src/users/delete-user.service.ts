import {getUsersCollection} from './repository';
import {ObjectId} from 'mongodb';

export async function deleteUserService(id: string): Promise<boolean> {
  return await deleteUser(id);
}

async function deleteUser(id: string): Promise<boolean> {
  if (!ObjectId.isValid(id)) {
    return false;
  }

  const collection = getUsersCollection();
  const result = await collection.deleteOne({_id: new ObjectId(id)});
  return result.deletedCount === 1;
}