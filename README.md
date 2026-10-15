# Inovayt

## Enquiry form email setup

The contact form sends enquiries through the server-side `/api/contact` endpoint using [Resend](https://resend.com). The Resend API key stays on the server and is never included in the browser bundle.

1. Create a Resend account and an API key.
2. Verify a domain in Resend, then choose a sender address on that domain.
3. In local development, copy `.env.example` to `.env` and set `RESEND_API_KEY` and `CONTACT_FROM`.
4. In Netlify, add `RESEND_API_KEY` and `CONTACT_FROM` under **Site configuration → Environment variables**, then redeploy. `netlify.toml` configures the Vite build, SPA fallback, and `/api/contact` route to the Netlify Function.
5. In Vercel, add those same variables under **Project Settings → Environment Variables**, then redeploy.
6. `CONTACT_TO` defaults to `zafargayas3101@gmail.com`. Change that environment variable whenever the enquiry recipient changes.

The sender domain must be verified with Resend before email can be delivered. Until the API key and verified sender are configured, the form reports an error rather than displaying a false success message.

## Deploying to Netlify

Import the project’s Git repository in Netlify. The build command is `npm run build` and the publish directory is `dist` (both are set in `netlify.toml`). Add the Resend environment variables before deploying so the enquiry form can send email.
