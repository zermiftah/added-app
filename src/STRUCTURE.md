# src/ Structure

```
src/
├── lib/
│   └── api.js                    # Base fetch utility (mirrors sh-extranet networking.js)
│
├── stores/
│   └── adminStore.js             # Zustand store (persist + immer) for admin session
│
├── providers/
│   └── QueryProvider.jsx         # TanStack QueryClient provider
│
├── hooks/
│   └── useToast.js               # Shared toast hook
│
├── ui/                           # Reusable UI primitives (used across user + admin)
│   ├── Button/
│   ├── Input/
│   ├── Select/
│   ├── TextArea/
│   ├── Modal/
│   ├── Badge/
│   ├── Spinner/
│   ├── Toast/
│   ├── RichEditor/
│   └── index.js                  # Barrel export: import { Button, Modal } from "ui"
│
├── features/
│   ├── user/                     # Public-facing pages
│   │   ├── home/
│   │   │   └── HomePage.jsx
│   │   ├── events/
│   │   │   ├── api/
│   │   │   │   ├── events-api.js
│   │   │   │   ├── events-queries.js
│   │   │   │   └── events-types.js
│   │   │   └── EventsPage.jsx
│   │   ├── careers/
│   │   │   ├── api/
│   │   │   │   ├── careers-api.js
│   │   │   │   ├── careers-queries.js
│   │   │   │   └── careers-types.js
│   │   │   ├── CareersListPage.jsx
│   │   │   ├── CareerDetailPage.jsx
│   │   │   └── CareerApplyPage.jsx
│   │   ├── resources/
│   │   │   ├── api/
│   │   │   │   ├── resources-api.js
│   │   │   │   ├── resources-queries.js
│   │   │   │   └── resources-types.js
│   │   │   ├── ResourcePage.jsx
│   │   │   └── ResourceDetail.jsx
│   │   └── programs/
│   │       ├── AddedArtsPage.jsx
│   │       └── TutoringPage.jsx
│   │
│   └── admin/                    # Admin dashboard
│       ├── AddedAdmin.jsx         # Entry: token guard → AdminLayout + panel routing
│       ├── auth/
│       │   ├── AdminLogin.jsx
│       │   └── api/
│       │       ├── auth-api.js
│       │       ├── auth-queries.js
│       │       └── auth-types.js
│       ├── jobs/
│       │   ├── AdminJobs.jsx
│       │   └── api/
│       │       ├── jobs-api.js
│       │       ├── jobs-queries.js
│       │       └── jobs-types.js
│       ├── applicants/
│       │   ├── AdminApplicants.jsx
│       │   └── api/
│       │       ├── applicants-api.js
│       │       ├── applicants-queries.js
│       │       └── applicants-types.js
│       ├── articles/
│       │   ├── AdminArticles.jsx
│       │   └── api/
│       │       ├── articles-api.js
│       │       ├── articles-queries.js
│       │       └── articles-types.js
│       ├── authors/
│       │   ├── AdminAuthors.jsx
│       │   └── api/
│       │       ├── authors-api.js
│       │       ├── authors-queries.js
│       │       └── authors-types.js
│       └── shared/
│           └── layout/
│               └── AdminLayout.jsx  # Sidebar reads/writes Zustand directly
│
├── components/                   # Legacy shared components (Navbar, Footer, sections)
│
└── App.jsx                       # Root: QueryProvider → BrowserRouter → Routes
```

## Patterns

### API Layer (per feature)
- `*-types.js`   → JSDoc @typedef only, no runtime code
- `*-api.js`     → pure async functions, import { fetchData } from "lib/api"
- `*-queries.js` → TanStack hooks (useQuery / useMutation), read token from Zustand

### State
- `useAdminStore` (Zustand + persist + immer) → token, activeNav
- TanStack Query → all server state (fetch, cache, invalidate)

### UI imports
```js
import { Button, Modal, Badge, Spinner, Toast, RichEditor } from "ui"
```

### Vite aliases
```
features → src/features
ui       → src/ui
stores   → src/stores
providers→ src/providers
hooks    → src/hooks
lib      → src/lib
```
