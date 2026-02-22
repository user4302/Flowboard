// WebRTC P2P connection management
import { Board, Card, List } from './types';

export interface PeerConnection {
  peerId: string;
  userId: string;
  connection: RTCPeerConnection;
  dataChannel: RTCDataChannel;
  isOwner: boolean;
  isConnected: boolean;
}

export interface SyncMessage {
  type: 'create' | 'update' | 'delete' | 'sync-request';
  entityType: 'board' | 'list' | 'card';
  data: any;
  timestamp: string;
  userId: string;
}

class P2PManager {
  private connections: Map<string, PeerConnection> = new Map();
  private localPeerId: string;
  private onSyncCallbacks: ((message: SyncMessage) => void)[] = [];

  constructor() {
    this.localPeerId = this.generatePeerId();
  }

  generatePeerId(): string {
    return `peer-${Math.random().toString(36).substr(2, 9)}`;
  }

  getLocalPeerId(): string {
    return this.localPeerId;
  }

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

  private async waitForDataChannel(connection: RTCPeerConnection): Promise<RTCDataChannel> {
    return new Promise((resolve) => {
      connection.ondatachannel = (event) => {
        resolve(event.channel);
      };
    });
  }

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

  private async createOffer(peerConnection: PeerConnection): Promise<void> {
    const offer = await peerConnection.connection.createOffer();
    await peerConnection.connection.setLocalDescription(offer);
    
    // Send offer to other peer via signaling
    this.sendSignalingMessage(peerConnection.peerId, {
      type: 'offer',
      offer
    });
  }

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

  private async handleAnswer(peerConnection: PeerConnection, answer: RTCSessionDescriptionInit): Promise<void> {
    await peerConnection.connection.setRemoteDescription(answer);
  }

  private async handleIceCandidate(peerConnection: PeerConnection, candidate: RTCIceCandidateInit): Promise<void> {
    await peerConnection.connection.addIceCandidate(candidate);
  }

  private sendSignalingMessage(peerId: string, message: any): void {
    // In real implementation, send via Netlify function or WebSocket
    console.log(`Signaling to ${peerId}:`, message);
  }

  private handleSyncMessage(message: SyncMessage): void {
    // Notify all registered callbacks
    this.onSyncCallbacks.forEach(callback => callback(message));
  }

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

  sendMessage(peerConnection: PeerConnection, message: SyncMessage): void {
    if (peerConnection.dataChannel.readyState === 'open') {
      peerConnection.dataChannel.send(JSON.stringify(message));
    }
  }

  broadcastMessage(message: SyncMessage): void {
    this.connections.forEach(peerConnection => {
      if (peerConnection.isConnected) {
        this.sendMessage(peerConnection, message);
      }
    });
  }

  onSync(callback: (message: SyncMessage) => void): void {
    this.onSyncCallbacks.push(callback);
  }

  disconnect(peerId: string): void {
    const peerConnection = this.connections.get(peerId);
    if (peerConnection) {
      peerConnection.connection.close();
      this.connections.delete(peerId);
    }
  }

  disconnectAll(): void {
    this.connections.forEach((_, peerId) => {
      this.disconnect(peerId);
    });
  }

  getConnectedPeers(): PeerConnection[] {
    return Array.from(this.connections.values()).filter(conn => conn.isConnected);
  }
}

export const p2pManager = new P2PManager();
