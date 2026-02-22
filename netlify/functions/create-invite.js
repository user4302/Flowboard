const { v4: uuidv4 } = require('uuid');

const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { boardId, boardName, ownerId, expiresIn = 168 } = JSON.parse(event.body);
    
    if (!boardId || !boardName || !ownerId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields' }),
      };
    }

    const inviteId = uuidv4();
    const expiresAt = new Date(Date.now() + expiresIn * 60 * 60 * 1000).toISOString();
    
    // In a real implementation, you'd store this in a database
    // For now, we'll return the invite data directly
    const inviteUrl = `${event.headers.origin}/invite/${inviteId}`;
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({
        inviteId,
        inviteUrl,
        boardId,
        boardName,
        ownerId,
        expiresAt,
        maxUses: 10,
        currentUses: 0,
        isActive: true,
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
