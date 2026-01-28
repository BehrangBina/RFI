# Frontend Architecture Documentation

## Folder Structure
```
src/
├── components/
│   ├── common/           # Reusable UI components
│   │   └── UIComponents.js
│   └── Navbar.js
├── pages/                # Page components (route handlers)
├── services/             # API service layer
│   └── api.js
├── hooks/                # Custom React hooks
│   └── useApi.js
├── config/               # Configuration files
│   └── environment.js
├── constants/            # Application constants
│   └── index.js
└── App.js
```

## Architecture Principles Applied

### 1. **Separation of Concerns**
- **Components**: Pure presentational logic
- **Pages**: Route handlers that compose components
- **Services**: API communication layer
- **Hooks**: Reusable stateful logic
- **Config**: Environment and application configuration

### 2. **Single Responsibility**
- Each hook handles one concern (API calls, state management)
- Services organized by domain (events, donations, posters)
- Common components are atomic and reusable

### 3. **Dependency Inversion**
- Components depend on service abstractions (api.js)
- Services use configuration abstractions (environment.js)
- Constants centralized for easy modification

### 4. **Open/Closed Principle**
- API services easily extensible without modification
- Custom hooks can be composed for new use cases
- Common components accept props for customization

## Key Improvements

### Custom Hooks (`useApi.js`)
- **useFetch**: Handles GET requests with loading/error states
- **usePost**: Handles POST requests with loading/error/success states
- Eliminates repetitive useState/useEffect patterns
- Provides consistent error handling

### Common Components (`UIComponents.js`)
- **LoadingSpinner**: Reusable loading indicator
- **ErrorMessage**: Consistent error display
- **EmptyState**: Reusable empty state UI
- DRY principle applied across all pages

### Environment Configuration (`environment.js`)
- Separate dev/prod configurations
- Environment variable support
- Easy to extend for staging/QA environments

### Constants (`constants/index.js`)
- Centralized route definitions
- API endpoint templates
- Animation variants for consistency
- Single source of truth

## Usage Examples

### Using Custom Hooks
```javascript
// In any component
const { data, loading, error } = useFetch(() => eventsAPI.getAll());

// For POST requests
const { post, loading, error } = usePost();
const handleSubmit = async (formData) => {
  await post(donationsAPI.create, formData);
};
```

### Adding New API Endpoints
```javascript
// 1. Add to constants/index.js
export const API_ENDPOINTS = {
  COMMENTS: {
    ALL: '/comments',
    BY_ID: (id) => `/comments/${id}`,
  },
};

// 2. Add to services/api.js
export const commentsAPI = {
  getAll: () => api.get(API_ENDPOINTS.COMMENTS.ALL),
  getById: (id) => api.get(API_ENDPOINTS.COMMENTS.BY_ID(id)),
};

// 3. Use in components
const { data: comments } = useFetch(() => commentsAPI.getAll());
```

## Benefits

1. **Maintainability**: Changes to API structure require updates in one place
2. **Testability**: Services and hooks can be mocked easily
3. **Scalability**: New features follow established patterns
4. **Consistency**: All pages use same loading/error handling
5. **Type Safety**: Constants prevent typos in routes/endpoints
6. **Developer Experience**: Less boilerplate, more focus on features
