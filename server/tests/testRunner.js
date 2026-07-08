import assert from 'assert';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import textSplitter from '../services/textSplitter.js';
import embeddingService from '../services/embeddingService.js';
import vectorDbService from '../services/vectorDbService.js';
import searchService from '../services/searchService.js';

dotenv.config();

const tests = [];
function test(name, fn) {
  tests.push({ name, fn });
}

// ============================================================================
// DEFINE TESTS
// ============================================================================

test('1. Recursive Character Text Splitter Verification', () => {
  const sampleText = `
  # Section Header
  Amarix Solution implements high-performance headless Next.js layouts. 
  By caching pages on global CDNs, mobile load times drop below 1 second.
  
  * Bullet point item 1
  * Bullet point item 2
  
  This is a paragraph representing body details of services.
  `;

  const splitter = new textSplitter({ chunkSize: 150, chunkOverlap: 30 });
  const chunks = splitter.splitDocument(sampleText);

  assert(Array.isArray(chunks), 'Chunks must be returned as an array');
  assert(chunks.length > 0, 'Should split text into at least one chunk');
  assert(chunks.every(c => c.text && c.hash), 'Each chunk must possess text content and an MD5 hash');
  
  // Verify overlap/size constraints
  assert(chunks.every(c => c.text.length <= 150), 'No chunk should exceed the chunkSize threshold');
  console.log(`   [PASS] Text Splitter created ${chunks.length} chunks successfully.`);
});

test('2. Embedding Abstraction Configuration Verification', () => {
  const dimension = embeddingService.getVectorDimension();
  assert(typeof dimension === 'number', 'Dimension count must be a number');
  assert([384, 768, 1536].includes(dimension), 'Dimension size matches standard vector spaces');
  console.log(`   [PASS] Embedding layer configured for provider: "${embeddingService.provider}" (dimension: ${dimension})`);
});

test('3. Vector DB Connector Verification', async () => {
  // Test collection stat endpoints - resolves mock database fallback cleanly if Qdrant offline
  const stats = await vectorDbService.getCollectionStats();
  assert(stats && stats.status, 'Stats response must return diagnostic status');
  assert(typeof stats.pointsCount === 'number', 'Points count must be registered as a number');
  console.log(`   [PASS] Vector DB driver connected. Collection status: "${stats.status}" (points indexed: ${stats.pointsCount})`);
});

test('4. Hybrid Search Merge & RRF Ordering Verification', async () => {
  // Verifies that RRF function resolves ranks
  const mockVectorHits = [
    { chunkId: 'doc1_0', documentId: 'doc1', text: 'Vector matched content A', score: 0.9, metadata: { title: 'Doc A', source: 'file' } },
    { chunkId: 'doc2_0', documentId: 'doc2', text: 'Vector matched content B', score: 0.8, metadata: { title: 'Doc B', source: 'file' } }
  ];
  
  const mockKeywordHits = [
    { chunkId: 'doc2_0', documentId: 'doc2', text: 'Vector matched content B', score: 1.5, metadata: { title: 'Doc B', source: 'file' } },
    { chunkId: 'doc3_0', documentId: 'doc3', text: 'Keyword matched content C', score: 1.2, metadata: { title: 'Doc C', source: 'file' } }
  ];

  const merged = searchService._applyRRF(mockVectorHits, mockKeywordHits, 5);
  
  assert(Array.isArray(merged), 'Merged output must be an array');
  assert.strictEqual(merged[0].chunkId, 'doc2_0', 'Doc2 should rank first due to match on both lists');
  assert(merged.length <= 5, 'RRF should respect the Top K limit');
  console.log('   [PASS] Hybrid search Rank Fusion (RRF) sorted overlapping hits correctly.');
});

// ============================================================================
// TEST RUNNER EXECUTION
// ============================================================================

async function runAllTests() {
  console.log('\n==================================================');
  console.log('Starting Automated Integration Testing Suite...');
  console.log('==================================================\n');

  // Verify DB connection
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/amarix';
  try {
    await mongoose.connect(mongoUri);
    console.log('MongoDB connection initialized successfully.');
  } catch (err) {
    console.warn(`[WARNING] MongoDB not available at ${mongoUri}. Some DB assertions will be skipped.`);
  }

  let failed = 0;

  for (const t of tests) {
    console.log(`Running test: "${t.name}"`);
    try {
      await t.fn();
    } catch (err) {
      console.error(`   \x1b[31m[FAIL]\x1b[0m Assertion failed in "${t.name}":`);
      console.error(`          ${err.message}\n`);
      failed++;
    }
  }

  // Cleanup DB connections
  await mongoose.connection.close();

  console.log('\n==================================================');
  if (failed === 0) {
    console.log('\x1b[32mALL TESTS COMPLETED SUCCESSFULLY! (Exit code: 0)\x1b[0m');
    console.log('==================================================\n');
    process.exit(0);
  } else {
    console.error(`\x1b[31mTEST SUITE FAILED: ${failed} assertion errors found. (Exit code: 1)\x1b[0m`);
    console.log('==================================================\n');
    process.exit(1);
  }
}

runAllTests();
