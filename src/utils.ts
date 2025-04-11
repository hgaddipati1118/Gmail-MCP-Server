/**
 * Utility functions for Gmail MCP Server
 */
import { EmailMessageArgs } from './types.js';

/**
 * Helper function to encode email headers containing non-ASCII characters
 * according to RFC 2047 MIME specification
 */
function encodeEmailHeader(text: string): string {
    // Only encode if the text contains non-ASCII characters
    if (/[^\x00-\x7F]/.test(text)) {
        // Use MIME Words encoding (RFC 2047)
        return '=?UTF-8?B?' + Buffer.from(text).toString('base64') + '?=';
    }
    return text;
}

/**
 * Validates an email address format
 */
export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Creates a properly formatted email message string
 */
export function createEmailMessage(args: EmailMessageArgs): string {
    const encodedSubject = encodeEmailHeader(args.subject);

    // Validate all email addresses
    args.to.forEach(email => {
        if (!validateEmail(email)) {
            throw new Error(`Recipient email address is invalid: ${email}`);
        }
    });

    if (args.cc) {
        args.cc.forEach(email => {
            if (!validateEmail(email)) {
                throw new Error(`CC email address is invalid: ${email}`);
            }
        });
    }

    if (args.bcc) {
        args.bcc.forEach(email => {
            if (!validateEmail(email)) {
                throw new Error(`BCC email address is invalid: ${email}`);
            }
        });
    }

    const emailParts = [
        'From: me',
        `To: ${args.to.join(', ')}`,
        args.cc ? `Cc: ${args.cc.join(', ')}` : '',
        args.bcc ? `Bcc: ${args.bcc.join(', ')}` : '',
        `Subject: ${encodedSubject}`,
        // Add thread-related headers if specified
        args.inReplyTo ? `In-Reply-To: ${args.inReplyTo}` : '',
        args.inReplyTo ? `References: ${args.inReplyTo}` : '',
        'MIME-Version: 1.0',
        'Content-Type: text/plain; charset=UTF-8',
        'Content-Transfer-Encoding: 7bit',
    ].filter(Boolean);

    emailParts.push('')
    emailParts.push(args.body);

    return emailParts.join('\r\n');
} 