# Vercel Deployment Guide (Updated)

## New Approach: Serverless API Functions

We've updated the deployment strategy to use Vercel's serverless functions directly rather than trying to adapt the Express app. Each API endpoint is now a separate serverless function in the `/api` directory.

## Deployment Setup

1. Make sure you're using the latest Vercel configuration from this repo.

2. Set your environment variables in the Vercel dashboard:
   - `DATABASE_URL`: Your Neon PostgreSQL connection string (required)
   - `NODE_ENV`: Set to `production`

3. **CRITICAL**: For Neon database, you MUST:
   - Enable "Pooled connections" in the Neon dashboard
   - Enable SSL connections
   - Use the correct connection string format: `postgresql://user:password@hostname/database?sslmode=require&pgbouncer=true`

## How This Works

1. The frontend static files are built and served from `dist/public`
2. API endpoints are handled by individual serverless functions in the `api` directory
3. Each function creates its own database connection when needed
4. The build process copies the necessary shared files to the deployment

## Testing Your Deployment

After deployment, test these endpoints in this order:

1. API health check: `https://your-vercel-app.vercel.app/api/health`
2. Debug endpoint: `https://your-vercel-app.vercel.app/api/debug` - provides environment information
3. API test: `https://your-vercel-app.vercel.app/api/badges`
4. Home page: `https://your-vercel-app.vercel.app/`
5. Admin login: `https://your-vercel-app.vercel.app/admin-login`

## Troubleshooting

If you still encounter issues:

1. Check Vercel Function Logs in the Vercel dashboard
2. Use the debug endpoint (`/api/debug`) to see environment details
3. Verify your database connection string is correct
4. Try creating a new deployment with a clean build
5. Make sure your Neon database is active and accessible

## Troubleshooting 500 Server Errors (FUNCTION_INVOCATION_FAILED)

If you're seeing 500 errors or FUNCTION_INVOCATION_FAILED errors:

1. **Check Database Connection**:
   - Test your database connection string locally first
   - Verify the DATABASE_URL environment variable is correctly set in Vercel
   - Check that your database provider (Neon) is up and running
   - Try accessing the health check endpoint: `/api/health`
   - Use the debug endpoint (`/api/debug`) to verify environment variables

2. **Check Vercel Build Logs**: Look for any errors in the build process.

3. **Review Function Logs**: In the Vercel dashboard, go to Functions and check the logs for the failing function.

4. **Manual Deploy Attempt**: Try these steps:
   ```bash
   # Install Vercel CLI
   npm install -g vercel

   # Login to Vercel (if you haven't already)
   vercel login

   # Deploy with debugging
   vercel --debug
   ```

5. **Override Vercel's Auto-Detection**: If Vercel is detecting the wrong framework, add this to your vercel.json:
   ```json
   "framework": null
   ```

6. **Check Database Connection String**: Make sure your DATABASE_URL is properly formatted for Vercel. For Neon:
   ```
   postgresql://user:password@hostname/database?sslmode=require&pgbouncer=true
   ```

## Common Database Issues with Vercel

1. **Connection Pooling**: Neon requires pooled connections for Vercel serverless functions - make sure you've enabled this in your Neon dashboard.

2. **SSL Issues**: Make sure SSL is enabled and required in your connection string.

3. **Cold Starts**: The first request after a period of inactivity might fail due to "cold start" issues. This is normal with serverless functions.

4. **Connection Limits**: Serverless environments can have issues with connection limits. We've configured the connection pool to use a maximum of 1 connection. 