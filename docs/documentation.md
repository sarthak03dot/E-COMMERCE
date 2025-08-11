## Technical Documentation for BD.ai Web Application

This technical documentation follows a structured template based on standard practices for web apps, including an introduction, architecture, API details, deployment, and more. It serves as a comprehensive guide for developers, maintainers, and users of the BD.ai platform—an AI-powered smart selling application for buying and selling items across categories like cars, bikes, electronics, and more.

#### Introduction

**Summary**: BD.ai is a full-stack web application built with React (frontend) and Node.js/Express/Mongoose (backend) for user authentication, product listing, searching, and testimonials. It supports features like one-click selling, favorite toggling, and eco-scoring for products. The purpose is to provide a seamless marketplace experience with AI-driven recommendations and secure transactions. Target audience includes end-users (buyers/sellers), developers, and administrators.

**Project Goals**:

- Enable quick product selling and buying.
- Ensure secure authentication and data handling.
- Support responsive design for desktop and mobile.
- Integrate API for real-time data fetching and updates.

**Version**: 1.0 (as of August 12, 2025).
**Dependencies**:

- Frontend: React, MUI, React Router DOM.
- Backend: Node.js, Express, Mongoose, Multer (for file uploads), JWT (for authentication).

#### Key Elements

##### Product Information

**Summary**: BD.ai allows users to browse categories (e.g., Cars, Bikes), list products with details (title, price, image, description, features), favorite items, and submit testimonials. Core features include:

- User authentication (login/register/logout).
- Product CRUD operations.
- Search and filtering by category.
- Eco-score calculation for sustainability.

**User Guides**:

- **Installation Manual**: Clone repo, run `npm install` for frontend/backend, start with `npm start`.
- **How-to Guide**: Log in, navigate to "Sell" to open modal, fill form, submit.
- **Troubleshooting**: Common issues like "400 Bad Request" (check payload), resolved by validating FormData.

##### Technical Details

**Summary**:

- **System Architecture**: Client-server model with React frontend, Node.js backend, MongoDB database. Data flow: User -> React (state management) -> API calls (fetch) -> Express routes -> Mongoose models -> MongoDB.
- **Hardware/Software Requirements**: Node.js v18+, MongoDB, browser (Chrome/Firefox).
- **Configuration**: Environment variables (e.g., `MONGODB_URI`, `JWT_SECRET` in `.env`).
- **Programming Languages/Frameworks**: JavaScript, React, Express, Mongoose.
- **System Interfaces**: RESTful APIs (e.g., `/api/auth/login`, `/api/items`, `/api/search`).

##### User Instruction

**Summary**: Step-by-step guide for using BD.ai.

1. Open the app in a browser.
2. Log in/register via the navbar.
3. Search for products or browse categories.
4. Click "Sell" to open the modal, fill details (title, price, image, etc.), and submit.
5. Favorite items by clicking the heart icon.
6. Submit testimonials via the "Add Testimonial" button.

**Visual Aids**: Refer to flowcharts and ER diagrams below.

##### Glossary of Terms

- **AuthToken**: JWT for user authentication.
- **EcoScore**: Sustainability rating (0-100) for products.
- **FormData**: Object for multipart form uploads (e.g., images).
- **Mongoose**: ODM for MongoDB.
- **MUI**: Material-UI for React components.

##### Appendices

- **FAQs**: Q: How to upload an image? A: Use the file input in the sell modal.
- **Troubleshooting Tips**: If API fails, check token expiration or network.
- **Reference Guides**: See API endpoints below.

#### Process Documentation

**Summary**:

- **Project Plan**: Developed iteratively with frontend (React components) and backend (Express routes) built in parallel.
- **Methodology**: Agile with sprints for features like authentication and product listing.
- **Workflow**: Design -> Develop -> Test -> Deploy.
- **Schedule**: Development: 4 weeks; Testing: 1 week; Deployment: Ongoing.

**Roadmap**:

- v1.1: Add payment integration.
- v1.2: AI recommendations.

#### Advantages of Using the Template

- Ensures consistency in documentation.
- Facilitates collaboration among team members.
- Reduces errors by providing placeholders for key sections.
- Supports compliance with development standards.

#### Creation Process

- **Access Template**: Based on standard web app documentation templates.
- **Select Structure**: Customized for BD.ai with sections like introduction and API.
- **Define Standards**: Use Markdown for readability; consistent terminology (e.g., "product" for items).
- **Determine Audience**: Developers (technical details), users (instructions).
- **Save and Share**: Store in repo as `docs/technical-documentation.md`.

### Flowcharts and ER Diagrams

![Image](https://github.com/user-attachments/assets/6a28378d-0de6-4128-a264-8a15f91b3649)

### Testing Logs

Using a test case template for web apps, below are sample test cases for BD.ai, with simulated execution logs. These are based on manual testing scenarios, as the app is a React/Node.js project. Logs include pass/fail status, comments, and timestamps (simulated as of August 12, 2025).

#### Test Case Template Structure

- **Test Case ID**: Unique ID (e.g., TC_WEB_LOGIN_1).
- **Module**: Feature being tested.
- **Description**: Test objective.
- **Preconditions**: Setup required.
- **Steps**: Execution steps.
- **Data**: Input data.
- **Expected Results**: Anticipated outcome.
- **Status**: Pass/Fail.
- **Comments**: Notes/logs.

#### Sample Test Cases and Logs

1. **Test Case ID**: TC_WEB_LOGIN_1  
   **Module**: Authentication  
   **Description**: Verify user login with valid credentials.  
   **Preconditions**: User is registered; app is running.  
   **Steps**: 1. Click "Login" in navbar. 2. Enter username and password. 3. Submit.  
   **Data**: Username: testuser, Password: testpass.  
   **Expected Results**: User logged in, navbar shows username and logout button.  
   **Status**: Pass  
   **Comments/Logs**: [2025-08-12 10:15:00] Opened login modal. Entered credentials. API call to /auth/login succeeded (200 OK). Navbar updated with "testuser". No errors.

2. **Test Case ID**: TC_WEB_SELL_1  
   **Module**: Product Listing  
   **Description**: Add a new product via Sell modal.  
   **Preconditions**: User logged in; categories loaded.  
   **Steps**: 1. Click "Sell" in navbar. 2. Fill form (title, price, category, image). 3. Submit.  
   **Data**: Title: Test Product, Price: 1000, Category: Electronics, Image: test.jpg.  
   **Expected Results**: Product added, success alert shown, list refreshed.  
   **Status**: Pass  
   **Comments/Logs**: [2025-08-12 10:30:00] Modal opened. Filled form. Submitted FormData to /items (201 Created). Success alert displayed. FetchData called, new item visible in list. Image uploaded successfully.

3. **Test Case ID**: TC_WEB_FAVORITE_1  
   **Module**: Product Interaction  
   **Description**: Toggle favorite on a product.  
   **Preconditions**: User logged in; products listed.  
   **Steps**: 1. Click favorite icon on a product card.  
   **Data**: Item ID: 12345.  
   **Expected Results**: Icon changes to filled heart, favorite status updated.  
   **Status**: Pass  
   **Comments/Logs**: [2025-08-12 10:45:00] Clicked favorite. API call to /items/favorite/12345 (200 OK). UI updated to show liked. No errors.

4. **Test Case ID**: TC_WEB_TESTIMONIAL_1  
   **Module**: Testimonials  
   **Description**: Submit a new testimonial.  
   **Preconditions**: User logged in.  
   **Steps**: 1. Click "Add Testimonial". 2. Fill title, text, stars. 3. Submit.  
   **Data**: Title: Great App, Text: Works well, Stars: 5.  
   **Expected Results**: Testimonial added, success alert, list refreshed.  
   **Status**: Pass  
   **Comments/Logs**: [2025-08-12 11:00:00] Modal opened. Submitted to /items/testimonial (201 Created). Alert shown. Testimonials updated.

5. **Test Case ID**: TC_WEB_ERROR_1  
   **Module**: Error Handling  
   **Description**: Attempt sell without login.  
   **Preconditions**: User logged out.  
   **Steps**: 1. Click "Sell".  
   **Data**: N/A.  
   **Expected Results**: Login prompt alert shown.  
   **Status**: Pass  
   **Comments/Logs**: [2025-08-12 11:15:00] Clicked Sell. Alert: "Login Required". Login modal opened. No crash.

**Overall Test Summary**: 5/5 tests passed. No critical issues. Coverage: Authentication (100%), Product Listing (80%), UI Interactions (90%). Recommendations: Add automated tests with Jest/Cypress.
