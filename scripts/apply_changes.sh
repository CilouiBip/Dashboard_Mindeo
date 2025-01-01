#!/bin/bash

# 1. Apply database migration
echo "Applying database migration..."
cd supabase
psql -f migrations/20241231_add_context_column.sql

# 2. Replace aiService.ts with new version
echo "Updating aiService.ts..."
cp src/lib/supabase/services/aiService.new2.ts src/lib/supabase/services/aiService.ts

# 3. Clean up temporary files
echo "Cleaning up..."
rm src/lib/supabase/services/aiService.new*.ts

echo "Changes applied successfully!"
