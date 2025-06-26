# ExpenseTracker Fullstack Application

A modern, full-featured personal expense tracker with a **React.js frontend** and a **Spring Boot backend**.

---

![capstone 1](https://github.com/user-attachments/assets/f4002dc9-4a48-4c6e-94a6-bf3c26cb92eb)

![capstone 2](https://github.com/user-attachments/assets/938ff138-298e-48b6-8504-127156e753ab)

![capstone 3](https://github.com/user-attachments/assets/bcaa67d8-ca8b-4f48-a138-e56e49ccfd4d)

![capstone 4](https://github.com/user-attachments/assets/0b845537-264e-4caf-a303-fb3838ab3c67)

![capstone 5](https://github.com/user-attachments/assets/5fbc86f4-9766-4443-bd4f-b0322f138de8)

![capstone 6](https://github.com/user-attachments/assets/19d62848-5f0a-40e0-b4a5-abd9468d5c6d)

![capstone 7](https://github.com/user-attachments/assets/c946ce1e-b1a6-495a-8cd4-118b10dabb22)

![capstone 8](https://github.com/user-attachments/assets/c8f21441-8600-4509-b988-db6d5d1aeb12)

![capstone 11](https://github.com/user-attachments/assets/df6ebef0-6e8c-4c05-b2ea-e5371aaf8da6)

![capstone 9](https://github.com/user-attachments/assets/9e678692-40d6-44fd-bfb8-1e45845d0b50)

![capstone 10](https://github.com/user-attachments/assets/c85996ec-3313-448c-91c0-060c400933b3)


---

## 🚀 Features

- User registration & authentication (JWT)
- CRUD operations for expenses
- Secure API endpoints (Spring Security)
- Responsive, modern UI (Bootstrap 5)
- Weekly, monthly, and category analytics with charts
- Dark/Light mode toggle
- Comprehensive unit & integration tests (backend)

---

## 🏗️ Technology Stack

### Backend
- **Java 17**
- **Spring Boot 3.5.0**
- **Spring Security** (JWT)
- **Spring Data JPA** (Hibernate)
- **H2 Database** (In-Memory)
- **JUnit 5**, **Mockito** (Testing)

### Frontend
- **React 19.1.0**
- **React Router 7.6.2**
- **Axios 1.10.0**
- **Bootstrap 5.3.7** & **Bootstrap Icons**
- **Chart.js 4.4.0** & **React ChartJS 2**
- **JWT Authentication**
- **Dark/Light Theme**

---

## 📦 Project Structure

```
backend/ (Spring Boot)
frontend/ (React)
```

---

## ⚙️ Backend API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user and get JWT token

### Expenses (Requires Authentication)
- `POST /api/expenses` - Create a new expense
- `GET /api/expenses` - Get all expenses for logged-in user
- `GET /api/expenses/{id}` - Get expense by ID
- `PUT /api/expenses/{id}` - Update an expense
- `DELETE /api/expenses/{id}` - Delete an expense

---

## 🗄️ Database Schema

### User Entity
- id (Primary Key)
- username (Unique)
- email (Unique)
- password (Encoded)
- createdAt
- updatedAt

### Expense Entity
- id (Primary Key)
- title
- description
- amount
- category
- expenseDate
- createdAt
- updatedAt
- user_id (Foreign Key to User)

---

## 🔐 Security
- JWT-based authentication
- Password encryption using BCrypt
- Protected endpoints require valid JWT token
- Users can only access their own expenses

---

## 🖥️ Frontend Features

- **Authentication**: Register, Login, Logout
- **Dashboard**: Expense summary, quick add, recent expenses
- **Expense CRUD**: Add, edit, delete, view details
- **Analytics**: Weekly, monthly, and category charts (line, bar, pie)
- **Dark/Light Mode**: Theme toggle with persistence
- **User Personalization**: Welcome message in navbar
- **Responsive Design**: Mobile and desktop friendly

---

## 📊 Analytics & Charts
- **Daily/Weekly/Monthly Trends**: Line & bar charts
- **Category Breakdown**: Pie chart
- **Spending Insights**: Current vs previous period, top category, daily average
- **Time Filters**: All time, last 30 days, last 3 months, last year

---

## 🛣️ How to Run

### Backend (Spring Boot)
1. Install Java 17+ & Maven 3.6+
2. `cd backend`
3. `mvn spring-boot:run`
4. API runs at `http://localhost:8080`

![Capstone Backend Run](https://github.com/user-attachments/assets/0cda6a11-47a0-4582-b13e-5c2e01b0e469)

![Capstone Backend Run 1](https://github.com/user-attachments/assets/36521e89-d413-4fa8-a71a-b29432a03efd)



### Frontend (React)
1. Install Node.js 16+
2. `cd frontend`
3. `npm install`
4. `npm start`
5. App runs at `http://localhost:3000`



---

## 🔗 API Usage Examples

### Register
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "password": "password123"
  }'
```

### Create Expense (with JWT)
```bash
curl -X POST http://localhost:8080/api/expenses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Grocery Shopping",
    "description": "Weekly groceries",
    "amount": 150.00,
    "category": "Food",
    "expenseDate": "2024-01-15"
  }'
```

---

## 🧪 Testing

### Backend
- `mvn test` (JUnit, Mockito)
- H2 Console: `http://localhost:8080/h2-console`
- Postman collection available for all endpoints

### Frontend
- `npm test` (React Testing Library)
- Manual UI/UX and integration testing

---

## 🏛️ Architecture

- **Controller Layer**: REST endpoints
- **Service Layer**: Business logic
- **Repository Layer**: Data access
- **Entity Layer**: JPA entities
- **Security Layer**: Authentication and authorization

---

## ⚠️ Error Handling
- User not found
- Expense not found or access denied
- Invalid credentials
- Validation errors
- Unauthorized access attempts

---

## ⚙️ Configuration
- API base URL: `http://localhost:8080/api`
- CORS enabled for `http://localhost:3000`
- JWT secret, expiration, and DB settings in `application.properties`

---

## 📚 Documentation & Resources
- Full API docs in backend `/docs` (if enabled)
- Postman collection: `ExpenseTracker-Postman-Collection.json`
- Frontend and backend README files for each module
- See `SUMMARY.md` for full-stack integration details

---

## 📝 License
MIT

---

**ExpenseTracker is a modern, secure, and extensible fullstack solution for personal finance management.**
