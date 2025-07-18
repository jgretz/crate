import {Collection} from 'mongodb';
import {setDependency, resolveDependency} from '@crate/iocdi';
import {getDatabase} from '../database/connection';
import type {Link} from '../types';

export const LINK_SYMBOLS = {
  COLLECTION: Symbol('links-collection'),
} as const;

export function initializeLinksCollection(): void {
  const database = getDatabase();
  const collection = database.collection<Link>('links');

  setDependency(LINK_SYMBOLS.COLLECTION, collection);
}

export function getLinksCollection(): Collection<Link> {
  const collection = resolveDependency<Collection<Link>>(LINK_SYMBOLS.COLLECTION);
  if (!collection) {
    throw new Error('Links collection not initialized. Call initializeLinksCollection() first.');
  }
  return collection;
}
