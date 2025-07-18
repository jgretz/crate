import {getLinksCollection} from './repository';
import {isValidUrl} from '../utils';
import {ObjectId} from 'mongodb';
import type {Link, UpdateLinkInput} from '../types';

export async function updateLinkService(id: string, input: UpdateLinkInput, userId: string): Promise<Link | null> {
  if (input.url && !isValidUrl(input.url)) {
    throw new Error('Invalid URL provided');
  }

  if (input.title !== undefined && !input.title.trim()) {
    throw new Error('Title cannot be empty');
  }

  if (!userId) {
    throw new Error('User ID is required');
  }

  return await updateLink(id, input, userId);
}

async function updateLink(id: string, input: UpdateLinkInput, userId: string): Promise<Link | null> {
  if (!ObjectId.isValid(id)) {
    return null;
  }

  const collection = getLinksCollection();
  const updateDoc: Partial<Link> = {};

  if (input.url !== undefined) updateDoc.url = input.url;
  if (input.title !== undefined) updateDoc.title = input.title;
  if (input.description !== undefined) updateDoc.description = input.description;

  const result = await collection.findOneAndUpdate(
    {_id: new ObjectId(id), userId: new ObjectId(userId)},
    {$set: updateDoc},
    {returnDocument: 'after'},
  );

  return result;
}
