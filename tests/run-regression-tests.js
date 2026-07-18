#!/usr/bin/env node

/**
 * Script pour executer les tests de non-regression
 * Ce script execute tous les tests Playwright pour verifier que les nouvelles
 * fonctionnalites ne cassent pas les fonctionnalites existantes
 */

const { execSync } = require('child_process');
const path = require('path');

console.log('='.repeat(80));
console.log('DEMARRAGE DES TESTS DE NON-REGRESSION');
console.log('='.repeat(80));
console.log();

// Configuration
const TEST_FILES = [
  'tests/playwright/full-ihm-test.spec.js',
  'tests/playwright/matrices.spec.js',
  'tests/playwright/code-analysis.spec.js'
];

const PROJECTS = ['chromium'];

// Fonction pour executer un test
function runTest(testFile, project) {
  console.log(`\n${'='.repeat(80)}`);
  console.log(`Execution: ${testFile} (${project})`);
  console.log('='.repeat(80));
  
  try {
    const command = `npx playwright test ${testFile} --project=${project}`;
    console.log(`Commande: ${command}\n`);
    
    const output = execSync(command, {
      cwd: path.join(__dirname, '..'),
      encoding: 'utf-8',
      stdio: 'inherit'
    });
    
    console.log(`\n[SUCCESS] ${testFile} (${project}) a passe`);
    return true;
  } catch (error) {
    console.log(`\n[FAILED] ${testFile} (${project}) a echoue`);
    console.error(error.stdout);
    console.error(error.stderr);
    return false;
  }
}

// Fonction principale
async function main() {
  let allPassed = true;
  
  for (const testFile of TEST_FILES) {
    for (const project of PROJECTS) {
      const passed = runTest(testFile, project);
      if (!passed) {
        allPassed = false;
      }
    }
  }
  
  console.log(`\n${'='.repeat(80)}`);
  if (allPassed) {
    console.log('TOUS LES TESTS DE NON-REGRESSION ONT PASSE');
    console.log('='.repeat(80));
    process.exit(0);
  } else {
    console.log('CERTAINS TESTS ONT ECHOUE');
    console.log('='.repeat(80));
    process.exit(1);
  }
}

// Executer
main().catch(error => {
  console.error('Erreur lors de l\'execution des tests:', error);
  process.exit(1);
});
