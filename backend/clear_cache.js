import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

async function clearCache() {
  const { error } = await supabase
    .from('issues_cache')
    .delete()
    .not('cache_key', 'eq', 'nothing')
    
  if (error) {
    console.error('Error clearing cache:', error)
  } else {
    console.log('Successfully cleared issues_cache.')
  }
}

clearCache()
