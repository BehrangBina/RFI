```mermaid
graph TB
    subgraph "Frontend - React Application"
        A[User Interface] --> B[Pages/Components]
        B --> C[Custom Hooks<br/>useFetch, usePost]
        C --> D[API Service Layer]
        D --> E[Environment Config]
    end

    subgraph "Backend - Clean Architecture"
        F[Controllers<br/>Thin Orchestrators] --> G[Service Layer<br/>Business Logic]
        G --> H[Repository Layer<br/>Data Access]
        H --> I[DbContext<br/>Entity Framework]
        I --> J[(Database)]
    end

    D -.HTTP Requests.-> F
    
    subgraph "SOLID Principles Applied"
        K[Single Responsibility<br/>Each class has one job]
        L[Open/Closed<br/>Extend without modifying]
        M[Liskov Substitution<br/>Implementations interchangeable]
        N[Interface Segregation<br/>Focused interfaces]
        O[Dependency Inversion<br/>Depend on abstractions]
    end

    style A fill:#e1f5ff
    style B fill:#e1f5ff
    style C fill:#b3e5fc
    style D fill:#81d4fa
    style E fill:#4fc3f7

    style F fill:#fff9c4
    style G fill:#fff59d
    style H fill:#ffee58
    style I fill:#fdd835
    style J fill:#fbc02d

    style K fill:#c8e6c9
    style L fill:#a5d6a7
    style M fill:#81c784
    style N fill:#66bb6a
    style O fill:#4caf50
```

# Architecture Diagram

## Layer Responsibilities

### Frontend Layers
1. **User Interface**: React components, routing, presentation
2. **Custom Hooks**: Reusable logic for data fetching and state management
3. **API Service**: Centralized API communication with interceptors
4. **Environment Config**: Configuration management for different environments

### Backend Layers
1. **Controllers**: Handle HTTP requests, validation, and response formatting
2. **Service Layer**: Business logic, domain rules, orchestration
3. **Repository Layer**: Data access abstraction, CRUD operations
4. **DbContext**: Entity Framework Core, database connection
5. **Database**: Data persistence

## Communication Flow

**Request Flow:**
```
User Action → Component → Custom Hook → API Service → HTTP Request 
    → Controller → Service → Repository → DbContext → Database
```

**Response Flow:**
```
Database → DbContext → Repository → Service → DTO → Controller 
    → JSON Response → API Service → Custom Hook → Component → UI Update
```

## Key Benefits

✅ **Separation of Concerns**: Each layer has a distinct responsibility  
✅ **Loose Coupling**: Layers communicate through interfaces  
✅ **High Testability**: Each layer can be tested independently  
✅ **Easy Maintenance**: Changes isolated to specific layers  
✅ **Scalability**: Easy to add new features following established patterns  
