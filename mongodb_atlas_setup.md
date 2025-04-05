# MongoDB Atlas Setup Guide

This guide will walk you through setting up a free MongoDB Atlas cluster for the Emergency Department Tracking System.

## Step 1: Create a MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Sign up for a free account using your email address
3. Complete the registration process

## Step 2: Create a Free Cluster

1. After logging in, click "Build a Database"
2. Select "FREE" tier option (M0 Sandbox)
3. Choose a cloud provider (AWS, Google Cloud, or Azure) - any will work for our purposes
4. Select a region closest to your users for best performance
5. Click "Create Cluster" (this may take a few minutes to provision)

## Step 3: Set Up Database Access

1. While the cluster is being created, go to the "Database Access" section in the left sidebar
2. Click "Add New Database User"
3. Create a username and password (make sure to save these credentials)
   - Username: `ed_tracking_user`
   - Password: Generate a secure password
4. Set user privileges to "Read and Write to Any Database"
5. Click "Add User"

## Step 4: Configure Network Access

1. Go to the "Network Access" section in the left sidebar
2. Click "Add IP Address"
3. For development purposes, you can click "Allow Access from Anywhere" (0.0.0.0/0)
   - Note: For production, you would restrict this to specific IP addresses
4. Click "Confirm"

## Step 5: Get Connection String

1. Once your cluster is created, click "Connect" on your cluster
2. Select "Connect your application"
3. Choose "Node.js" as your driver and the latest version
4. Copy the connection string provided
5. Replace `<password>` with your database user's password
6. Replace `<dbname>` with `ed_tracking_system`

## Step 6: Update Application Configuration

1. Open the `.env` file in your deployment directory
2. Update the `MONGO_URI` variable with your MongoDB Atlas connection string:
   ```
   MONGO_URI=mongodb+srv://ed_tracking_user:<your_password>@cluster0.mongodb.net/ed_tracking_system?retryWrites=true&w=majority
   ```
3. Save the file

## Step 7: Test Connection

Before deploying, you can test the connection by running the application locally:

```bash
cd deployment
npm install
npm start
```

If everything is set up correctly, you should see "MongoDB Connected" in the console output.

## MongoDB Atlas Free Tier Limitations

- 512MB storage limit
- Shared RAM and vCPU
- Limited operations per second
- Clusters may be paused after 60 days of inactivity
- No SLA or technical support

These limitations are acceptable for a demonstration system but would need to be upgraded for a production environment.
