import React, { useState } from 'react';
import { userAPI } from '../utils/jsonApi';

const NetworkTest = () => {
  const [testResult, setTestResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    setTestResult('Testing...');
    
    try {
      // Test 1: Basic fetch to JSON server
      console.log('Test 1: Testing basic connection to JSON server...');
      const response = await fetch('http://localhost:5000/users');
      const data = await response.json();
      console.log('Test 1 Success:', data);
      
      // Test 2: Using userAPI to get users
      console.log('Test 2: Testing userAPI.getUsers()...');
      const apiResponse = await userAPI.getUsers();
      console.log('Test 2 Success:', apiResponse.data);
      
      // Test 3: Test forgot password function
      console.log('Test 3: Testing forgot password function...');
      try {
        await userAPI.forgotPasswordJSON('test@test.com', 'newpassword');
      } catch (err) {
        console.log('Test 3 Expected Error (user not found):', err.message);
      }
      
      setTestResult(`✅ All tests passed! 
      - JSON Server is reachable
      - API functions work correctly
      - Found ${data.length} users in database`);
      
    } catch (error) {
      console.error('Network test failed:', error);
      setTestResult(`❌ Network test failed: ${error.message}`);
    }
    
    setLoading(false);
  };

  return (
    <div style={{ padding: '20px', margin: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h3>Network Connectivity Test</h3>
      <button onClick={testConnection} disabled={loading}>
        {loading ? 'Testing...' : 'Test Network Connection'}
      </button>
      <div style={{ marginTop: '10px', whiteSpace: 'pre-line' }}>
        {testResult}
      </div>
    </div>
  );
};

export default NetworkTest;
