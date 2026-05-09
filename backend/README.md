# Spring Boot 3 Backend Application

A clean Spring Boot 3 + Maven backend project with JWT authentication, MySQL integration, and security.

## Project Structure

```
src/main/
├── java/com/example/app/
│   ├── config/              # Spring configuration classes
│   ├── security/            # JWT and security utilities
│   ├── entity/              # JPA entities
│   ├── repository/          # Spring Data repositories
│   ├── service/             # Service interfaces
│   ├── service/impl/        # Service implementations
│   ├── controller/          # REST controllers
│   ├── dto/
│   │   ├── request/         # Request DTOs
│   │   └── response/        # Response DTOs
│   ├── exception/           # Custom exceptions and handlers
│   └── Application.java     # Main entry point
└── resources/
    └── application.yml      # Application configuration
```

## Technologies

- Java 17
- Spring Boot 3.2.0
- Spring Security
- Spring Data JPA
- MySQL 8
- JWT (JJWT)
- Lombok
- Maven

## Setup

### Prerequisites

- Java 17+
- Maven 3.8+
- MySQL 8

### Configuration

1. Update `application.yml` with your MySQL credentials:
   ```yaml
   datasource:
     url: jdbc:mysql://localhost:3306/app_db
     username: your_username
     password: your_password
   ```

2. Change JWT secret in `application.yml`:
   ```yaml
   jwt:
     secret: your-secret-key-here-change-in-production
   ```

### Build and Run

```bash
# Build the project
mvn clean install

# Run the application
mvn spring-boot:run
```

The application will start on `http://localhost:8080`

## API Endpoints

### Authentication

- **Register**: `POST /api/auth/register`
- **Login**: `POST /api/auth/login`

### Users

- **Get User by ID**: `GET /api/users/{userId}`
- **Get User by Username**: `GET /api/users/username/{username}`
- **Delete User**: `DELETE /api/users/{userId}`

## Features

- JWT-based authentication
- Spring Security integration
- Global exception handling
- Input validation
- MySQL database persistence
- CORS support
- Lombok for boilerplate reduction

## Dependencies

Main dependencies in `pom.xml`:
- Spring Boot Web Starter
- Spring Boot Data JPA
- Spring Security
- MySQL Connector
- JJWT (JWT library)
- Lombok

## License

This project is open source.
