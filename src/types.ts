/**
 * Type definitions for Gmail MCP Server
 */

// Gmail API types
export interface GmailMessagePart {
    partId?: string;
    mimeType?: string;
    filename?: string;
    headers?: Array<{
        name: string;
        value: string;
    }>;
    body?: {
        attachmentId?: string;
        size?: number;
        data?: string;
    };
    parts?: GmailMessagePart[];
}

export interface EmailAttachment {
    id: string;
    filename: string;
    mimeType: string;
    size: number;
}

export interface EmailContent {
    text: string;
    html: string;
}

export interface GmailAPI {
    context: {
        _options: {
            auth: any;
        };
    };
    users: {
        labels: {
            create: (params: any) => Promise<any>;
            update: (params: any) => Promise<any>;
            delete: (params: any) => Promise<any>;
            get: (params: any) => Promise<any>;
            list: (params: any) => Promise<any>;
        };
        messages: {
            send: (params: any) => Promise<any>;
            get: (params: any) => Promise<any>;
            modify: (params: any) => Promise<any>;
            delete: (params: any) => Promise<any>;
            list: (params: any) => Promise<any>;
        };
    };
}

export interface EmailMessageArgs {
    access_token: string;
    to: string[];
    subject: string;
    body: string;
    cc?: string[];
    bcc?: string[];
    threadId?: string;
    inReplyTo?: string;
} 