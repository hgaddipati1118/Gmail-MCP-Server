/**
 * Type definitions for Gmail MCP Server
 */

import { gmail_v1 } from 'googleapis';

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

export type GmailAPI = gmail_v1.Gmail;

// Update GmailLabel to match Schema$Label from googleapis
export type GmailLabel = gmail_v1.Schema$Label;

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