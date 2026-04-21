# 🌍 Tour & Travel Management System

A comprehensive full-stack web application for managing tour packages, bookings, and travel experiences. Built with React.js frontend and Node.js backend.

## 🚀 Features

### For Travelers (Users)

- 🔍 Browse and search tour packages
- 📅 Book travel packages with real-time availability
- 💳 Secure payment processing
- ⭐ Rate and review completed trips
- 📱 Personal dashboard for booking management
- 🔔 Real-time notifications

### For Travel Companies

- 📦 Create and manage tour packages
- 🏢 Company profile management
- 📊 Booking and revenue analytics
- 👥 Customer management
- 📈 Performance tracking

### For Administrators

- 👨‍💼 System-wide dashboard and analytics
- 🏢 Company verification and management
- 👥 User management
- 📊 Platform statistics and reporting

## 🛠️ Tech Stack

### Frontend

- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **React Router** for navigation
- **React Query** for data fetching
- **React Hook Form** for form management
- **Vite** for build tooling

### Backend

- **Node.js** with Express.js
- **MySQL** database
- **JWT** authentication
- **Bcrypt** for password hashing
- **Joi** for validation
- **Multer** for file uploads

### Security & Performance

- **Helmet** for security headers
- **CORS** configuration
- **Rate limiting**
- **Input validation**
- **SQL injection prevention**

## 📁 Project Structure

```
tour-travel-ms/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service functions
│   │   ├── context/        # React context providers
│   │   ├── types/          # TypeScript type definitions
│   │   └── layouts/        # Layout components
│   ├── public/             # Static assets
│   └── package.json
├── api/                     # Node.js backend API
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── services/       # Business logic
│   │   ├── routes/         # API routes
│   │   ├── middlewares/    # Custom middleware
│   │   ├── validations/    # Input validation schemas
│   │   ├── config/         # Configuration files
│   │   ├── utils/          # Utility functions
│   │   └── seeders/        # Database seed data
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone git@github.com:abdulaki91/Tour-and-travel-ms.git
   cd Tour-and-travel-ms
   ```

2. **Setup Backend**

   ```bash
   cd api
   npm install

   # Create environment file
   cp .env.example .env
   # Edit .env with your database credentials

   # Initialize database and seed data
   npm run seed

   # Start development server
   npm run dev
   ```

3. **Setup Frontend**

   ```bash
   cd frontend
   npm install

   # Create environment file
   cp .env.example .env
   # Edit .env with your API URL

   # Start development server
   npm run dev
   ```

### Environment Variables

#### Backend (.env)

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=tour_travel_db
DB_PORT=3306

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key
JWT_REFRESH_SECRET=your_super_secret_refresh_key
JWT_EXPIRE=24h
JWT_REFRESH_EXPIRE=7d
```

#### Frontend (.env)

```env
VITE_API_URL=http://localhost:5000/api
```

## 📊 Database Schema

The system uses a relational MySQL database with the following main entities:

- **Users** - System users (travelers, companies, admins)
- **Companies** - Travel company profiles
- **Packages** - Tour packages offered by companies
- **Bookings** - User bookings for packages
- **Payments** - Payment transactions
- **Reviews** - User reviews and ratings
- **Notifications** - System notifications

## 🔐 Authentication & Authorization

The system implements role-based access control with three user types:

1. **USER** - Regular travelers who can book packages
2. **COMPANY** - Travel companies who can create packages
3. **ADMIN** - System administrators with full access

## 🌐 API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Packages

- `GET /api/packages` - Get all packages (with filters)
- `GET /api/packages/:id` - Get package details
- `POST /api/packages` - Create package (Company only)
- `PUT /api/packages/:id` - Update package (Company only)

### Bookings

- `POST /api/bookings` - Create booking
- `GET /api/bookings/my` - Get user bookings
- `PATCH /api/bookings/:id/cancel` - Cancel booking

### Payments

- `POST /api/payments/booking/:bookingId` - Create payment
- `POST /api/payments/:id/process` - Process payment

[View complete API documentation](./api/README.md)

## 🧪 Testing

### Backend Testing

```bash
cd api
npm test
```

### Frontend Testing

```bash
cd frontend
npm test
```

## 🚀 Deployment

### Backend Deployment

1. Set production environment variables
2. Build the application: `npm run build`
3. Start production server: `npm start`

### Frontend Deployment

1. Build for production: `npm run build`
2. Deploy the `dist` folder to your hosting service

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Abdul Aki**

- GitHub: [@abdulaki91](https://github.com/abdulaki91)
- Email: your.email@example.com

## 🙏 Acknowledgments

- Thanks to all contributors who helped build this project
- Inspired by modern travel booking platforms
- Built with love for the travel community

## 📞 Support

If you have any questions or need help with setup, please open an issue or contact the maintainer.

---

**Happy Traveling! 🌍✈️**
