const axios = require('axios');

async function rpcCall(procedure, variable) {
  try {
    const response = await axios.post('http://192.168.0.109:3000/rpc', {
      procedure,
      variable,
    });

    if (response.data.result !== undefined) {
      console.log(`Result: ${response.data.result}`);
    } else {
      console.log(`Error: ${response.data.message}`);
    }
  } catch (error) {
    if (error.response && error.response.data) {
      console.error(`Error: ${error.response.data.message}`);
    } else {
      console.error(`Failed to call RPC: ${error.message}`);
    }
  }
}

async function testRPC() {
  console.log("\nTesting Valid Procedures:");
  await rpcCall('factorial', [5]); // Should print 120
  await rpcCall('sum', [10, 15]); // Should print 25

  console.log('\nTesting Invalid Cases:');
  await rpcCall('unknownMethod', [5]); // Invalid method
  await rpcCall('sum', [10]); // Missing parameter
  await rpcCall('factorial', ['a']); // Invalid parameter type
}

testRPC();
