const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');

const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { inviteId, email, username, password } = JSON.parse(event.body);
    
    if (!inviteId || !email || !username || !password) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields' }),
      };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid email format' }),
      };
    }

    // Hash password for storage
    const passwordHash = crypto.createHash('sha256').update(password).digest('hex');
    
    // Generate user ID
    const userId = uuidv4();
    
    // In a real implementation, you'd store this in a database
    // and notify the board owner for approval
    const joinRequest = {
      id: uuidv4(),
      userId,
      inviteId,
      email,
      username,
      passwordHash,
      createdAt: new Date().toISOString(),
      status: 'pending', // pending, approved, rejected
    };

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({
        success: true,
        message: 'Join request submitted. Waiting for owner approval.',
        userId,
        requiresApproval: true,
        requestId: joinRequest.id,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};

module.exports = { handler };
