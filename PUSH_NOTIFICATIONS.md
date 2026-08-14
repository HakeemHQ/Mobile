# Hakeem — Push Notifications: Backend Integration Guide

This document describes everything needed for push notification integration between the Hakeem mobile app and the backend.

---

## Overview

```
┌──────────────┐                      ┌──────────────┐                     ┌──────────────┐
│  Hakeem App  │  1. Register Token   │   Hakeem     │  3. Send Push via   │  Expo Push   │
│  (Mobile)    │ ───────────────────► │   Backend    │ ──────────────────► │  API Server  │
│              │                      │              │                     │              │
│              │ ◄─────────────────── │              │ ◄────────────────── │              │
│              │  4. Notification     │              │  Receipt/Status     │              │
└──────────────┘     delivered        └──────────────┘                     └──────────────┘
```

---

## Expo Push Token

The token the mobile app sends looks like this:

```
ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]
```

**Example:** `ExponentPushToken[F6rG8bU0sK1mJ7nP2qW4]`

| Property   | Details                                      |
|------------|----------------------------------------------|
| **Format** | `ExponentPushToken[<alphanumeric>]`           |
| **Length**  | ~40 characters                               |
| **Unique** | Per device + per Expo project                |

---

## Mobile App → Backend Endpoints (Already Implemented)

### Register Device: `PUT /patient/push-devices`

```json
{
  "expoPushToken": "ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]",
  "platform": "android",
  "language": "en"
}
```

### Unregister Device: `DELETE /patient/push-devices`

```json
{
  "expoPushToken": "ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]"
}
```

---

## Backend → Expo Push API (Sending Notifications)

When the backend needs to notify a user, send an HTTP request to Expo:

### Endpoint

```
POST https://exp.host/--/api/v2/push/send
```

### Headers

```
Content-Type: application/json
Accept: application/json
```

### Single Notification

```bash
curl -X POST https://exp.host/--/api/v2/push/send \
  -H "Content-Type: application/json" \
  -d '{
    "to": "ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]",
    "title": "Document Processed ✅",
    "body": "Your blood test results have been analyzed.",
    "data": { "type": "DOCUMENT_PROCESSED", "documentId": "abc-123" },
    "sound": "default",
    "priority": "high",
    "channelId": "default-notifications"
  }'
```

### Batch (up to 100 per request)

```bash
curl -X POST https://exp.host/--/api/v2/push/send \
  -H "Content-Type: application/json" \
  -d '[
    { "to": "ExponentPushToken[aaa...]", "title": "Title", "body": "Body" },
    { "to": "ExponentPushToken[bbb...]", "title": "Title", "body": "Body" }
  ]'
```

### C# Example

```csharp
public class ExpoPushService
{
    private static readonly HttpClient _client = new();
    private const string EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send";

    public async Task SendAsync(string expoPushToken, string title, string body, object? data = null)
    {
        var payload = new {
            to = expoPushToken,
            title,
            body,
            sound = "default",
            priority = "high",
            channelId = "default-notifications",
            data = data ?? new { }
        };

        var json = JsonSerializer.Serialize(payload);
        var content = new StringContent(json, Encoding.UTF8, "application/json");
        await _client.PostAsync(EXPO_PUSH_URL, content);
    }
}
```

---

## Payload Fields

| Field       | Type     | Required | Description                                |
|-------------|----------|----------|--------------------------------------------|
| `to`        | `string` | ✅       | Expo Push Token                            |
| `title`     | `string` | ❌       | Notification title (bold)                  |
| `body`      | `string` | ❌       | Notification body text                     |
| `data`      | `object` | ❌       | Custom JSON data (accessible in app)       |
| `sound`     | `string` | ❌       | `"default"` or custom sound               |
| `priority`  | `string` | ❌       | `"default"`, `"normal"`, or `"high"`       |
| `channelId` | `string` | ❌       | Android channel (see below)                |
| `badge`     | `number` | ❌       | iOS badge count                            |
| `ttl`       | `number` | ❌       | Time to live in seconds                    |

### Android Channels

| Channel ID              | Use For                              |
|-------------------------|--------------------------------------|
| `default-notifications` | Standard notifications (recommended) |
| `critical-alarms`       | Critical medical alerts (bypasses DND) |

---

## Error Handling

### Response Format

```json
{
  "data": [
    { "status": "ok", "id": "receipt-id-xxx" }
  ]
}
```

### Error: `DeviceNotRegistered`

```json
{
  "data": [
    {
      "status": "error",
      "message": "Token is not a registered push notification recipient",
      "details": { "error": "DeviceNotRegistered" }
    }
  ]
}
```

**Action:** Delete this token from the database immediately.

### Check Receipts (~15 min later)

```bash
curl -X POST https://exp.host/--/api/v2/push/getReceipts \
  -H "Content-Type: application/json" \
  -d '{ "ids": ["receipt-id-xxx"] }'
```

---

## Testing

### Expo Push Tool (Web)

1. Go to **https://expo.dev/notifications**
2. Enter the Expo Push Token
3. Fill in title/body
4. Click Send

### From Console Logs

The token is printed on app startup:
```
[PushNotifications] Expo Push Token: ExponentPushToken[xxxxxx]
```

---

## Quick Reference

| Item                | Value                                    |
|---------------------|------------------------------------------|
| **Push API URL**    | `https://exp.host/--/api/v2/push/send`   |
| **Receipt URL**     | `https://exp.host/--/api/v2/push/getReceipts` |
| **Token format**    | `ExponentPushToken[...]`                 |
| **Max payload**     | 4096 bytes                               |
| **Max batch**       | 100 per request                          |
| **Default channel** | `default-notifications`                  |
| **Test tool**       | https://expo.dev/notifications           |
