---
title: Webhooks
description: Receive real-time notifications for chatbot events
sidebarTitle: Webhooks
icon: webhook
---

Webhooks allow you to receive HTTP POST requests when specific events occur in your chatbot, enabling real-time integrations and automation.

<Note>
  Webhooks are available as an addon (\$59/mo or \$468/yr) or included in the Scale plan by default. Visit your [billing page](/navigating-your-account/billing) to enable this feature.
</Note>

## Available webhooks

<Tabs>
  <Tab title="New Message" icon="message">
    Triggered when your chatbot sends or receives a message in a thread.

    **Use cases:**

    * Log conversations to your database
    * Analyze chatbot performance
    * Trigger custom workflows
    * Monitor chatbot activity

  </Tab>

  <Tab title="Escalation" icon="user-headset">
    Triggered when a user requests human support.

    **Use cases:**

    * Create support tickets
    * Alert support team
    * Route to appropriate agent
    * Track escalation metrics

  </Tab>

  <Tab title="New Lead" icon="address-book">
    Triggered when a lead is captured through your chatbot.

    **Use cases:**

    * Add leads to CRM
    * Send welcome emails
    * Notify sales team
    * Update marketing automation

  </Tab>
</Tabs>

## Setting up webhooks

<Steps>
  <Step title="Navigate to webhook settings">
    Go to your chatbot dashboard and click **Settings** > **Webhooks**.
  </Step>

  <Step title="Enter your webhook URL">
    Add the HTTPS endpoint URL where you want to receive webhook notifications.
  </Step>

  <Step title="Set a webhook secret">
    Create a secure secret (minimum 16 characters) used to sign and verify payloads.
  </Step>

  <Step title="Select events">
    Choose which events to subscribe to: `NEW_MESSAGE`, `CONVERSATION_ESCALATED`, and/or `NEW_LEAD`. Defaults to all three.
  </Step>

  <Step title="Save configuration">
    Click **Save** to activate your webhook. The full secret is shown only once on creation — save it securely.
  </Step>

  <Step title="Test webhooks">
    Use the **Send Test** button to fire a sample payload and verify your endpoint receives data correctly.
  </Step>
</Steps>

## Webhook configuration

Each chatbot supports one webhook configuration. You can subscribe to one or more of the available event types.

<AccordionGroup>
  <Accordion title="Webhook URL" icon="link">
    <ParamField path="url" type="string" required>
      The HTTPS endpoint where all event notifications will be sent.

      Example: `https://your-server.com/webhooks/contextgpt`
    </ParamField>
  </Accordion>

  <Accordion title="Webhook Secret" icon="key">
    <ParamField path="secret" type="string" required>
      A secret (minimum 16 characters) sent in the `X-WEBHOOK-TOKEN` header and used to sign each payload via HMAC-SHA256. Shown in full only at creation time.

      Example: `my-very-secret-token-abc123`
    </ParamField>
  </Accordion>

  <Accordion title="Events" icon="list">
    <ParamField path="events" type="array">
      An array of event types to subscribe to. Defaults to all events if omitted.

      Valid values: `NEW_MESSAGE`, `CONVERSATION_ESCALATED`, `NEW_LEAD`
    </ParamField>
  </Accordion>
</AccordionGroup>

## Webhook payloads

### New Message payload

Fired for every message sent or received in a thread. For user messages, `answer` is `null`. For AI/agent messages, `question` is `null`.

```json theme={null}
{
  "event": "NEW_MESSAGE",
  "data": {
    "chatbotId": "chatbot_123",
    "threadId": "thread_456",
    "messageId": "msg_789",
    "role": "assistant",
    "question": null,
    "answer": "To reset your password, click on 'Forgot Password' on the login page.",
    "sources": [
      "https://example.com/docs/reset-password"
    ],
    "createdAt": "2025-01-15T10:30:00Z"
  }
}
```

<Note>
  `question` is populated and `answer` is `null` for user messages. `answer` is populated and `question` is `null` for AI/agent messages.
</Note>

### Escalation payload

Fired when a visitor requests to speak with a human.

```json theme={null}
{
  "event": "CONVERSATION_ESCALATED",
  "data": {
    "chatbotId": "chatbot_123",
    "threadId": "thread_456",
    "dashboardUrl": "https://app.contextgpt.in/chatbot_123/chat-history/thread_456",
    "user": {
      "id": "visitor_321",
      "email": "user@example.com",
      "name": "John Doe",
      "phone": "+1234567890",
      "verified": true,
      "createdAt": "2024-01-15T10:25:00Z"
    },
    "leadInfo": {
      "name": "John Doe",
      "email": "user@example.com",
      "phone": "+1234567890"
    }
  }
}
```

<Note>
  `user` and `leadInfo` can be `null` if the visitor had not provided their contact information before escalating.
</Note>

### New Lead payload

Fired when a visitor's contact information is captured as a lead.

```json theme={null}
{
  "event": "NEW_LEAD",
  "data": {
    "chatbotId": "chatbot_123",
    "chatbotName": "Support Bot",
    "leadDetails": {
      "id": "visitor_789",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "capturedAt": "2024-01-15T10:30:00Z"
    }
  }
}
```

## Webhook headers

Every request from ContextGPT includes these headers:

```
Content-Type: application/json
X-WEBHOOK-TOKEN: your_configured_secret
X-SIGNATURE: sha256=<hmac_hex>
User-Agent: ContextGPT-Webhooks/1.0
```

`X-SIGNATURE` is an HMAC-SHA256 signature of the raw JSON body, computed using your webhook secret.

## Implementing webhook endpoints

### Basic endpoint structure

Your webhook endpoint should:

1. Accept POST requests
2. Verify the webhook token and/or signature
3. Return a `200` status code immediately
4. Process the payload asynchronously

### Example implementation (Node.js)

```javascript theme={null}
const express = require("express");
const crypto = require("crypto");
const app = express();

app.use(express.json());

function verifySignature(rawBody, signature, secret) {
  const expected = "sha256=" + crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}

app.post("/webhooks/contextgpt", (req, res) => {
  // Verify token
  const token = req.headers["x-webhook-token"];
  if (token !== process.env.CONTEXTGPT_WEBHOOK_SECRET) {
    return res.status(401).send("Unauthorized");
  }

  // Respond immediately
  res.status(200).send("OK");

  // Process asynchronously
  const { event, data } = req.body;

  switch (event) {
    case "NEW_MESSAGE":
      console.log(`Message in thread ${data.threadId}: Q=${data.question} A=${data.answer}`);
      break;
    case "CONVERSATION_ESCALATED":
      console.log(`Escalation from ${data.user?.name ?? "Anonymous"}: ${data.dashboardUrl}`);
      break;
    case "NEW_LEAD":
      console.log(`New lead: ${data.leadDetails.name} (${data.leadDetails.email})`);
      break;
  }
});

app.listen(3000, () => console.log("Webhook server running on port 3000"));
```

### Example implementation (Python)

```python theme={null}
from flask import Flask, request
import os

app = Flask(__name__)

@app.route('/webhooks/contextgpt', methods=['POST'])
def webhook():
    # Verify token
    token = request.headers.get('X-WEBHOOK-TOKEN')
    if token != os.environ.get('CONTEXTGPT_WEBHOOK_SECRET'):
        return 'Unauthorized', 401

    payload = request.json
    event = payload.get('event')
    data = payload.get('data', {})

    if event == 'NEW_MESSAGE':
        print(f"Message in thread {data['threadId']}: {data.get('answer') or data.get('question')}")
    elif event == 'CONVERSATION_ESCALATED':
        user = data.get('user')
        print(f"Escalation from {user['name'] if user else 'Anonymous'}: {data['dashboardUrl']}")
    elif event == 'NEW_LEAD':
        lead = data['leadDetails']
        print(f"New lead: {lead['name']} ({lead['email']})")

    return 'OK', 200

if __name__ == '__main__':
    app.run(port=3000)
```

## Security best practices

### Verify the webhook token

Always check that the `X-WEBHOOK-TOKEN` header matches your configured secret:

```javascript theme={null}
if (req.headers["x-webhook-token"] !== process.env.CONTEXTGPT_WEBHOOK_SECRET) {
  return res.status(401).send("Unauthorized");
}
```

### Verify the signature (recommended)

For stronger security, verify the `X-SIGNATURE` header using HMAC-SHA256:

```javascript theme={null}
const crypto = require("crypto");

function verifySignature(rawBody, signature, secret) {
  const expected = "sha256=" + crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}

// In your route handler (use express.raw() or read rawBody before JSON parsing):
const isValid = verifySignature(
  req.rawBody,
  req.headers["x-signature"],
  process.env.CONTEXTGPT_WEBHOOK_SECRET
);
if (!isValid) return res.status(401).send("Invalid signature");
```

### Use HTTPS

Webhook endpoints must use HTTPS. HTTP endpoints are rejected.

### Respond quickly

Return a `200` status code within **10 seconds**. Process time-consuming tasks asynchronously to avoid timeouts.

```javascript theme={null}
app.post("/webhooks/contextgpt", async (req, res) => {
  res.status(200).send("OK"); // Respond immediately
  processWebhookAsync(req.body).catch(console.error); // Process in background
});
```

## Testing webhooks

### Send a test event

From the webhook settings page, click **Send Test** and choose an event type (`NEW_MESSAGE`, `CONVERSATION_ESCALATED`, or `NEW_LEAD`). A sample payload is dispatched and logged in the delivery history.

### Test with curl

```bash theme={null}
curl -X POST https://your-server.com/webhooks/contextgpt \
  -H "Content-Type: application/json" \
  -H "X-WEBHOOK-TOKEN: your-secret" \
  -d '{
    "event": "NEW_MESSAGE",
    "data": {
      "chatbotId": "test_123",
      "threadId": "test_thread",
      "messageId": "test_msg",
      "role": "assistant",
      "question": null,
      "answer": "Test answer",
      "sources": [],
      "createdAt": "2025-01-15T10:30:00Z"
    }
  }'
```

### Use webhook testing tools

- **Webhook.site** — Inspect payloads without a server
- **ngrok** — Expose a local development server publicly
- **Postman** — Send and inspect test requests

## Delivery logs

Every webhook dispatch is recorded. From the **Webhooks** page you can:

- View the full delivery history with status, response code, and response time
- Filter by event type or status (`PENDING`, `RETRYING`, `SUCCESS`, `FAILED`)
- Manually retry any failed delivery

## Webhook retries

ContextGPT automatically retries failed deliveries:

| Attempt | Delay |
|---------|-------|
| 1st retry | 1 second |
| 2nd retry | 5 seconds |
| 3rd retry | 25 seconds |

After 3 failed attempts the delivery is marked `FAILED`. You can manually retry it from the delivery log.

- **Failure conditions**: Non-2xx response or no response within 10 seconds
- **Idempotency**: Each source event is dispatched at most once per webhook configuration

## Troubleshooting

<AccordionGroup>
  <Accordion title="Webhooks not being received" icon="circle-xmark">
    <Warning>If you're not receiving webhooks, check these items:</Warning>

    **Verify endpoint URL**\
    Ensure the URL is correct and publicly accessible.

    **Check HTTPS**\
    Webhooks only work with HTTPS endpoints.

    **Test connectivity**\
    Use curl or Postman to verify your endpoint responds to POST requests.

    **Review firewall rules**\
    Ensure your server allows incoming connections from ContextGPT.

  </Accordion>

  <Accordion title="Authentication failures" icon="shield-xmark">
    <Warning>If webhooks are being rejected with 401:</Warning>

    **Verify secret**\
    Ensure the secret in your code matches the one configured in ContextGPT exactly (case-sensitive, no extra whitespace).

    **Check header name**\
    The token is sent as `X-WEBHOOK-TOKEN`.

    **Review logs**\
    Check your server logs for the received token value.

  </Accordion>

  <Accordion title="Timeout errors" icon="clock">
    <Warning>If webhooks are timing out:</Warning>

    **Respond quickly**\
    Return a 200 status within 10 seconds.

    **Process asynchronously**\
    Move time-consuming tasks to background jobs.

    **Optimize code**\
    Profile your webhook handler for performance bottlenecks.

  </Accordion>

  <Accordion title="Receiving duplicate webhooks" icon="copy">
    Use the `data.messageId` / `data.leadDetails.id` / `data.threadId` fields as idempotency keys. Store processed IDs and skip duplicates on your end.
  </Accordion>
</AccordionGroup>

## Next steps

<CardGroup cols={2}>
  <Card title="API reference" icon="code" href="/api-reference/v2/getting-started">
    Explore the ContextGPT API
  </Card>

  <Card title="Zapier integration" icon="bolt" href="/integrations/zapier">
    Use Zapier for no-code automation
  </Card>

  <Card title="SDK documentation" icon="book" href="/developers/sdk">
    Integrate with the JavaScript SDK
  </Card>

  <Card title="Human support" icon="user" href="/features/human-support">
    Set up escalation webhooks
  </Card>
</CardGroup>
