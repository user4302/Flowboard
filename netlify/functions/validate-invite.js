const handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const inviteId = event.path.split('/').pop();
    
    if (!inviteId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing invite ID' }),
      };
    }

    // In a real implementation, you'd validate against a database
    // For now, we'll simulate validation
    const mockInviteData = {
      valid: true,
      boardName: 'Website Redesign',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    };

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify(mockInviteData),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};

module.exports = { handler };
