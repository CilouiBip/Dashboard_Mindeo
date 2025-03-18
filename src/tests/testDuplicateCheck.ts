import { createWithKeyResults } from '../lib/supabase/services/okrService';
import { testOKR } from './testOKR';

async function testDuplicateInsertion() {
  console.log('Test 1: Creating first OKR');
  const result1 = await createWithKeyResults({
    ...testOKR,
    vision_id: 'test-vision-id'
  });
  console.log('Result 1:', result1);

  console.log('\nTest 2: Attempting to create duplicate OKR');
  const result2 = await createWithKeyResults({
    ...testOKR,
    vision_id: 'test-vision-id'
  });
  console.log('Result 2:', result2);
}

testDuplicateInsertion().catch(console.error);
