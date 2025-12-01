# Bland AI Configuration Guide

This document outlines all the configuration options available for the Bland AI calling functionality in the `config.js` file.

## Overview

The Bland AI configuration is stored in the `BLAND_AI_CONFIG` object in `config.js`. This configuration allows developers to customize various aspects of the AI calling behavior without modifying the main application code.

## Configuration Structure

```javascript
const BLAND_AI_CONFIG = {
    // Configuration options here
};
```

## API Configuration

| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| `apiKey` | string | Your Bland AI API key | Required |
| `apiUrl` | string | Bland AI API endpoint | `https://api.bland.ai/v1/calls` |

## Basic Call Parameters

| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| `pathwayId` | string | UUID of the conversation pathway to use | Required |
| `pathwayVersion` | number | Specific version of the pathway (optional) | `null` |
| `voice` | string | Voice model for the AI | `claude-3-sonnet` |
| `model` | string | AI model to use for the call | `claude-3-sonnet` |
| `language` | string | Language for the call | `en` |

## Call Behavior Settings

| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| `waitForGreeting` | boolean | Wait for human to speak first | `true` |
| `temperature` | number | AI creativity level (0.0 to 1.0) | `0.7` |
| `interruptionThreshold` | number | How easily AI can be interrupted | `0.5` |
| `maxDuration` | number | Maximum call duration in seconds | `300` (5 min) |

## Call Flow Settings

| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| `firstSentence` | string | Custom first sentence (overrides pathway) | `null` |
| `task` | string | Custom task description (overrides pathway) | `null` |
| `personaId` | string | Specific persona to use | `null` |

## Transfer and Routing

| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| `transferPhoneNumber` | string | Number to transfer to | `null` |
| `transferList` | object | Transfer configuration object | `{}` |

## Audio and Quality Settings

| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| `backgroundTrack` | string | Background music track | `null` |
| `noiseCancellation` | boolean | Enable noise cancellation | `true` |
| `blockInterruptions` | boolean | Block human interruptions | `false` |
| `record` | boolean | Record the call | `true` |

## Voicemail Settings

```javascript
voicemail: {
    action: 'leave_message', // 'hangup', 'leave_message', 'ignore'
    message: 'Custom voicemail message...'
}
```

| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| `action` | string | Action when voicemail is detected | `leave_message` |
| `message` | string | Message to leave on voicemail | Custom message |

## Retry Configuration

```javascript
retry: {
    enabled: true,
    wait: 300, // Wait 5 minutes before retry
    voicemailAction: 'leave_message',
    voicemailMessage: 'Retry voicemail message...'
}
```

| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| `enabled` | boolean | Enable retry functionality | `true` |
| `wait` | number | Wait time in seconds before retry | `300` |
| `voicemailAction` | string | Action for retry voicemail | `leave_message` |
| `voicemailMessage` | string | Message for retry voicemail | Custom message |

## Analysis and Post-Call Settings

| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| `analysisPreset` | string | Analysis preset UUID | `null` |
| `summaryPrompt` | string | Custom instructions for call summary | Custom prompt |
| `dispositions` | array | List of possible outcome tags | Recruitment-specific tags |

## Webhook Configuration

| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| `webhook` | string | Webhook URL for call events | `null` |
| `webhookEvents` | array | Events to send to webhook | `['call', 'tool', 'dynamic_data']` |

## Advanced Settings

| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| `pronunciationGuide` | array | Custom pronunciation guide | `[]` |
| `dialingStrategy` | object | Dialing strategy configuration | `{type: 'sequential', maxAttempts: 3}` |
| `timezone` | string | Timezone for scheduling | `UTC` |
| `startTime` | string | Specific start time (ISO string) | `null` |

## Tools and Integrations

| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| `tools` | array | Custom tools to use during call | `[]` |
| `dynamicData` | array | External data sources | `[]` |
| `citationSchemaIds` | array | Citation schemas for analysis | `[]` |

## Keywords and Transcription

| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| `keywords` | array | Words to boost in transcription | Recruitment keywords |
| `ignoreButtonPress` | boolean | Ignore DTMF input | `false` |

## Metadata and Tracking

```javascript
metadata: {
    source: 'web_application',
    campaign: 'recruitment_demo',
    version: '1.0.0'
}
```

Custom key-value pairs for tracking and analytics.

## Request Data

```javascript
requestData: {
    applicationType: 'web_form',
    priority: 'normal'
}
```

Data available as variables during the call.

## Example Configurations

### Basic Recruitment Call
```javascript
const BLAND_AI_CONFIG = {
    apiKey: 'your_api_key',
    pathwayId: 'your_pathway_id',
    voice: 'claude-3-sonnet',
    waitForGreeting: true,
    record: true,
    dispositions: ['qualified', 'not_qualified', 'voicemail']
};
```

### Advanced Call with Retry
```javascript
const BLAND_AI_CONFIG = {
    apiKey: 'your_api_key',
    pathwayId: 'your_pathway_id',
    voice: 'claude-3-sonnet',
    waitForGreeting: false,
    temperature: 0.8,
    maxDuration: 600,
    retry: {
        enabled: true,
        wait: 1800,
        voicemailAction: 'leave_message'
    },
    webhook: 'https://your-webhook.com/call-events',
    metadata: {
        campaign: 'q4_recruitment',
        source: 'website'
    }
};
```

### Multi-language Support
```javascript
const BLAND_AI_CONFIG = {
    apiKey: 'your_api_key',
    pathwayId: 'your_pathway_id',
    language: 'es',
    voice: 'claude-3-sonnet',
    keywords: ['reclutamiento', 'contratación', 'puesto', 'calificaciones'],
    dispositions: ['calificado', 'no_calificado', 'buzón_voz']
};
```

## Modifying Configuration

To modify any of these settings:

1. Open `config.js`
2. Locate the `BLAND_AI_CONFIG` object
3. Modify the desired parameter values
4. Save the file
6. The changes will take effect on the next call

## Important Notes

- **API Key**: Never commit your actual API key to version control
- **Pathway ID**: Must be a valid UUID from your Bland AI account
- **Voice Models**: Available models depend on your Bland AI plan
- **Webhooks**: Ensure your webhook endpoint can handle the expected payloads
- **Rate Limits**: Be aware of Bland AI's rate limiting policies

## Troubleshooting

### Common Issues

1. **Configuration not found**: Ensure `config.js` is loaded before `script.js`
2. **Invalid pathway ID**: Verify the pathway exists in your Bland AI account
3. **API key errors**: Check that your API key is valid and has sufficient credits
4. **Missing parameters**: Some parameters may be required depending on your use case

### Debug Mode

Enable console logging by checking the browser's developer console for detailed information about the configuration being used and any errors that occur.

## API Reference

For the complete list of available parameters and their detailed descriptions, refer to the [Bland AI API Documentation](https://docs.bland.ai/api-v1/post/calls).
