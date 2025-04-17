/**
 * This script helps update API paths in the React application
 * Run with: node fix-frontend.js
 */

const fs = require('fs');
const path = require('path');

// Paths to check and update
const paths = [
  'client/src/pages/AdminLogin.tsx',
  'client/src/pages/Admin.tsx',
  'client/src/components/AuthProvider.tsx',
  'client/src/hooks/useAuth.ts',
];

// API paths that might need to be updated
const apiPatterns = [
  {
    find: /["']\/auth\/admin\/login["']/g,
    replace: '"/api/auth/admin/login"'
  },
  {
    find: /["']\/auth\/login["']/g,
    replace: '"/api/auth/login"'
  },
  {
    find: /["']\/auth\/logout["']/g,
    replace: '"/api/auth/logout"'
  },
  {
    find: /["']\/api\/badges["']/g, 
    keep: true // This one is already correct
  }
];

// Function to update file content
function updateFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;
  let changes = 0;
  
  apiPatterns.forEach(pattern => {
    // Skip patterns we want to keep
    if (pattern.keep) return;
    
    const matches = content.match(pattern.find);
    if (matches) {
      content = content.replace(pattern.find, pattern.replace);
      changes += matches.length;
      console.log(`  - Updated ${matches.length} occurrences`);
    }
  });
  
  if (changes > 0) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath} (${changes} changes)`);
  } else {
    console.log(`No changes needed in ${filePath}`);
  }
}

// Process all files
console.log('Checking and updating API paths in frontend files...');
paths.forEach(filePath => {
  console.log(`\nChecking ${filePath}:`);
  updateFile(filePath);
});

console.log('\nDone!');
console.log('After making these changes, rebuild your frontend:');
console.log('npm run build');
console.log('Then deploy to Vercel again.'); 