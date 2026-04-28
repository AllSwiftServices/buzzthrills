import { supabaseAdmin } from '../src/lib/supabase';

async function initStorage() {
  if (!supabaseAdmin) {
    console.error("supabaseAdmin not initialized");
    return;
  }

  const buckets = ['voice-notes', 'recordings'];

  for (const bucket of buckets) {
    const { data, error } = await supabaseAdmin.storage.createBucket(bucket, {
      public: false,
      allowedMimeTypes: ['audio/mpeg', 'audio/wav', 'audio/mp4'],
      fileSizeLimit: 10485760 // 10MB
    });

    if (error) {
      if ((error as any).status === 409 || error.message.includes('already exists')) {
        console.log(`Bucket "${bucket}" already exists.`);
      } else {
        console.error(`Error creating bucket "${bucket}":`, error.message);
      }
    } else {
      console.log(`Bucket "${bucket}" created successfully.`);
    }
  }
}

initStorage();
