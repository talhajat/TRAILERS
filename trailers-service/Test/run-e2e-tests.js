const newman = require('newman');
const path = require('path');

console.log('🚛 Starting Trailers Service E2E Tests...\n');

newman.run({
    collection: path.join(__dirname, 'Trailers-API-E2E-Tests.postman_collection.json'),
    reporters: ['cli', 'json'],
    reporter: {
        json: {
            export: path.join(__dirname, 'test-results.json')
        }
    },
    iterationCount: 1,
    delayRequest: 500, // 500ms delay between requests
    timeout: 30000, // 30 second timeout
    insecure: true, // Allow self-signed certificates
}, function (err, summary) {
    if (err) {
        console.error('❌ Test execution failed:', err);
        process.exit(1);
    }

    console.log('\n📊 Test Summary:');
    console.log(`Total Tests: ${summary.run.stats.tests.total}`);
    console.log(`Passed: ${summary.run.stats.tests.passed}`);
    console.log(`Failed: ${summary.run.stats.tests.failed}`);
    console.log(`Skipped: ${summary.run.stats.tests.skipped}`);

    if (summary.run.failures.length > 0) {
        console.log('\n❌ Failed Tests:');
        summary.run.failures.forEach((failure, index) => {
            console.log(`${index + 1}. ${failure.source.name}`);
            console.log(`   Error: ${failure.error.message}`);
        });
        process.exit(1);
    } else {
        console.log('\n✅ All tests passed!');
        process.exit(0);
    }
});