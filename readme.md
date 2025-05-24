# Campus++

## Overview

Campus++ is a comprehensive marketplace platform designed specifically for university students. It enables students to buy, sell, and trade items within their university community or across multiple universities. The platform facilitates safe and convenient transactions between students with features like in-app messaging, meetup scheduling, and bidding.

## Features

- **University-focused Marketplace**: Buy and sell items specifically targeted to university students
- **User Authentication**: Secure login and registration system for students with university email verification
- **Listings Management**: Create, edit, and manage listings with multiple images and detailed descriptions
- **Profile System**: Personalized user profiles showcasing listings and student information
- **Categories**: Browse items by categories like Textbooks, Electronics, Furniture, Tutoring, and more
- **Location-based Meetups**: Schedule and manage in-person meetups with interactive map selection
- **Bidding System**: Enable bidding on items for negotiable pricing
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop devices
- **Real-time Chat**: Integrated messaging system for communication between buyers and sellers

## Tech Stack

### Frontend
- **Framework**: Next.js 15 with React 19
- **Type Safety**: TypeScript
- **Styling**: TailwindCSS with Shadcn UI components
- **Form Handling**: React Hook Form with Zod validation
- **UI Libraries**: Lucide React icons, Radix UI primitives
- **Mapping**: Leaflet/React Leaflet for location services

### Backend
- **Runtime**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT for secure authentication
- **Storage**: Cloud storage for images and files
- **API**: RESTful API architecture
- **Deployment**: Vercel for serverless functions

### Chat Server
- Separate Node.js server for real-time chat functionality

## Project Structure

```
campusmarket/
├── client/                  # Frontend Next.js application
│   ├── app/                # Next.js app router
│   ├── components/         # Reusable UI components
│   ├── lib/                # Utility functions and hooks
│   ├── public/             # Static assets
│   └── styles/             # Global styles
├── server/                  # Backend Express.js API
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Express middleware
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   └── utils/              # Helper functions
└── chat-server/             # WebSocket server for real-time chat
```

## Getting Started

### Prerequisites
- Node.js 20.x or higher
- MongoDB instance (local or Atlas)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/campusmarket.git
cd campusmarket
```

2. Install dependencies for client and server:
```bash
# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install

# Install chat server dependencies
cd ../chat-server
npm install
```

3. Set up environment variables:
- Create `.env.local` in the client directory
- Create `.env` in the server and chat-server directories
- Add necessary environment variables (see `.env.example` files)

4. Start development servers:
```bash
# Start client (from client directory)
npm run dev

# Start server (from server directory)
npm run dev

# Start chat server (from chat-server directory)
npm run dev
```

## API Documentation

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/verify-email/:token` - Verify user email

### Listings
- `GET /api/listings` - Get all listings
- `GET /api/listings/:id` - Get specific listing
- `POST /api/listings` - Create new listing
- `PUT /api/listings/:id` - Update listing
- `DELETE /api/listings/:id` - Delete listing

### Users
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile
- `GET /api/users/:id/listings` - Get user listings

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- University IT departments for API support
- Student beta testers and feedback providers
- Open source libraries and frameworks used in this project
