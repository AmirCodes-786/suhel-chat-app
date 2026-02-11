<h1 align="center">✨ Streamify - Fullstack Chat & Video Calling App ✨</h1>

<p align="center">
  <img src="/frontend/public/screenshot-for-readme.png" alt="Demo App" width="100%" />
</p>

<p align="center">
  A modern, real-time chat application with video calling, built for seamless communication across all devices.
  <br />
  <a href="#-features"><strong>Explore the docs »</strong></a>
  <br />
  <br />
  <a href="https://github.com/AmirCodes-786/suhel-chat-app/issues">Report Bug</a>
  ·
  <a href="https://github.com/AmirCodes-786/suhel-chat-app/issues">Request Feature</a>
</p>

## 🚀 Features

- **📱 Fully Mobile Responsive**: 
  - Custom bottom navigation for mobile users.
  - Optimized chat interface with 100% viewport height.
  - Adaptive layouts for notifications and profiles.
- **🌐 Real-time Messaging**: Instant chat with typing indicators, read receipts, and message reactions.
- **📹 Video Calls**: 1-on-1 and Group calls with screen sharing and recording capabilities.
- **🔐 Secure Authentication**: JWT-based auth with protected routes.
- **🎨 Modern UI/UX**: 
  - Glassmorphism design elements.
  - 32 Unique UI Themes (Dark/Light modes).
  - Smooth animations and transitions.
- **🧠 State Management**: Robust global state handling with Zustand.
- **⚡ Performance**: Optimized with TanStack Query for efficient data fetching.

## 🛠️ Tech Stack

- **Frontend**: React, TailwindCSS, DaisyUI, Lucide React, Framer Motion
- **Backend**: Node.js, Express, MongoDB, Socket.io (via Stream)
- **Services**: Stream Chat & Video SDK, Cloudinary (file storage)
- **Deployment**: Vercel (Frontend), Render (Backend)

---

## ⚡ Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB Atlas Account
- Stream Chat Account
- Cloudinary Account

### 🔧 Backend Setup

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file and add your credentials:
    ```env
    PORT=5001
    MONGODB_URI=your_mongo_connection_string
    JWT_SECRET=your_jwt_secret_key
    CLOUDINARY_CLOUD_NAME=your_cloud_name
    CLOUDINARY_API_KEY=your_api_key
    CLOUDINARY_API_SECRET=your_api_secret
    STREAM_API_KEY=your_stream_api_key
    STREAM_API_SECRET=your_stream_api_secret
    NODE_ENV=development
    CLIENT_URL=http://localhost:5173
    ```
4.  Run the server:
    ```bash
    npm run dev
    ```

### 💻 Frontend Setup

1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file:
    ```env
    VITE_STREAM_API_KEY=your_stream_api_key
    VITE_API_BASE_URL=http://localhost:5001/api
    ```
4.  Run the application:
    ```bash
    npm run dev
    ```

---

## 🌍 Deployment

### Backend (Render)
- **Build Command**: `npm install`
- **Start Command**: `node src/server.js`
- **Env Vars**: Set all variables from `.env`. Set `CLIENT_URL` to your frontend domain.

### Frontend (Vercel)
- **Framework Preset**: Vite
- **Env Vars**: `VITE_STREAM_API_KEY`, `VITE_API_BASE_URL` (points to your Render backend).

---

## 🤝 Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.
