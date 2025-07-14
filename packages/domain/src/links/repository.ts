import {Collection, ObjectId} from 'mongodb';
import {setDependency, resolveDependency} from '@crate/iocdi';
import {getDatabase} from '../database/connection';
import type {Link, CreateLinkInput, UpdateLinkInput} from '../types';

export const LINK_SYMBOLS = {
  COLLECTION: Symbol('links-collection'),
} as const;

/**
 * Initialize the links collection and register it in the IOC container
 */
export function initializeLinksCollection(): void {
  const database = getDatabase();
  const collection = database.collection<Link>('links');
  setDependency(LINK_SYMBOLS.COLLECTION, collection);
}

/**
 * Get the links collection from the IOC container
 */
export function getLinksCollection(): Collection<Link> {
  const collection = resolveDependency<Collection<Link>>(LINK_SYMBOLS.COLLECTION);
  if (!collection) {
    throw new Error('Links collection not initialized. Call initializeLinksCollection() first.');
  }
  return collection;
}

/**
 * Create a new link
 */
export async function createLink(input: CreateLinkInput): Promise<Link> {
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

/**
 * Find a link by ID
 */
export async function findLinkById(id: string): Promise<Link | null> {
  if (!ObjectId.isValid(id)) {
    return null;
  }

  const collection = getLinksCollection();
  return await collection.findOne({_id: new ObjectId(id)});
}

/**
 * Find all links
 */
export async function findAllLinks(): Promise<Link[]> {
  const collection = getLinksCollection();
  return await collection.find({}).sort({dateAdded: -1}).toArray();
}

/**
 * Update a link by ID
 */
export async function updateLink(id: string, input: UpdateLinkInput): Promise<Link | null> {
  if (!ObjectId.isValid(id)) {
    return null;
  }

  const collection = getLinksCollection();
  const updateDoc: Partial<Link> = {};

  if (input.url !== undefined) updateDoc.url = input.url;
  if (input.title !== undefined) updateDoc.title = input.title;
  if (input.description !== undefined) updateDoc.description = input.description;

  const result = await collection.findOneAndUpdate(
    {_id: new ObjectId(id)},
    {$set: updateDoc},
    {returnDocument: 'after'},
  );

  return result;
}

/**
 * Delete a link by ID
 */
export async function deleteLink(id: string): Promise<boolean> {
  if (!ObjectId.isValid(id)) {
    return false;
  }

  const collection = getLinksCollection();
  const result = await collection.deleteOne({_id: new ObjectId(id)});
  return result.deletedCount === 1;
}
