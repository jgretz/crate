import {initializeDatabase} from './database/connection';
import {type DatabaseConfig} from './database/config';
import {initializeLinksCollection} from './links/repository';
import {initializeUsersCollection} from './users/repository';

/**
 * Initialize the entire domain layer
 */
export async function initializeDomain(config: DatabaseConfig = {}): Promise<void> {
  // Initialize database connection
  await initializeDatabase(config);

  // Initialize collections
  initializeLinksCollection();
  initializeUsersCollection();

  console.log('Domain layer initialized');
}
