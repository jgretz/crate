import {getLinksCollection} from './repository';
import {isValidUrl} from '../utils';
import type {Link, CreateLinkInput} from '../types';

export async function createLinkService(input: CreateLinkInput): Promise<Link> {
  if (!isValidUrl(input.url)) {
    throw new Error('Invalid URL provided');
  }

  if (!input.title.trim()) {
    throw new Error('Title cannot be empty');
  }

  return await createLink(input);
}

async function createLink(input: CreateLinkInput): Promise<Link> {
  const collection = getLinksCollection();

  const link: Omit<Link, '_id'> = {
    url: input.url,
    title: input.title,
    description: input.description,
    dateAdded: new Date(),
  };

  const result = await collection.insertOne(link as Link);
  return {...link, _id: result.insertedId};
}
