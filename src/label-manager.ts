/**
 * Label Manager for Gmail MCP Server
 * Provides comprehensive label management functionality
 */
import { GmailAPI } from './types.js';

// Type definitions for Gmail API labels
export interface GmailLabel {
    id: string;
    name: string;
    type?: string;
    messageListVisibility?: string;
    labelListVisibility?: string;
    messagesTotal?: number;
    messagesUnread?: number;
    color?: {
        textColor?: string;
        backgroundColor?: string;
    };
}

export interface LabelOptions {
    messageListVisibility?: 'show' | 'hide';
    labelListVisibility?: 'labelShow' | 'labelShowIfUnread' | 'labelHide';
}

/**
 * Creates a new Gmail label
 * @param gmail - Gmail API instance
 * @param labelName - Name of the label to create
 * @param options - Optional settings for the label
 * @returns The newly created label
 */
export async function createLabel(gmail: GmailAPI, labelName: string, options: LabelOptions = {}) {
    try {
        // Default visibility settings if not provided
        const messageListVisibility = options.messageListVisibility || 'show';
        const labelListVisibility = options.labelListVisibility || 'labelShow';

        const response = await gmail.users.labels.create({
            userId: 'me',
            requestBody: {
                name: labelName,
                messageListVisibility,
                labelListVisibility,
            },
        });

        return response.data;
    } catch (error: any) {
        // Handle duplicate labels more gracefully
        if (error.message && error.message.includes('already exists')) {
            throw new Error(`Label "${labelName}" already exists. Please use a different name.`);
        }
        
        throw new Error(`Failed to create label: ${error.message}`);
    }
}

/**
 * Updates an existing Gmail label
 * @param gmail - Gmail API instance
 * @param labelId - ID of the label to update
 * @param updates - Properties to update
 * @returns The updated label
 */
export async function updateLabel(gmail: GmailAPI, labelId: string, updates: LabelOptions & { name?: string }) {
    try {
        // Verify the label exists before updating
        await gmail.users.labels.get({
            userId: 'me',
            id: labelId,
        });

        const response = await gmail.users.labels.update({
            userId: 'me',
            id: labelId,
            requestBody: updates,
        });

        return response.data;
    } catch (error: any) {
        if (error.code === 404) {
            throw new Error(`Label with ID "${labelId}" not found.`);
        }
        
        throw new Error(`Failed to update label: ${error.message}`);
    }
}

/**
 * Deletes a Gmail label
 * @param gmail - Gmail API instance
 * @param labelId - ID of the label to delete
 * @returns Success message
 */
export async function deleteLabel(gmail: GmailAPI, labelId: string) {
    try {
        // Ensure we're not trying to delete system labels
        const label = await gmail.users.labels.get({
            userId: 'me',
            id: labelId,
        });
        
        if (label.data.type === 'system') {
            throw new Error(`Cannot delete system label with ID "${labelId}".`);
        }
        
        await gmail.users.labels.delete({
            userId: 'me',
            id: labelId,
        });

        return { success: true, message: `Label "${label.data.name}" deleted successfully.` };
    } catch (error: any) {
        if (error.code === 404) {
            throw new Error(`Label with ID "${labelId}" not found.`);
        }
        
        throw new Error(`Failed to delete label: ${error.message}`);
    }
}

/**
 * Gets a detailed list of all Gmail labels
 * @param gmail - Gmail API instance
 * @returns Object containing system and user labels
 */
export async function listLabels(gmail: GmailAPI): Promise<{ system: GmailLabel[], user: GmailLabel[], count: { total: number, system: number, user: number } }> {
    const response = await gmail.users.labels.list({ userId: 'me' });
    const labels = response.data.labels || [];
    
    const systemLabels = labels
        .filter(label => label.type === 'system')
        .map(label => ({
            ...label,
            id: label.id || '',
            name: label.name || '',
            type: label.type || 'system'
        })) as GmailLabel[];
    
    const userLabels = labels
        .filter(label => label.type === 'user')
        .map(label => ({
            ...label,
            id: label.id || '',
            name: label.name || '',
            type: label.type || 'user'
        })) as GmailLabel[];

    return {
        system: systemLabels,
        user: userLabels,
        count: {
            total: labels.length,
            system: systemLabels.length,
            user: userLabels.length
        }
    };
}

/**
 * Finds a label by name
 * @param gmail - Gmail API instance
 * @param name - Name of the label to find
 * @returns The found label or null if not found
 */
export async function findLabelByName(gmail: GmailAPI, name: string): Promise<GmailLabel | null> {
    const { system, user } = await listLabels(gmail);
    const allLabels = [...system, ...user];
    return allLabels.find(label => label.name.toLowerCase() === name.toLowerCase()) || null;
}

/**
 * Creates label if it doesn't exist or returns existing label
 * @param gmail - Gmail API instance
 * @param labelName - Name of the label to create
 * @param options - Optional settings for the label
 * @returns The new or existing label
 */
export async function getOrCreateLabel(gmail: GmailAPI, labelName: string, options: LabelOptions = {}) {
    try {
        // First try to find an existing label
        const existingLabel = await findLabelByName(gmail, labelName);
        
        if (existingLabel) {
            return existingLabel;
        }
        
        // If not found, create a new one
        return await createLabel(gmail, labelName, options);
    } catch (error: any) {
        throw new Error(`Failed to get or create label: ${error.message}`);
    }
}
