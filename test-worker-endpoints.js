// Simple test script to verify worker endpoints
const testEndpoints = [
  {
    name: 'GET work translations',
    method: 'GET',
    url: 'https://meum-diarium.xn--schchner-2za.de/api/translations/works/de-bello-gallico'
  },
  {
    name: 'GET specific language translation',
    method: 'GET', 
    url: 'https://meum-diarium.xn--schchner-2za.de/api/translations/works/de-bello-gallico/de'
  }
];

console.log('Testing worker endpoints for work translations...\n');

testEndpoints.forEach(async (test) => {
  try {
    console.log(`Testing: ${test.name}`);
    console.log(`URL: ${test.url}`);
    
    const response = await fetch(test.url, {
      method: test.method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    console.log(`Status: ${response.status}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Response structure:', JSON.stringify(data, null, 2).substring(0, 500) + '...');
    } else {
      const error = await response.text();
      console.log('Error:', error);
    }
    
    console.log('\n' + '='.repeat(50) + '\n');
  } catch (error) {
    console.log(`Failed to test ${test.name}:`, error.message);
    console.log('\n' + '='.repeat(50) + '\n');
  }
});
