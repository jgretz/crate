import {initializeDatabase} from './database/connection';
import {type DatabaseConfig} from './database/config';
import {initializeLinksCollection} from './links/repository';

/**
 * Initialize the entire domain layer
 */
export async function initializeDomain(config: DatabaseConfig = {}): Promise<void> {
  // Initialize database connection
  await initializeDatabase(config);

  // Initialize collections
  initializeLinksCollection();

  console.log('Domain layer initialized');
}
