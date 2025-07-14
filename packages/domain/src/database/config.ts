export interface DatabaseConfig {
  connectionString?: string;
  databaseName?: string;
}

export const DATABASE_SYMBOLS = {
  CLIENT: Symbol('mongodb-client'),
  DATABASE: Symbol('mongodb-database'),
  CONFIG: Symbol('database-config'),
} as const;
