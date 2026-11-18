NEBULA AI — INSTALLABLE WEB APP (PWA)
=====================================

WHAT IS INCLUDED
- index.html: responsive Nebula AI interface
- manifest.json + icon.svg: installable app metadata and icon
- sw.js: service worker for app-shell caching
- worker.js: secure multi-provider API proxy for Cloudflare Workers

IMPORTANT
The frontend does NOT store provider API keys. Configure keys as Cloudflare Worker
secrets. The chat UI supports text conversations with OpenAI, Claude and Gemini.
Image understanding, document parsing, streaming responses and generated images
are not implemented in this starter build yet.

DEPLOY THE AI BACKEND (Cloudflare Workers)
1. Sign in to https://dash.cloudflare.com/
2. Open Workers & Pages -> Create -> Worker.
3. Create a Worker and replace its code with worker.js.
4. In Worker Settings -> Variables and Secrets, add these as encrypted secrets:
   OPENAI_API_KEY
   ANTHROPIC_API_KEY
   GEMINI_API_KEY
   Add only the providers you actually have API access for.
5. Deploy. Copy the Worker URL, e.g. https://nebula-api.<account>.workers.dev

DEPLOY THE WEB APP
Option A — GitHub Pages:
1. Create a GitHub repository named nebula-ai.
2. Upload index.html, manifest.json, sw.js and icon.svg to the repository root.
3. Open repository Settings -> Pages.
4. Choose Deploy from a branch, select main and /(root), then Save.
5. Open the published HTTPS URL on your Android phone.

Option B — Netlify:
1. Open https://app.netlify.com/drop
2. Upload the folder containing index.html, manifest.json, sw.js and icon.svg.
3. Use the generated HTTPS URL.

CONNECT THE APP
1. Open the deployed Nebula AI website.
2. Tap the gear icon.
3. Paste the Cloudflare Worker URL into “API endpoint”.
4. Save settings.
5. Choose OpenAI, Claude or Gemini above the chat composer.

INSTALL ON SAMSUNG / ANDROID
1. Open the HTTPS website in Chrome.
2. Tap the three-dot menu.
3. Choose “Install app” or “Add to Home screen”.
4. Confirm. Nebula AI will appear as an app icon.

SECURITY AND COST
- Never paste API keys into the website's API endpoint field.
- Keep API keys only as encrypted Worker secrets.
- API calls may incur charges with the AI provider. Check provider pricing and usage limits.
- The Worker currently allows cross-origin requests from any website. For a public launch,
  restrict Access-Control-Allow-Origin to your exact deployed website domain and add
  rate limiting / authentication before sharing it widely.
- Do not publish your Worker secrets or share account credentials.

TROUBLESHOOTING
- “secret is not configured”: add the matching encrypted secret and redeploy.
- Network error: check the Worker URL and ensure it ends with no /chat suffix.
- Install option missing: use HTTPS and a supported browser such as Chrome.
