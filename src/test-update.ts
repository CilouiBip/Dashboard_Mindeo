import { api } from './api/airtable';

async function testAuditUpdate() {
  try {
    const auditItemId = 'rec9cKPTXXri77r4T';
    
    await api.updateAuditItem(auditItemId, {
      Score: 8,
      Comments: 'Test update with new API key'
    });
    
    console.log('Update successful!');
  } catch (error) {
    console.error('Test failed:', error);
    if (error.response) {
      console.error('Error response:', error.response.data);
    }
  }
}

testAuditUpdate();
