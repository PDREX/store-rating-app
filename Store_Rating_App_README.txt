🏪 Store Rating App

A personal full-stack web application built by Prathamesh Dasare to manage stores and allow users to rate them. The system supports role-based access: Admin, Store Owner, and Normal Users.

🚀 Built with Node.js, Express, Sequelize, SQLite, React, Bootstrap, and Axios.

🔥 Features

- 🔐 Secure login with JWT-based authentication
- 🧑‍💼 Role-based dashboards:
  - Admin: Manage users and stores
  - Store Owner: Add/view their own stores
  - Users: View and rate any store
- 📊 Average rating calculation
- 🏪 Store listing with filtering
- 🌐 RESTful APIs and clean UI

🧪 Test Login Credentials

| Role        | Email              | Password   |
|-------------|--------------------|------------|
| Admin       | admin@gmail.com    | admin12345 |
| Store Owner | owner@gmail.com    | owner1234  |
| User        | user@gmail.com     | user1234   |

📁 Folder Structure

store-rating-app/
├── backend/               # Node.js + Express API
│   ├── models/            # Sequelize models
│   ├── routes/            # Express routes
│   ├── middleware/        # Auth middleware
│   └── server.js          # App entry point
├── frontend/              # React client
│   ├── components/        # Reusable components
│   └── App.js             # Main App file
└── README.md              # Project documentation

⚙️ How to Run

Prerequisites
- Node.js installed
- npm installed

🛠 Setup

git clone https://github.com/your-username/store-rating-app.git
cd store-rating-app

# Install dependencies
cd store-rating-app-backend && npm install
cd store-rating-app-frontend && npm install

# Return to root and run both servers
cd ..
npm install concurrently --save-dev

🚀 One-click Start

Make sure your project structure is like this:

store-rating-app/
├── store-rating-app-backend/
│   └── server.js
├── store-rating-app-frontend/
│   └── ...
└── package.json
 
At this point you can directly run using run.bat 

or you can do this 

add this to your root package.json:

"scripts": {
  "client": "cd store-rating-app-frontend && npm start",
  "server": "cd store-rating-app-backend && nodemon server.js",
  "start": "concurrently \"npm run server\" \"npm run client\""
}

Now run:

npm start

🧠 Tech Stack

- Frontend: React, Bootstrap, Axios
- Backend: Express.js, Sequelize, JWT, SQLite
- Database: SQLite (easily switchable to MySQL/PostgreSQL)

📌 Todo (Future Enhancements)

- ✅ Filter stores by category
- 📍 Add Google Maps integration
- 📸 Add store images upload
- 📊 User analytics dashboard

📜 License

This is a personal project created by Prathamesh Dasare for learning and demonstration purposes. Feel free to fork and build upon it.

Made with ❤️ by Prathamesh