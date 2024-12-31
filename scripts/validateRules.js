const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Colors for console output
const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const RESET = '\x1b[0m';

function validateFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const errors = [];

  // Check file structure
  if (path.extname(filePath) === '.tsx' || path.extname(filePath) === '.ts') {
    // Check imports
    if (!content.includes('from \'@/')) {
      errors.push('Missing absolute imports (@/)');
    }

    // Check TypeScript interfaces/types
    if (!content.includes('interface') && !content.includes('type ')) {
      errors.push('Missing type definitions');
    }

    // Check for proper exports
    if (!content.match(/export (default |{)/)) {
      errors.push('Missing exports');
    }
  }

  // Check component structure
  if (filePath.includes('/components/') && path.extname(filePath) === '.tsx') {
    // Check for proper component naming
    const fileName = path.basename(filePath, '.tsx');
    if (!fileName.match(/^[A-Z][A-Za-z]+$/)) {
      errors.push('Component name should be PascalCase');
    }

    // Check for proper props interface
    if (!content.includes('interface') || !content.includes('Props')) {
      errors.push('Missing Props interface');
    }
  }

  // Check hooks
  if (filePath.includes('/hooks/')) {
    const fileName = path.basename(filePath, '.ts');
    if (!fileName.startsWith('use')) {
      errors.push('Hook should start with "use"');
    }
  }

  return errors;
}

function validateDataStructure(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const errors = [];

  // Check for proper function structure
  if (content.includes('Fonction_Name')) {
    if (!content.includes('Score_Final_Fonction')) {
      errors.push('Missing Score_Final_Fonction in function');
    }
    if (!content.includes('Problems_Name')) {
      errors.push('Missing Problems_Name in function');
    }
  }

  // Check for proper problem structure
  if (content.includes('Problems_Name')) {
    if (!content.includes('Categorie_Problems_Name')) {
      errors.push('Missing Categorie_Problems_Name in problem');
    }
    if (!content.includes('Sub_Problems_Name')) {
      errors.push('Missing Sub_Problems_Name in problem');
    }
  }

  return errors;
}

function main() {
  console.log(`${YELLOW}Starting rule validation...${RESET}\n`);

  // Get all TypeScript/TSX files
  const files = execSync('git ls-files "*.ts" "*.tsx"', { encoding: 'utf8' })
    .split('\n')
    .filter(Boolean);

  let hasErrors = false;
  let totalErrors = 0;

  files.forEach(file => {
    const fileErrors = validateFile(file);
    const dataErrors = validateDataStructure(file);
    const allErrors = [...fileErrors, ...dataErrors];

    if (allErrors.length > 0) {
      hasErrors = true;
      totalErrors += allErrors.length;
      console.log(`${RED}Errors in ${file}:${RESET}`);
      allErrors.forEach(error => console.log(`  - ${error}`));
      console.log('');
    }
  });

  if (hasErrors) {
    console.log(`${RED}Validation failed with ${totalErrors} errors${RESET}`);
    process.exit(1);
  } else {
    console.log(`${GREEN}All rules validated successfully!${RESET}`);
  }
}

main();
