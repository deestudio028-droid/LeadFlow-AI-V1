const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envFile = fs.readFileSync('.env.local', 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const [k, ...v] = line.split('=');
  if (k) env[k.trim()] = v.join('=').trim().replace(/^"|"$/g, '');
});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function assignToken() {
  const { data: businesses } = await supabase.from('businesses').select('*');
  console.log('Current Businesses:', businesses);
  
  if (businesses.length > 0) {
    const b = businesses[0];
    if (!b.embed_token) {
      const newToken = 'lf_' + Math.random().toString(36).substring(2, 15);
      await supabase.from('businesses').update({ embed_token: newToken }).eq('id', b.id);
      console.log('Assigned token:', newToken, 'to', b.name);
    } else {
      console.log('Business already has token:', b.embed_token);
    }
  }
}

assignToken();
