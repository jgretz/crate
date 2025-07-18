import {getLinksCollection} from './repository';
import {ObjectId} from 'mongodb';
import type {Link} from '../types';

export async function getAllLinksService(): Promise<Link[]> {
  return await findAllLinks();
}

export async function getLinkByIdService(id: string): Promise<Link | null> {
  return await findLinkById(id);
}

async function findAllLinks(): Promise<Link[]> {
  const collection = getLinksCollection();
  return await collection.find({}).sort({dateAdded: -1}).toArray();
}

async function findLinkById(id: string): Promise<Link | null> {
  if (!ObjectId.isValid(id)) {
    return null;
  }

  const collection = getLinksCollection();
  return await collection.findOne({_id: new ObjectId(id)});
}
