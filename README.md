# PDFusion - Digital PDF Library

A modern, responsive digital library application built with React, Vite, and Supabase for managing and viewing PDF documents.

## Features

- 📚 **Comprehensive PDF Library**: Browse and search through a collection of educational PDFs
- 🔍 **Advanced Search**: Find documents by title, category, or keywords
- 👁️ **PDF Viewer**: In-app PDF viewing with navigation controls
- 📱 **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- 🎨 **Modern UI**: Beautiful dark-themed interface with animations and gradients
- 🔐 **Google OAuth Authentication**: Secure login with Google accounts
- 🔒 **Protected Routes**: Library and search pages only accessible to authenticated users
- 👤 **Role-based Access**: Admin panel only accessible to users with emails in the admin_users table
- ⚙️ **Admin Panel**: Easy management of PDF resources and categories
- ☁️ **Cloud Storage**: Integration with Google Drive for PDF storage

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- A Supabase account
- A Google Cloud Platform account (for Google OAuth)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open your browser to `http://localhost:5173`

## Google OAuth Setup

To enable Google authentication, follow the instructions in [GOOGLE-OAUTH-SETUP.md](GOOGLE-OAUTH-SETUP.md).

## Project Structure

- `src/components/` - Reusable UI components
- `src/pages/` - Main application pages
- `src/utils/` - Utility functions and services
- `src/hooks/` - Custom React hooks
- `src/data/` - Sample data for demo mode

## Technologies Used

- **React** - Frontend library
- **Vite** - Build tool and development server
- **Supabase** - Backend-as-a-Service (database, authentication)
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **React Router** - Client-side routing
- **Lucide React** - Icon library

## Deployment

Build the project for production:
```bash
npm run build
```

The output will be in the `dist` directory, ready for deployment to any static hosting service.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
