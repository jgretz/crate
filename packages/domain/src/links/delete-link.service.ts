import {getLinksCollection} from './repository';
import {ObjectId} from 'mongodb';

export async function deleteLinkService(id: string): Promise<boolean> {
  return await deleteLink(id);
}

async function deleteLink(id: string): Promise<boolean> {
  if (!ObjectId.isValid(id)) {
    return false;
  }

  const collection = getLinksCollection();
  const result = await collection.deleteOne({_id: new ObjectId(id)});
  return result.deletedCount === 1;
}
