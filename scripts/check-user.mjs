import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

const env = readFileSync('.env.local', 'utf8')
  .split('\n')
  .reduce((acc, line) => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
      acc[key.trim()] = valueParts.join('=').trim();
    }
    return acc;
  }, {});

const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function checkUser() {
  const { data, error } = await supabase
    .from('auth_accounts')
    .select('*')
    .eq('email', 'danielbarima235@gmail.com');
    
  if (error) {
    console.error('Error:', error);
  } else {
    console.log('User found:', data);
  }
}

checkUser();
