import axios from 'axios';

const baseUrl = `https://api.airtable.com/v0/app6Q4KQzMBm5MEsz`;
const headers = {
  Authorization: `Bearer patEvEhaTBRmTxpQc.5c3a7241c0d360d379260e8655a372d34dec2626c76f51736975c058f30fbfae`,
};

async function testAuditUpdate() {
  try {
    const auditItemId = 'rec9cKPTXXri77r4T';
    const updatePayload = {
      fields: {
        Score: 8,
        Comments: 'Test update with new API key'
      }
    };

    console.log('Sending update to Airtable:', {
      url: `${baseUrl}/Audit_Items/${auditItemId}`,
      payload: updatePayload
    });

    const response = await axios.patch(
      `${baseUrl}/Audit_Items/${auditItemId}`,
      updatePayload,
      { headers }
    );

    console.log('Update successful!', response.data);
  } catch (error) {
    console.error('Test failed:', error.message);
    if (error.response) {
      console.error('Error response:', error.response.data);
    }
  }
}

testAuditUpdate();
