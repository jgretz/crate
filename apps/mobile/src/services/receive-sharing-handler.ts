import ReceiveSharingIntent from 'react-native-receive-sharing-intent';
import {fetchPageMetadata, isValidUrl, normalizeUrl} from './metadata';
import {createLink} from './api';
import type {CreateLinkInput} from '@crate/domain';

export interface SharedContent {
  text?: string;
  weblink?: string;
  mimeType: string;
  extraData?: any;
  contentUri?: string;
  fileName?: string;
  filePath?: string;
  fileSize?: number;
  subject?: string;
}

export interface ProcessedSharedData {
  url: string;
  title?: string;
  description?: string;
}

/**
 * Handles incoming shared content using react-native-receive-sharing-intent
 */
export class ReceiveSharingHandler {
  private static instance: ReceiveSharingHandler;
  private listeners: Array<(data: ProcessedSharedData) => void> = [];

  static getInstance(): ReceiveSharingHandler {
    if (!ReceiveSharingHandler.instance) {
      ReceiveSharingHandler.instance = new ReceiveSharingHandler();
    }
    return ReceiveSharingHandler.instance;
  }

  /**
   * Initialize the sharing handler
   */
  async initialize(): Promise<void> {
    try {
      // Listen for shared content when app is already running or launched
      ReceiveSharingIntent.getReceivedFiles(
        (files: SharedContent[]) => {
          if (files && files.length > 0) {
            this.processSharedData(files);
          }
        },
        (error: any) => {
          console.error('Error receiving shared files:', error);
        },
        'ShareMedia' // Share media protocol
      );
    } catch (error) {
      console.error('Error initializing sharing handler:', error);
    }
  }

  /**
   * Process shared data and extract URL information
   */
  private async processSharedData(sharedData: SharedContent[]): Promise<void> {
    try {
      for (const item of sharedData) {
        let url: string | null = null;
        let title: string | undefined;

        // Extract URL from different content types
        if (item.weblink) {
          url = item.weblink;
        } else if (item.text) {
          // Check if the text contains a URL
          const urlMatch = item.text.match(/(https?:\/\/[^\s]+)/);
          if (urlMatch) {
            url = urlMatch[1];
          } else if (isValidUrl(item.text)) {
            url = item.text;
          }
        }

        if (url) {
          const normalizedUrl = normalizeUrl(url);
          
          // Use subject as title if available
          if (item.subject) {
            title = item.subject;
          }

          // Fetch metadata for the URL
          try {
            const metadata = await fetchPageMetadata(normalizedUrl);
            const processedData: ProcessedSharedData = {
              url: normalizedUrl,
              title: title || metadata.title,
              description: metadata.description,
            };

            // Notify listeners
            this.notifyListeners(processedData);
          } catch (metadataError) {
            console.error('Error fetching metadata:', metadataError);
            
            // Still notify with basic data
            const processedData: ProcessedSharedData = {
              url: normalizedUrl,
              title: title,
            };
            this.notifyListeners(processedData);
          }
        }
      }

      // Clear the received files to prevent processing them again
      ReceiveSharingIntent.clearReceivedFiles();
    } catch (error) {
      console.error('Error processing shared data:', error);
    }
  }

  /**
   * Add a listener for shared content
   */
  addListener(callback: (data: ProcessedSharedData) => void): () => void {
    this.listeners.push(callback);
    
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  /**
   * Notify all listeners of new shared data
   */
  private notifyListeners(data: ProcessedSharedData): void {
    this.listeners.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error('Error in sharing listener:', error);
      }
    });
  }

  /**
   * Create a link from shared data
   */
  async createLinkFromSharedData(data: ProcessedSharedData): Promise<void> {
    try {
      const linkData: CreateLinkInput = {
        url: data.url,
        title: data.title || 'Shared Link',
        description: data.description,
      };

      await createLink(linkData);
      console.log('Link created successfully from shared data');
    } catch (error) {
      console.error('Error creating link from shared data:', error);
      throw error;
    }
  }

  /**
   * Cleanup resources
   */
  cleanup(): void {
    this.listeners = [];
  }
}

export const receiveSharingHandler = ReceiveSharingHandler.getInstance();
