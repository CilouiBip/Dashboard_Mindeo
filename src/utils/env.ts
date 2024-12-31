export function validateEnv() {
  const requiredEnvVars = [
    'VITE_AIRTABLE_API_KEY',
    'VITE_AIRTABLE_BASE_ID'
  ] as const;

  const missingEnvVars = requiredEnvVars.filter(
    (envVar) => !import.meta.env[envVar]
  );

  if (missingEnvVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingEnvVars.join(', ')}\n` +
      'Please create a .env file in the project root with the following variables:\n' +
      'VITE_AIRTABLE_API_KEY=your_api_key\n' +
      'VITE_AIRTABLE_BASE_ID=your_base_id'
    );
  }

  // Validate API key format
  const apiKey = import.meta.env.VITE_AIRTABLE_API_KEY;
  if (!apiKey.startsWith('pat') || apiKey.length < 10) {
    throw new Error('Invalid Airtable API key format. API key should start with "pat" and be at least 10 characters long.');
  }

  // Validate Base ID format
  const baseId = import.meta.env.VITE_AIRTABLE_BASE_ID;
  if (!baseId.startsWith('app') || baseId.length < 10) {
    throw new Error('Invalid Airtable Base ID format. Base ID should start with "app" and be at least 10 characters long.');
  }
}