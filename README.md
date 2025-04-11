# Gmail MCP Server

A Model Context Protocol (MCP) server for Gmail integration that enables AI assistants to manage Gmail through natural language interactions. This server provides a comprehensive set of tools for email management, label organization, and batch operations. Based off of [GongRzhe/Gmail-MCP-Server](https://github.com/GongRzhe/Gmail-MCP-Server). This is an MCP thatt allows agents to authenticate on a per call basis.

## Features

- **Email Management**
  - Send and draft emails with support for CC/BCC
  - Read emails with full MIME structure handling
  - Search emails using Gmail's powerful search syntax
  - Delete emails (single or batch)
  - Full support for international characters

- **Label Management**
  - Create, update, and delete custom labels
  - List all available labels (system and user-defined)
  - Move emails between labels/folders
  - Batch label operations

- **Authentication**
  - Per-call authentication with access tokens
  - No need for separate authentication setup
  - Support for both Desktop and Web application credentials
  - Docker support for containerized environments

## Quick Start

### 1. Prerequisites

- Node.js 16 or higher
- A Google Cloud Project with Gmail API enabled
- OAuth 2.0 credentials from Google Cloud Console

### 2. Local Setup

This is a local codebase that needs to be set up manually:

```bash
# Clone the repository
git clone https://github.com/yourusername/Gmail-MCP-Server.git
cd Gmail-MCP-Server

# Install dependencies
npm install

# Build the project
npm run build
```

### 3. Cursor Integration

This project includes Cursor support through the `mcp-config.json` file:

```json
{
  "name": "gmail",
  "version": "1.0.0",
  "description": "Gmail MCP Server for Cursor",
  "main": "dist/index.js",
  "scripts": {
    "start": "node dist/index.js"
  }
}
```

To use with Cursor:

1. Make sure the `mcp-config.json` file is in the root directory
2. Configure Cursor to use this MCP server
3. The server will be available to AI assistants within Cursor

## Authentication

The server now uses per-call authentication with access tokens. This means:

1. No separate authentication setup is required
2. Each API call must include an `access_token` parameter
3. The access token is used only for that specific call
4. Tokens can be obtained from your Google Cloud Console or through OAuth2 flows

Example of including an access token in a request:

```json
{
  "access_token": "ya29.a0AfH6SMC...",
  "to": ["recipient@example.com"],
  "subject": "Meeting Tomorrow",
  "body": "Hi,\n\nJust a reminder about our meeting tomorrow at 10 AM.\n\nBest regards"
}
```

## Available Tools

### Email Operations

1. **Send Email** (`send_email`)
   ```json
   {
     "access_token": "ya29.a0AfH6SMC...",
     "to": ["recipient@example.com"],
     "subject": "Meeting Tomorrow",
     "body": "Hi,\n\nJust a reminder about our meeting tomorrow at 10 AM.\n\nBest regards",
     "cc": ["cc@example.com"],
     "bcc": ["bcc@example.com"]
   }
   ```

2. **Draft Email** (`draft_email`)
   ```json
   {
     "access_token": "ya29.a0AfH6SMC...",
     "to": ["recipient@example.com"],
     "subject": "Draft Report",
     "body": "Here's the draft report for your review.",
     "cc": ["manager@example.com"]
   }
   ```

3. **Read Email** (`read_email`)
   ```json
   {
     "access_token": "ya29.a0AfH6SMC...",
     "messageId": "182ab45cd67ef"
   }
   ```

4. **Search Emails** (`search_emails`)
   ```json
   {
     "access_token": "ya29.a0AfH6SMC...",
     "query": "from:sender@example.com after:2024/01/01 has:attachment",
     "maxResults": 10
   }
   ```

### Label Management

1. **Create Label** (`create_label`)
   ```json
   {
     "access_token": "ya29.a0AfH6SMC...",
     "name": "Important Projects",
     "messageListVisibility": "show",
     "labelListVisibility": "labelShow"
   }
   ```

2. **Update Label** (`update_label`)
   ```json
   {
     "access_token": "ya29.a0AfH6SMC...",
     "id": "Label_123",
     "name": "Updated Label Name",
     "messageListVisibility": "hide"
   }
   ```

3. **Delete Label** (`delete_label`)
   ```json
   {
     "access_token": "ya29.a0AfH6SMC...",
     "id": "Label_123"
   }
   ```

4. **List Labels** (`list_email_labels`)
   ```json
   {
     "access_token": "ya29.a0AfH6SMC..."
   }
   ```

### Batch Operations

1. **Batch Modify Emails** (`batch_modify_emails`)
   ```json
   {
     "access_token": "ya29.a0AfH6SMC...",
     "messageIds": ["id1", "id2", "id3"],
     "addLabelIds": ["IMPORTANT"],
     "removeLabelIds": ["INBOX"],
     "batchSize": 50
   }
   ```

2. **Batch Delete Emails** (`batch_delete_emails`)
   ```json
   {
     "access_token": "ya29.a0AfH6SMC...",
     "messageIds": ["id1", "id2", "id3"],
     "batchSize": 50
   }
   ```

## Docker Support

### Using Docker

```bash
docker run -i --rm \
  -p 3000:3000 \
  mcp/gmail
```

## Error Handling

The server provides detailed error messages for common issues:

- Authentication failures
- Invalid email addresses
- Label operation errors
- API rate limiting
- Network connectivity issues

## Security Considerations

- Access tokens are used only for the specific API call
- No tokens are stored on the server
- All API calls use HTTPS
- Each request requires a valid access token

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
