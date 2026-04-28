import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function addColumns() {
  const { error } = await supabase.rpc('run_sql', { 
    sql: 'ALTER TABLE calls ADD COLUMN IF NOT EXISTS admin_notes TEXT; ALTER TABLE calls ADD COLUMN IF NOT EXISTS failure_reason TEXT;' 
  });
  
  if (error) {
    console.error('Error adding columns:', error);
  } else {
    console.log('Columns added successfully');
  }
}

addColumns();
