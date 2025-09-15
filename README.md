# CRM Platform Backend

This is the backend for the CRM Platform application. This README provides information on setting up the project locally, understanding its architecture, the technologies used, and any known limitations.

## Table of Contents
- [Local Setup Instructions](#local-setup-instructions)
- [Architecture Diagram](#architecture-diagram)
- [Summary of AI Tools and Other Tech Used](#summary-of-ai-tools-and-other-tech-used)
- [Known Limitations or Assumptions](#known-limitations-or-assumptions)

## Local Setup Instructions

To get the CRM Platform Backend up and running on your local machine, follow these instructions.

**Prerequisites:**

*   **Node.js** (LTS recommended): JavaScript runtime environment.
*   **npm** (comes with Node.js): Package manager for Node.js.
*   **MongoDB**: A local or cloud instance of MongoDB for data storage.

**Steps:**

1.  **Clone the repository:**
    ```bash
    git clone <repository_url>
    cd crm-platform/backend
    ```
    (Replace `<repository_url>` with the actual URL of your repository.)

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the `backend` directory by copying `env.example`.
    
    Example `.env` content:
    ```
    MONGO_URL=mongodb://localhost:27017/crm-platform
    GOOGLE_CLIENT_ID=your_google_client_id_here
    GOOGLE_CLIENT_SECRET=your_google_client_secret_here
    PORT=5002
    SESSION_SECRET=a_very_secret_key_for_sessions
    # GOOGLE_API_KEY=your_google_gemini_api_key_here
    ```
    *   **`MONGO_URL`**: Connection string for your MongoDB instance.
    *   **`GOOGLE_CLIENT_ID`**: Your Google OAuth Client ID.
    *   **`GOOGLE_CLIENT_SECRET`**: Your Google OAuth Client Secret.
    *   **`PORT`**: The port on which the server will run (default: `5002`).
    *   **`SESSION_SECRET`**: A strong, random string used to sign the session ID cookie. **Change this for production.**
    *   **`GOOGLE_API_KEY`**: (Optional) Your Google Gemini API key if AI integration is enabled (uncomment and replace).

4.  **Start MongoDB:**
    Ensure your MongoDB instance is running and accessible at the `MONGO_URL` specified in your `.env` file.

5.  **Run the application:**
    To start the server in production mode:
    ```bash
    npm start
    ```
    To start the server in development mode (with `nodemon` for automatic restarts):
    ```bash
    npm run dev
    ```

## Architecture Diagram

The CRM Platform Backend follows a layered architecture, primarily built using the Express.js framework.

```
+------------+     +-------------------+     +---------------------+     +-----------------+     +----------+
|   Client   | <-> |       Routes      | <-> |      Middleware     | <-> |    Controllers    | <-> |  Models  | <-> MongoDB
+------------+     +-------------------+     +---------------------+     +-----------------+     +----------+
                           ^      |                    |                              ^
                           |      |                    |                              |
                           |      +--------------------+------------------------------+
                           |                           |
                           +---------------------------+
                                  (Authentication - Passport.js / Google OAuth2)

+-------------------+
| AI Integration    |
| (Python/FastAPI)  | <------------------------------------------------------------------+
+-------------------+                                                                    |
                                                                                         |
                                         (API calls to AI service from Controllers/Routes)
```

**Key Components:**

*   **Client:** Frontend application that interacts with the backend via RESTful APIs.
*   **Routes:** Define API endpoints (e.g., `/api/customers`, `/api/orders`, `/auth/google`) and delegate incoming requests to the appropriate controllers.
*   **Middleware:**
    *   `express.json()`: Parses incoming JSON request bodies.
    *   `express-session`: Manages user sessions.
    *   `passport.initialize()`, `passport.session()`: Initializes and utilizes Passport.js for authentication.
    *   `cors`: Handles Cross-Origin Resource Sharing, configured to allow requests from `http://localhost:5173`.
    *   `isLoggedIn`: A custom middleware to ensure a user is authenticated before accessing protected routes.
*   **Authentication (Passport.js with Google OAuth2):** Handles user login and session management through Google's OAuth2 provider.
*   **Controllers:** Implement the core business logic for processing requests, interacting with data models, and preparing responses.
*   **Models:** Define the schema and provide an interface for interacting with the MongoDB database using Mongoose.
*   **AI Integration (Python/FastAPI):** A separate Python service built with FastAPI that provides AI-driven functionalities, such as generating customer segmentation rules. The Node.js backend communicates with this service via HTTP requests.
*   **MongoDB:** The primary NoSQL database used for persistent storage of application data.

## Summary of AI Tools and Other Tech Used

This project leverages a combination of Node.js and Python technologies to deliver its functionalities.

**Backend Technologies (Node.js):**

*   **Node.js**: The JavaScript runtime powering the backend server.
*   **Express.js**: A minimalist web framework used to build the RESTful APIs.
*   **MongoDB**: A NoSQL database used for flexible and scalable data storage.
*   **Mongoose**: An elegant MongoDB object data modeling (ODM) library for Node.js, simplifying database interactions.
*   **Passport.js**: Authentication middleware, specifically configured for Google OAuth2 for secure user authentication.
*   **dotenv**: Used to load environment variables from a `.env` file, managing sensitive configuration.
*   **CORS**: Middleware enabling secure communication between the frontend and backend by handling Cross-Origin Resource Sharing policies.
*   **axios**: A promise-based HTTP client used for making requests to external services or internal AI services.
*   **express-session**: Middleware for managing user sessions within the Express application.
*   **nodemon**: A development utility that automatically restarts the Node.js server upon file changes, enhancing developer productivity.

**AI Integration (Python):**

*   **Python**: The programming language used for the AI service.
*   **FastAPI**: A modern, high-performance web framework for building APIs with Python, utilized for the AI microservice.
*   **Pydantic**: A data validation and settings management library, used in FastAPI for defining request and response models.
*   **LangChain**: A framework designed to streamline the development of applications powered by large language models (LLMs).
*   **Groq (llama-3.3-70b-versatile)**: The specific Large Language Model (LLM) employed within the AI service to process natural language queries and generate structured campaign rules.

## Known Limitations or Assumptions

*   **Session Secret Security**: The `SESSION_SECRET` in the `.env` file should be a strong, randomly generated string and kept secure. Using a default or weak secret can compromise application security in production environments.
*   **Google OAuth2 Dependency**: The current authentication mechanism is solely based on Google OAuth2. There are no alternative authentication methods (e.g., email/password), which might limit user registration options.
*   **CORS Configuration**: The CORS policy is currently configured to allow requests specifically from `http://localhost:5173`. For deployment, this origin should be updated to match the actual domain of the frontend application.
*   **AI Model External Dependency**: The AI integration's functionality is dependent on the availability and performance of the Groq API and the `llama-3.3-70b-versatile` model. Disruptions to this external service will impact AI features.
*   **Error Handling Robustness**: While `express-async-handler` is used to simplify error handling in asynchronous routes, a comprehensive review of error logging, user-friendly error responses, and graceful degradation strategies should be considered for production.
*   **Scalability for High Traffic**: The current backend architecture is set up for a single instance. For applications expecting high traffic, implementing load balancing and considering horizontal scaling strategies for both the Node.js and FastAPI services would be necessary.
*   **Database Seeding Process**: While a `seed.js` script exists, its usage and the expected data it populates are not explicitly documented. Users might need to investigate this script for initial data setup.
*   **AI Rule Generation Scope**: The AI is specifically trained and configured to convert natural language queries into structured JSON objects for customer segmentation rules based on predefined fields (`totalSpend`, `visits`, `lastPurchaseDate`) and operators. It may not effectively handle queries outside this defined scope.
*   **Lack of Rate Limiting**: The backend does not appear to have rate-limiting implemented on its API endpoints. This could make the application susceptible to abuse, such as brute-force attacks or denial-of-service attempts.
