# Emergency Department Tracking System - Deployment Package

This directory contains all the files needed to deploy the Emergency Department Tracking System to a free hosting platform like Render.com.

## Directory Structure

```
deployment/
├── .env                    # Environment variables configuration
├── package.json            # Node.js package configuration
├── README.md               # This file
├── mongodb_atlas_setup.md  # Guide for setting up MongoDB Atlas
├── render_deployment_guide.md # Guide for deploying to Render.com
├── src/
│   ├── server_deployment.js # Combined backend server
│   └── utils/
│       └── sampleData.js    # Sample data for demonstration
└── frontend/
    ├── index.html          # Login page
    ├── dashboard.html      # Dashboard view
    ├── triage.html         # Triage management
    ├── patient_details.html # Patient details view
    ├── zone_view.html      # Zone-specific patient tracking
    ├── styles.css          # CSS styling
    └── app.js              # Frontend JavaScript functionality
```

## Deployment Instructions

Please follow the detailed guides provided in this package:

1. First, set up MongoDB Atlas by following the instructions in `mongodb_atlas_setup.md`
2. Then, deploy the application to Render.com by following the instructions in `render_deployment_guide.md`

## Sample User Credentials

The system comes pre-loaded with the following sample users:

- **Admin**: admin@example.com / Admin@123
- **Doctor**: john.smith@example.com / Doctor@123
- **Nurse**: sarah.johnson@example.com / Nurse@123
- **Triage**: mike.brown@example.com / Triage@123

## Features

This Emergency Department Tracking System includes:

- User authentication with role-based access control
- Triage management with vital signs tracking
- Zone-specific patient tracking (Red, Yellow Team A/B, Green)
- Clinical documentation with provider notes
- Order management for medications, labs, and imaging
- Quick alerts for critical conditions (STEMI/Stroke)
- Responsive design for desktop and mobile devices

## Technical Details

- **Frontend**: HTML, CSS, JavaScript with Bootstrap 5
- **Backend**: Node.js with Express
- **Database**: MongoDB (hosted on MongoDB Atlas)
- **Authentication**: JWT-based authentication
- **Hosting**: Render.com free tier

## Support

For any questions or issues, please refer to the documentation or contact the system administrator.
