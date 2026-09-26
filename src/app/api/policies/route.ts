import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(req) {
  console.log('--- POLICIES API HIT ---');
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!url || !key) {
      console.error('Missing Supabase URL or Key in .env.local');
      return NextResponse.json({ error: 'Missing env vars' }, { status: 500 });
    }

    const body = await req.json();
    console.log('Incoming body payload:', JSON.stringify(body));

    const supabase = createClient(url, key);
    
    // The database requires a policy_hash. We will generate a basic one here.
    const crypto = require('crypto');
    const hash = crypto.createHash('sha256').update(JSON.stringify(body.requirements)).digest('hex');
    
    const payload = {
      ...body,
      policy_hash: hash
    };
    
    const { data, error } = await supabase
      .from('policies')
      .upsert(payload, { onConflict: 'policy_hash' })
      .select()
      .single();
    
    if (error) {
      console.error("Supabase Error Details:", error);
      return NextResponse.json({ error: error.message || 'Supabase Error', details: error }, { status: 500 });
    }
    
    console.log('Insert Success! Data:', data);
    return NextResponse.json(data);
  } catch (e) {
    console.error("Catch Block Error:", e);
    return NextResponse.json({ error: e.message || 'Server error' }, { status: 500 });
  }
}
