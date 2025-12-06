/**
 * Force replace images in Supabase Storage by deleting old ones first
 */

import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'

const dotenv = require('dotenv')
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const imagesToReplace = [
  'reading-direction-ux.jpg',
  'islamic-calligraphy.jpg',
  'arabic-ligatures.jpg',
  'bidirectional-text.jpg',
  'common-rtl-bugs.jpg',
  'css-logical-properties.jpg',
  'history-of-arabic-script.jpg',
  'nastaliq-vs-naskh.jpg',
  'numbers-rtl.jpg',
  'understanding-rtl.jpg',
  'urdu-nastaliq-script.jpg',
]

async function forceReplaceImages() {
  console.log('Force replacing images in Supabase Storage...\n')

  const publicDir = path.join(process.cwd(), 'public', 'images', 'posts')

  for (const filename of imagesToReplace) {
    const localPath = path.join(publicDir, filename)
    const storagePath = `posts/${filename}`

    console.log(`\n📥 Processing: ${filename}`)

    // 1. Delete old image
    console.log(`   Deleting old image...`)
    const { error: deleteError } = await supabase.storage
      .from('images')
      .remove([storagePath])

    if (deleteError) {
      console.log(`   ⚠️  Delete failed (may not exist): ${deleteError.message}`)
    } else {
      console.log(`   ✓ Deleted old image`)
    }

    // 2. Upload new image
    if (!fs.existsSync(localPath)) {
      console.log(`   ✗ Local file not found: ${localPath}`)
      continue
    }

    console.log(`   Uploading new image...`)
    const fileBuffer = fs.readFileSync(localPath)

    const { data, error: uploadError } = await supabase.storage
      .from('images')
      .upload(storagePath, fileBuffer, {
        contentType: 'image/jpeg',
        cacheControl: '3600',
      })

    if (uploadError) {
      console.log(`   ✗ Upload failed: ${uploadError.message}`)
      continue
    }

    console.log(`   ✓ Uploaded successfully`)

    // 3. Get public URL
    const { data: urlData } = supabase.storage
      .from('images')
      .getPublicUrl(storagePath)

    console.log(`   URL: ${urlData.publicUrl}`)
  }

  console.log('\n' + '='.repeat(60))
  console.log('Force replace completed!')
  console.log('='.repeat(60))
}

forceReplaceImages()
