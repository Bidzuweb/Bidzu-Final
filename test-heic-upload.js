// Test script for HEIC file upload support
// This helps debug HEIC file upload issues

console.log('Testing HEIC file upload support...\n');

// Test 1: Check if heic2any package is available
async function testHeic2anyPackage() {
  console.log('Test 1: Checking heic2any package...');
  try {
    const heic2any = await import('heic2any');
    console.log('✅ heic2any package loaded successfully');
    console.log('Package version:', heic2any.default ? 'Available' : 'Not available');
    return true;
  } catch (error) {
    console.log('❌ heic2any package failed to load:', error.message);
    return false;
  }
}

// Test 2: Check if File and Blob constructors are available
function testFileConstructors() {
  console.log('\nTest 2: Checking File and Blob constructors...');
  try {
    if (typeof File !== 'undefined') {
      console.log('✅ File constructor available');
    } else {
      console.log('❌ File constructor not available');
    }

    if (typeof Blob !== 'undefined') {
      console.log('✅ Blob constructor available');
    } else {
      console.log('❌ Blob constructor not available');
    }

    return typeof File !== 'undefined' && typeof Blob !== 'undefined';
  } catch (error) {
    console.log('❌ Error checking constructors:', error.message);
    return false;
  }
}

// Test 3: Check if URL.createObjectURL is available
function testCreateObjectURL() {
  console.log('\nTest 3: Checking URL.createObjectURL...');
  try {
    if (typeof URL !== 'undefined' && URL.createObjectURL) {
      console.log('✅ URL.createObjectURL available');
      return true;
    } else {
      console.log('❌ URL.createObjectURL not available');
      return false;
    }
  } catch (error) {
    console.log('❌ Error checking URL.createObjectURL:', error.message);
    return false;
  }
}

// Test 4: Check if Canvas API is available (for placeholder generation)
function testCanvasAPI() {
  console.log('\nTest 4: Checking Canvas API...');
  try {
    if (typeof document !== 'undefined' && document.createElement) {
      const canvas = document.createElement('canvas');
      if (canvas && canvas.getContext) {
        console.log('✅ Canvas API available');
        return true;
      } else {
        console.log('❌ Canvas API not fully available');
        return false;
      }
    } else {
      console.log('❌ Canvas API not available (no document)');
      return false;
    }
  } catch (error) {
    console.log('❌ Error checking Canvas API:', error.message);
    return false;
  }
}

// Test 5: Check environment
function testEnvironment() {
  console.log('\nTest 5: Checking environment...');
  try {
    if (typeof window !== 'undefined') {
      console.log('✅ Running in browser environment');
      console.log('User Agent:', navigator.userAgent);
    } else if (typeof global !== 'undefined') {
      console.log('✅ Running in Node.js environment');
      console.log('Node version:', process.version);
    } else {
      console.log('❓ Unknown environment');
    }

    return true;
  } catch (error) {
    console.log('❌ Error checking environment:', error.message);
    return false;
  }
}

// Run all tests
async function runAllTests() {
  console.log('Starting HEIC support tests...\n');

  const results = {
    heic2any: await testHeic2anyPackage(),
    constructors: testFileConstructors(),
    createObjectURL: testCreateObjectURL(),
    canvas: testCanvasAPI(),
    environment: testEnvironment()
  };

  console.log('\n=== Test Results Summary ===');
  console.log('heic2any package:', results.heic2any ? '✅ PASS' : '❌ FAIL');
  console.log('File/Blob constructors:', results.constructors ? '✅ PASS' : '❌ FAIL');
  console.log('URL.createObjectURL:', results.createObjectURL ? '✅ PASS' : '❌ FAIL');
  console.log('Canvas API:', results.canvas ? '✅ PASS' : '❌ FAIL');
  console.log('Environment detection:', results.environment ? '✅ PASS' : '❌ FAIL');

  const allPassed = Object.values(results).every(result => result === true);
  console.log('\nOverall Result:', allPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED');

  if (!allPassed) {
    console.log('\n=== Troubleshooting Tips ===');
    if (!results.heic2any) {
      console.log('- Install heic2any: npm install heic2any@^0.0.4');
    }
    if (!results.constructors) {
      console.log('- Check if running in a modern browser or Node.js environment');
    }
    if (!results.createObjectURL) {
      console.log('- Check if running in a browser environment');
    }
    if (!results.canvas) {
      console.log('- Canvas API might not be available in this environment');
    }
  }

  return allPassed;
}

// Run tests if this script is executed directly
if (typeof window !== 'undefined' || typeof global !== 'undefined') {
  runAllTests().catch(error => {
    console.error('Test execution failed:', error);
  });
}

console.log('\nHEIC support test script loaded successfully!');
console.log('Run runAllTests() to execute the tests.');
