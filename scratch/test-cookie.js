const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envFile = fs.readFileSync('.env.local', 'utf-8');
const env = {};
envFile.split('\n').forEach(line => {
  const [k, ...v] = line.trim().split('=');
  if (k && v.length) env[k.trim()] = v.join('=').trim().replace(/^["']|["']$/g, '');
});

const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const client = createClient(url, key);

async function run() {
  const { data, error } = await client.auth.signInWithPassword({
    email: 'e2e-tester@redteam.internal',
    password: 'Password123!'
  });
  if (error) {
    console.error('Error:', error);
    return;
  }
  console.log('User id:', data.user.id);
  console.log('Session access token prefix:', data.session.access_token.slice(0, 30));
  // In JWT, let's decode the payload
  const parts = data.session.access_token.split('.');
  const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf-8'));
  console.log('JWT payload sub:', payload.sub, 'email:', payload.email, 'exp:', payload.exp);
}
run();

