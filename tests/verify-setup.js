/**
 * Script de vérification de l'installation
 * Ce script vérifie que toutes les dépendances et configurations sont correctes
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Vérification de la configuration du projet...\n');

// Vérifier les fichiers essentiels
const essentialFiles = [
  'app/layout.tsx',
  'app/globals.css',
  'app/page.tsx',
  'app/page.tsx',
  'app/features/page.tsx',
  'app/exigences/page.tsx',
  'app/tests/page.tsx',
  'app/matrices/page.tsx',
  'app/code/page.tsx',
  'app/prd/page.tsx',
  'app/epics/page.tsx',
  'components/Sidebar.tsx',
  'components/FeatureForm.tsx',
  'components/TestForm.tsx',
  'components/ExigenceForm.tsx',
  'components/AIImprovementModal.tsx',
  'components/TestAIGeneratorModal.tsx',
  'components/FeatureAIGeneratorModal.tsx',
  'types/besoin.ts',
  'types/feature.ts',
  'types/exigence.ts',
  'types/test.ts',
  'types/epic.ts',
  'types/prd.ts',
];

let allFilesExist = true;

console.log('📁 Vérification des fichiers essentiels:');
for (const file of essentialFiles) {
  const filePath = path.join(__dirname, '..', file);
  if (fs.existsSync(filePath)) {
    console.log(`   ✅ ${file}`);
  } else {
    console.log(`   ❌ ${file} - MANQUANT`);
    allFilesExist = false;
  }
}

// Vérifier les composants IA
console.log('\n🤖 Vérification des composants IA:');
const aiComponents = [
  'components/AIImprovementModal.tsx',
  'components/TestAIGeneratorModal.tsx',
  'components/FeatureAIGeneratorModal.tsx',
  'components/ExigenceAIGeneratorModal.tsx',
];

for (const component of aiComponents) {
  const componentPath = path.join(__dirname, '..', component);
  if (fs.existsSync(componentPath)) {
    console.log(`   ✅ ${component}`);
  } else {
    console.log(`   ⚠️ ${component} - Non trouvé (optionnel)`);
  }
}

// Vérifier les pages avec intégration IA
console.log('\n🎨 Vérification des pages avec intégration IA:');
const pagesWithAI = [
  { file: 'app/features/page.tsx', features: ['onGenerateAI', 'onImproveAI', 'FeatureAIGeneratorModal'] },
  { file: 'app/tests/page.tsx', features: ['onGenerateAI', 'onImproveAI', 'TestAIGeneratorModal'] },
];

for (const { file, features } of pagesWithAI) {
  const filePath = path.join(__dirname, '..', file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    const hasAllFeatures = features.every((feature) => content.includes(feature));
    if (hasAllFeatures) {
      console.log(`   ✅ ${file} - Toutes les fonctionnalités IA présentes`);
    } else {
      console.log(`   ⚠️ ${file} - Certaines fonctionnalités IA manquantes`);
      features.forEach((feature) => {
        if (content.includes(feature)) {
          console.log(`      ✅ ${feature}`);
        } else {
          console.log(`      ❌ ${feature} - MANQUANT`);
        }
      });
    }
  } else {
    console.log(`   ❌ ${file} - MANQUANT`);
  }
}

// Vérifier la matrice Exigence-Tests
console.log('\n📋 Vérification de la matrice Exigence-Tests:');
const matricesPage = path.join(__dirname, '..', 'app/matrices/page.tsx');
if (fs.existsSync(matricesPage)) {
  const content = fs.readFileSync(matricesPage, 'utf8');
  const requiredFeatures = [
    'ExigenceTestsMatrix',
    'calculateExigenceTestCoverage',
    'calculateCoveragePercentage',
    'getExigenceTitle',
    'Link',
  ];
  
  const hasAllFeatures = requiredFeatures.every((feature) => content.includes(feature));
  if (hasAllFeatures) {
    console.log(`   ✅ app/matrices/page.tsx - Toutes les fonctionnalités de matrice présentes`);
  } else {
    console.log(`   ⚠️ app/matrices/page.tsx - Certaines fonctionnalités manquantes`);
    requiredFeatures.forEach((feature) => {
      if (content.includes(feature)) {
        console.log(`      ✅ ${feature}`);
      } else {
        console.log(`      ❌ ${feature} - MANQUANT`);
      }
    });
  }
} else {
  console.log(`   ❌ app/matrices/page.tsx - MANQUANT`);
}

// Vérifier le thème neumorphic
console.log('\n🎨 Vérification du thème Neumorphic:');
const globalsCss = path.join(__dirname, '..', 'app/globals.css');
if (fs.existsSync(globalsCss)) {
  const content = fs.readFileSync(globalsCss, 'utf8');
  const neumorphicFeatures = [
    '--neumorphic-bg',
    '--neumorphic-text',
    '.neumorphic-card',
    '.neumorphic-button',
    '.neumorphic-sidebar',
  ];
  
  const hasAllFeatures = neumorphicFeatures.every((feature) => content.includes(feature));
  if (hasAllFeatures) {
    console.log(`   ✅ app/globals.css - Thème neumorphic complet`);
  } else {
    console.log(`   ⚠️ app/globals.css - Certaines classes neumorphic manquantes`);
    neumorphicFeatures.forEach((feature) => {
      if (content.includes(feature)) {
        console.log(`      ✅ ${feature}`);
      } else {
        console.log(`      ❌ ${feature} - MANQUANT`);
      }
    });
  }
} else {
  console.log(`   ❌ app/globals.css - MANQUANT`);
}

// Vérifier le layout
console.log('\n🏗️ Vérification du Layout:');
const layoutFile = path.join(__dirname, '..', 'app/layout.tsx');
if (fs.existsSync(layoutFile)) {
  const content = fs.readFileSync(layoutFile, 'utf8');
  const layoutFeatures = [
    'Sidebar',
    'metadata',
    'bg-neumorphic',
    'min-h-screen',
  ];
  
  const hasAllFeatures = layoutFeatures.every((feature) => content.includes(feature));
  if (hasAllFeatures) {
    console.log(`   ✅ app/layout.tsx - Layout complet`);
  } else {
    console.log(`   ⚠️ app/layout.tsx - Certaines fonctionnalités manquantes`);
    layoutFeatures.forEach((feature) => {
      if (content.includes(feature)) {
        console.log(`      ✅ ${feature}`);
      } else {
        console.log(`      ❌ ${feature} - MANQUANT`);
      }
    });
  }
} else {
  console.log(`   ❌ app/layout.tsx - MANQUANT`);
}

// Résumé final
console.log('\n' + '='.repeat(60));
console.log('📊 RÉSUMÉ DE LA VÉRIFICATION');
console.log('='.repeat(60));

if (allFilesExist) {
  console.log('✅ Tous les fichiers essentiels sont présents');
} else {
  console.log('❌ Certains fichiers essentiels sont manquants');
}

console.log('\n💡 Prochaines étapes:');
console.log('   1. Exécutez: npm install');
console.log('   2. Exécutez: npm run build');
console.log('   3. Exécutez: npm run start');
console.log('   4. Ouvrez http://localhost:3000 dans votre navigateur');
console.log('   5. Dans la console, exécutez: loadTestData()');
console.log('   6. Testez toutes les fonctionnalités');
console.log('\n' + '='.repeat(60));
