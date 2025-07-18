import {getLinksCollection} from './repository';
import {ObjectId} from 'mongodb';
import type {Link} from '../types';

export async function getAllLinksService(): Promise<Link[]> {
  return await findAllLinks();
}

export async function getAllLinksByUserService(userId: string): Promise<Link[]> {
  return await findAllLinksByUser(userId);
}

export async function getLinkByIdService(id: string): Promise<Link | null> {
  return await findLinkById(id);
}

async function findAllLinks(): Promise<Link[]> {
  const collection = getLinksCollection();
  return await collection.find({}).sort({dateAdded: -1}).toArray();
}

async function findAllLinksByUser(userId: string): Promise<Link[]> {
  const collection = getLinksCollection();
  return await collection.find({userId: new ObjectId(userId)}).sort({dateAdded: -1}).toArray();
}

async function findLinkById(id: string): Promise<Link | null> {
  if (!ObjectId.isValid(id)) {
    return null;
  }

  const collection = getLinksCollection();
  return await collection.findOne({_id: new ObjectId(id)});
}

export async function getLinkByIdAndUserService(id: string, userId: string): Promise<Link | null> {
  return await findLinkByIdAndUser(id, userId);
}

async function findLinkByIdAndUser(id: string, userId: string): Promise<Link | null> {
  if (!ObjectId.isValid(id)) {
    return null;
  }

  const collection = getLinksCollection();
  return await collection.findOne({_id: new ObjectId(id), userId: new ObjectId(userId)});
}
