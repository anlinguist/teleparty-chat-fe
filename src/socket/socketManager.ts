import { TelepartyClient, SocketEventHandler, SocketMessageTypes, MessageList } from 'teleparty-websocket-lib';
import { SocketMessage } from 'teleparty-websocket-lib/lib/SocketMessage';

export interface Message {
  id: string;
  user: string;
  content: string;
  timestamp: string;
}

class SocketManager {
  private static instance: SocketManager;
  public socket: TelepartyClient | null = null;
  public isConnected: boolean = false;

  private onMessageCallback: ((message: SocketMessage) => void) | null = null;
  private onCloseCallback: (() => void) | null = null;
  private onConnectionReadyCallback: (() => void) | null = null;

  private constructor() {}

  public static getInstance(): SocketManager {
    if (!SocketManager.instance) {
      SocketManager.instance = new SocketManager();
    }
    return SocketManager.instance;
  }

  public initializeSocket() {
    if (!this.socket) {
      const eventHandler: SocketEventHandler = {
        onConnectionReady: () => {
          this.isConnected = true;
          if (this.onConnectionReadyCallback) {
            this.onConnectionReadyCallback();
          }
        },
        onClose: () => {
          this.isConnected = false;
          if (this.onCloseCallback) {
            this.onCloseCallback();
          }
        },
        onMessage: (message: SocketMessage) => {
          console.log("Received message:", message);
          if (this.onMessageCallback) {
            this.onMessageCallback(message);
          }
        },
      };
      this.socket = new TelepartyClient(eventHandler);
    }
  }

  public setOnMessageCallback(callback: (message: SocketMessage) => void) {
    this.onMessageCallback = callback;
  }

  public setOnCloseCallback(callback: () => void) {
    this.onCloseCallback = callback;
  }

  public setOnConnectionReadyCallback(callback: () => void) {
    this.onConnectionReadyCallback = callback;
  }

  public async joinChatRoom(nickname: string, chatId: string, userIcon?: string): Promise<MessageList | undefined> {
    if (this.socket) {
      return await this.socket.joinChatRoom(nickname, chatId, userIcon);
    }
  }

  public async createChatRoom(nickname: string, userIcon?: string): Promise<string> {
    if (this.socket) {
      return await this.socket.createChatRoom(nickname, userIcon);
    }
    return '';
  }

  public sendMessage(message: string) {
    if (this.socket) {
      this.socket.sendMessage(SocketMessageTypes.SEND_MESSAGE, { body: message }, (response) => {
        console.log("Message sent:", response);
      });
    }
  }

  public teardown() {
    if (this.socket) {
      this.socket.teardown();
      this.socket = null;
      this.isConnected = false;
    }
  }
}

export default SocketManager.getInstance();