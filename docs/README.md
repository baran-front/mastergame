# Mastergame Website

A Next.js 16 e-commerce website built with TypeScript, Tailwind CSS, React Query, and React Hook Form.

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Project Structure](#project-structure)
3. [Naming Conventions](#naming-conventions)
4. [Brand System](#brand-system)
5. [API & Data Fetching](#api--data-fetching)
6. [Forms & Validation](#forms--validation)
7. [State Management](#state-management)
8. [Components Guide](#components-guide)
9. [Adding New Features](#adding-new-features)
10. [Common Patterns](#common-patterns)

---

## Getting Started

### Install Dependencies

```bash
npm install
```

### Generate Brand Configuration

Before running the project, you need to generate the brand configuration:

```bash
npm run generate-brand master-game
```

### Run Development Server

```bash
npm run dev
```

### Build for Production

```bash
npm run build
npm start
```

---

## Project Structure

```
mastergame-website/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout (providers, header, footer)
│   ├── page.tsx            # Home page
│   ├── globals.css         # Global styles
│   ├── products/           # Products pages
│   ├── articles/           # Articles pages
│   ├── dashboard/          # User dashboard pages
│   └── ...
│
├── components/             # React components
│   ├── ui/                 # Basic UI components (button, input, etc.)
│   ├── modules/            # Reusable business components
│   ├── templates/          # Page-specific components
│   └── providers/          # Context providers
│
├── lib/                    # Utility functions and helpers
│   ├── api.ts              # Base API fetch function
│   ├── fetchs.ts           # All API fetch functions
│   ├── validations.ts      # All form validation schemas
│   ├── utils.ts            # Utility functions
│   ├── data.ts             # Data transformation helpers
│   └── hooks/              # Custom React hooks
│
├── types/                  # TypeScript type definitions
│   ├── api.types.ts        # API response types
│   └── app.types.ts        # App-specific types
│
├── brands/                 # Brand configuration files
│   ├── master-game.json    # Master Game brand config
│   └── other-brand.json    # Other brand configs
│
├── scripts/                # Build and utility scripts
│   └── generate-brand.ts   # Brand generator script
│
├── public/                 # Static files
│   ├── brands/             # Brand-specific assets (logos, etc.)
│   └── images/             # General images
│
└── brand.ts                # Auto-generated brand config (DO NOT EDIT)
```

---

## Naming Conventions

### Files

| Type | Convention | Example |
|------|------------|---------|
| Pages | `page.tsx` | `app/products/page.tsx` |
| Layouts | `layout.tsx` | `app/dashboard/layout.tsx` |
| Components | `camelCase.tsx` | `productCard.tsx` |
| Hooks | `use{Name}.ts` | `useBasket.ts` |
| Types | `{name}.types.ts` | `api.types.ts` |
| Utilities | `{name}.ts` | `utils.ts` |

### Components

| Type | Naming | Location |
|------|--------|----------|
| UI Components | `{Name}` | `components/ui/` |
| Module Components | `{Name}` | `components/modules/` |
| Template Components | `{Name}` | `components/templates/` |
| Providers | `{Name}Provider` | `components/providers/` |

### Functions & Variables

```typescript
// Functions: camelCase
function getUserData() {}
async function fetchProducts() {}

// Components: PascalCase
function ProductCard() {}
function HeaderLoginButton() {}

// Types: PascalCase with T suffix
type ProductT = {};
type UserT = {};

// Constants: UPPER_SNAKE_CASE
const API_URL = "";
const MAX_ITEMS = 10;
```

---

## Brand System

This project supports multiple brands. Each brand has its own configuration file.

### How It Works

1. **Brand configs** are stored in `/brands/` folder as JSON files
2. **Running the generator** creates `/brand.ts` from the selected config
3. **Components use** `brand` object for brand-specific values

### Brand Config Structure

```json
// brands/my-brand.json
{
  "name": "Brand Name",
  "apiUrl": "https://api.example.com/api",
  "apiHostname": "api.example.com",
  "apiBaseUrl": "https://api.example.com",
  "apiTenant": "tenant-name",
  "apiToken": "your-jwt-token",
  "logoImg": "/brands/my-brand/logo.png",
  "theme": {
    "light": {
      "background": "#ffffff",
      "foreground": "#000000",
      "card": "#f5f5f5",
      "primary": "#3b82f6",
      "secondary": "#10b981"
    },
    "dark": {
      "background": "#1e1e1e",
      "foreground": "#ffffff",
      "card": "#2b2b2b",
      "primary": "#3b82f6",
      "secondary": "#10b981"
    }
  }
}
```

### Switching Brands

```bash
# Generate brand config for "master-game"
npm run generate-brand master-game

# Generate brand config for another brand
npm run generate-brand other-brand
```

### Using Brand in Code

```typescript
import { brand } from "@/brand";

// Access brand values
console.log(brand.name);        // "مستر گیم"
console.log(brand.apiUrl);      // "https://api.arvinvira.com/api"
console.log(brand.theme.light); // { background: "#f2f2f3", ... }
```

### Adding a New Brand

1. Create a new JSON file in `/brands/` folder:
   ```
   brands/new-brand.json
   ```

2. Add brand assets to `/public/brands/new-brand/`:
   ```
   public/brands/new-brand/logo.png
   ```

3. Generate the brand config:
   ```bash
   npm run generate-brand new-brand
   ```

---

## API & Data Fetching

### Base API Setup

All API calls go through `safeFetch` function in `/lib/api.ts`:

```typescript
import { brand } from "@/brand";

export async function safeFetch<T>(endPoint: string, init: RequestInit) {
  const response = await fetch(brand.apiUrl + endPoint, {
    ...init,
    headers: {
      Tenant: brand.apiTenant,
      "Accept-Language": "fa",
      ...init.headers,
    },
  });
  
  return {
    status: response?.status,
    result: await response.json(),
  };
}
```

### Fetch Functions

All fetch functions are in `/lib/fetchs.ts`:

```typescript
// Example: Get products
export const getProducts = (params: GetProductsParamsT) =>
  safeFetch<{ data: ProductT[] }>("/v1/products/client/search", {
    method: "POST",
    headers: CommonHeaders.jsonApplicationType,
    body: JSON.stringify(params),
  });

// Example: Get user profile
export const getMe = (params: { token: string }) =>
  safeFetch<UserT>("/v1/personal/profile", {
    headers: CommonHeaders.bearerToken(params.token),
  });
```

### Using React Query (Client Components)

```typescript
"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { getProducts, createOrder } from "@/lib/fetchs";

function ProductsList() {
  // Fetching data
  const { data, isLoading, error } = useQuery({
    queryKey: ["products"],
    queryFn: () => getProducts({ pageNumber: 1, pageSize: 10 }),
  });

  // Mutating data
  const mutation = useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      // Handle success
    },
  });

  if (isLoading) return <div>Loading...</div>;
  
  return (
    <div>
      {data?.result?.data?.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

### Direct Fetch (Server Components)

```typescript
// app/products/page.tsx
import { getProducts } from "@/lib/fetchs";

async function ProductsPage() {
  const products = await getProducts({
    pageNumber: 1,
    pageSize: 20,
    keyword: "",
    orderBy: [""],
  });

  return (
    <div>
      {products.result?.data?.data?.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

### Adding New Fetch Functions

1. Define the params type:
   ```typescript
   type GetItemsParamsT = {
     pageNumber: number;
     pageSize: number;
   };
   ```

2. Add the fetch function:
   ```typescript
   export const getItems = (params: GetItemsParamsT) =>
     safeFetch<{ data: ItemT[] }>("/v1/items", {
       method: "POST",
       headers: CommonHeaders.jsonApplicationType,
       body: JSON.stringify(params),
     });
   ```

---

## Forms & Validation

We use **React Hook Form** with **Zod** for form handling and validation.

### Validation Schemas

All validation schemas are in `/lib/validations.ts`:

```typescript
import { z } from "zod";

// Define schema
export const contactFormSchema = z.object({
  fullname: z.string().min(2, "Minimum 2 characters"),
  email: z.string().email("Invalid email"),
  message: z.string().min(10, "Minimum 10 characters"),
});

// Export type from schema
export type ContactFormValues = z.infer<typeof contactFormSchema>;
```

### Using Forms in Components

```typescript
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactFormSchema, ContactFormValues } from "@/lib/validations";

function ContactForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
  });

  const onSubmit = async (data: ContactFormValues) => {
    // Call API
    const res = await postContactUs(data);
    
    if (res.status === 200) {
      toast.success("Success!");
      reset();
    } else {
      toast.error("Error!");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("fullname")} />
      {errors.fullname && <p>{errors.fullname.message}</p>}
      
      <input {...register("email")} type="email" />
      {errors.email && <p>{errors.email.message}</p>}
      
      <textarea {...register("message")} />
      {errors.message && <p>{errors.message.message}</p>}
      
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Sending..." : "Send"}
      </button>
    </form>
  );
}
```

### Adding New Validation Schemas

1. Add schema to `/lib/validations.ts`:
   ```typescript
   export const newFormSchema = z.object({
     field1: z.string().min(1, "Required"),
     field2: z.number().min(0),
   });
   
   export type NewFormValues = z.infer<typeof newFormSchema>;
   ```

2. Import and use in your component:
   ```typescript
   import { newFormSchema, NewFormValues } from "@/lib/validations";
   ```

---

## State Management

### React Query for Server State

Used for:
- Fetching data from API
- Caching responses
- Automatic refetching
- Optimistic updates

```typescript
// Setup: Already done in app/layout.tsx via ReactQueryProvider

// Usage
const { data, isLoading } = useQuery({
  queryKey: ["uniqueKey", param1, param2],
  queryFn: () => fetchFunction({ param1, param2 }),
  staleTime: 1000 * 60 * 5, // 5 minutes
});
```

### Context for Client State

Used for:
- UI state (modals, sidebars)
- User preferences
- Authentication state

Example: Login Modal Context (`components/providers/loginModalProvider.tsx`):

```typescript
"use client";

import { createContext, useContext, useState } from "react";

const LoginModalContext = createContext<{
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
} | undefined>(undefined);

export function LoginModalProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <LoginModalContext.Provider value={{
      isOpen,
      openModal: () => setIsOpen(true),
      closeModal: () => setIsOpen(false),
    }}>
      {children}
    </LoginModalContext.Provider>
  );
}

export function useLoginModal() {
  const context = useContext(LoginModalContext);
  if (!context) throw new Error("Must be used within LoginModalProvider");
  return context;
}
```

### Custom Hooks

All hooks are in `/lib/hooks/`:

```typescript
// lib/hooks/useBasket.ts
export function useBasket() {
  // Hook logic
  return {
    cartItems,
    addToCart,
    removeItem,
    // ...
  };
}
```

---

## Components Guide

### UI Components (`components/ui/`)

Basic building blocks. Usually from shadcn/ui.

```typescript
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog } from "@/components/ui/dialog";
```

### Module Components (`components/modules/`)

Reusable business components used across multiple pages.

```typescript
import ProductCard from "@/components/modules/productCard";
import ArticleCard from "@/components/modules/articleCard";
import Carousel from "@/components/modules/carousel";
```

### Template Components (`components/templates/`)

Page-specific components, usually larger and more complex.

```typescript
import Header from "@/components/templates/header/header";
import Footer from "@/components/templates/footer";
import ProductDetail from "@/components/templates/productDetail";
```

### Providers (`components/providers/`)

Context providers that wrap the app.

```typescript
import { ThemeProvider } from "@/components/providers/themeProvider";
import ReactQueryProvider from "@/components/providers/reactQueryProvider";
import { LoginModalProvider } from "@/components/providers/loginModalProvider";
```

---

## Adding New Features

### Adding a New Page

1. Create folder in `/app/`:
   ```
   app/new-page/page.tsx
   ```

2. Create the page component:
   ```typescript
   async function NewPage() {
     return <div>New Page Content</div>;
   }
   export default NewPage;
   ```

### Adding a New API Endpoint

1. Add types to `/types/api.types.ts`:
   ```typescript
   export type NewItemT = {
     id: string;
     name: string;
   };
   ```

2. Add fetch function to `/lib/fetchs.ts`:
   ```typescript
   export const getNewItems = () =>
     safeFetch<{ data: NewItemT[] }>("/v1/newitems", {});
   ```

### Adding a New Form

1. Add validation to `/lib/validations.ts`
2. Create form component in `/components/templates/`
3. Use React Hook Form with Zod resolver

### Adding a New Component

1. Decide the type:
   - **UI**: Basic, reusable, no business logic → `/components/ui/`
   - **Module**: Reusable with business logic → `/components/modules/`
   - **Template**: Page-specific → `/components/templates/`

2. Create the file with correct naming:
   ```typescript
   // components/modules/newComponent.tsx
   function NewComponent() {
     return <div>...</div>;
   }
   export default NewComponent;
   ```

---

## Common Patterns

### Client vs Server Components

```typescript
// Server Component (default) - Can fetch data directly
async function ServerComponent() {
  const data = await fetchData();
  return <div>{data}</div>;
}

// Client Component - Uses hooks, interactivity
"use client";
function ClientComponent() {
  const [state, setState] = useState();
  return <button onClick={() => setState(...)}>Click</button>;
}
```

### Loading States

```typescript
// Using React Query
const { data, isLoading } = useQuery({...});

if (isLoading) return <LoadingSpinner />;
return <DataDisplay data={data} />;
```

### Error Handling

```typescript
// Using toast notifications
import { toast } from "sonner";

const onSubmit = async (data) => {
  const res = await submitData(data);
  
  if (res.status === 200) {
    toast.success("Success!");
  } else {
    toast.error("Something went wrong");
  }
};
```

### Authentication

```typescript
import { getCookie } from "cookies-next/client";

// Get token
const token = getCookie("token") || "";

// Use in queries
const { data: user } = useQuery({
  queryKey: ["user"],
  queryFn: () => getMe({ token }),
  enabled: !!token, // Only run if token exists
});
```

---

## Important Rules

1. **DO NOT edit `brand.ts`** - It's auto-generated
2. **All fetch functions** go in `/lib/fetchs.ts`
3. **All validation schemas** go in `/lib/validations.ts`
4. **All API types** go in `/types/api.types.ts`
5. **Only hooks** (`.ts` files) in `/lib/hooks/`
6. **Providers with JSX** go in `/components/providers/`
7. **Use React Query** for data fetching in client components
8. **Use Zod + React Hook Form** for all forms

---

## Useful Commands

```bash
# Development
npm run dev

# Build
npm run build

# Start production
npm start

# Generate brand config
npm run generate-brand <brand-name>

# Lint
npm run lint
```

---

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **State Management**: React Query + Context
- **Forms**: React Hook Form + Zod
- **UI Components**: Radix UI (via shadcn/ui)
- **Animations**: Framer Motion
- **Carousel**: Swiper
- **Notifications**: Sonner

---

## Questions?

If you have questions about specific parts of the codebase, check the existing components for examples. Most patterns are repeated throughout the project.
