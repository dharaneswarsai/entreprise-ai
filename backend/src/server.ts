import { createApp } from './app';
import { env } from './config/env';
import { isSupabaseConfigured } from './config/supabase';

const app = createApp();
const PORT = env.PORT || 10000;

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`=======================================================`);
  console.log(`Entreprise AI Backend Operations Server`);
  console.log(`Status: RUNNING on http://0.0.0.0:${PORT}`);
  console.log(`Environment: ${env.NODE_ENV}`);
  console.log(`Database: ${isSupabaseConfigured() ? `Supabase (${env.SUPABASE_URL})` : 'In-Memory Engine (Configure SUPABASE_URL in .env to connect)'}`);
  console.log(`AI Provider: ${env.AI_PROVIDER || 'in-memory grounded ops engine'}`);
  console.log(`=======================================================`);
});

const shutdown = () => {
  console.log('Received shutdown signal, terminating server gracefully...');
  server.close(() => {
    console.log('Entreprise AI server closed successfully.');
    process.exit(0);
  });
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
