# 🚀 PrepVault

PrepVault is a premium, full-stack application designed to be your ultimate interview arsenal. Organize your professional links, build a comprehensive technical answer bank, and test your knowledge using an interactive flashcard system—all wrapped in a stunning, modern glassmorphic UI.

## ✨ Features

*   **🔗 Links Vault**: Store, organize, and quickly access your important professional URLs (GitHub, LinkedIn, Portfolio, specific project demos). Includes quick-copy and direct link access.
*   **📚 Answer Bank**: Create and manage a personal database of interview questions and answers. Features rich-text editing, topic categorization, and confidence-level tracking.
*   **🧠 Revise Mode**: Transform your Answer Bank into interactive flashcards. Test your knowledge, flip cards to reveal answers, and update your confidence levels dynamically.
*   **🌗 Premium Glassmorphic UI**: A highly polished, responsive interface with beautiful backdrop blurs, subtle gradients, and full support for both Light and Dark modes.
*   **🔐 Secure Authentication**: JWT-based authentication with secure `httpOnly` cookie session management.

## 🛠️ Tech Stack

**Frontend:**
*   React 18 (Vite)
*   Tailwind CSS v4 (Custom Glassmorphism Utilities)
*   React Query (@tanstack/react-query) for data fetching and caching
*   React Router DOM for navigation
*   Lucide React for iconography
*   React Simple WYSIWYG for rich text editing

**Backend:**
*   Node.js & Express.js
*   MongoDB (Mongoose ODM)
*   JSON Web Tokens (JWT) for secure authentication
*   BcryptJS for password hashing

## 🚀 Getting Started

Follow these instructions to set up the project locally.

### Prerequisites
*   Node.js (v18 or higher recommended)
*   MongoDB Atlas Account (or local MongoDB instance)

### 1. Clone the repository
```bash
git clone https://github.com/your-username/PrepVault.git
cd PrepVault
```

### 2. Backend Setup
```bash
cd server
npm install
```
Create a `.env` file in the `server` directory (use `.env.example` as a template):
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```
Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal window:
```bash
cd client
npm install
```
Create a `.env` file in the `client` directory:
```env
VITE_API_URL=http://localhost:5000/api
```
Start the Vite development server:
```bash
npm run dev
```

The application will be running at `http://localhost:5173`.

## 🌐 Deployment

PrepVault is designed to be easily deployable on modern cloud platforms.

*   **Frontend (Vercel)**: Connect your GitHub repo to Vercel, set the build command to `npm run build`, output directory to `dist`, and add `VITE_API_URL` to your Vercel Environment Variables.
*   **Backend (Render)**: Deploy the Node.js server to Render, setting your Environment Variables appropriately. Ensure `NODE_ENV=production` is set so cross-site cookies are configured properly between Vercel and Render.

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## 📝 License
This project is open source and available under the [MIT License](LICENSE).
