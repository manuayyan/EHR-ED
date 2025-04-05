# Updated Deployment Instructions for Render.com

These instructions will help you successfully deploy the Emergency Department Tracking System to Render.com's free tier. We've updated the deployment package to fix the file path issues you encountered.

## Step 1: Prepare Your Files

1. Extract the updated deployment package (`ed_tracking_system_deployment_fixed.zip`).
2. Make sure your directory structure looks like this:
   ```
   ed_tracking_system/
   ├── server.js           # Main server file (now in root directory)
   ├── package.json        # Updated package.json for Render.com
   ├── .env                # Environment variables
   └── frontend/           # Frontend files
       ├── index.html
       ├── dashboard.html
       ├── triage.html
       ├── patient_details.html
       ├── zone_view.html
       ├── styles.css
       └── app.js
   ```

## Step 2: Set Up MongoDB Atlas (Free Tier)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign up for a free account if you don't have one.
2. Create a new cluster (the M0 Sandbox tier is free).
3. Once your cluster is created, click "Connect" and select "Connect your application".
4. Copy the connection string provided (it will look like `mongodb+srv://username:<password>@cluster0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`).
5. Replace `<password>` with your database user password and `myFirstDatabase` with `ed_tracking_system`.

## Step 3: Deploy to Render.com

1. Go to [Render.com](https://render.com/) and sign up for a free account if you don't have one.
2. From your dashboard, click "New" and select "Web Service".
3. Connect your GitHub account or choose "Upload Files" if you're not using GitHub.
4. If uploading files directly:
   - Compress your entire project folder (with the structure shown above)
   - Upload the compressed file to Render
   
5. Configure your web service:
   - **Name**: `ed-tracking-system` (or any name you prefer)
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   
6. Add the following environment variables:
   - `PORT`: 10000 (Render will override this, but it's good to have)
   - `MONGO_URI`: Your MongoDB Atlas connection string from Step 2
   - `JWT_SECRET`: Any secure random string for JWT token generation
   - `NODE_ENV`: production

7. Select the free plan and click "Create Web Service".

## Step 4: Verify Deployment

1. Render will automatically build and deploy your application. This may take a few minutes.
2. Once deployment is complete, Render will provide you with a URL (something like `https://ed-tracking-system.onrender.com`).
3. Visit this URL to access your application.
4. You can log in with the following demo credentials:
   - Admin: admin@example.com / Admin@123
   - Doctor: john.smith@example.com / Doctor@123
   - Nurse: sarah.johnson@example.com / Nurse@123
   - Triage: mike.brown@example.com / Triage@123

## Troubleshooting

If you encounter any issues:

1. Check the Render logs for error messages (available in your Render dashboard).
2. Verify that your MongoDB Atlas connection string is correct and that your IP address is whitelisted.
3. Make sure all files are in the correct locations as shown in the directory structure above.
4. Check that the package.json file has the correct main file and start script:
   ```json
   "main": "server.js",
   "scripts": {
     "start": "node server.js"
   }
   ```

## Important Notes

1. The free tier of Render.com has some limitations:
   - Your service will spin down after 15 minutes of inactivity
   - The first request after inactivity may take up to 30 seconds to respond
   
2. The free tier of MongoDB Atlas has a 512MB storage limit, which is more than enough for this application with sample data.

3. For a production environment, you would want to implement additional security measures and possibly upgrade to paid tiers for better performance and reliability.
