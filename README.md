# RealTimeChat - FullStack Chat Application


A real-time chat application built with React.js frontend and Django backend, featuring WebSocket communication, JWT authentication, and responsive design.

## Features ✨

- **Real-time messaging** using WebSocket
- **JWT Authentication** with refresh tokens
- **User profiles** with avatar upload
- **Responsive design** for all devices
- **Emoji support** with emoji picker
- **Message history** with timestamps
- **Contact management** (add/search users)
- **Online status** indicators
- **End-to-end encrypted** communication

## Tech Stack 🛠️

### Frontend
- React.js (Vite)
- Axios for HTTP requests
- WebSocket API for real-time communication
- Emoji Picker React
- Moment.js for time formatting
- CSS Modules for styling

### Backend
- Django REST Framework
- Django Channels for WebSocket
- SimpleJWT for authentication
- SQLite (Development), PostgreSQL ready
- CORS headers for cross-origin requests
- ImageField for avatar storage

## Installation ⚙️

### Prerequisites
- Node.js (v16+)
- Python (3.9+)
- PostgreSQL (optional for production)

### Backend Setup
```bash
cd BackEnd
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

Frontend Setup
```bash
cd FrontEnd
npm install
npm run dev
```

Environment Variables 🔒
Create .env files in both frontend and backend directories:

BackEnd/.env
```ini
SECRET_KEY=your-django-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
DATABASE_URL=sqlite:///db.sqlite3
```
FrontEnd/.env
```ini
VITE_API_BASE_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000
```

API Endpoints 📡
```
Endpoint	Method	Description
/accounts/signup/	POST	User registration
/accounts/login/	POST	JWT authentication
/accounts/user/<username>/	GET	User profile details
/api/messages/	POST	Get message history
/ws/chat/<username>/	WS	WebSocket connection
Project Structure 📂
```
```
RealTimeChat/
├── BackEnd/
│   ├── accounts/           # Django auth app
│   │   ├── models.py       # Custom User model
│   │   ├── views.py        # API views
│   │   └── ...
│   ├── my_backend/         # Project config
│   └── manage.py
├── FrontEnd/
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── App.jsx         # Main component
│   │   └── ...
│   └── package.json
└── README.md
```
Contributing 🤝
Fork the project

Create your feature branch (git checkout -b feature/AmazingFeature)

Commit your changes (git commit -m 'Add some amazing feature')

Push to the branch (git push origin feature/AmazingFeature)

Open a Pull Request

License 📄
Distributed under the MIT License. See LICENSE for more information.

Contact 📧
MohammadHosein - mohammadhoseindadgostr@gmail.com - t.me/blackeagle256

Project Link: https://github.com/BlackEagle256/RealTimeChat


### Key Professional Touches:
1. Added emojis for visual scanning
2. Clear section headers
3. Complete setup instructions
4. API endpoint documentation
5. Project structure visualization
6. Professional contribution guidelines
7. License and contact information
8. Environment variables explanation
9. Tech stack breakdown
10. Responsive design mention
