import {Hono} from 'hono';
import {createYoga} from 'graphql-yoga';
import {initializeDomain} from '@stashl/domain';
import {createSchema} from './schema';
import {getAuthContext} from './auth/context';

const app = new Hono();

// Initialize the functional domain layer
try {
  await initializeDomain();
} catch (error) {
  console.error('❌ Failed to initialize domain layer:', error.message);
  process.exit(1);
}

// Initialize email service
import {initializeEmail} from '@stashl/email';
try {
  initializeEmail();
} catch (error) {
  console.error('❌ Failed to initialize email service:', error.message);
  process.exit(1);
}

// Create the GraphQL schema using the functional approach
const schema = createSchema();

const yoga = createYoga({
  schema,
  context: ({request}) => {
    return getAuthContext(request);
  },
});

app.use('/graphql', async (c) => {
  return await yoga.fetch(c.req.raw);
});

app.get('/', (c) => c.text('Stashl.ink API'));

export default {
  port: 3001,
  fetch: app.fetch,
};
