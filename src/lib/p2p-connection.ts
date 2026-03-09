/**
 * WebRTC P2P connection management
 * Handles peer-to-peer connections for real-time board synchronization
 * Provides WebRTC-based data channels for collaborative editing
 */

/**
 * Peer connection interface - Represents a WebRTC peer connection
 * Contains connection details, data channel, and connection state
 */
export interface PeerConnection {
  // Unique identifier for the peer
  peerId: string;
  // User ID associated with the peer
  userId: string;
  // WebRTC connection object
  connection: RTCPeerConnection;
  // Data channel for message exchange
  dataChannel: RTCDataChannel;
  // Whether this peer is the board owner
  isOwner: boolean;
  // Connection status
  isConnected: boolean;
}

/**
 * Sync message interface - Represents a synchronization message
 * Used for real-time board updates between peers
 */
export interface SyncMessage {
  // Type of sync operation
  type: 'create' | 'update' | 'delete' | 'sync-request';
  // Type of entity being synced
  entityType: 'board' | 'list' | 'card';
  // Payload data for the sync operation
  data: Record<string, unknown>;
  // Timestamp of the message
  timestamp: string;
  // ID of the user sending the message
  userId: string;
}

/**
 * P2P Manager class - Manages WebRTC peer connections
 * Handles connection lifecycle, message routing, and synchronization
 */
class P2PManager {
  // Map of peer connections by peer ID
  private connections: Map<string, PeerConnection> = new Map();
  // Local peer identifier
  private localPeerId: string;
  // Callbacks for sync message handling
  private onSyncCallbacks: ((message: SyncMessage) => void)[] = [];

  constructor() {
    this.localPeerId = this.generatePeerId();
  }

  /**
   * Generate a unique peer ID
   * @returns Random peer ID string
   */
  generatePeerId(): string {
    return `peer-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get the local peer ID
   * @returns Local peer ID
   */
  getLocalPeerId(): string {
    return this.localPeerId;
  }

  /**
   * Create a new WebRTC peer connection
   * Sets up connection with ICE servers and data channel
   * @param peerId - ID of the peer to connect to
   * @param userId - User ID associated with the peer
   * @param isInitiator - Whether this peer initiates the connection
   * @returns Promise resolving to the created peer connection
   */
  async createConnection(peerId: string, userId: string, isInitiator: boolean = false): Promise<PeerConnection> {
    const configuration = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ]
    };

    const connection = new RTCPeerConnection(configuration);
    const dataChannel = isInitiator
      ? connection.createDataChannel('board-sync')
      : await this.waitForDataChannel(connection);

    const peerConnection: PeerConnection = {
      peerId,
      userId,
      connection,
      dataChannel,
      isOwner: false,
      isConnected: false,
    };

    this.setupConnectionHandlers(peerConnection);
    this.connections.set(peerId, peerConnection);

    if (isInitiator) {
      await this.createOffer(peerConnection);
    }

    return peerConnection;
  }

  /**
   * Wait for data channel to be created by remote peer
   * @param connection - WebRTC connection to wait for data channel on
   * @returns Promise resolving to the data channel
   */
  private async waitForDataChannel(connection: RTCPeerConnection): Promise<RTCDataChannel> {
    return new Promise((resolve) => {
      connection.ondatachannel = (event) => {
        resolve(event.channel);
      };
    });
  }

  /**
   * Set up event handlers for WebRTC connection and data channel
   * Handles ICE candidates, connection state changes, and message exchange
   * @param peerConnection - Peer connection to set up handlers for
   */
  private setupConnectionHandlers(peerConnection: PeerConnection): void {
    const { connection, dataChannel } = peerConnection;

    // Connection state handlers
    connection.onicecandidate = (event) => {
      if (event.candidate) {
        // Send ICE candidate to other peer via signaling
        this.sendSignalingMessage(peerConnection.peerId, {
          type: 'ice-candidate',
          candidate: event.candidate
        });
      }
    };

    connection.onconnectionstatechange = () => {
      peerConnection.isConnected = connection.connectionState === 'connected';
      if (peerConnection.isConnected) {
        console.log(`Connected to peer: ${peerConnection.userId}`);
        this.requestSync(peerConnection);
      }
    };

    // Data channel handlers
    dataChannel.onopen = () => {
      console.log(`Data channel opened with peer: ${peerConnection.userId}`);
    };

    dataChannel.onmessage = (event) => {
      try {
        const message: SyncMessage = JSON.parse(event.data);
        this.handleSyncMessage(message);
      } catch (error) {
        console.error('Failed to parse sync message:', error);
      }
    };

    dataChannel.onclose = () => {
      console.log(`Data channel closed with peer: ${peerConnection.userId}`);
      peerConnection.isConnected = false;
    };
  }

  /**
   * Create WebRTC offer for connection initiation
   * @param peerConnection - Peer connection to create offer for
   */
  private async createOffer(peerConnection: PeerConnection): Promise<void> {
    const offer = await peerConnection.connection.createOffer();
    await peerConnection.connection.setLocalDescription(offer);

    // Send offer to other peer via signaling
    this.sendSignalingMessage(peerConnection.peerId, {
      type: 'offer',
      offer
    });
  }

  /**
   * Handle incoming WebRTC offer
   * Creates and sends answer back to the offering peer
   * @param peerConnection - Peer connection handling the offer
   * @param offer - Incoming RTC session description
   */
  private async handleOffer(peerConnection: PeerConnection, offer: RTCSessionDescriptionInit): Promise<void> {
    await peerConnection.connection.setRemoteDescription(offer);
    const answer = await peerConnection.connection.createAnswer();
    await peerConnection.connection.setLocalDescription(answer);

    // Send answer back
    this.sendSignalingMessage(peerConnection.peerId, {
      type: 'answer',
      answer
    });
  }

  /**
   * Handle incoming WebRTC answer
   * Sets remote description for the connection
   * @param peerConnection - Peer connection handling the answer
   * @param answer - Incoming RTC session description
   */
  private async handleAnswer(peerConnection: PeerConnection, answer: RTCSessionDescriptionInit): Promise<void> {
    await peerConnection.connection.setRemoteDescription(answer);
  }

  /**
   * Handle incoming ICE candidate
   * Adds the candidate to the peer connection
   * @param peerConnection - Peer connection handling the candidate
   * @param candidate - Incoming ICE candidate
   */
  private async handleIceCandidate(peerConnection: PeerConnection, candidate: RTCIceCandidateInit): Promise<void> {
    await peerConnection.connection.addIceCandidate(candidate);
  }

  /**
   * Send signaling message to peer
   * In production, this would use Netlify functions or WebSocket
   * @param peerId - ID of the peer to send message to
   * @param message - Signaling message to send
   */
  private sendSignalingMessage(peerId: string, message: Record<string, unknown>): void {
    // In real implementation, send via Netlify function or WebSocket
    console.log(`Signaling to ${peerId}:`, message);
  }

  /**
   * Handle incoming sync message
   * Notifies all registered callbacks with the message
   * @param message - Sync message to handle
   */
  private handleSyncMessage(message: SyncMessage): void {
    // Notify all registered callbacks
    this.onSyncCallbacks.forEach(callback => callback(message));
  }

  /**
   * Request sync data from newly connected peer
   * Sends sync-request message to get current board state
   * @param peerConnection - Peer connection to request sync from
   */
  private requestSync(peerConnection: PeerConnection): void {
    const syncMessage: SyncMessage = {
      type: 'sync-request',
      entityType: 'board',
      data: {},
      timestamp: new Date().toISOString(),
      userId: this.localPeerId,
    };

    this.sendMessage(peerConnection, syncMessage);
  }

  /**
   * Send message to specific peer
   * @param peerConnection - Peer connection to send message to
   * @param message - Sync message to send
   */
  sendMessage(peerConnection: PeerConnection, message: SyncMessage): void {
    if (peerConnection.dataChannel.readyState === 'open') {
      peerConnection.dataChannel.send(JSON.stringify(message));
    }
  }

  /**
   * Broadcast message to all connected peers
   * @param message - Sync message to broadcast
   */
  broadcastMessage(message: SyncMessage): void {
    this.connections.forEach(peerConnection => {
      if (peerConnection.isConnected) {
        this.sendMessage(peerConnection, message);
      }
    });
  }

  /**
   * Register callback for sync message handling
   * @param callback - Function to call when sync message is received
   */
  onSync(callback: (message: SyncMessage) => void): void {
    this.onSyncCallbacks.push(callback);
  }

  /**
   * Disconnect from specific peer
   * @param peerId - ID of the peer to disconnect from
   */
  disconnect(peerId: string): void {
    const peerConnection = this.connections.get(peerId);
    if (peerConnection) {
      peerConnection.connection.close();
      this.connections.delete(peerId);
    }
  }

  /**
   * Disconnect from all peers
   */
  disconnectAll(): void {
    this.connections.forEach((_, peerId) => {
      this.disconnect(peerId);
    });
  }

  /**
   * Get list of connected peers
   * @returns Array of connected peer connections
   */
  getConnectedPeers(): PeerConnection[] {
    return Array.from(this.connections.values()).filter(conn => conn.isConnected);
  }
}

/**
 * Global P2P manager instance
 * Provides singleton access to P2P functionality
 */
export const p2pManager = new P2PManager();
