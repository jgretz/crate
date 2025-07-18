import {getLinksCollection} from './repository';
import {isValidUrl} from '../utils';
import {ObjectId} from 'mongodb';
import type {Link, CreateLinkInput} from '../types';

export async function createLinkService(input: CreateLinkInput, userId: string): Promise<Link> {
  if (!isValidUrl(input.url)) {
    throw new Error('Invalid URL provided');
  }

  if (!input.title.trim()) {
    throw new Error('Title cannot be empty');
  }

  if (!userId) {
    throw new Error('User ID is required');
  }

  return await createLink(input, userId);
}

async function createLink(input: CreateLinkInput, userId: string): Promise<Link> {
  const collection = getLinksCollection();

  const link: Omit<Link, '_id'> = {
    url: input.url,
    title: input.title,
    description: input.description,
    dateAdded: new Date(),
    userId: new ObjectId(userId),
  };

  const result = await collection.insertOne(link as Link);
  return {...link, _id: result.insertedId};
}
