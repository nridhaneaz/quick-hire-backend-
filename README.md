# Quick-Hire

Node/Express + MongoDB API for jobs, categories, applications, users, and more. Uses JWT auth, multer for uploads, Cloudinary for media, and rate limiting/security middleware.

## Requirements
- Node 18+ (ESM)
- MongoDB instance/connection string
- Cloudinary account (for file/image uploads)
- npm (bundled with Node)

## Setup
1) Install deps:
   ```bash
   npm install
   ```
2) Copy/create `.env` and fill:
   ```env
   PORT=5000
   MONGO_URI=your-mongodb-uri
   ACCESS_TOKEN_SECRETE=your-jwt-secret
   CLOUDINARY_CLOUD_NAME=xxx
   CLOUDINARY_API_KEY=xxx
   CLOUDINARY_API_SECRET=xxx
   ```
3) Start dev server:
   ```bash
   npm run dev
   ```
   or production:
   ```bash
   npm start
   ```
4) API base path: `http://localhost:5000/api/v1`

## Key Endpoints (examples)
- Auth: `POST /api/v1/auth/register`, `POST /api/v1/auth/login`
- Jobs: `GET /api/v1/jobs`, `POST /api/v1/jobs` (admin, with `companyLogo` upload)
- Categories: `GET /api/v1/categories`, `POST /api/v1/categories` (admin, with `image` upload)
- Applications: `POST /api/v1/applications`, `PUT /api/v1/applications/:id` (admin updates)
- Users: avatar/file uploads via `/api/v1/user/...`

## Uploads
- Local uploads served at `/uploads/*` (see `src/core/middlewares/multer.js`).
- Cloudinary used for persisted assets (`src/lib/cloudinaryUpload.js`).

## Notes
- Admin routes require auth (`verifyToken` + `adminMiddleware`).
- Request size limited to ~10 MB.
- Security middleware: helmet, cors, xss-clean, express-mongo-sanitize, and a global rate limiter.
