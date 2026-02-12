# Prime Trade Frontend

A React-based frontend for testing the Prime Trade REST API.

## Features

- **User Authentication**: Login and registration forms
- **Protected Dashboard**: Only accessible with valid JWT
- **Task Management**: Full CRUD operations
- **Real-time Feedback**: Success and error messages
- **Responsive Design**: Works on all devices

## Tech Stack

- React 18
- Vite
- React Router DOM
- CSS (vanilla)

## Getting Started

### Prerequisites
- Node.js 18+
- Running Prime Trade API server

### Installation

```bash
cd frontend
npm install
```

### Development

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

### Build for Production

```bash
npm run build
```

## Project Structure

```
frontend/
├── src/
│   ├── context/
│   │   └── AuthContext.jsx    # Authentication state
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   └── Dashboard.jsx
│   ├── services/
│   │   └── api.js            # API client
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
├── index.html
├── vite.config.js
└── package.json
```

## Demo Accounts

- **Admin**: admin@primetrade.com / Admin123!
- **User**: test@primetrade.com / User123!

## API Integration

The frontend is configured to proxy API requests to `http://localhost:5000`. Ensure the backend server is running before using the frontend.

## License

MIT License
