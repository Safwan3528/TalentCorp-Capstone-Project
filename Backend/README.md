# ExpenseTracker Application

A RESTful API backend for managing personal expenses built with Spring Boot.

## Features

- User registration and authentication with JWT
- CRUD operations for expenses
- Secure API endpoints with Spring Security
- Hibernate/JPA entity relationships
- Comprehensive unit and integration tests

## Technology Stack

- **Java 17**
- **Spring Boot 3.5.0**
- **Spring Security** (JWT Authentication)
- **Spring Data JPA** (Hibernate)
- **MySQL Database** (Production-ready)
- **JUnit 5** and **Mockito** (Testing)

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user and get JWT token

### Expenses (Requires Authentication)
- `POST /api/expenses` - Create a new expense
- `GET /api/expenses` - Get all expenses for logged-in user
- `GET /api/expenses/{id}` - Get expense by ID
- `PUT /api/expenses/{id}` - Update an expense
- `DELETE /api/expenses/{id}` - Delete an expense

## Database Schema

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

## Entity Relationships

- **One-to-Many**: User → Expenses
  - A User can have many Expenses
  - Each Expense belongs to one User

## Security

- JWT-based authentication
- Password encryption using BCrypt
- Protected endpoints require valid JWT token
- Users can only access their own expenses

## Getting Started

### Prerequisites
- Java 17 or higher
- Maven 3.6 or higher
- MySQL 8.0 or higher

### Running the Application

1. **Setup MySQL Database:**
   ```bash
   # Create database
   mysql -u root -p -e "CREATE DATABASE expense_tracker_db;"
   
   # Or use Docker (recommended for development)
   docker-compose up -d
   ```

2. **Configure Database Connection:**
   Update `src/main/resources/application.properties` with your MySQL credentials:
   ```properties
   spring.datasource.username=your_mysql_username
   spring.datasource.password=your_mysql_password
   ```

3. **Run the application:**
   ```bash
   mvn spring-boot:run
   ```

The application will start on `http://localhost:8080`

### Database Setup Options

#### Option 1: Local MySQL Installation
1. Install MySQL Server
2. Create database: `CREATE DATABASE expense_tracker_db;`
3. Update application.properties with credentials

#### Option 2: Docker (Recommended)
Use the provided `docker-compose.yml`:
```bash
docker-compose up -d
```
This will start:
- MySQL database on port 3306
- phpMyAdmin on port 8081 (http://localhost:8081)

### Testing

Run all tests:
```bash
mvn test
```

### Database Access

Access phpMyAdmin (if using Docker): `http://localhost:8081`
- **Username**: `root`
- **Password**: `rootpassword`

Database connection details:
- **Host**: `localhost`
- **Port**: `3306`
- **Database**: `expense_tracker_db`

## API Usage Examples

### 1. Register a User
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "password": "password123"
  }'
```

### 3. Create an Expense (with JWT token)
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

### 4. Get All Expenses
```bash
curl -X GET http://localhost:8080/api/expenses \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Test Coverage

The application includes comprehensive tests:

### Controller Tests (`@WebMvcTest`)
- `ExpenseControllerTest` - Tests all expense endpoints
- `AuthControllerTest` - Tests authentication endpoints

### Service Tests (`@ExtendWith(MockitoExtension.class)`)
- `ExpenseServiceTest` - Tests expense business logic

### Security Tests
- `UserDetailsServiceImplTest` - Tests user authentication
- `SecurityIntegrationTest` - Tests security configuration

### Test Structure
```
src/test/java/
├── controller/
│   ├── ExpenseControllerTest.java
│   └── AuthControllerTest.java
├── service/
│   └── ExpenseServiceTest.java
└── security/
    ├── UserDetailsServiceImplTest.java
    └── SecurityIntegrationTest.java
```

## Architecture

The application follows a layered architecture:

1. **Controller Layer** - REST endpoints
2. **Service Layer** - Business logic
3. **Repository Layer** - Data access
4. **Entity Layer** - JPA entities
5. **Security Layer** - Authentication and authorization

## Error Handling

The application handles common scenarios:
- User not found
- Expense not found or access denied
- Invalid credentials
- Validation errors
- Unauthorized access attempts

## Configuration

Key configuration in `application.properties`:
- MySQL database settings
- JWT secret and expiration
- JPA/Hibernate settings
- Server port

### Environment-Specific Configuration

The application supports multiple environments:
- `application.properties` - Base configuration
- `application-dev.properties` - Development settings
- `application-prod.properties` - Production settings

To run with specific profile:
```bash
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

All endpoints (except authentication) are secured and require a valid JWT token.

## 🔗 Frontend Integration

This backend is fully compatible with React.js frontends. Key integration points:

### API Base URL
```javascript
baseURL: "http://localhost:8080/api"
```

### CORS Configuration
- Allows React dev server: `http://localhost:3000`
- Supports all HTTP methods: GET, POST, PUT, DELETE, OPTIONS
- Credentials and Authorization headers enabled

### Authentication Flow
1. **Register**: POST `/api/auth/register` → `{"message": "User registered successfully"}`
2. **Login**: POST `/api/auth/login` → `{"token": "jwt_token", "type": "Bearer", "username": "user"}`
3. **Protected Routes**: Include `Authorization: Bearer <token>` header

### Response Formats
- **Success**: JSON objects with data
- **Errors**: JSON objects with error messages
- **Timestamps**: ISO 8601 format (LocalDateTime)
- **Amounts**: Decimal precision (BigDecimal)

### Import Postman Collection
Import `ExpenseTracker-Postman-Collection.json` untuk testing lengkap semua endpoints.

## Database Features

### Data Persistence
- **Production-ready**: Data persists between application restarts
- **ACID Compliance**: Full transactional support
- **Scalability**: Better performance for large datasets
- **Backup Support**: Standard MySQL backup and recovery

### JPA/Hibernate Configuration
- **DDL Mode**: `update` - preserves existing data
- **Dialect**: MySQL8Dialect for optimal performance
- **Connection Pool**: HikariCP for efficient connection management
- **Timezone**: UTC for consistent timestamp handling

### Database Schema Management
Tables are automatically created by Hibernate based on JPA entities:
- `users` table for user authentication
- `expenses` table for expense records
- Foreign key relationships maintained automatically
