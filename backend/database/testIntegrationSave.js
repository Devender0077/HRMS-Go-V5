const axios = require('axios');

async function testIntegrationSave() {
  console.log('\n🧪 Testing Integration Save API...\n');

  try {
    // First login to get token
    console.log('STEP 1: Login to get JWT token...');
    const loginResponse = await axios.post('http://localhost:8000/api/auth/login', {
      email: 'superadmin@test.com',
      password: 'Test@123'
    });

    if (!loginResponse.data.success) {
      console.error('❌ Login failed');
      return;
    }

    const token = loginResponse.data.token;
    console.log('✅ Login successful, got token');

    // Test integration save
    console.log('\nSTEP 2: Testing integration save...');
    
    const integrationData = {
      // Pusher
      pusher_enabled: true,
      pusher_app_id: 'test-app-from-script-123',
      pusher_key: 'test-key-from-script-456',
      pusher_secret: 'test-secret-from-script-789',
      pusher_cluster: 'us2',
      
      // Slack
      slack_enabled: true,
      slack_webhook_url: 'https://hooks.slack.com/test',
      slack_workspace_name: 'Test Workspace',
      slack_default_channel: '#general',
    };

    console.log('📤 Sending data:', JSON.stringify(integrationData, null, 2));

    const saveResponse = await axios.put(
      'http://localhost:8000/api/general-settings/category/integrations',
      integrationData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('\n✅ Save Response:');
    console.log('   Status:', saveResponse.status);
    console.log('   Data:', JSON.stringify(saveResponse.data, null, 2));

    // Verify the save by fetching
    console.log('\nSTEP 3: Verifying saved data...');
    
    const getResponse = await axios.get(
      'http://localhost:8000/api/general-settings/category/integrations',
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    console.log('\n✅ Retrieved Data:');
    console.log('   Pusher App ID:', getResponse.data.settings?.pusher_app_id || 'NOT FOUND');
    console.log('   Pusher Key:', getResponse.data.settings?.pusher_key || 'NOT FOUND');
    console.log('   Pusher Secret:', getResponse.data.settings?.pusher_secret || 'NOT FOUND');
    console.log('   Pusher Cluster:', getResponse.data.settings?.pusher_cluster || 'NOT FOUND');
    console.log('   Pusher Enabled:', getResponse.data.settings?.pusher_enabled || 'NOT FOUND');

    console.log('\n🎉 TEST COMPLETE!\n');

  } catch (error) {
    console.error('\n❌ TEST FAILED:');
    console.error('   Error:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    }
    console.log('\n');
  }
}

// Wait for server to be ready
setTimeout(() => {
  testIntegrationSave()
    .then(() => process.exit(0))
    .catch(err => {
      console.error(err);
      process.exit(1);
    });
}, 3000);

console.log('⏳ Waiting 3 seconds for server to start...');

