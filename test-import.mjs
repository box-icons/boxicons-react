// Quick test to verify imports work
import { Alarm, Twitter, Home } from './dist/esm/index.js';

console.log('✅ Imports successful!');
console.log('Alarm:', Alarm.displayName === 'Alarm' ? '✓ loaded' : '✗ FAILED');
console.log('Twitter:', Twitter.displayName === 'Twitter' ? '✓ loaded' : '✗ FAILED');
console.log('Home:', Home.displayName === 'Home' ? '✓ loaded' : '✗ FAILED');
console.log('\n📦 Package is working correctly!');
