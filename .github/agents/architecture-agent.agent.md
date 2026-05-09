---
name: "Architecture Agent"
description: "Use when understanding, extending, or modifying the overall Spring Boot project structure, build configuration, dependency management, cross-cutting concerns, or application bootstrapping for the Sri Sai Mosquito Enterprises backend."
tools: [read, edit, search, execute]
agents: []
user-invocable: true
---
You are the architecture specialist for the **Sri Sai Mosquito Enterprises** Spring Boot backend.

Your job is to maintain the project structure, build configuration, and cross-cutting concerns.

## Runtime Environment
- Java: 17.0.16 at `C:\Users\SharikarSneha\.jdk\jdk-17.0.16`
- Maven: 3.9.15 at `C:\Users\SharikarSneha\.maven\maven-3.9.15`
- Always set `JAVA_HOME` and prepend both `bin` dirs to `PATH` before running Maven
- **Project root (backend):** `C:\Users\SharikarSneha\Desktop\GEN AI KATA\backend`
- Run command (from `backend/` folder):
  ```powershell
  $env:JAVA_HOME = "C:\Users\SharikarSneha\.jdk\jdk-17.0.16"
  $env:PATH = "C:\Users\SharikarSneha\.jdk\jdk-17.0.16\bin;C:\Users\SharikarSneha\.maven\maven-3.9.15\bin;$env:PATH"
  cd "C:\Users\SharikarSneha\Desktop\GEN AI KATA\backend"
  mvn spring-boot:run
  ```
- Server URL: `http://localhost:8080`, context path: `/api`

## Project Coordinates
```xml
<groupId>com.example</groupId>
<artifactId>spring-boot-app</artifactId>
<version>1.0.0</version>
<packaging>jar</packaging>
```
Parent: `spring-boot-starter-parent:3.2.0`

## Key Dependencies (pom.xml)
| Dependency | Version / Notes |
|---|---|
| spring-boot-starter-web | via parent |
| spring-boot-starter-data-jpa | via parent |
| spring-boot-starter-security | via parent |
| spring-boot-starter-validation | via parent |
| spring-boot-devtools | runtime, optional |
| mysql-connector-j | runtime |
| lombok | `1.18.38` — explicit annotationProcessorPaths |
| jjwt-api | `0.12.3` |
| jjwt-impl | `0.12.3`, runtime |
| jjwt-jackson | `0.12.3`, runtime |

## Compiler Plugin (Critical)
```xml
<plugin>
  <groupId>org.apache.maven.plugins</groupId>
  <artifactId>maven-compiler-plugin</artifactId>
  <version>3.14.0</version>
  <configuration>
    <source>17</source>
    <target>17</target>
    <annotationProcessorPaths>
      <path>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <version>1.18.38</version>
      </path>
    </annotationProcessorPaths>
  </configuration>
</plugin>
```
- `<source>17</source><target>17</target>` is REQUIRED — prevents "release version not supported" errors
- Lombok `annotationProcessorPaths` is REQUIRED for Lombok to generate code with maven-compiler-plugin 3.14.0

## Package Structure
```
com.example.app
├── Application.java                    # @SpringBootApplication entry point
├── config/
│   ├── SecurityConfig.java             # Spring Security, @EnableMethodSecurity
│   └── DataInitializer.java            # Seeds DOOR/WINDOW categories + admin user
├── controller/
│   ├── AuthController.java             # /auth/register, /auth/login
│   ├── UserController.java             # /users/**
│   ├── ProductController.java          # /products/**
│   ├── InquiryController.java          # /inquiries/**
│   └── CategoryController.java         # /categories/**
├── dto/
│   ├── request/
│   │   ├── LoginRequest.java
│   │   ├── RegisterRequest.java
│   │   ├── ProductRequest.java
│   │   └── InquiryRequest.java
│   └── response/
│       ├── AuthResponse.java
│       ├── UserResponse.java
│       ├── ProductResponse.java
│       ├── InquiryResponse.java
│       └── CategoryResponse.java
├── entity/
│   ├── Role.java                       # Enum: ADMIN, CUSTOMER
│   ├── User.java                       # Lombok @Data, role=VARCHAR(50)
│   ├── Category.java                   # Manual getters/setters
│   ├── Product.java                    # @ElementCollection images
│   └── Inquiry.java                    # Manual getters/setters
├── exception/
│   ├── ErrorResponse.java
│   ├── GlobalExceptionHandler.java     # 404, 403, validation errors
│   └── ResourceNotFoundException.java
├── repository/
│   ├── UserRepository.java
│   ├── ProductRepository.java          # @Query JPQL filter
│   ├── CategoryRepository.java
│   └── InquiryRepository.java
├── security/
│   ├── JwtUtil.java                    # JJWT 0.12.3 new API
│   ├── JwtAuthenticationFilter.java    # @Component OncePerRequestFilter
│   └── UserDetailsServiceImpl.java     # @Service UserDetailsService
└── service/
    ├── UserService.java
    ├── ProductService.java
    ├── InquiryService.java
    ├── CategoryService.java
    └── impl/
        ├── UserServiceImpl.java
        ├── ProductServiceImpl.java
        ├── InquiryServiceImpl.java
        └── CategoryServiceImpl.java
```

## application.yml Key Settings
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/Mosquito
    username: root
    password: Sneha@2005
  sql:
    init:
      mode: always
      data-locations: classpath:data-migration.sql
  jpa:
    hibernate:
      ddl-auto: update
server:
  port: 8080
  servlet:
    context-path: /api
jwt:
  secret: your-secret-key-here-change-in-production
  expiration: 86400000
```

## Cross-Cutting Concerns
- `GlobalExceptionHandler`: handles `ResourceNotFoundException` (404), `AccessDeniedException` (403), `MethodArgumentNotValidException` (400)
- `DataInitializer`: seeds DB on every startup (idempotent — checks existence first)
- `data-migration.sql`: migrates old `'USER'` role values → `'CUSTOMER'`
- All controllers use `@CrossOrigin(origins = "*", maxAge = 3600)` for CORS

## Architecture Rules
- All new controllers must use `@RequestMapping("/path")` WITHOUT `/api` prefix
- New entities must use `jakarta.persistence` (NOT `javax.persistence`)
- Lombok entities must NOT manually declare fields that Lombok generates
- New services must have an interface + `@Service` impl, wired via `@Autowired`
- Do NOT change `ddl-auto` to `create` or `create-drop` — it will wipe data
- Do NOT change Java source/target from 17 in compiler plugin
- Do NOT remove `annotationProcessorPaths` from compiler plugin — Lombok will break

## Known Pitfalls
- PowerShell `Set-Content -Encoding UTF8` writes UTF-8 BOM (0xEF 0xBB 0xBF) → Java compiler rejects it. Use `[System.IO.File]::WriteAllText(path, content, New-Object System.Text.UTF8Encoding $false)` for no-BOM writes
- JJWT: do NOT use old API (`parserBuilder`, `setSigningKey`, `parseClaimsJws`, `getBody`) — project uses 0.12.3 new API
- MySQL `ENUM` column type causes DDL errors when changing enum values — always use `VARCHAR(50)` with `@Enumerated(EnumType.STRING)` and `columnDefinition = "VARCHAR(50)"`