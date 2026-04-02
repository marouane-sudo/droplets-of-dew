# SmartTaste AI - Full-Stack Restaurant Application

🍽️ **AI-powered restaurant recommendation system** that helps users find perfect dining experiences based on their mood, preferences, and dietary needs.

## Features

### Core Features
- ✅ **AI-Based Food Recommendations** - Get personalized suggestions based on your current mood
- ✅ **Voice Input Search** - Hands-free restaurant searching using speech recognition
- ✅ **Restaurant Listings** - Browse restaurants with advanced filters (price, distance, rating, cuisine)
- ✅ **Real-Time Wait Times** - Simulated wait time updates and busy level indicators
- ✅ **User Profiles** - Manage food preferences, dietary restrictions, and spice levels
- ✅ **Dark/Light Mode** - Modern UI with theme switching

### Advanced Features
- 🏆 **Gamification System** - Earn points and badges for orders and reviews
- 📊 **Calorie Tracking** - Track calories from your orders
- 👥 **Social System** - Add friends and view activity feed (structure ready)
- ⭐ **Review System** - Rate and review restaurants
- 🔐 **JWT Authentication** - Secure user authentication

### Technology Stack

#### Backend
- **Node.js** + **Express** - RESTful API
- **MongoDB** + **Mongoose** - Database
- **JWT** - Authentication
- **OpenAI API** - AI recommendations (optional)
- **bcryptjs** - Password hashing

#### Frontend
- **React 18** - UI library
- **React Router v6** - Navigation
- **Framer Motion** - Animations
- **Axios** - HTTP client
- **Context API** - State management

## Project Structure

```
smarttaste-ai/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Auth middleware
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API routes
│   ├── services/        # Business logic (AI service)
│   ├── utils/           # Utility functions
│   ├── .env.example     # Environment variables template
│   ├── package.json
│   └── server.js        # Entry point
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/  # Reusable components
    │   ├── context/     # React contexts
    │   ├── pages/       # Page components
    │   ├── services/    # API services
    │   ├── App.js       # Main app component
    │   └── index.js     # Entry point
    └── package.json
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone the Repository
```bash
cd smarttaste-ai
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file from example
cp .env.example .env

# Edit .env and add your configuration:
# - MONGODB_URI (your MongoDB connection string)
# - JWT_SECRET (any secure string)
# - OPENAI_API_KEY (optional, for AI features)
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd ../frontend

# Install dependencies
npm install
```

### 4. Run the Application

#### Start Backend Server
```bash
# From backend directory
npm run dev
# Server runs on http://localhost:5000
```

#### Start Frontend Development Server
```bash
# From frontend directory (new terminal)
npm start
# App runs on http://localhost:3000
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)
- `PUT /api/auth/profile` - Update profile (protected)

### Restaurants
- `GET /api/restaurants` - Get all restaurants (with filters)
- `GET /api/restaurants/:id` - Get single restaurant
- `GET /api/restaurants/:id/reviews` - Get restaurant reviews
- `GET /api/restaurants/:id/wait-time` - Get real-time wait time

### AI Features
- `POST /api/ai/recommend` - Get mood-based recommendation (protected)
- `POST /api/ai/voice-analyze` - Analyze voice input (protected)
- `POST /api/ai/chat` - Chat with AI assistant (protected)

## Usage Examples

### Filter Restaurants
```
GET /api/restaurants?cuisineType=italian&priceRange=$$&minRating=4.0&isOpenNow=true
```

### Get AI Recommendation
```javascript
POST /api/ai/recommend
Headers: { Authorization: "Bearer <token>" }
Body: { "mood": "happy" }
```

### Voice Search
The AI Assistant page supports voice input using the Web Speech API. Click the microphone button and speak commands like:
- "I'm feeling hungry, recommend something"
- "Find Italian restaurants near me"
- "I'm stressed and need comfort food"

## Environment Variables

### Backend (.env)
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/smarttaste-ai
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d
OPENAI_API_KEY=your-openai-api-key
FRONTEND_URL=http://localhost:3000
```

### Frontend
Create `.env` in frontend folder:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## Demo Data

To populate the database with sample restaurants, you can use MongoDB Compass or create a seed script. Here's a sample restaurant document:

```javascript
{
  name: "Italian Bistro",
  description: "Authentic Italian cuisine",
  cuisineType: ["italian"],
  priceRange: "$$",
  rating: 4.5,
  address: {
    city: "New York",
    state: "NY"
  },
  menu: [
    {
      name: "Margherita Pizza",
      price: 18,
      calories: 800,
      category: "main"
    }
  ],
  currentWaitTime: 20,
  busyLevel: "medium"
}
```

## Learning Resources

This project is designed for learning full-stack development:

1. **Clean Architecture** - Separation of concerns with controllers, services, and models
2. **Authentication Flow** - Complete JWT implementation
3. **API Design** - RESTful best practices
4. **React Patterns** - Context API, custom hooks, component composition
5. **State Management** - Global state with Context
6. **Styling** - CSS variables for theming

## Future Enhancements

- [ ] Real-time order tracking with WebSockets
- [ ] Payment integration (Stripe)
- [ ] Google Maps integration for location
- [ ] Email notifications
- [ ] Mobile app with React Native
- [ ] Admin dashboard
- [ ] Advanced analytics

## License

MIT License - Feel free to use this project for learning!

## Support

For questions or issues, please open an issue on GitHub.

---

**Built with ❤️ for learning full-stack development**
