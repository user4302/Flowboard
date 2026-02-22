const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { boardId, userId, peerId } = JSON.parse(event.body);
    
    if (!boardId || !userId || !peerId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields' }),
      };
    }

    // In a real implementation, you'd store peer information in a database
    // For now, we'll return mock peer data
    const mockPeers = [
      {
        userId: 'owner-123',
        peerId: 'peer-owner-123',
        lastSeen: new Date().toISOString(),
        isOnline: true,
      },
    ];

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({
        peers: mockPeers.filter(peer => peer.userId !== userId),
        timestamp: new Date().toISOString(),
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
