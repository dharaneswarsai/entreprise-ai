import { isSupabaseConfigured, testSupabaseConnection } from '../config/supabase';
import { EnterpriseRepository } from '../repositories/enterprise.repository';

async function main() {
  console.log('====================================================');
  console.log('Entreprise AI OS — Supabase Database Seeder');
  console.log('====================================================');

  if (!isSupabaseConfigured()) {
    console.error('ERROR: Supabase credentials not found in backend/.env.');
    console.error('Please configure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY first.');
    process.exit(1);
  }

  console.log('1. Testing connection to Supabase...');
  const health = await testSupabaseConnection();
  if (!health.connected) {
    console.error(`Connection failed: ${health.message}`);
    console.error('Check that your schema tables have been created using backend/src/config/schema.sql');
    process.exit(1);
  }

  console.log(`Connected successfully! Latency: ${health.latencyMs}ms`);
  console.log('2. Cleansing existing records and seeding 4 distinct enterprise businesses...');

  const repo = EnterpriseRepository.getInstance();
  const res = await repo.resetAndSeedDatabase();

  console.log('\nSeeding Complete! Summary of clean records provisioned:');
  Object.entries(res.inserted).forEach(([entity, count]) => {
    console.log(`  - ${entity.padEnd(20)}: ${count} rows`);
  });
  console.log('====================================================');
  console.log('All enterprise records synchronized with Supabase.');
  process.exit(0);
}

main().catch(err => {
  console.error('Unexpected error while seeding Supabase:', err);
  process.exit(1);
});
