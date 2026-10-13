import test from 'node:test';
import assert from 'node:assert';
import { isSupabaseConfigured, testSupabaseConnection } from '../config/supabase';
import { EnterpriseRepository } from '../repositories/enterprise.repository';

test('Supabase connector fallback detection', () => {
  const configured = isSupabaseConfigured();
  assert.strictEqual(typeof configured, 'boolean');
});

test('EnterpriseRepository initializes memory state gracefully', () => {
  const repo = EnterpriseRepository.getInstance();
  const orgs = repo.getOrganizations();
  assert.ok(Array.isArray(orgs));
  assert.ok(orgs.length >= 5);
  assert.strictEqual(orgs[0].id, 'org-apex-001');

  const projects = repo.getProjects('org-apex-001');
  assert.ok(Array.isArray(projects));
  assert.ok(projects.length >= 1);
});

test('Supabase health check returns structured result', async () => {
  const health = await testSupabaseConnection();
  assert.strictEqual(typeof health.configured, 'boolean');
  assert.strictEqual(typeof health.connected, 'boolean');
  assert.strictEqual(typeof health.message, 'string');
});
