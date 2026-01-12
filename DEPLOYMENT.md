# Deployment Guide for WebScrapeX

This guide will help you deploy your WebScrapeX application to production using **Vercel** (recommended for Next.js) and configure **Supabase** correctly.

## 1. Prerequisites

-   A [GitHub](https://github.com) account.
-   A [Vercel](https://vercel.com) account.
-   Your [Supabase](https://supabase.com) project URL and Anon Key.

## 2. Push Code to GitHub

1.  Initialize a git repository if you haven't already:
    ```bash
    git init
    git add .
    git commit -m "Ready for deploy"
    ```
2.  Create a new repository on GitHub.
3.  Push your code:
    ```bash
    git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
    git push -u origin main
    ```

## 3. Deploy to Vercel

1.  Go to your [Vercel Dashboard](https://vercel.com/dashboard).
2.  Click **"Add New..."** -> **"Project"**.
3.  Import your GitHub repository.
4.  **Configure Environment Variables**:
    You must add the following variables (copy them from your `.env.local` file):
    *   `NEXT_PUBLIC_SUPABASE_URL`
    *   `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5.  Click **"Deploy"**.

## 4. Configure Supabase for Production

**Crucial Step:** Your authentication will fail if you skip this!

1.  Go to your [Supabase Dashboard](https://supabase.com/dashboard).
2.  Select your project.
3.  Navigate to **Authentication** -> **URL Configuration**.
4.  **Site URL**: Set this to your Vercel domain (e.g., `https://webscrapex-production.vercel.app`).
5.  **Redirect URLs**: Add the following:
    *   `https://webscrapex-production.vercel.app/**`
    *   `https://webscrapex-production.vercel.app/auth/callback`
    *   `https://webscrapex-production.vercel.app/`

## 5. Changing the App Name ("Change name to..." instructions)

If you want to change the application name from "WebScrapeX" to something else (e.g., "MyLocalScraper" or your custom brand), follow these steps:

### Update Metadata (Tab Title & SEO)
Edit `app/layout.tsx`:

```typescript
export const metadata: Metadata = {
  // Change the base URL to your production domain
  metadataBase: new URL('https://your-new-domain.com'), 
  title: {
    default: "Your New App Name", // <--- Change this
    template: "%s | Your New App Name" // <--- Change this
  },
  // ... update description and other fields as needed
}
```

### Update the Logo/Text in UI
1.  **Sidebar**: Edit `components/layout/Sidebar.tsx` and find the text "WebScrapeX" inside the `Logo Section`.
2.  **Mobile Navbar**: Edit `components/layout/Navbar.tsx` and find "WEBSCRAPEX".

## 6. Puppeteer on Vercel (Important Note)

The full Puppeteer library is too large for Vercel Serverless Functions. This project relies on `website-scraper` and `website-scraper-puppeteer`.
**If you encounter deployment size limits:**
You may need to exclude the local chromium download or configure the build to use `chrome-aws-lambda` or `sparticuz-chromium` if the default setup exceeds the 50MB limit.
*However, for basic deployments, the current setup might work if the cache is handled correctly.*

If the scrape fails in production, consider deploying the **API route** causing the scrape on a platform with fewer limits (like Railway, Render, or a VPS), or using a third-party scraping API service.
