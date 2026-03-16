# Cloudinary Setup Guide

## Problem
Render.com and other cloud platforms use **ephemeral file systems**, meaning uploaded files are deleted when the server restarts. This causes 404 errors for uploaded images.

## Solution
Use **Cloudinary** (a cloud-based image hosting service) to store images permanently.

---

## Setup Steps

### 1. Create a Cloudinary Account
1. Go to [https://cloudinary.com/users/register/free](https://cloudinary.com/users/register/free)
2. Sign up for a free account (1GB storage, 25 monthly credits)
3. After signup, go to your **Dashboard**

### 2. Get Your Credentials
From the Cloudinary Dashboard, copy:
- **Cloud Name**
- **API Key**
- **API Secret**

### 3. Update Local Configuration
Edit `appsettings.Development.json` (for local development):

```json
{
  "CloudinarySettings": {
    "CloudName": "your-cloud-name",
    "ApiKey": "your-api-key",
    "ApiSecret": "your-api-secret"
  }
}
```

### 4. Update Render Environment Variables
In your Render.com dashboard:

1. Go to your service → **Environment** tab
2. Add these environment variables:
   ```
   CloudinarySettings__CloudName = your-cloud-name
   CloudinarySettings__ApiKey = your-api-key
   CloudinarySettings__ApiSecret = your-api-secret
   ```

   Note: Use double underscore `__` for nested configuration in environment variables.

### 5. Redeploy to Render
After adding environment variables, trigger a new deployment on Render.

---

## What Changed

### Before (Local File System - NOT PERSISTENT)
```csharp
// Files saved to wwwroot/uploads/carousel
var uploadsFolder = Path.Combine(_environment.WebRootPath, "uploads", "carousel");
var filePath = Path.Combine(uploadsFolder, fileName);
```
❌ Files deleted on server restart

### After (Cloudinary - PERSISTENT)
```csharp
// Files uploaded to Cloudinary cloud storage
var imageUrl = await _cloudinaryService.UploadImageAsync(photo, "carousel");
```
✅ Files stored permanently in the cloud

---

## Testing

After setup, upload a new carousel image:

```bash
POST https://rfi-1.onrender.com/api/carousel
Content-Type: multipart/form-data

photo: [your-image-file]
title: "Test Image"
order: 0
```

The response should have an `imageUrl` like:
```
https://res.cloudinary.com/your-cloud-name/image/upload/v1234567890/carousel/abc123.jpg
```

---

## Important Notes

1. **Existing images are lost** - You'll need to re-upload all carousel images
2. **Free tier limits**: 25 monthly credits (plenty for a small site)
3. **Automatic optimization**: Cloudinary automatically optimizes images for web
4. **CDN delivery**: Images are served through Cloudinary's global CDN

---

## Other Controllers to Update

You may need to update other image upload endpoints:
- Events images
- News images  
- Posters
- Product images

Let me know if you need help updating those as well!
