import {getLinksCollection} from './repository';
import {ObjectId} from 'mongodb';

export async function deleteLinkService(id: string, userId: string): Promise<boolean> {
  if (!userId) {
    throw new Error('User ID is required');
  }
  return await deleteLink(id, userId);
}

async function deleteLink(id: string, userId: string): Promise<boolean> {
  if (!ObjectId.isValid(id)) {
    return false;
  }

  const collection = getLinksCollection();
  const result = await collection.deleteOne({_id: new ObjectId(id), userId: new ObjectId(userId)});
  return result.deletedCount === 1;
}
