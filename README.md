HNG Stage 0 Express Server

A simple yet secure **Node.js/Express** server built for the **HNG Internship**, designed to demonstrate essential backend principles — including rate limiting, environment configuration, API consumption, and graceful error handling.  

This project exposes a `/me` endpoint that returns basic user information along with a random cat fact from the [catfact.ninja API](https://catfact.ninja).

---

## Features

- **Express.js** server with modern middleware setup  
- **Secure** by default using [Helmet](https://www.npmjs.com/package/helmet)  
- **Rate limiting** to prevent abuse (via [express-rate-limit](https://www.npmjs.com/package/express-rate-limit))  
- **CORS enabled** for safe cross-origin access  
- **HTTP request logging** with [Morgan](https://www.npmjs.com/package/morgan)  
- **Environment variable management** with [dotenv](https://www.npmjs.com/package/dotenv)  
- **External API integration** (Cat Facts API) with graceful timeout and fallback  
- **Healthcheck endpoint** for deployment readiness  

---

## Project Structure

```
project-root/
│
├── .env                 # Environment variables (create this manually)
├── package.json         # Node dependencies and scripts
├── server.js            # Main Express server file
├── README.md            # Documentation
└── node_modules/        # Installed packages (auto-generated)
```

---

## Environment Variables

Create a `.env` file in the project root to configure runtime values.

Example `.env`:

```env
PORT=3000
USER_EMAIL=okeowokabir@gmail.com
USER_FULLNAME=Okeowo Abdulkabir
USER_STACK=Node.js/Express
CATFACT_URL=https://catfact.ninja/fact
CATFACT_TIMEOUT_MS=2500
RATE_LIMIT_WINDOW_MIN=1
RATE_LIMIT_MAX=60
```

All values have sensible defaults, so the app will still run without the `.env` file.

---

## Installation and Setup

Follow these steps to run the project locally:

### 1 Clone the Repository

```bash
git clone https://github.com/your-username/hng-stage0-server.git
cd hng-stage0-server
```

### 2 Install Dependencies

```bash
npm install
```

### 3 Configure Environment

Create a `.env` file in the root directory (optional if you want to override defaults).

### 4 Run the Server

**Development mode (recommended):**

```bash
npm run dev
```

**Production mode:**

```bash
npm start
```

---

## API Endpoints

### **GET /**  
Healthcheck endpoint to verify if the server is up and running.

**Response Example:**
```json
{
  "status": "ok",
  "up": true,
  "timestamp": "2025-10-19T13:22:54.123Z"
}
```

---

### **GET /me**  
Returns user profile data with a random cat fact.

**Response Example:**
```json
{
  "status": "success",
  "user": {
    "email": "okeowokabir@gmail.com",
    "name": "Okeowo Abdulkabir",
    "stack": "Node.js/Express"
  },
  "timestamp": "2025-10-19T13:25:10.987Z",
  "fact": "Cats sleep for 70% of their lives."
}
```

If the Cat Facts API is unreachable, a fallback message is returned:
```json
{
  "fact": "Could not fetch a cat fact right now — try again in a moment."
}
```

---

## Notes & Design Considerations

- **Timeouts & retries:**  
  External API calls are timed out after `CATFACT_TIMEOUT_MS` milliseconds, with automatic retries during warmup.

- **Performance:**  
  Persistent HTTPS Agent keeps sockets alive for faster API requests.

- **Security:**  
  Uses Helmet and CORS middleware to protect HTTP headers and enable safe client access.

- **Error handling:**  
  Graceful 404 and internal error responses are implemented.

---

## Testing the API

Once the server is running:

Visit in your browser or API client (like Postman):

```
http://localhost:3000/me
```

You should see a JSON response containing your user info and a cat fact.

---

## Built With

- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [Axios](https://axios-http.com/)
- [Helmet](https://www.npmjs.com/package/helmet)
- [CORS](https://www.npmjs.com/package/cors)
- [Morgan](https://www.npmjs.com/package/morgan)
- [express-rate-limit](https://www.npmjs.com/package/express-rate-limit)
- [dotenv](https://www.npmjs.com/package/dotenv)

---

##  Author

**Okeowo Abdulkabir**  
📧 [okeowokabir@gmail.com](mailto:okeowokabir@gmail.com)  
💻 Stack: Node.js / Express

---

## License

This project is licensed under the [MIT License](LICENSE).

---

> “Code simply, secure smartly, and document thoroughly.”
