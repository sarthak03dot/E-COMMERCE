# BD.ai - AI-Powered Smart Selling Platform

Welcome to **BD.ai**, an innovative full-stack web application designed to simplify buying and selling across categories like cars, bikes, electronics, and more. Built with React for the frontend and Node.js/Express/Mongoose for the backend, BD.ai offers features such as one-click selling, favorite toggling, eco-scoring, and AI-driven recommendations. This platform aims to provide a seamless marketplace experience with secure transactions.
## Demo Image
<img width="1920" height="964" alt="Image" src="https://github.com/user-attachments/assets/93683a53-6f41-4cdd-ae44-4a5c4916dd29" />
<img width="1920" height="964" alt="Image" src="https://github.com/user-attachments/assets/2cd7bd0a-0130-4d3d-a0f9-20e8a6f6d51a" />
<img width="1920" height="964" alt="Image" src="https://github.com/user-attachments/assets/a98e31ff-c269-4e1b-a285-16954938805c" />
<img width="1920" height="964" alt="Image" src="https://github.com/user-attachments/assets/6a0d76a3-fec3-4824-b941-7624107c2b8e" />
<img width="1920" height="964" alt="Image" src="https://github.com/user-attachments/assets/e81e29ed-9b70-4f4c-82c5-0a3163192a08" />


## Features
- **User Authentication**: Login, register, and logout with JWT-based security.
- **Product Management**: Create, browse, and manage listings with images and details.
- **Search & Filtering**: Explore products by category with ease.
- **Eco-Score**: Sustainability rating (0-100) for products.
- **Testimonials**: Share feedback and ratings.
- **Responsive Design**: Optimized for desktop and mobile.

## Tech Stack
- **Frontend**: React, Material-UI (MUI), React Router DOM
- **Backend**: Node.js, Express, Mongoose, Multer, JWT
- **Database**: MongoDB
- **Other**: JavaScript, RESTful APIs

## Prerequisites
- Node.js (v18+)
- MongoDB (local or remote instance)
- Git

## Installation

### 1. Clone the Repository
```bash
git clone https://github.com/sarthak03dot/E-COMMERCE.git
cd E-COMMERCE
```

### 2. Set Up the Backend
- Navigate to the backend directory:
  ```bash
  cd server
  ```
- Install dependencies:
  ```bash
  npm install
  ```
- Create a `.env` file in the `server` directory with:
  ```
  MONGODB_URI=mongodb://localhost:27017/bd_ai_db
  JWT_SECRET=your-secure-jwt-secret-key
  PORT=5000
  ```
  - Replace `your-secure-jwt-secret-key` with a random string.
  - Ensure MongoDB is running (`mongod`).

- Start the backend:
  ```bash
  node app.js
  ```

### 3. Set Up the Frontend
- Navigate to the root directory:
  ```bash
  cd ..
  ```
- Install dependencies:
  ```bash
  npm install
  ```
- Start the frontend:
  ```bash
  npm start
  ```
- Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Image Upload Setup
- Create an `uploads/` directory in `server/` and ensure it’s writable:
  ```bash
  mkdir server/uploads
  chmod -R 755 server/uploads
  ```
- Uploaded images will be stored here and served via `/uploads/`.

## Usage
1. **Register/Login**: Use the navbar to sign up or log in.
2. **Sell an Item**: Click "Sell" to open the modal, fill in details (title, price, image, etc.), and submit.
3. **Browse**: Explore categories or search for products.
4. **Favorite Items**: Toggle favorites with the heart icon.
5. **Submit Testimonials**: Add feedback via the "Add Testimonial" button.

## Project Structure
- `server/`: Backend code (routes, models, middleware).
- `src/`: Frontend code (components, pages, utils).
- `public/`: Static assets (e.g., `logo.avif`).

## Roadmap
- **v1.1**: Add payment integration.
- **v1.2**: Implement AI-driven recommendations.

## Contributing
1. Fork the repository.
2. Create a feature branch (`git checkout -b feature-name`).
3. Commit changes (`git commit -m "Add feature-name"`).
4. Push to the branch (`git push origin feature-name`).
5. Open a Pull Request.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact
For questions or support, reach out at `sarthak03dot@gmail.com`.

## Acknowledgments
- Built with love by the BD.ai team.
- Thanks to the open-source community for tools like React, Node.js, and MUI.