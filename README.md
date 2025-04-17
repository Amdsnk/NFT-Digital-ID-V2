# NFT Dashboard

## Deploying to Vercel

This application can be deployed to Vercel by following these steps:

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)

2. Sign up for a Vercel account at https://vercel.com

3. Create a new project in Vercel and connect it to your Git repository

4. Configure the following environment variables in Vercel's project settings:
   - `DATABASE_URL`: Your Neon PostgreSQL connection string
   
5. Deploy the application by clicking the "Deploy" button

### Important Notes

- Make sure your Neon Database allows connections from Vercel's IP ranges
- The application uses Neon's serverless PostgreSQL, which is compatible with Vercel's serverless functions
- The frontend assets will be built and served statically, while the backend runs as serverless functions

## Admin Access

The application includes an admin dashboard for managing users, NFTs, and system settings.

### Default Admin Credentials

- **Username**: admin
- **Password**: admin123

### Admin Features

- **User Management**: View, create, and manage user accounts
- **NFT Management**: Monitor and manage NFTs in the system
- **System Settings**: Configure application settings
- **Transfer Requests**: Approve or reject NFT transfer requests

### Admin Login

There are two ways to access the admin dashboard:

1. **Username/Password**: Use the admin credentials to log in
2. **Wallet Authentication**: Connect your wallet and use the admin password (for admin wallets only)

The admin login page is available at `/admin-login`

### Security Considerations

For production environments, make sure to:
- Change the default admin password
- Set up proper authentication with JWT and secure password hashing
- Consider implementing 2FA for admin access

## Local Development

To run the application locally:

1. Clone the repository
2. Install dependencies: `npm install`
3. Create a `.env` file based on `.env.example`
4. Run the development server:
   - For macOS/Linux: `npm run dev`
   - For Windows: `npm run dev:windows`

## Project Structure

- `client/`: Frontend React application
- `server/`: Backend Express.js API
- `shared/`: Shared code between frontend and backend
- `dist/`: Built files (generated during build)

## Build and Production

To build the application for production:

```bash
npm run build
```

To start the production server:

```bash
npm start
``` 