# Render.com Deployment Guide

This guide will walk you through deploying the Emergency Department Tracking System to Render.com's free tier.

## Step 1: Create a Render.com Account

1. Go to [Render.com](https://render.com/)
2. Sign up for a free account using your email address or GitHub account
3. Complete the registration process

## Step 2: Prepare Your Application

Before deploying to Render.com, ensure your application files are organized as follows:

1. Make sure all files from the `deployment` directory are in your project root:
   - `package.json`
   - `.env` (with updated MongoDB Atlas connection string)
   - `src/server_deployment.js`
   - `src/utils/sampleData.js`
   - Frontend files in the `frontend` directory

2. Create a new GitHub repository and push your code to it (optional but recommended)

## Step 3: Create a New Web Service on Render

1. Log in to your Render.com dashboard
2. Click "New" and select "Web Service"
3. Connect your GitHub repository or use the "Deploy from existing repository" option
   - If you don't have a GitHub repository, you can use the "Upload Files" option

## Step 4: Configure the Web Service

1. Enter the following configuration details:
   - **Name**: `ed-tracking-system`
   - **Environment**: `Node`
   - **Region**: Choose the region closest to your users
   - **Branch**: `main` (or your default branch)
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

2. Add the following environment variables:
   - `PORT`: `10000` (Render uses this port internally)
   - `MONGO_URI`: Your MongoDB Atlas connection string from the MongoDB Atlas setup guide
   - `JWT_SECRET`: Generate a secure random string (you can use [random.org](https://www.random.org/strings/))
   - `NODE_ENV`: `production`

3. Click "Create Web Service"

## Step 5: Monitor the Deployment

1. Render will automatically build and deploy your application
2. You can monitor the build process in the "Logs" tab
3. The deployment may take a few minutes to complete

## Step 6: Access Your Application

1. Once the deployment is complete, Render will provide a URL for your application (e.g., `https://ed-tracking-system.onrender.com`)
2. Click on the URL to access your deployed Emergency Department Tracking System
3. You should see the login page of the application

## Step 7: Test the Application

1. Log in using one of the sample user credentials:
   - Admin: `admin@example.com` / `Admin@123`
   - Doctor: `john.smith@example.com` / `Doctor@123`
   - Nurse: `sarah.johnson@example.com` / `Nurse@123`
   - Triage: `mike.brown@example.com` / `Triage@123`

2. Verify that all functionality is working correctly:
   - Dashboard view
   - Patient registration
   - Triage management
   - Zone-specific views
   - Clinical documentation
   - Order management

## Render.com Free Tier Limitations

- 750 hours of runtime per month
- Automatic sleep after 15 minutes of inactivity
- Limited bandwidth and compute resources
- No custom domains on free tier
- No persistent disk storage (use MongoDB Atlas for data persistence)

These limitations are acceptable for a demonstration system but would need to be upgraded for a production environment.

## Troubleshooting

If you encounter any issues during deployment:

1. Check the Render logs for error messages
2. Verify that your MongoDB Atlas connection string is correct
3. Ensure all environment variables are properly set
4. Check that your package.json has all the required dependencies
5. Make sure your start command correctly points to the server file

For more detailed troubleshooting, refer to the [Render.com documentation](https://render.com/docs).
