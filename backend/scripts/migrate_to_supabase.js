/*
Run this script locally to migrate existing data.json into Supabase `app_state` table.
Usage:
  cd backend
  node scripts/migrate_to_supabase.js
Make sure env vars SUPABASE_URL and SUPABASE_KEY are set.
*/

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

async function main() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_KEY;
  if (!url || !key) {
    console.error('Set SUPABASE_URL and SUPABASE_KEY in env before running');
    process.exit(1);
  }

  const supabase = createClient(url, key);
  const dataFile = path.join(__dirname, '..', 'data.json');
  if (!fs.existsSync(dataFile)) {
    console.error('data.json not found at', dataFile);
    process.exit(1);
  }

  const fileData = fs.readFileSync(dataFile, 'utf8');
  const payload = JSON.parse(fileData);

  const row = { id: 'main', payload };
  const { error } = await supabase.from('app_state').upsert(row, { onConflict: 'id' });
  if (error) {
    console.error('Supabase upsert error', error);
    process.exit(1);
  }
  console.log('Migrated data.json to Supabase app_state table');
}

main().catch(err => { console.error(err); process.exit(1); });
