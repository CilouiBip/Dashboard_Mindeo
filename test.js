import axios from 'axios';

const baseUrl = `https://api.airtable.com/v0/${
  import.meta.env.VITE_AIRTABLE_BASE_ID
}`;
const headers = {
  Authorization: `Bearer ${import.meta.env.VITE_AIRTABLE_API_KEY}`,
};

// Fonction de test pour vérifier l'API Airtable
(async () => {
  try {
    console.log('Testing Airtable connection...');

    const response = await axios.get(`${baseUrl}/Marketing_Problems`, {
      headers,
    });
    console.log(
      'Data fetched successfully:',
      JSON.stringify(response.data, null, 2)
    );
  } catch (error) {
    console.error(
      'Error fetching data:',
      error.response ? error.response.data : error.message
    );
  }
})();
