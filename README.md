# Secure Vault - Password Generator & Manager

A modern, secure password manager built with Next.js, TypeScript, and MongoDB featuring client-side encryption, strong password generation, and a clean, fast interface.

## Features

### 🔐 Security First
- **Client-side encryption**: All vault data is encrypted before being sent to the server using AES encryption
- **Strong password hashing**: User passwords are hashed with bcryptjs (12 rounds)
- **JWT authentication**: Secure token-based authentication
- **No plaintext storage**: Server never sees unencrypted sensitive data

### 🎯 Core Functionality
- **Password Generator**: Customizable strong password generation with configurable options
  - Adjustable length (4-64 characters)
  - Include/exclude letters, numbers, symbols
  - Exclude look-alike characters (0, O, 1, l, I)
- **Secure Vault**: Store and manage password entries
  - Title, username, password, URL, and notes
  - Search and filter functionality
  - Copy to clipboard with auto-clear (15 seconds)
  - Edit and delete entries
- **Simple Authentication**: Email/password registration and login

### 🚀 User Experience
- **Fast & Responsive**: Built with Next.js and optimized for performance
- **Clean UI**: Minimal design with Tailwind CSS
- **Instant Updates**: Real-time interface updates
- **Mobile Friendly**: Responsive design works on all devices

## Tech Stack

- **Frontend**: Next.js 15 with TypeScript
- **Styling**: Tailwind CSS
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT tokens with bcryptjs
- **Encryption**: CryptoJS (AES encryption)
- **Icons**: Lucide React

## Environment Setup

Create a `.env.local` file in the root directory:

```env
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your-secret-key-here-replace-in-production
NEXTAUTH_URL=http://localhost:3000
ENCRYPTION_KEY=your-32-character-encryption-key-here-replace-in-production
```

## Installation & Running

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd secure_vault
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   - Copy `.env.local.example` to `.env.local`
   - Update with your MongoDB connection string and secure keys

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   - Visit `http://localhost:3000`

## Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Security Implementation

### Client-Side Encryption
All sensitive vault data (title, username, password, URL, notes) is encrypted using AES encryption before being sent to the server. The encryption key is stored server-side and never transmitted to the client in plaintext.

```typescript
// Encryption example
const encrypt = (text: string): string => {
  return CryptoJS.AES.encrypt(text, ENCRYPTION_KEY).toString();
};
```

### Password Generation
The password generator uses cryptographically secure random number generation with customizable character sets:

```typescript
const generatePassword = (options) => {
  // Secure random password generation with user preferences
  // Supports length, character types, and look-alike exclusion
};
```

### Authentication Flow
1. User registers/logs in with email/password
2. Password is hashed with bcryptjs (12 rounds)
3. JWT token is issued for authenticated requests
4. Token is stored locally and sent with API requests

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Vault Management
- `GET /api/vault` - Get all vault items (requires auth)
- `POST /api/vault` - Create new vault item (requires auth)
- `PUT /api/vault/[id]` - Update vault item (requires auth)
- `DELETE /api/vault/[id]` - Delete vault item (requires auth)

### Utilities
- `POST /api/generate-password` - Generate secure password

## Database Schema

### User Model
```typescript
{
  email: string (unique),
  password: string (hashed),
  createdAt: Date
}
```

### VaultItem Model
```typescript
{
  userId: ObjectId (ref: User),
  title: string (encrypted),
  username: string (encrypted),
  password: string (encrypted),
  url: string (encrypted),
  notes: string (encrypted),
  createdAt: Date,
  updatedAt: Date
}
```

## Security Notes

1. **Encryption Keys**: Use strong, unique encryption keys in production
2. **HTTPS**: Always use HTTPS in production
3. **Environment Variables**: Never commit sensitive environment variables
4. **Database Security**: Ensure MongoDB is properly secured
5. **Regular Updates**: Keep dependencies updated for security patches

## Deployment

The application is ready for deployment on platforms like:
- Vercel (recommended for Next.js)
- Netlify
- Railway
- Heroku

Make sure to:
1. Set all environment variables in your deployment platform
2. Use strong, unique keys for production
3. Enable HTTPS
4. Configure your MongoDB connection for production

## Crypto Implementation

**Encryption Library**: CryptoJS (AES encryption)
**Why CryptoJS**: Chosen for its widespread adoption, strong AES implementation, and seamless integration with TypeScript. It provides robust client-side encryption ensuring sensitive data is encrypted before transmission to the server, maintaining privacy-first architecture.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please open an issue in the GitHub repository.
