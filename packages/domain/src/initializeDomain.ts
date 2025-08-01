import {initializeDatabase} from './database/connection';
import {type DatabaseConfig} from './database/config';
import {initializeLinksCollection} from './links/repository';
import {initializeUsersCollection} from './users/repository';

export async function initializeDomain(config: DatabaseConfig = {}): Promise<void> {
  // database connection
  await initializeDatabase(config);

  // collections
  initializeLinksCollection();
  initializeUsersCollection();

  console.log('Domain layer initialized');
}
