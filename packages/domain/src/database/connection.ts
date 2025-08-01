import {MongoClient, Db, ServerApiVersion} from 'mongodb';
import {setDependency, resolveDependency} from '@stashl/iocdi';
import {DATABASE_SYMBOLS, type DatabaseConfig} from './config';

/**
 * Initialize MongoDB connection and register it in the IOC container
 */
export async function initializeDatabase(config: DatabaseConfig = {}): Promise<void> {
  const connectionString =
    config.connectionString || process.env.MONGODB_CONNECTION_STRING || 'mongodb://localhost:27017';

  const databaseName = config.databaseName || process.env.MONGODB_DATABASE_NAME || 'crate';

  try {
    // Create and connect MongoDB client with Atlas-compatible serverApi
    const client = new MongoClient(connectionString, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });
    await client.connect();

    // Get database instance
    const database = client.db(databaseName);

    // Register in IOC container
    setDependency(DATABASE_SYMBOLS.CONFIG, config);
    setDependency(DATABASE_SYMBOLS.CLIENT, client);
    setDependency(DATABASE_SYMBOLS.DATABASE, database);

    console.log(`Connected to MongoDB database: ${databaseName}`);
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error instanceof Error ? error.message : String(error));
    throw error;
  }
}

/**
 * Get MongoDB client from IOC container
 */
export function getMongoClient(): MongoClient {
  const client = resolveDependency<MongoClient>(DATABASE_SYMBOLS.CLIENT);
  if (!client) {
    throw new Error('MongoDB client not initialized. Call initializeDatabase() first.');
  }
  return client;
}

/**
 * Get MongoDB database from IOC container
 */
export function getDatabase(): Db {
  const database = resolveDependency<Db>(DATABASE_SYMBOLS.DATABASE);
  if (!database) {
    throw new Error('MongoDB database not initialized. Call initializeDatabase() first.');
  }
  return database;
}

/**
 * Close MongoDB connection
 */
export async function closeDatabase(): Promise<void> {
  const client = resolveDependency<MongoClient>(DATABASE_SYMBOLS.CLIENT);
  if (client) {
    await client.close();
  }
}
