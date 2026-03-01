# Quick-Hire Backend API

A robust Node.js/Express REST API for a job board platform with comprehensive job management, user authentication, applications tracking, and broadcast email functionality. Built with MongoDB, JWT authentication, and Cloudinary integration.

## 🚀 Features

- **Authentication & Authorization**: JWT-based auth with access/refresh tokens, role-based access control (User/Admin)
- **Job Management**: Full CRUD operations for job listings with categories, filtering, search, and pagination
- **Application System**: Job application submission and tracking with status management
- **User Management**: Profile management with avatar uploads, multi-image support, and PDF file handling
- **Category System**: Organize jobs by categories with active job count tracking
- **Broadcast Emails**: Newsletter subscription and bulk email broadcasting to subscribers
- **File Uploads**: Image and document uploads via Multer with Cloudinary storage
- **Security**: Helmet, CORS, XSS protection, MongoDB sanitization, and rate limiting
- **Password Management**: Forget/reset password with OTP verification via email

## 📋 Requirements

- **Node.js**: 18+ (ESM modules)
- **MongoDB**: 4.4+ (Atlas or local instance)
- **Cloudinary Account**: For media storage
- **Email Service**: SMTP credentials for transactional emails
- **npm/yarn**: Package manager

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd quick-hire-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   
   Create a `.env` file in the root directory:
   ```env
   # Server
   PORT=5000
   NODE_ENV=development

   # Database
   MONGO_URI=your-mongodb-connection-string

   # JWT Tokens
   ACCESS_TOKEN_SECRET=your-access-token-secret
   ACCESS_TOKEN_EXPIRES=7d
   REFRESH_TOKEN_SECRET=your-refresh-token-secret
   REFRESH_TOKEN_EXPIRES=10d

   # Email Configuration
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_ADDRESS=your-email@example.com
   EMAIL_PASS=your-email-password
   EMAIL_FROM="Quick Hire <noreply@quickhire.com>"
   ADMIN_EMAIL=admin@quickhire.com
   EMAIL_EXPIRES=900000

   # Cloudinary
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ```

4. **Start the server**
   ```bash
   # Development mode with nodemon
   npm run dev

   # Production mode
   npm start
   ```

5. **Access the API**
   ```
   http://localhost:5000/api/v1
   ```

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api/v1
```

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register new user | No |
| POST | `/auth/login` | User login | No |
| POST | `/auth/refresh-access-token` | Refresh access token | No |
| POST | `/auth/forget-password` | Request password reset OTP | No |
| POST | `/auth/verify-code` | Verify OTP code | No |
| POST | `/auth/reset-password` | Reset password with OTP | No |
| POST | `/auth/change-password` | Change password (logged in) | Yes |
| POST | `/auth/logout` | User logout | Yes |

### Job Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/jobs` | Get all jobs (with filters) | No |
| GET | `/jobs/:id` | Get single job | No |
| POST | `/jobs` | Create job (with logo upload) | Admin |
| PUT | `/jobs/:id` | Update job | Admin |
| DELETE | `/jobs/:id` | Archive job | Admin |

**Query Parameters for GET `/jobs`:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `search` - Search in title/company/location
- `location` - Filter by location
- `jobType` - Filter by job type
- `tag` - Filter by tag
- `category` - Filter by category ID
- `status` - Filter by status (ACTIVE/ARCHIVED)
- `includeArchived` - Include archived jobs (true/false)

### Category Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/categories` | Get all categories | No |
| GET | `/categories/:id` | Get single category | No |
| POST | `/categories` | Create category (with image) | Admin |
| PUT | `/categories/:id` | Update category | Admin |
| DELETE | `/categories/:id` | Delete category | Admin |

### Application Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/applications` | Submit job application | User |
| GET | `/applications/my-applications` | Get user's applications | User |
| GET | `/applications` | Get all applications | Admin |
| GET | `/applications/:id` | Get single application | Admin |
| PUT | `/applications/:id` | Update application | Admin |
| DELETE | `/applications/:id` | Delete application | Admin |

### User Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/user/me` | Get own profile | User |
| PUT | `/user/me` | Update own profile | User |
| DELETE | `/user/me` | Delete own account | User |
| POST | `/user/upload-avatar` | Upload profile image | User |
| PUT | `/user/upload-avatar` | Update profile image | User |
| DELETE | `/user/upload-avatar` | Delete profile image | User |
| POST | `/user/upload-multiple-avatar` | Upload multiple images | User |
| PUT | `/user/upload-multiple-avatar` | Update multiple images | User |
| DELETE | `/user/upload-multiple-avatar` | Delete multiple images | User |
| POST | `/user/upload-file` | Upload PDF document | User |
| PUT | `/user/upload-file` | Update PDF document | User |
| DELETE | `/user/upload-file` | Delete PDF document | User |
| GET | `/user/all-users` | Get all users | Admin |
| GET | `/user/all-admins` | Get all admins | Admin |
| GET | `/user/:id` | Get user by ID | Admin |
| PUT | `/user/:id` | Update user by ID | Admin |
| DELETE | `/user/:id` | Delete user by ID | Admin |

### Broadcast Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/broadcast/subscribe` | Subscribe to newsletter | No |
| GET | `/broadcast/subscribe` | Get all subscribers | Admin |
| GET | `/broadcast/subscribe/:id` | Get subscriber by ID | Admin |
| DELETE | `/broadcast/subscribe/:id` | Delete subscriber | Admin |
| POST | `/broadcast/specific` | Send email to specific address | Admin |
| POST | `/broadcast` | Send to all subscribers | Admin |
| GET | `/broadcast` | Get all broadcasts | Admin |
| GET | `/broadcast/:id` | Get broadcast by ID | Admin |
| DELETE | `/broadcast/:id` | Delete broadcast | Admin |

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication:

1. **Register/Login** to receive `accessToken` and `refreshToken`
2. Include `Authorization: Bearer <accessToken>` header in protected requests
3. When access token expires, use refresh token endpoint to get new tokens

**Example:**
```javascript
// Login request
POST /api/v1/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}

// Response
{
  "status": true,
  "message": "Login successful",
  "data": {
    "user": { ...userInfo },
    "accessToken": "...",
    "refreshToken": "..."
  }
}

// Using the token
GET /api/v1/user/me
Headers: {
  "Authorization": "Bearer <accessToken>"
}
```

## 📁 Project Structure

```
quick-hire-backend/
├── src/
│   ├── app.js                 # Express app setup
│   ├── core/
│   │   ├── app/
│   │   │   └── appRouter.js   # Main API router
│   │   ├── config/
│   │   │   ├── config.js      # Environment config
│   │   │   └── logger.js      # Winston logger
│   │   └── middlewares/
│   │       ├── authMiddleware.js
│   │       ├── errorMiddleware.js
│   │       ├── multer.js
│   │       ├── notFound.js
│   │       └── validateRequest.js
│   ├── entities/
│   │   ├── application/       # Application module
│   │   ├── auth/              # Authentication module
│   │   ├── broadcast/         # Newsletter/broadcast module
│   │   ├── category/          # Category module
│   │   ├── job/               # Job module
│   │   └── user/              # User module
│   └── lib/
│       ├── cloudinaryUpload.js
│       ├── emailTemplates.js
│       ├── limit.js           # Rate limiting
│       ├── pagination.js      # Pagination helpers
│       ├── responseFormate.js
│       ├── sendEmail.js
│       └── types.js           # Role types
├── uploads/                   # Local upload directory
│   ├── files/
│   └── images/
├── logs/                      # Application logs
├── .env                       # Environment variables
├── .eslintrc.json            # ESLint config
├── .prettierrc               # Prettier config
├── .gitignore
├── ecosystem.config.js       # PM2 config
├── index.js                  # Entry point
├── package.json
└── README.md
```

## 🔒 Security Features

- **Helmet**: Sets security-related HTTP headers
- **CORS**: Configured for cross-origin requests
- **XSS Protection**: Sanitizes user input
- **MongoDB Sanitization**: Prevents NoSQL injection
- **Rate Limiting**: Global and endpoint-specific limits
- **Password Hashing**: bcrypt with salt rounds
- **JWT Tokens**: Secure access and refresh token system
- **Input Validation**: Request validation middleware

## 📤 File Uploads

### Supported File Types
- **Images**: jpg, jpeg, png, gif, webp
- **Documents**: pdf, doc, docx, xls, xlsx, ppt, pptx

### Upload Endpoints
- Single profile image: `POST /user/upload-avatar`
- Multiple images (max 5): `POST /user/upload-multiple-avatar`
- PDF documents: `POST /user/upload-file`
- Job company logo: `POST /jobs` (form-data: `companyLogo`)
- Category image: `POST /categories` (form-data: `image`)

### Storage
- **Local**: Temporary storage in `/uploads` directory
- **Cloudinary**: Persistent cloud storage
- Files are automatically uploaded to Cloudinary and local temp files are cleaned up

## 📧 Email Features

- **Verification Codes**: OTP-based email verification
- **Password Reset**: Secure password reset flow
- **Newsletters**: Broadcast emails to subscribers
- **HTML Templates**: Customizable email templates in [`src/lib/emailTemplates.js`](src/lib/emailTemplates.js)

## 🧪 Testing

```bash
npm test
```

## 📝 Logging

Logs are stored in the `/logs` directory using Winston:
- Console output for development
- File output (`logs/app.log`) for production
- Timestamps in Asia/Dhaka timezone

## 🚀 Deployment

### Using PM2 (Production)
```bash
npm install -g pm2
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
```

### Environment Variables
Ensure all required environment variables are set in production:
- Use strong secrets for JWT tokens
- Configure production MongoDB connection
- Set `NODE_ENV=production`
- Use secure SMTP credentials

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is private and proprietary.

## 👨‍💻 Developer

For questions or support, contact the development team.

---

**Note**: This is a backend API only. A separate frontend application is required to interact with these endpoints.