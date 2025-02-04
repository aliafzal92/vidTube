# vidTube

vidTube is a video sharing platform built with Node.js, Express, and MongoDB. It allows users to upload, view, and manage videos.

## Features

- User registration and authentication
- Video upload and management
- Cloudinary integration for video storage
- MongoDB for data storage
- Express for server-side logic
- Middleware for handling file uploads

## Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/yourusername/vidtube.git
   cd vidtube
   ```

2. Create a `.env` file in the root directory and add the following environment variables:
   ```
   MONGODB_URI=your_mongodb_uri
   PORT=8000
   CLOUDINARY_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ACCESS_TOKEN_SECRET=your_access_token_secret
   ACCESS_TOKEN_EXPIRY=your_access_token_expiry
   REFRESH_TOKEN_SECRET=your_refresh_token_secret
   REFRESH_TOKEN_EXPIRY=your_refresh_token_expiry
   CORS_ORIGIN=your_cors_origin
   ```

Feel free to customize the content as needed.

## Project Structure
