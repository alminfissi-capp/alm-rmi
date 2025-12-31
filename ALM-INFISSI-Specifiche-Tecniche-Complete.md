# ALM Infissi - Specifiche Tecniche di Sviluppo
## Configuratore e Preventivatore Serramenti in Alluminio

**Versione:** 1.0  
**Data:** Dicembre 2025  
**Cliente:** ALM Infissi - Alessandro Cappello  
**Tipo Documento:** Specifiche Tecniche per Implementazione

---

## INDICE

1. [Setup Iniziale del Progetto](#1-setup-iniziale-del-progetto)
2. [Stack Tecnologico Dettagliato](#2-stack-tecnologico-dettagliato)
3. [Struttura del Progetto](#3-struttura-del-progetto)
4. [Database Schema e Configurazione](#4-database-schema-e-configurazione)
5. [Autenticazione e Sicurezza](#5-autenticazione-e-sicurezza)
6. [Componenti Frontend](#6-componenti-frontend)
7. [API Routes e Backend Logic](#7-api-routes-e-backend-logic)
8. [Editor Canvas - Specifiche Tecniche](#8-editor-canvas-specifiche-tecniche)
9. [Sistema di Calcolo Prezzi](#9-sistema-di-calcolo-prezzi)
10. [Generazione PDF Preventivi](#10-generazione-pdf-preventivi)
11. [File da Creare - Checklist Completa](#11-file-da-creare-checklist-completa)
12. [Configurazioni e Variabili d'Ambiente](#12-configurazioni-e-variabili-dambiente)
13. [Testing Strategy](#13-testing-strategy)
14. [Deployment](#14-deployment)

---

## 1. SETUP INIZIALE DEL PROGETTO

### 1.1 Comandi di Inizializzazione

```bash
# 1. Crea progetto Next.js con TypeScript
npx create-next-app@latest alm-infissi --typescript --tailwind --app --use-npm

# 2. Naviga nella cartella
cd alm-infissi

# 3. Installa dipendenze core
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
npm install @tanstack/react-query
npm install zustand
npm install fabric
npm install lucide-react
npm install date-fns
npm install zod
npm install react-hook-form @hookform/resolvers

# 4. Installa dipendenze UI
npm install class-variance-authority clsx tailwind-merge
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-select @radix-ui/react-tabs

# 5. Installa dipendenze PDF
npm install jspdf jspdf-autotable

# 6. Installa dev dependencies
npm install -D @types/fabric @types/node
npm install -D prettier prettier-plugin-tailwindcss
npm install -D eslint-config-prettier

# 7. Supabase CLI (per generare types)
npm install -D supabase
```

### 1.2 Configurazione Supabase

```bash
# Login Supabase
npx supabase login

# Inizializza progetto (crea cartella supabase/)
npx supabase init

# Link al progetto cloud
npx supabase link --project-ref YOUR_PROJECT_REF

# Genera TypeScript types dal database
npx supabase gen types typescript --linked > types/supabase.ts
```

---

## 2. STACK TECNOLOGICO DETTAGLIATO

### 2.1 Frontend Stack

```typescript
// Next.js 14+ App Router
{
  "framework": "Next.js 14.x",
  "language": "TypeScript 5.x",
  "styling": "Tailwind CSS 3.x",
  "components": [
    "Radix UI (primitives)",
    "shadcn/ui (optional, pre-built components)",
    "Lucide React (icons)"
  ],
  "stateManagement": {
    "server": "TanStack Query (React Query)",
    "client": "Zustand",
    "forms": "React Hook Form + Zod"
  },
  "canvas": "Fabric.js 5.x"
}
```

### 2.2 Backend Stack

```typescript
{
  "runtime": "Next.js API Routes / Server Actions",
  "database": "Supabase (PostgreSQL 15)",
  "auth": "Supabase Auth",
  "storage": "Supabase Storage",
  "orm": "Supabase Client (direct SQL queries)",
  "validation": "Zod schemas"
}
```

### 2.3 Tools & Utilities

```typescript
{
  "pdfGeneration": "jsPDF + jspdf-autotable",
  "dateHandling": "date-fns",
  "typeValidation": "Zod",
  "codeQuality": ["ESLint", "Prettier", "TypeScript strict mode"],
  "versionControl": "Git + GitHub"
}
```

---

## 3. STRUTTURA DEL PROGETTO

### 3.1 Directory Structure Completa

```
alm-infissi/
├── app/                              # Next.js App Router
│   ├── (auth)/                       # Auth route group
│   │   ├── login/
│   │   │   └── page.tsx             # Login page
│   │   ├── register/
│   │   │   └── page.tsx             # Register page
│   │   └── layout.tsx               # Auth layout (no sidebar)
│   │
│   ├── (dashboard)/                  # Protected route group
│   │   ├── layout.tsx               # Dashboard layout (with sidebar)
│   │   ├── page.tsx                 # Dashboard home
│   │   │
│   │   ├── clients/
│   │   │   ├── page.tsx             # Clients list
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx         # Client detail
│   │   │   └── new/
│   │   │       └── page.tsx         # New client form
│   │   │
│   │   ├── projects/
│   │   │   ├── page.tsx             # Projects list
│   │   │   ├── [id]/
│   │   │   │   ├── page.tsx         # Project detail
│   │   │   │   └── edit/
│   │   │   │       └── page.tsx     # Project editor
│   │   │   └── new/
│   │   │       └── page.tsx         # New project wizard
│   │   │
│   │   ├── editor/
│   │   │   └── [projectId]/
│   │   │       └── page.tsx         # Canvas editor
│   │   │
│   │   ├── catalog/
│   │   │   ├── page.tsx             # Products catalog
│   │   │   └── [id]/
│   │   │       └── page.tsx         # Product detail
│   │   │
│   │   └── settings/
│   │       ├── page.tsx             # Settings home
│   │       ├── profile/
│   │       │   └── page.tsx         # User profile
│   │       ├── price-lists/
│   │       │   └── page.tsx         # Price lists management
│   │       └── users/
│   │           └── page.tsx         # Users management (admin)
│   │
│   ├── api/                          # API Routes
│   │   ├── auth/
│   │   │   └── callback/
│   │   │       └── route.ts         # Auth callback
│   │   ├── projects/
│   │   │   ├── route.ts             # GET, POST /api/projects
│   │   │   └── [id]/
│   │   │       ├── route.ts         # GET, PUT, DELETE /api/projects/:id
│   │   │       ├── items/
│   │   │       │   └── route.ts     # Project items CRUD
│   │   │       └── pdf/
│   │   │           └── route.ts     # Generate PDF
│   │   ├── clients/
│   │   │   ├── route.ts
│   │   │   └── [id]/
│   │   │       └── route.ts
│   │   └── window-types/
│   │       └── route.ts
│   │
│   ├── layout.tsx                    # Root layout
│   ├── globals.css                   # Global styles
│   └── providers.tsx                 # App providers wrapper
│
├── components/                       # React components
│   ├── ui/                          # Base UI components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── dialog.tsx
│   │   ├── card.tsx
│   │   ├── table.tsx
│   │   ├── tabs.tsx
│   │   └── ...
│   │
│   ├── layout/                      # Layout components
│   │   ├── header.tsx
│   │   ├── sidebar.tsx
│   │   ├── navigation.tsx
│   │   └── footer.tsx
│   │
│   ├── auth/                        # Auth components
│   │   ├── login-form.tsx
│   │   ├── register-form.tsx
│   │   └── auth-guard.tsx
│   │
│   ├── clients/                     # Client components
│   │   ├── client-list.tsx
│   │   ├── client-card.tsx
│   │   ├── client-form.tsx
│   │   └── client-search.tsx
│   │
│   ├── projects/                    # Project components
│   │   ├── project-list.tsx
│   │   ├── project-card.tsx
│   │   ├── project-form.tsx
│   │   ├── project-status.tsx
│   │   └── project-wizard.tsx
│   │
│   ├── editor/                      # Canvas editor components
│   │   ├── canvas.tsx              # Main canvas component
│   │   ├── canvas-toolbar.tsx      # Tools (add, delete, etc.)
│   │   ├── properties-panel.tsx    # Edit selected item
│   │   ├── window-element.tsx      # Window rendering logic
│   │   ├── grid-overlay.tsx        # Grid and rulers
│   │   ├── zoom-controls.tsx       # Zoom in/out
│   │   └── canvas-context-menu.tsx # Right-click menu
│   │
│   ├── quote/                       # Quote components
│   │   ├── quote-summary.tsx       # Summary table
│   │   ├── quote-item-row.tsx      # Single item row
│   │   ├── price-breakdown.tsx     # Detailed pricing
│   │   └── pdf-preview.tsx         # PDF preview modal
│   │
│   └── catalog/                     # Catalog components
│       ├── product-grid.tsx
│       ├── product-card.tsx
│       ├── category-filter.tsx
│       └── window-type-card.tsx
│
├── lib/                             # Utility libraries
│   ├── supabase/
│   │   ├── client.ts               # Client-side Supabase
│   │   ├── server.ts               # Server-side Supabase
│   │   └── middleware.ts           # Auth middleware
│   │
│   ├── api/                        # API client functions
│   │   ├── clients.ts
│   │   ├── projects.ts
│   │   ├── window-types.ts
│   │   └── products.ts
│   │
│   ├── utils/
│   │   ├── cn.ts                   # className utility
│   │   ├── format.ts               # Formatters (currency, date)
│   │   ├── calculations.ts         # Price calculations
│   │   └── validation.ts           # Validation helpers
│   │
│   └── pdf/
│       └── generator.ts            # PDF generation logic
│
├── hooks/                           # Custom React hooks
│   ├── use-auth.ts                 # Auth state hook
│   ├── use-projects.ts             # Projects queries
│   ├── use-clients.ts              # Clients queries
│   ├── use-canvas.ts               # Canvas state management
│   ├── use-window-types.ts         # Window types queries
│   └── use-toast.ts                # Toast notifications
│
├── store/                           # Zustand stores
│   ├── ui-store.ts                 # UI state (sidebar, modals)
│   ├── editor-store.ts             # Canvas editor state
│   └── auth-store.ts               # Client-side auth state
│
├── types/                           # TypeScript types
│   ├── supabase.ts                 # Generated from DB
│   ├── database.ts                 # Extended DB types
│   ├── project.ts                  # Project types
│   ├── client.ts                   # Client types
│   └── canvas.ts                   # Canvas types
│
├── schemas/                         # Zod validation schemas
│   ├── auth.schema.ts
│   ├── client.schema.ts
│   ├── project.schema.ts
│   └── window-item.schema.ts
│
├── config/                          # Configuration files
│   ├── site.ts                     # Site config (name, links)
│   ├── nav.ts                      # Navigation structure
│   └── constants.ts                # App constants
│
├── supabase/                        # Supabase files
│   ├── migrations/                 # SQL migrations
│   │   └── 00001_initial_schema.sql
│   ├── seed.sql                    # Seed data
│   └── config.toml                 # Supabase config
│
├── public/                          # Static files
│   ├── logo.svg
│   └── images/
│
├── .env.local                       # Environment variables
├── .env.example                     # Example env file
├── next.config.js                   # Next.js config
├── tailwind.config.ts               # Tailwind config
├── tsconfig.json                    # TypeScript config
├── package.json
└── README.md
```

---

## 4. DATABASE SCHEMA E CONFIGURAZIONE

### 4.1 Complete SQL Schema

Crea questo file: `supabase/migrations/00001_initial_schema.sql`

```sql
-- ============================================================================
-- ALM INFISSI DATABASE SCHEMA
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- TABLES
-- ============================================================================

-- User Profiles (extends auth.users)
CREATE TABLE public.user_profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'sales', 'technician')),
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Clients
CREATE TABLE public.clients (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  mobile TEXT,
  address TEXT,
  city TEXT,
  province TEXT,
  zip_code TEXT,
  vat_number TEXT,
  fiscal_code TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) NOT NULL
);

-- Projects
CREATE TABLE public.projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_number TEXT UNIQUE NOT NULL,
  client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  address TEXT,
  city TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'approved', 'rejected', 'completed', 'archived')),
  
  -- Pricing
  subtotal NUMERIC(10,2) DEFAULT 0,
  discount_percent NUMERIC(5,2) DEFAULT 0,
  discount_amount NUMERIC(10,2) DEFAULT 0,
  tax_percent NUMERIC(5,2) DEFAULT 22, -- IVA italiana
  tax_amount NUMERIC(10,2) DEFAULT 0,
  total_amount NUMERIC(10,2) DEFAULT 0,
  
  -- Additional info
  notes TEXT,
  internal_notes TEXT,
  valid_until DATE,
  delivery_days INTEGER DEFAULT 30,
  
  -- Canvas data
  canvas_data JSONB,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) NOT NULL
);

-- Window Types (catalog)
CREATE TABLE public.window_types (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  opening_type TEXT NOT NULL CHECK (opening_type IN ('fixed', 'casement', 'sliding', 'tilt', 'tilt_turn', 'lift_slide', 'door')),
  
  -- Pricing
  base_price_per_sqm NUMERIC(10,2) NOT NULL,
  labor_cost_per_sqm NUMERIC(10,2) DEFAULT 0,
  
  -- Technical specs
  min_width INTEGER DEFAULT 300,
  max_width INTEGER DEFAULT 3000,
  min_height INTEGER DEFAULT 300,
  max_height INTEGER DEFAULT 3000,
  
  -- Visual
  icon_url TEXT,
  color_hex TEXT DEFAULT '#93c5fd',
  
  -- Status
  active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Project Items (windows/doors in a project)
CREATE TABLE public.project_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  item_number INTEGER NOT NULL,
  
  -- Window reference
  window_type_id UUID REFERENCES public.window_types(id) NOT NULL,
  
  -- Dimensions (mm)
  width_mm INTEGER NOT NULL CHECK (width_mm >= 300 AND width_mm <= 5000),
  height_mm INTEGER NOT NULL CHECK (height_mm >= 300 AND height_mm <= 5000),
  
  -- Position on canvas
  position_x INTEGER DEFAULT 0,
  position_y INTEGER DEFAULT 0,
  
  -- Configuration
  sections INTEGER DEFAULT 1 CHECK (sections >= 1 AND sections <= 6),
  opening_direction TEXT CHECK (opening_direction IN ('left', 'right', 'up', 'down', 'both')),
  
  -- Materials
  glass_type TEXT DEFAULT 'double' CHECK (glass_type IN ('single', 'double', 'triple', 'low_e', 'security', 'decorative')),
  frame_color TEXT DEFAULT 'white',
  frame_color_ral TEXT,
  
  -- Accessories
  has_mosquito_net BOOLEAN DEFAULT false,
  mosquito_net_type TEXT CHECK (mosquito_net_type IN ('fixed', 'sliding', 'pleated', null)),
  has_shutter BOOLEAN DEFAULT false,
  shutter_type TEXT CHECK (shutter_type IN ('roller', 'venetian', null)),
  handle_type TEXT DEFAULT 'standard',
  
  -- Pricing
  unit_price NUMERIC(10,2) NOT NULL,
  quantity INTEGER DEFAULT 1,
  line_total NUMERIC(10,2) NOT NULL,
  
  -- Additional
  notes TEXT,
  configuration JSONB, -- Store complex config as JSON
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products (profiles, accessories, hardware)
CREATE TABLE public.products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  category TEXT NOT NULL CHECK (category IN ('profile', 'glass', 'hardware', 'accessory', 'mosquito_net', 'shutter')),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  manufacturer TEXT,
  
  -- Pricing
  unit_price NUMERIC(10,2) NOT NULL,
  unit_of_measure TEXT DEFAULT 'pz' CHECK (unit_of_measure IN ('pz', 'm', 'm2', 'kg')),
  
  -- Technical
  technical_specs JSONB,
  
  -- Visual
  image_url TEXT,
  thumbnail_url TEXT,
  
  -- Status
  active BOOLEAN DEFAULT true,
  in_stock BOOLEAN DEFAULT true,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Item Accessories (link products to project items)
CREATE TABLE public.item_accessories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_item_id UUID REFERENCES public.project_items(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) NOT NULL,
  quantity NUMERIC(10,2) NOT NULL,
  unit_price NUMERIC(10,2) NOT NULL,
  total_price NUMERIC(10,2) NOT NULL,
  notes TEXT
);

-- Price Lists
CREATE TABLE public.price_lists (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  valid_from DATE NOT NULL,
  valid_to DATE,
  active BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) NOT NULL
);

-- Price List Items
CREATE TABLE public.price_list_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  price_list_id UUID REFERENCES public.price_lists(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) NOT NULL,
  window_type_id UUID REFERENCES public.window_types(id),
  price NUMERIC(10,2) NOT NULL,
  discount_percent NUMERIC(5,2) DEFAULT 0,
  UNIQUE(price_list_id, product_id, window_type_id)
);

-- Project Documents (PDFs, images, etc.)
CREATE TABLE public.project_documents (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  uploaded_by UUID REFERENCES auth.users(id) NOT NULL
);

-- Activity Log
CREATE TABLE public.activity_log (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- INDEXES
-- ============================================================================

CREATE INDEX idx_clients_created_by ON public.clients(created_by);
CREATE INDEX idx_clients_name ON public.clients(name);
CREATE INDEX idx_projects_client_id ON public.projects(client_id);
CREATE INDEX idx_projects_created_by ON public.projects(created_by);
CREATE INDEX idx_projects_status ON public.projects(status);
CREATE INDEX idx_projects_project_number ON public.projects(project_number);
CREATE INDEX idx_project_items_project_id ON public.project_items(project_id);
CREATE INDEX idx_project_items_window_type_id ON public.project_items(window_type_id);
CREATE INDEX idx_products_category ON public.products(category);
CREATE INDEX idx_products_active ON public.products(active);
CREATE INDEX idx_activity_log_user_id ON public.activity_log(user_id);
CREATE INDEX idx_activity_log_entity ON public.activity_log(entity_type, entity_id);

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Generate project number
CREATE OR REPLACE FUNCTION generate_project_number()
RETURNS TEXT AS $$
DECLARE
  new_number TEXT;
  year_code TEXT;
  sequence_num INTEGER;
BEGIN
  year_code := TO_CHAR(NOW(), 'YY');
  
  SELECT COALESCE(MAX(CAST(SUBSTRING(project_number FROM 4) AS INTEGER)), 0) + 1
  INTO sequence_num
  FROM public.projects
  WHERE project_number LIKE 'ALM' || year_code || '%';
  
  new_number := 'ALM' || year_code || LPAD(sequence_num::TEXT, 4, '0');
  RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- Calculate project totals
CREATE OR REPLACE FUNCTION calculate_project_totals(project_uuid UUID)
RETURNS VOID AS $$
DECLARE
  items_subtotal NUMERIC(10,2);
  discount_amt NUMERIC(10,2);
  tax_amt NUMERIC(10,2);
  final_total NUMERIC(10,2);
  project_rec RECORD;
BEGIN
  SELECT * INTO project_rec FROM public.projects WHERE id = project_uuid;
  
  -- Sum all items
  SELECT COALESCE(SUM(line_total), 0) INTO items_subtotal
  FROM public.project_items
  WHERE project_id = project_uuid;
  
  -- Calculate discount
  discount_amt := items_subtotal * (project_rec.discount_percent / 100);
  
  -- Calculate tax on discounted amount
  tax_amt := (items_subtotal - discount_amt) * (project_rec.tax_percent / 100);
  
  -- Final total
  final_total := items_subtotal - discount_amt + tax_amt;
  
  -- Update project
  UPDATE public.projects
  SET 
    subtotal = items_subtotal,
    discount_amount = discount_amt,
    tax_amount = tax_amt,
    total_amount = final_total,
    updated_at = NOW()
  WHERE id = project_uuid;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Auto-update updated_at on tables
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON public.clients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_window_types_updated_at BEFORE UPDATE ON public.window_types
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_project_items_updated_at BEFORE UPDATE ON public.project_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-generate project number
CREATE OR REPLACE FUNCTION auto_generate_project_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.project_number IS NULL OR NEW.project_number = '' THEN
    NEW.project_number := generate_project_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER generate_project_number_trigger
  BEFORE INSERT ON public.projects
  FOR EACH ROW EXECUTE FUNCTION auto_generate_project_number();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.item_accessories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.window_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.price_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.price_list_items ENABLE ROW LEVEL SECURITY;

-- User Profiles Policies
CREATE POLICY "Users can view own profile"
  ON public.user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.user_profiles FOR UPDATE
  USING (auth.uid() = id);

-- Clients Policies
CREATE POLICY "Users can view own clients"
  ON public.clients FOR SELECT
  USING (auth.uid() = created_by);

CREATE POLICY "Users can create clients"
  ON public.clients FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update own clients"
  ON public.clients FOR UPDATE
  USING (auth.uid() = created_by);

CREATE POLICY "Users can delete own clients"
  ON public.clients FOR DELETE
  USING (auth.uid() = created_by);

-- Projects Policies
CREATE POLICY "Users can view own projects"
  ON public.projects FOR SELECT
  USING (auth.uid() = created_by);

CREATE POLICY "Users can create projects"
  ON public.projects FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update own projects"
  ON public.projects FOR UPDATE
  USING (auth.uid() = created_by);

CREATE POLICY "Users can delete own projects"
  ON public.projects FOR DELETE
  USING (auth.uid() = created_by);

-- Project Items Policies (inherit from project)
CREATE POLICY "Users can view own project items"
  ON public.project_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = project_items.project_id
      AND projects.created_by = auth.uid()
    )
  );

CREATE POLICY "Users can create project items"
  ON public.project_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = project_items.project_id
      AND projects.created_by = auth.uid()
    )
  );

CREATE POLICY "Users can update project items"
  ON public.project_items FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = project_items.project_id
      AND projects.created_by = auth.uid()
    )
  );

CREATE POLICY "Users can delete project items"
  ON public.project_items FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = project_items.project_id
      AND projects.created_by = auth.uid()
    )
  );

-- Products Policies (read-only for all authenticated users)
CREATE POLICY "Authenticated users can view products"
  ON public.products FOR SELECT
  USING (auth.role() = 'authenticated');

-- Admins can manage products
CREATE POLICY "Admins can manage products"
  ON public.products FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- Window Types Policies (read-only for all authenticated users)
CREATE POLICY "Authenticated users can view window types"
  ON public.window_types FOR SELECT
  USING (auth.role() = 'authenticated');

-- Admins can manage window types
CREATE POLICY "Admins can manage window types"
  ON public.window_types FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- Item Accessories Policies (inherit from project_items)
CREATE POLICY "Users can view item accessories"
  ON public.item_accessories FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.project_items
      JOIN public.projects ON projects.id = project_items.project_id
      WHERE project_items.id = item_accessories.project_item_id
      AND projects.created_by = auth.uid()
    )
  );

-- Project Documents Policies
CREATE POLICY "Users can view own project documents"
  ON public.project_documents FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = project_documents.project_id
      AND projects.created_by = auth.uid()
    )
  );

-- ============================================================================
-- SEED DATA
-- ============================================================================

-- Insert default window types
INSERT INTO public.window_types (code, name, description, opening_type, base_price_per_sqm, labor_cost_per_sqm, color_hex, icon_url, sort_order) VALUES
  ('FIX-001', 'Fisso', 'Vetrata fissa senza apertura', 'fixed', 180.00, 30.00, '#93c5fd', '/icons/fixed.svg', 1),
  ('BAT-001', 'Battente 1 Anta', 'Finestra a battente con 1 anta', 'casement', 220.00, 40.00, '#86efac', '/icons/casement.svg', 2),
  ('BAT-002', 'Battente 2 Ante', 'Finestra a battente con 2 ante', 'casement', 240.00, 45.00, '#86efac', '/icons/casement-2.svg', 3),
  ('SCO-001', 'Scorrevole 2 Ante', 'Finestra scorrevole con 2 ante', 'sliding', 280.00, 50.00, '#fca5a5', '/icons/sliding.svg', 4),
  ('VAS-001', 'Vasistas', 'Finestra a vasistas (apertura dall\'alto)', 'tilt', 240.00, 42.00, '#fde047', '/icons/tilt.svg', 5),
  ('OSC-001', 'Anta-Ribalta', 'Finestra oscillante e ribaltabile', 'tilt_turn', 260.00, 48.00, '#c084fc', '/icons/tilt-turn.svg', 6),
  ('ALZ-001', 'Alzante Scorrevole', 'Porta-finestra alzante scorrevole', 'lift_slide', 350.00, 70.00, '#fb923c', '/icons/lift-slide.svg', 7),
  ('POR-001', 'Porta', 'Porta d\'ingresso in alluminio', 'door', 400.00, 80.00, '#64748b', '/icons/door.svg', 8);

-- Insert sample products
INSERT INTO public.products (category, code, name, description, unit_price, unit_of_measure, active) VALUES
  -- Profiles
  ('profile', 'PROF-ALU-001', 'Profilo Serie Economica', 'Profilo alluminio base senza taglio termico', 25.00, 'm', true),
  ('profile', 'PROF-ALU-002', 'Profilo Serie Standard', 'Profilo alluminio con taglio termico standard', 35.00, 'm', true),
  ('profile', 'PROF-ALU-003', 'Profilo Serie Premium', 'Profilo alluminio con taglio termico avanzato', 50.00, 'm', true),
  
  -- Glass
  ('glass', 'VET-DOP-001', 'Vetrocamera 4-16-4', 'Doppio vetro 4-16-4 standard', 45.00, 'm2', true),
  ('glass', 'VET-DOP-002', 'Vetrocamera 4-18-4 Low-E', 'Doppio vetro basso emissivo', 65.00, 'm2', true),
  ('glass', 'VET-TRI-001', 'Triplo Vetro 4-16-4-16-4', 'Triplo vetro per isolamento massimo', 95.00, 'm2', true),
  
  -- Hardware
  ('hardware', 'MAN-STD-001', 'Maniglia Standard', 'Maniglia alluminio standard', 15.00, 'pz', true),
  ('hardware', 'MAN-DES-001', 'Maniglia Design', 'Maniglia design in acciaio inox', 35.00, 'pz', true),
  ('hardware', 'CER-STD-001', 'Cerniere Standard', 'Set cerniere standard', 20.00, 'pz', true),
  
  -- Mosquito nets
  ('mosquito_net', 'ZAN-FIS-001', 'Zanzariera Fissa', 'Zanzariera fissa a telaio', 45.00, 'pz', true),
  ('mosquito_net', 'ZAN-AVV-001', 'Zanzariera Avvolgibile', 'Zanzariera avvolgibile verticale', 85.00, 'pz', true),
  ('mosquito_net', 'ZAN-PLI-001', 'Zanzariera Plissettata', 'Zanzariera plissettata laterale', 120.00, 'pz', true),
  
  -- Shutters
  ('shutter', 'TAP-001', 'Tapparella Alluminio', 'Tapparella avvolgibile in alluminio', 150.00, 'pz', true),
  ('shutter', 'VEN-001', 'Veneziana Orientabile', 'Veneziana orientabile esterna', 180.00, 'pz', true);

-- ============================================================================
-- STORAGE BUCKETS
-- ============================================================================

-- Create storage buckets (run this in Supabase dashboard or via API)
-- Bucket: project-images (public)
-- Bucket: project-documents (private)
-- Bucket: product-images (public)
-- Bucket: user-avatars (public)
```

### 4.2 Seed Data File

Crea: `supabase/seed.sql`

```sql
-- Additional seed data for testing

-- Test user profile (requires existing auth.users entry)
-- You'll need to create a user first via Supabase Auth, then:
INSERT INTO public.user_profiles (id, full_name, role, phone)
VALUES 
  ('YOUR_USER_UUID_HERE', 'Alessandro Cappello', 'admin', '+39 333 1234567');

-- Sample client
INSERT INTO public.clients (name, email, phone, address, city, province, zip_code, created_by)
VALUES 
  ('Mario Rossi', 'mario.rossi@example.com', '+39 333 9876543', 'Via Roma 123', 'Milano', 'MI', '20100', 'YOUR_USER_UUID_HERE');
```

---

## 5. AUTENTICAZIONE E SICUREZZA

### 5.1 Supabase Client Setup

Crea: `lib/supabase/client.ts`

```typescript
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types/supabase'

export function createClient() {
  return createClientComponentClient<Database>()
}
```

Crea: `lib/supabase/server.ts`

```typescript
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Database } from '@/types/supabase'

export function createClient() {
  return createServerComponentClient<Database>({ 
    cookies 
  })
}
```

Crea: `lib/supabase/middleware.ts`

```typescript
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { Database } from '@/types/supabase'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient<Database>({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Protected routes
  if (req.nextUrl.pathname.startsWith('/dashboard') ||
      req.nextUrl.pathname.startsWith('/projects') ||
      req.nextUrl.pathname.startsWith('/clients') ||
      req.nextUrl.pathname.startsWith('/editor')) {
    
    if (!session) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
  }

  // Redirect authenticated users away from auth pages
  if ((req.nextUrl.pathname === '/login' || 
       req.nextUrl.pathname === '/register') && session) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return res
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/projects/:path*',
    '/clients/:path*',
    '/editor/:path*',
    '/login',
    '/register',
  ],
}
```

### 5.2 Auth Hook

Crea: `hooks/use-auth.ts`

```typescript
'use client'

import { useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface UserProfile {
  id: string
  full_name: string
  role: 'admin' | 'sales' | 'technician'
  phone: string | null
  avatar_url: string | null
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      
      if (session?.user) {
        await fetchProfile(session.user.id)
      }
      
      setLoading(false)
    }

    getSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user ?? null)
        
        if (session?.user) {
          await fetchProfile(session.user.id)
        } else {
          setProfile(null)
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (data && !error) {
      setProfile(data as UserProfile)
    }
  }

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error
    return data
  }

  const signUp = async (email: string, password: string, fullName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })

    if (error) throw error

    // Create profile
    if (data.user) {
      await supabase.from('user_profiles').insert({
        id: data.user.id,
        full_name: fullName,
        role: 'sales', // Default role
      })
    }

    return data
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    router.push('/login')
  }

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })
    if (error) throw error
  }

  return {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    isAuthenticated: !!user,
    isAdmin: profile?.role === 'admin',
  }
}
```

---

## 6. COMPONENTI FRONTEND

### 6.1 Utility Functions

Crea: `lib/utils/cn.ts`

```typescript
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

Crea: `lib/utils/format.ts`

```typescript
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount)
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('it-IT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date))
}

export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat('it-IT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export function formatDimensions(widthMm: number, heightMm: number): string {
  return `${widthMm} × ${heightMm} mm`
}

export function formatArea(widthMm: number, heightMm: number): string {
  const areaSqm = (widthMm * heightMm) / 1_000_000
  return `${areaSqm.toFixed(2)} m²`
}
```

### 6.2 Calculation Utilities

Crea: `lib/utils/calculations.ts`

```typescript
export interface PriceCalculation {
  basePrice: number
  laborCost: number
  accessoriesTotal: number
  subtotal: number
  discountAmount: number
  taxAmount: number
  total: number
}

export interface ProjectItem {
  width_mm: number
  height_mm: number
  window_type: {
    base_price_per_sqm: number
    labor_cost_per_sqm: number
  }
  sections: number
  glass_type: string
  has_mosquito_net: boolean
  has_shutter: boolean
  quantity: number
}

export function calculateArea(widthMm: number, heightMm: number): number {
  return (widthMm * heightMm) / 1_000_000 // Convert mm² to m²
}

export function calculatePerimeter(widthMm: number, heightMm: number): number {
  return ((widthMm + heightMm) * 2) / 1000 // Convert mm to m
}

export function calculateItemPrice(item: ProjectItem): number {
  const area = calculateArea(item.width_mm, item.height_mm)
  
  // Base price
  let basePrice = item.window_type.base_price_per_sqm * area
  
  // Multipliers based on configuration
  const multipliers = {
    sections: item.sections > 2 ? 1.15 : 1.0, // +15% for 3+ sections
    glassType: getGlassMultiplier(item.glass_type),
    size: getSizeMultiplier(item.width_mm, item.height_mm),
  }
  
  basePrice *= multipliers.sections * multipliers.glassType * multipliers.size
  
  // Labor cost
  const laborCost = item.window_type.labor_cost_per_sqm * area
  
  // Accessories
  let accessoriesTotal = 0
  if (item.has_mosquito_net) accessoriesTotal += 85 // Average mosquito net price
  if (item.has_shutter) accessoriesTotal += 150 // Average shutter price
  
  // Total for single unit
  const unitPrice = basePrice + laborCost + accessoriesTotal
  
  // Apply quantity
  return unitPrice * item.quantity
}

function getGlassMultiplier(glassType: string): number {
  const multipliers: Record<string, number> = {
    single: 0.8,
    double: 1.0,
    triple: 1.25,
    low_e: 1.15,
    security: 1.30,
    decorative: 1.20,
  }
  return multipliers[glassType] || 1.0
}

function getSizeMultiplier(widthMm: number, heightMm: number): number {
  // Large windows cost more
  if (widthMm > 2500 || heightMm > 2500) return 1.15
  if (widthMm > 2000 || heightMm > 2000) return 1.10
  return 1.0
}

export function calculateProjectTotal(
  items: ProjectItem[],
  discountPercent: number = 0,
  taxPercent: number = 22
): PriceCalculation {
  const subtotal = items.reduce((sum, item) => sum + calculateItemPrice(item), 0)
  
  const discountAmount = subtotal * (discountPercent / 100)
  const afterDiscount = subtotal - discountAmount
  const taxAmount = afterDiscount * (taxPercent / 100)
  const total = afterDiscount + taxAmount
  
  return {
    basePrice: subtotal,
    laborCost: 0, // Already included in subtotal
    accessoriesTotal: 0, // Already included in subtotal
    subtotal,
    discountAmount,
    taxAmount,
    total,
  }
}
```

### 6.3 Base UI Components

Crea: `components/ui/button.tsx`

```typescript
import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils/cn'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-blue-600 text-white hover:bg-blue-700',
        destructive: 'bg-red-600 text-white hover:bg-red-700',
        outline: 'border border-gray-300 bg-transparent hover:bg-gray-100',
        secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
        ghost: 'hover:bg-gray-100 hover:text-gray-900',
        link: 'text-blue-600 underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
```

Crea: `components/ui/input.tsx`

```typescript
import * as React from 'react'
import { cn } from '@/lib/utils/cn'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'

export { Input }
```

### 6.4 Login Form Component

Crea: `components/auth/login-form.tsx`

```typescript
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await signIn(email, password)
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Errore durante il login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="alessandro@alminfissi.it"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="••••••••"
        />
      </div>

      {error && (
        <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
          {error}
        </div>
      )}

      <Button
        type="submit"
        disabled={loading}
        className="w-full"
      >
        {loading ? 'Accesso in corso...' : 'Accedi'}
      </Button>
    </form>
  )
}
```

---

## 7. API ROUTES E BACKEND LOGIC

### 7.1 Projects API

Crea: `app/api/projects/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/projects - List all projects for current user
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    
    // Check auth
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get query params
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const clientId = searchParams.get('clientId')

    // Build query
    let query = supabase
      .from('projects')
      .select(`
        *,
        client:clients(id, name, email),
        items:project_items(count)
      `)
      .eq('created_by', user.id)
      .order('created_at', { ascending: false })

    // Apply filters
    if (status) query = query.eq('status', status)
    if (clientId) query = query.eq('client_id', clientId)

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json(data)
  } catch (error: any) {
    console.error('GET /api/projects error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/projects - Create new project
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    
    // Check auth
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    
    // Validate required fields
    if (!body.title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      )
    }

    // Insert project
    const { data, error } = await supabase
      .from('projects')
      .insert({
        title: body.title,
        description: body.description,
        client_id: body.client_id,
        address: body.address,
        city: body.city,
        status: 'draft',
        created_by: user.id,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data, { status: 201 })
  } catch (error: any) {
    console.error('POST /api/projects error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
```

Crea: `app/api/projects/[id]/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/projects/:id
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        client:clients(*),
        items:project_items(
          *,
          window_type:window_types(*)
        )
      `)
      .eq('id', params.id)
      .eq('created_by', user.id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Project not found' }, { status: 404 })
      }
      throw error
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error('GET /api/projects/:id error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/projects/:id
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    const { data, error } = await supabase
      .from('projects')
      .update(body)
      .eq('id', params.id)
      .eq('created_by', user.id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error: any) {
    console.error('PUT /api/projects/:id error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/projects/:id
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', params.id)
      .eq('created_by', user.id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('DELETE /api/projects/:id error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
```

---

## 8. EDITOR CANVAS - SPECIFICHE TECNICHE

### 8.1 Canvas Store (Zustand)

Crea: `store/editor-store.ts`

```typescript
import { create } from 'zustand'

export interface CanvasWindow {
  id: string
  x: number
  y: number
  width: number
  height: number
  windowTypeId: string
  rotation: number
  zIndex: number
}

interface EditorState {
  // Canvas state
  windows: CanvasWindow[]
  selectedWindowId: string | null
  zoom: number
  pan: { x: number; y: number }
  gridSize: number
  snapToGrid: boolean
  showGrid: boolean
  showRulers: boolean
  
  // Actions
  addWindow: (window: CanvasWindow) => void
  updateWindow: (id: string, updates: Partial<CanvasWindow>) => void
  deleteWindow: (id: string) => void
  selectWindow: (id: string | null) => void
  setZoom: (zoom: number) => void
  setPan: (pan: { x: number; y: number }) => void
  toggleGrid: () => void
  toggleSnap: () => void
  clearCanvas: () => void
}

export const useEditorStore = create<EditorState>((set) => ({
  windows: [],
  selectedWindowId: null,
  zoom: 1,
  pan: { x: 0, y: 0 },
  gridSize: 50,
  snapToGrid: true,
  showGrid: true,
  showRulers: true,

  addWindow: (window) =>
    set((state) => ({
      windows: [...state.windows, window],
      selectedWindowId: window.id,
    })),

  updateWindow: (id, updates) =>
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, ...updates } : w
      ),
    })),

  deleteWindow: (id) =>
    set((state) => ({
      windows: state.windows.filter((w) => w.id !== id),
      selectedWindowId: state.selectedWindowId === id ? null : state.selectedWindowId,
    })),

  selectWindow: (id) => set({ selectedWindowId: id }),

  setZoom: (zoom) => set({ zoom: Math.max(0.1, Math.min(3, zoom)) }),

  setPan: (pan) => set({ pan }),

  toggleGrid: () => set((state) => ({ showGrid: !state.showGrid })),

  toggleSnap: () => set((state) => ({ snapToGrid: !state.snapToGrid })),

  clearCanvas: () =>
    set({
      windows: [],
      selectedWindowId: null,
      zoom: 1,
      pan: { x: 0, y: 0 },
    }),
}))
```

### 8.2 Canvas Component with Fabric.js

Crea: `components/editor/canvas.tsx`

```typescript
'use client'

import { useEffect, useRef } from 'react'
import { fabric } from 'fabric'
import { useEditorStore } from '@/store/editor-store'

interface CanvasProps {
  projectId: string
  width?: number
  height?: number
}

export function Canvas({ projectId, width = 1200, height = 800 }: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fabricRef = useRef<fabric.Canvas | null>(null)
  
  const { windows, selectedWindowId, zoom, gridSize, showGrid, selectWindow } =
    useEditorStore()

  // Initialize Fabric.js canvas
  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = new fabric.Canvas(canvasRef.current, {
      width,
      height,
      backgroundColor: '#ffffff',
      selection: true,
    })

    fabricRef.current = canvas

    // Event listeners
    canvas.on('selection:created', (e) => {
      if (e.selected && e.selected[0]) {
        const obj = e.selected[0] as any
        selectWindow(obj.windowId)
      }
    })

    canvas.on('selection:cleared', () => {
      selectWindow(null)
    })

    return () => {
      canvas.dispose()
    }
  }, [])

  // Render grid
  useEffect(() => {
    if (!fabricRef.current) return

    const canvas = fabricRef.current
    
    // Clear existing grid
    const objects = canvas.getObjects()
    objects.forEach((obj: any) => {
      if (obj.isGrid) canvas.remove(obj)
    })

    if (showGrid) {
      // Draw vertical lines
      for (let i = 0; i < width; i += gridSize) {
        const line = new fabric.Line([i, 0, i, height], {
          stroke: '#e5e7eb',
          strokeWidth: 1,
          selectable: false,
          evented: false,
        }) as any
        line.isGrid = true
        canvas.add(line)
      }

      // Draw horizontal lines
      for (let i = 0; i < height; i += gridSize) {
        const line = new fabric.Line([0, i, width, i], {
          stroke: '#e5e7eb',
          strokeWidth: 1,
          selectable: false,
          evented: false,
        }) as any
        line.isGrid = true
        canvas.add(line)
      }
    }

    canvas.renderAll()
  }, [showGrid, gridSize, width, height])

  // Render windows
  useEffect(() => {
    if (!fabricRef.current) return

    const canvas = fabricRef.current

    // Remove existing windows
    const objects = canvas.getObjects()
    objects.forEach((obj: any) => {
      if (obj.isWindow) canvas.remove(obj)
    })

    // Add windows
    windows.forEach((window) => {
      // Create window representation
      const rect = new fabric.Rect({
        left: window.x,
        top: window.y,
        width: window.width * 0.3, // Scale down for display
        height: window.height * 0.3,
        fill: '#93c
```typescript
        fill: '#93c5fd',
        stroke: window.id === selectedWindowId ? '#2563eb' : '#64748b',
        strokeWidth: window.id === selectedWindowId ? 3 : 1,
        selectable: true,
        hasControls: true,
      }) as any

      rect.isWindow = true
      rect.windowId = window.id

      canvas.add(rect)
    })

    canvas.renderAll()
  }, [windows, selectedWindowId])

  // Handle zoom
  useEffect(() => {
    if (!fabricRef.current) return
    fabricRef.current.setZoom(zoom)
  }, [zoom])

  return (
    <div className="relative border border-gray-300 rounded-lg overflow-hidden">
      <canvas ref={canvasRef} />
    </div>
  )
}
```

### 8.3 Canvas Toolbar

Crea: `components/editor/canvas-toolbar.tsx`

```typescript
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { 
  Square, 
  Trash2, 
  Grid3x3, 
  ZoomIn, 
  ZoomOut, 
  Undo, 
  Redo,
  Save,
  Download
} from 'lucide-react'
import { useEditorStore } from '@/store/editor-store'

export function CanvasToolbar() {
  const {
    selectedWindowId,
    zoom,
    showGrid,
    snapToGrid,
    setZoom,
    toggleGrid,
    toggleSnap,
    deleteWindow,
  } = useEditorStore()

  const handleZoomIn = () => setZoom(zoom + 0.1)
  const handleZoomOut = () => setZoom(zoom - 0.1)
  const handleResetZoom = () => setZoom(1)

  return (
    <div className="flex items-center gap-2 p-4 bg-white border-b">
      {/* Drawing Tools */}
      <div className="flex items-center gap-1 border-r pr-2">
        <Button variant="outline" size="sm">
          <Square className="h-4 w-4" />
        </Button>
      </div>

      {/* Edit Tools */}
      <div className="flex items-center gap-1 border-r pr-2">
        <Button
          variant="outline"
          size="sm"
          disabled={!selectedWindowId}
          onClick={() => selectedWindowId && deleteWindow(selectedWindowId)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" disabled>
          <Undo className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" disabled>
          <Redo className="h-4 w-4" />
        </Button>
      </div>

      {/* View Tools */}
      <div className="flex items-center gap-1 border-r pr-2">
        <Button
          variant={showGrid ? 'default' : 'outline'}
          size="sm"
          onClick={toggleGrid}
        >
          <Grid3x3 className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={handleZoomOut}>
          <ZoomOut className="h-4 w-4" />
        </Button>
        <span className="text-sm font-medium min-w-[60px] text-center">
          {Math.round(zoom * 100)}%
        </span>
        <Button variant="outline" size="sm" onClick={handleZoomIn}>
          <ZoomIn className="h-4 w-4" />
        </Button>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 ml-auto">
        <Button variant="outline" size="sm">
          <Save className="h-4 w-4 mr-2" />
          Salva
        </Button>
        <Button variant="default" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Genera Preventivo
        </Button>
      </div>
    </div>
  )
}
```

### 8.4 Properties Panel

Crea: `components/editor/properties-panel.tsx`

```typescript
'use client'

import { useEditorStore } from '@/store/editor-store'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Trash2 } from 'lucide-react'

export function PropertiesPanel() {
  const { windows, selectedWindowId, updateWindow, deleteWindow } = useEditorStore()

  const selectedWindow = windows.find((w) => w.id === selectedWindowId)

  if (!selectedWindow) {
    return (
      <Card className="w-80">
        <CardHeader>
          <CardTitle>Proprietà</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">
            Seleziona un elemento sulla canvas per modificarne le proprietà
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-80">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Proprietà Finestra</CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => deleteWindow(selectedWindow.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Position */}
        <div className="space-y-2">
          <Label>Posizione</Label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="x" className="text-xs">X (mm)</Label>
              <Input
                id="x"
                type="number"
                value={selectedWindow.x}
                onChange={(e) =>
                  updateWindow(selectedWindow.id, { x: Number(e.target.value) })
                }
              />
            </div>
            <div>
              <Label htmlFor="y" className="text-xs">Y (mm)</Label>
              <Input
                id="y"
                type="number"
                value={selectedWindow.y}
                onChange={(e) =>
                  updateWindow(selectedWindow.id, { y: Number(e.target.value) })
                }
              />
            </div>
          </div>
        </div>

        {/* Dimensions */}
        <div className="space-y-2">
          <Label>Dimensioni</Label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="width" className="text-xs">Larghezza (mm)</Label>
              <Input
                id="width"
                type="number"
                value={selectedWindow.width}
                onChange={(e) =>
                  updateWindow(selectedWindow.id, { width: Number(e.target.value) })
                }
              />
            </div>
            <div>
              <Label htmlFor="height" className="text-xs">Altezza (mm)</Label>
              <Input
                id="height"
                type="number"
                value={selectedWindow.height}
                onChange={(e) =>
                  updateWindow(selectedWindow.id, { height: Number(e.target.value) })
                }
              />
            </div>
          </div>
        </div>

        {/* Rotation */}
        <div className="space-y-2">
          <Label htmlFor="rotation">Rotazione (gradi)</Label>
          <Input
            id="rotation"
            type="number"
            value={selectedWindow.rotation}
            onChange={(e) =>
              updateWindow(selectedWindow.id, { rotation: Number(e.target.value) })
            }
          />
        </div>

        {/* Window Type Info */}
        <div className="pt-4 border-t">
          <p className="text-xs text-gray-500">
            ID Tipologia: {selectedWindow.windowTypeId}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
```

---

## 9. SISTEMA DI CALCOLO PREZZI

### 9.1 Price Calculation Utility

Crea: `lib/utils/calculations.ts`

```typescript
import { PriceList, WindowType, ProjectItem } from '@/types/supabase'

export interface PriceCalculation {
  basePrice: number
  areaPrice: number
  hardwarePrice: number
  installationPrice: number
  subtotal: number
  vatAmount: number
  total: number
}

export interface ItemCalculation extends PriceCalculation {
  itemId: string
  description: string
  quantity: number
  itemTotal: number
}

/**
 * Calcola il prezzo per un singolo item
 */
export function calculateItemPrice(
  item: ProjectItem,
  windowType: WindowType,
  priceList: PriceList
): ItemCalculation {
  // Converti dimensioni da mm a m²
  const widthM = item.width / 1000
  const heightM = item.height / 1000
  const areaM2 = widthM * heightM

  // Prezzo base fisso
  const basePrice = windowType.base_price || 0

  // Prezzo area (€/m²)
  const areaPrice = areaM2 * (priceList.price_per_sqm || 0)

  // Prezzo ferramenta (fisso per item)
  const hardwarePrice = windowType.hardware_price || 0

  // Prezzo installazione (€/m²)
  const installationPrice = areaM2 * (priceList.installation_per_sqm || 0)

  // Calcolo subtotale
  const subtotal = basePrice + areaPrice + hardwarePrice + installationPrice

  // IVA (22% o custom)
  const vatRate = priceList.vat_rate || 0.22
  const vatAmount = subtotal * vatRate

  // Totale con IVA
  const total = subtotal + vatAmount

  // Totale per item (moltiplicato per quantità)
  const itemTotal = total * item.quantity

  return {
    itemId: item.id,
    description: `${windowType.name} ${widthM.toFixed(2)}x${heightM.toFixed(2)}m`,
    quantity: item.quantity,
    basePrice,
    areaPrice,
    hardwarePrice,
    installationPrice,
    subtotal,
    vatAmount,
    total,
    itemTotal,
  }
}

/**
 * Calcola il totale del progetto
 */
export interface ProjectTotals {
  items: ItemCalculation[]
  subtotal: number
  vatAmount: number
  total: number
  itemCount: number
  totalArea: number
}

export function calculateProjectTotals(
  items: ProjectItem[],
  windowTypes: WindowType[],
  priceList: PriceList
): ProjectTotals {
  const calculations = items.map((item) => {
    const windowType = windowTypes.find((wt) => wt.id === item.window_type_id)
    if (!windowType) {
      throw new Error(`Window type not found for item ${item.id}`)
    }
    return calculateItemPrice(item, windowType, priceList)
  })

  const subtotal = calculations.reduce((sum, calc) => sum + calc.itemTotal - calc.vatAmount * calc.quantity, 0)
  const vatAmount = calculations.reduce((sum, calc) => sum + calc.vatAmount * calc.quantity, 0)
  const total = subtotal + vatAmount

  const totalArea = items.reduce((sum, item) => {
    return sum + (item.width / 1000) * (item.height / 1000) * item.quantity
  }, 0)

  return {
    items: calculations,
    subtotal,
    vatAmount,
    total,
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
    totalArea,
  }
}

/**
 * Applica uno sconto percentuale
 */
export function applyDiscount(amount: number, discountPercent: number): number {
  return amount * (1 - discountPercent / 100)
}

/**
 * Formatta il prezzo in Euro
 */
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount)
}

/**
 * Formatta l'area in m²
 */
export function formatArea(areaM2: number): string {
  return `${areaM2.toFixed(2)} m²`
}
```

### 9.2 Quote Summary Component

Crea: `components/quote/quote-summary.tsx`

```typescript
'use client'

import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download, FileText } from 'lucide-react'
import { calculateProjectTotals, formatPrice, formatArea } from '@/lib/utils/calculations'
import { ProjectItem, WindowType, PriceList } from '@/types/supabase'

interface QuoteSummaryProps {
  items: ProjectItem[]
  windowTypes: WindowType[]
  priceList: PriceList
  onGeneratePDF: () => void
}

export function QuoteSummary({ 
  items, 
  windowTypes, 
  priceList, 
  onGeneratePDF 
}: QuoteSummaryProps) {
  const totals = useMemo(
    () => calculateProjectTotals(items, windowTypes, priceList),
    [items, windowTypes, priceList]
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Riepilogo Preventivo</span>
          <Button onClick={onGeneratePDF} size="sm">
            <Download className="h-4 w-4 mr-2" />
            Genera PDF
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 pb-4 border-b">
          <div>
            <p className="text-sm text-gray-500">Elementi</p>
            <p className="text-2xl font-bold">{totals.itemCount}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Area Totale</p>
            <p className="text-2xl font-bold">{formatArea(totals.totalArea)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Tipologie</p>
            <p className="text-2xl font-bold">{windowTypes.length}</p>
          </div>
        </div>

        {/* Items List */}
        <div className="space-y-2">
          <h4 className="font-semibold text-sm">Dettaglio Articoli</h4>
          {totals.items.map((item) => (
            <div
              key={item.itemId}
              className="flex items-center justify-between py-2 border-b last:border-0"
            >
              <div className="flex-1">
                <p className="text-sm font-medium">{item.description}</p>
                <p className="text-xs text-gray-500">
                  Quantità: {item.quantity} | Prezzo unitario: {formatPrice(item.total)}
                </p>
              </div>
              <p className="font-semibold">{formatPrice(item.itemTotal)}</p>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="space-y-2 pt-4 border-t">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Subtotale</span>
            <span className="font-medium">{formatPrice(totals.subtotal)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              IVA ({(priceList.vat_rate * 100).toFixed(0)}%)
            </span>
            <span className="font-medium">{formatPrice(totals.vatAmount)}</span>
          </div>
          <div className="flex items-center justify-between text-lg font-bold pt-2 border-t">
            <span>Totale</span>
            <span className="text-blue-600">{formatPrice(totals.total)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-4">
          <Button variant="outline" className="flex-1" size="sm">
            <FileText className="h-4 w-4 mr-2" />
            Anteprima
          </Button>
          <Button className="flex-1" size="sm" onClick={onGeneratePDF}>
            <Download className="h-4 w-4 mr-2" />
            Scarica PDF
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
```

---

## 10. GENERAZIONE PDF PREVENTIVI

### 10.1 PDF Generator

Crea: `lib/pdf/generator.ts`

```typescript
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { format } from 'date-fns'
import { it } from 'date-fns/locale'
import { ProjectTotals, formatPrice, formatArea } from '@/lib/utils/calculations'

export interface PDFConfig {
  projectName: string
  projectNumber: string
  clientName: string
  clientAddress?: string
  clientPhone?: string
  clientEmail?: string
  date: Date
  validUntil: Date
  notes?: string
}

export function generateQuotePDF(config: PDFConfig, totals: ProjectTotals): Blob {
  const doc = new jsPDF()

  // Company Header
  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.text('ALM INFISSI', 20, 20)

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text('A.L.M. Infissi di Alessandro e Luigi Cappello', 20, 27)
  doc.text('Via Example 123, Palermo (PA)', 20, 32)
  doc.text('Tel: +39 XXX XXX XXXX | Email: info@alminfissi.it', 20, 37)
  doc.text('P.IVA: XXXXXXXXXXX', 20, 42)

  // Divider
  doc.setLineWidth(0.5)
  doc.line(20, 48, 190, 48)

  // Quote Title
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text('PREVENTIVO', 105, 58, { align: 'center' })

  // Quote Info
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text(`N° Preventivo: ${config.projectNumber}`, 20, 68)
  doc.text(`Data: ${format(config.date, 'dd MMMM yyyy', { locale: it })}`, 20, 73)
  doc.text(
    `Valido fino al: ${format(config.validUntil, 'dd MMMM yyyy', { locale: it })}`,
    20,
    78
  )

  // Client Info
  doc.setFont('helvetica', 'bold')
  doc.text('CLIENTE:', 120, 68)
  doc.setFont('helvetica', 'normal')
  doc.text(config.clientName, 120, 73)
  if (config.clientAddress) doc.text(config.clientAddress, 120, 78)
  if (config.clientPhone) doc.text(`Tel: ${config.clientPhone}`, 120, 83)
  if (config.clientEmail) doc.text(`Email: ${config.clientEmail}`, 120, 88)

  // Items Table
  const tableData = totals.items.map((item) => [
    item.description,
    item.quantity.toString(),
    formatPrice(item.total),
    formatPrice(item.itemTotal),
  ])

  autoTable(doc, {
    startY: 100,
    head: [['Descrizione', 'Quantità', 'Prezzo Unitario', 'Totale']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: 255,
      fontStyle: 'bold',
    },
    styles: {
      fontSize: 9,
    },
    columnStyles: {
      0: { cellWidth: 90 },
      1: { cellWidth: 30, halign: 'center' },
      2: { cellWidth: 35, halign: 'right' },
      3: { cellWidth: 35, halign: 'right' },
    },
  })

  // Totals Section
  const finalY = (doc as any).lastAutoTable.finalY + 10

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  
  doc.text('Subtotale:', 130, finalY)
  doc.text(formatPrice(totals.subtotal), 190, finalY, { align: 'right' })

  doc.text('IVA (22%):', 130, finalY + 6)
  doc.text(formatPrice(totals.vatAmount), 190, finalY + 6, { align: 'right' })

  doc.setLineWidth(0.5)
  doc.line(130, finalY + 10, 190, finalY + 10)

  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('TOTALE:', 130, finalY + 18)
  doc.text(formatPrice(totals.total), 190, finalY + 18, { align: 'right' })

  // Summary Info
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.text(`Elementi totali: ${totals.itemCount}`, 20, finalY)
  doc.text(`Area totale: ${formatArea(totals.totalArea)}`, 20, finalY + 6)

  // Notes
  if (config.notes) {
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text('NOTE:', 20, finalY + 30)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    const splitNotes = doc.splitTextToSize(config.notes, 170)
    doc.text(splitNotes, 20, finalY + 36)
  }

  // Footer
  doc.setFontSize(8)
  doc.setFont('helvetica', 'italic')
  doc.text(
    'Preventivo valido salvo esaurimento scorte. Tempi di consegna da concordare.',
    105,
    280,
    { align: 'center' }
  )

  // Generate Blob
  return doc.output('blob')
}

/**
 * Download PDF to user's device
 */
export function downloadPDF(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
```

### 10.2 PDF API Route

Crea: `app/api/projects/[id]/pdf/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateQuotePDF } from '@/lib/pdf/generator'
import { calculateProjectTotals } from '@/lib/utils/calculations'
import { addDays } from 'date-fns'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()

    // Auth check
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch project with relations
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select(
        `
        *,
        client:clients(*),
        items:project_items(*),
        price_list:price_lists(*)
      `
      )
      .eq('id', params.id)
      .eq('created_by', user.id)
      .single()

    if (projectError) throw projectError

    // Fetch window types for items
    const windowTypeIds = project.items.map((item: any) => item.window_type_id)
    const { data: windowTypes, error: windowTypesError } = await supabase
      .from('window_types')
      .select('*')
      .in('id', windowTypeIds)

    if (windowTypesError) throw windowTypesError

    // Calculate totals
    const totals = calculateProjectTotals(
      project.items,
      windowTypes,
      project.price_list
    )

    // Generate PDF
    const pdfBlob = generateQuotePDF(
      {
        projectName: project.name,
        projectNumber: project.project_number || 'N/A',
        clientName: project.client.name,
        clientAddress: project.client.address,
        clientPhone: project.client.phone,
        clientEmail: project.client.email,
        date: new Date(),
        validUntil: addDays(new Date(), 30),
        notes: project.notes,
      },
      totals
    )

    // Convert Blob to Buffer for response
    const buffer = await pdfBlob.arrayBuffer()

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Preventivo_${project.project_number}.pdf"`,
      },
    })
  } catch (error: any) {
    console.error('PDF generation error:', error)
    return NextResponse.json(
      { error: error.message || 'PDF generation failed' },
      { status: 500 }
    )
  }
}
```

---

## 11. FILE DA CREARE - CHECKLIST COMPLETA

### 11.1 Core Configuration Files

```plaintext
✅ package.json                    # Dependencies
✅ tsconfig.json                   # TypeScript config
✅ next.config.js                  # Next.js config
✅ tailwind.config.js              # Tailwind CSS config
✅ .eslintrc.json                  # ESLint rules
✅ .prettierrc                     # Prettier config
✅ .env.local                      # Environment variables
✅ .gitignore                      # Git ignore rules
```

### 11.2 App Router Structure

```plaintext
📁 app/
  📁 (auth)/
    📁 login/
      ✅ page.tsx
    📁 register/
      ✅ page.tsx
    ✅ layout.tsx
  
  📁 (dashboard)/
    ✅ page.tsx                    # Dashboard home
    ✅ layout.tsx                  # With sidebar
    
    📁 clients/
      ✅ page.tsx                  # List
      ✅ new/page.tsx              # Create
      ✅ [id]/page.tsx             # Detail
    
    📁 projects/
      ✅ page.tsx                  # List
      ✅ new/page.tsx              # Create wizard
      ✅ [id]/page.tsx             # Detail
      ✅ [id]/edit/page.tsx        # Edit
    
    📁 editor/
      ✅ [projectId]/page.tsx      # Canvas editor
    
    📁 catalog/
      ✅ page.tsx                  # Products
      ✅ [id]/page.tsx             # Product detail
    
    📁 settings/
      ✅ page.tsx
      ✅ profile/page.tsx
      ✅ price-lists/page.tsx
      ✅ users/page.tsx
  
  📁 api/
    📁 auth/
      ✅ callback/route.ts
    📁 projects/
      ✅ route.ts
      ✅ [id]/route.ts
      ✅ [id]/items/route.ts
      ✅ [id]/pdf/route.ts
    📁 clients/
      ✅ route.ts
      ✅ [id]/route.ts
    📁 window-types/
      ✅ route.ts
  
  ✅ layout.tsx                    # Root layout
  ✅ providers.tsx                 # App providers
  ✅ globals.css                   # Global styles
```

### 11.3 Components

```plaintext
📁 components/
  📁 ui/                           # Base components (20+ files)
    ✅ button.tsx
    ✅ input.tsx
    ✅ select.tsx
    ✅ dialog.tsx
    ✅ card.tsx
    ✅ table.tsx
    ✅ tabs.tsx
    ✅ form.tsx
    ✅ label.tsx
    ✅ dropdown-menu.tsx
    ... (altri Radix UI components)
  
  📁 layout/
    ✅ header.tsx
    ✅ sidebar.tsx
    ✅ navigation.tsx
    ✅ footer.tsx
  
  📁 auth/
    ✅ login-form.tsx
    ✅ register-form.tsx
    ✅ auth-guard.tsx
  
  📁 clients/
    ✅ client-list.tsx
    ✅ client-card.tsx
    ✅ client-form.tsx
    ✅ client-search.tsx
  
  📁 projects/
    ✅ project-list.tsx
    ✅ project-card.tsx
    ✅ project-form.tsx
    ✅ project-wizard.tsx
    ✅ project-status.tsx
  
  📁 editor/
    ✅ canvas.tsx
    ✅ canvas-toolbar.tsx
    ✅ properties-panel.tsx
    ✅ window-element.tsx
    ✅ grid-overlay.tsx
    ✅ zoom-controls.tsx
    ✅ canvas-context-menu.tsx
  
  📁 quote/
    ✅ quote-summary.tsx
    ✅ quote-item-row.tsx
    ✅ price-breakdown.tsx
    ✅ pdf-preview.tsx
  
  📁 catalog/
    ✅ product-grid.tsx
    ✅ product-card.tsx
    ✅ category-filter.tsx
    ✅ window-type-card.tsx
```

### 11.4 Lib Files

```plaintext
📁 lib/
  📁 supabase/
    ✅ client.ts                   # Client-side Supabase
    ✅ server.ts                   # Server-side Supabase
    ✅ middleware.ts               # Auth middleware
  
  📁 api/
    ✅ clients.ts                  # Client API functions
    ✅ projects.ts                 # Project API functions
    ✅ window-types.ts             # Window types API
    ✅ products.ts                 # Products API
  
  📁 utils/
    ✅ cn.ts                       # className utility
    ✅ format.ts                   # Formatters
    ✅ calculations.ts             # Price calculations
    ✅ validation.ts               # Validation helpers
  
  📁 pdf/
    ✅ generator.ts                # PDF generation
```

### 11.5 Types

```plaintext
📁 types/
  ✅ supabase.ts                   # Auto-generated from Supabase
  ✅ index.ts                      # Custom types
```

### 11.6 Hooks

```plaintext
📁 hooks/
  ✅ use-auth.ts                   # Auth state
  ✅ use-projects.ts               # Projects queries
  ✅ use-clients.ts                # Clients queries
  ✅ use-canvas.ts                 # Canvas state
  ✅ use-window-types.ts           # Window types
  ✅ use-debounce.ts               # Debounce utility
```

### 11.7 Store

```plaintext
📁 store/
  ✅ editor-store.ts               # Canvas editor state
  ✅ ui-store.ts                   # UI state (optional)
```

### 11.8 Database

```plaintext
📁 supabase/
  ✅ migrations/
    ✅ 20240101_initial_schema.sql
  ✅ seed.sql                      # Initial data
  ✅ config.toml                   # Supabase config
```

**TOTALE FILE DA CREARE: ~80-100 files**

---

## 12. CONFIGURAZIONI E VARIABILI D'AMBIENTE

### 12.1 Environment Variables

Crea: `.env.local`

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME="ALM Infissi"

# Optional: For server-side operations
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# PDF Configuration (optional)
PDF_FONT_PATH=/fonts
PDF_LOGO_PATH=/public/logo.png

# Email Configuration (se usi email)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=noreply@alminfissi.it
SMTP_PASSWORD=your-password

# Analytics (optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### 12.2 Next.js Configuration

Crea: `next.config.js`

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'your-project.supabase.co', // Supabase Storage
    ],
    formats: ['image/avif', 'image/webp'],
  },
  
  // Webpack configuration for Fabric.js
  webpack: (config) => {
    config.externals.push({
      canvas: 'commonjs canvas',
    })
    return config
  },

  // Environment variables
  env: {
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
  },

  // Strict mode
  reactStrictMode: true,

  // Experimental features
  experimental: {
    serverActions: true,
  },
}

module.exports = nextConfig
```

### 12.3 TypeScript Configuration

Crea: `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"],
      "@/components/*": ["./components/*"],
      "@/lib/*": ["./lib/*"],
      "@/hooks/*": ["./hooks/*"],
      "@/types/*": ["./types/*"],
      "@/store/*": ["./store/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### 12.4 Tailwind Configuration

Crea: `tailwind.config.js`

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
```

### 12.5 ESLint Configuration

Crea: `.eslintrc.json`

```json
{
  "extends": [
    "next/core-web-vitals",
    "prettier"
  ],
  "rules": {
    "react/no-unescaped-entities": "off",
    "@next/next/no-html-link-for-pages": "off",
    "react/jsx-key": "warn"
  }
}
```

### 12.6 Prettier Configuration

Crea: `.prettierrc`

```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

---

## 13. TESTING STRATEGY

### 13.1 Testing Overview

```typescript
// Test Pyramid per ALM Infissi
┌─────────────────────────┐
│   E2E Tests (5%)        │  ← Playwright
│   - Critical user flows │
│   - Purchase flow       │
└─────────────────────────┘
┌─────────────────────────────┐
│   Integration Tests (15%)   │  ← React Testing Library
│   - Component interactions  │
│   - API integration        │
└─────────────────────────────┘
┌───────────────────────────────────┐
│   Unit Tests (80%)                │  ← Jest + Vitest
│   - Utility functions             │
│   - Business logic                │
│   - Price calculations            │
└───────────────────────────────────┘
```

### 13.2 Unit Tests Setup

```bash
# Install testing dependencies
npm install -D @testing-library/react @testing-library/jest-dom
npm install -D @testing-library/user-event
npm install -D jest jest-environment-jsdom
npm install -D @types/jest
```

Crea: `jest.config.js`

```javascript
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)',
  ],
  collectCoverageFrom: [
    'app/**/*.{js,jsx,ts,tsx}',
    'components/**/*.{js,jsx,ts,tsx}',
    'lib/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
}

module.exports = createJestConfig(customJestConfig)
```

### 13.3 Example Unit Tests

Crea: `lib/utils/__tests__/calculations.test.ts`

```typescript
import { calculateItemPrice, calculateProjectTotals, formatPrice } from '../calculations'
import { WindowType, PriceList, ProjectItem } from '@/types/supabase'

describe('Price Calculations', () => {
  const mockWindowType: WindowType = {
    id: '1',
    name: 'Finestra Standard',
    code: 'WIN-001',
    base_price: 100,
    hardware_price: 50,
    price_per_sqm: 200,
  }

  const mockPriceList: PriceList = {
    id: '1',
    name: 'Listino Base',
    price_per_sqm: 200,
    installation_per_sqm: 50,
    vat_rate: 0.22,
  }

  const mockItem: ProjectItem = {
    id: '1',
    project_id: 'proj-1',
    width: 1000, // 1m
    height: 1500, // 1.5m = 1.5 m²
    quantity: 2,
    window_type_id: '1',
  }

  it('should calculate item price correctly', () => {
    const result = calculateItemPrice(mockItem, mockWindowType, mockPriceList)

    // Base: 100
    // Area: 1.5m² * 200 = 300
    // Hardware: 50
    // Installation: 1.5m² * 50 = 75
    // Subtotal: 525
    // VAT (22%): 115.5
    // Total: 640.5

    expect(result.basePrice).toBe(100)
    expect(result.areaPrice).toBe(300)
    expect(result.hardwarePrice).toBe(50)
    expect(result.installationPrice).toBe(75)
    expect(result.subtotal).toBe(525)
    expect(result.vatAmount).toBeCloseTo(115.5, 2)
    expect(result.total).toBeCloseTo(640.5, 2)
    expect(result.itemTotal).toBeCloseTo(1281, 2) // * quantity 2
  })

  it('should format price correctly', () => {
    expect(formatPrice(1234.56)).toBe('€1.234,56')
    expect(formatPrice(0)).toBe('€0,00')
    expect(formatPrice(999999.99)).toBe('€999.999,99')
  })

  it('should calculate project totals', () => {
    const items = [mockItem, { ...mockItem, id: '2' }]
    const windowTypes = [mockWindowType]

    const result = calculateProjectTotals(items, windowTypes, mockPriceList)

    expect(result.itemCount).toBe(4) // 2 items * 2 quantity
    expect(result.items.length).toBe(2)
  })
})
```

### 13.4 Component Tests

Crea: `components/__tests__/button.test.tsx`

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from '@/components/ui/button'

describe('Button Component', () => {
  it('renders button with text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('calls onClick handler when clicked', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    
    fireEvent.click(screen.getByText('Click me'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>)
    expect(screen.getByText('Click me')).toBeDisabled()
  })

  it('applies variant classes correctly', () => {
    const { container } = render(<Button variant="destructive">Delete</Button>)
    expect(container.firstChild).toHaveClass('bg-destructive')
  })
})
```

### 13.5 Integration Tests

Crea: `app/(dashboard)/projects/__tests__/project-list.integration.test.tsx`

```typescript
import { render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import ProjectList from '../page'

// Mock Supabase
jest.mock('@/lib/supabase/client', () => ({
  createClient: jest.fn(() => ({
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          data: [
            {
              id: '1',
              name: 'Test Project',
              status: 'draft',
              total_amount: 5000,
            },
          ],
          error: null,
        })),
      })),
    })),
    auth: {
      getUser: jest.fn(() => ({
        data: { user: { id: 'user-1' } },
        error: null,
      })),
    },
  })),
}))

describe('Project List Integration', () => {
  it('renders projects from API', async () => {
    const queryClient = new QueryClient()

    render(
      <QueryClientProvider client={queryClient}>
        <ProjectList />
      </QueryClientProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('Test Project')).toBeInTheDocument()
    })
  })
})
```

### 13.6 E2E Tests (Optional)

```bash
# Install Playwright
npm install -D @playwright/test
npx playwright install
```

Crea: `e2e/login.spec.ts`

```typescript
import { test, expect } from '@playwright/test'

test.describe('Login Flow', () => {
  test('should login successfully', async ({ page }) => {
    await page.goto('http://localhost:3000/login')

    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', 'password123')
    await page.click('button[type="submit"]')

    await expect(page).toHaveURL('/dashboard')
    await expect(page.locator('text=Dashboard')).toBeVisible()
  })

  test('should show error on invalid credentials', async ({ page }) => {
    await page.goto('http://localhost:3000/login')

    await page.fill('input[name="email"]', 'wrong@example.com')
    await page.fill('input[name="password"]', 'wrongpassword')
    await page.click('button[type="submit"]')

    await expect(page.locator('text=Invalid credentials')).toBeVisible()
  })
})
```

---

## 14. DEPLOYMENT

### 14.1 Vercel Deployment (Raccomandato)

**Step-by-Step:**

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Login
vercel login

# 3. Deploy (dalla root del progetto)
vercel

# 4. Deploy production
vercel --prod
```

**Configurazione automatica:**
- Vercel rileva automaticamente Next.js
- Build command: `next build`
- Output directory: `.next`
- Install command: `npm install`

### 14.2 Environment Variables su Vercel

Nel Vercel Dashboard:
1. Vai su Settings → Environment Variables
2. Aggiungi tutte le variabili da `.env.local`:

```plaintext
NEXT_PUBLIC_SUPABASE_URL         → your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY    → your-anon-key
SUPABASE_SERVICE_ROLE_KEY        → your-service-key (only Production)
NEXT_PUBLIC_APP_URL              → https://alminfissi.vercel.app
```

### 14.3 Vercel.json (Opzionale)

Crea: `vercel.json`

```json
{
  "buildCommand": "next build",
  "devCommand": "next dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["cdg1"],
  "headers": [
    {
      "source": "/api/:path*",
      "headers": [
        { "key": "Access-Control-Allow-Origin", "value": "*" },
        { "key": "Access-Control-Allow-Methods", "value": "GET,POST,PUT,DELETE,OPTIONS" },
        { "key": "Access-Control-Allow-Headers", "value": "Content-Type, Authorization" }
      ]
    }
  ]
}
```

### 14.4 Database Migration su Supabase

```bash
# 1. Crea migration locale
npx supabase migration new add_indexes

# 2. Edita il file in supabase/migrations/
# Aggiungi SQL per ottimizzazioni

# 3. Push to remote
npx supabase db push

# 4. Genera nuovi types
npx supabase gen types typescript --linked > types/supabase.ts
```

### 14.5 CI/CD con GitHub Actions (Opzionale)

Crea: `.github/workflows/ci.yml`

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linter
        run: npm run lint
      
      - name: Run tests
        run: npm test
      
      - name: Build
        run: npm run build
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

### 14.6 Performance Optimization Checklist

```typescript
// Ottimizzazioni pre-deploy:

✅ 1. Immagini
   - Usa next/image per tutte le immagini
   - Ottimizza con Sharp (built-in Next.js)
   - WebP format dove possibile

✅ 2. Code Splitting
   - Dynamic imports per componenti pesanti
   - Route-based splitting (automatico con App Router)
   
✅ 3. Caching
   - ISR per pagine statiche
   - Supabase query caching con React Query
   
✅ 4. Bundle Size
   - Analizza: npm run build
   - Usa Webpack Bundle Analyzer
   
✅ 5. Database
   - Indici su colonne frequentemente query
   - RLS policies ottimizzate
   
✅ 6. Fonts
   - Google Fonts via next/font
   - Preconnect DNS per font esterni
```

### 14.7 Monitoring e Analytics

**Setup Google Analytics:**

```typescript
// app/layout.tsx
import { GoogleAnalytics } from '@next/third-parties/google'

export default function RootLayout({ children }: { children: React.Node }) {
  return (
    <html lang="it">
      <body>
        {children}
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID!} />
      </body>
    </html>
  )
}
```

**Vercel Analytics (Opzionale):**

```bash
npm install @vercel/analytics
```

```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }: { children: React.Node }) {
  return (
    <html lang="it">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

### 14.8 Backup Strategy

```plaintext
Supabase Backups:
✅ Daily automatic backups (Supabase Pro Plan)
✅ Point-in-time recovery
✅ Export manuale via SQL:
   npx supabase db dump > backup.sql

File Storage:
✅ Supabase Storage (replicated automaticamente)
✅ Export periodico via API

Code:
✅ Git + GitHub (version control)
✅ Tag releases: git tag v1.0.0
```

### 14.9 Post-Deployment Checklist

```typescript
✅ 1. Verifica funzionalità critiche
   - Login/Register
   - Creazione progetto
   - Generazione PDF
   - Upload immagini

✅ 2. Performance
   - Google PageSpeed Insights
   - Lighthouse audit
   - Core Web Vitals

✅ 3. Security
   - HTTPS attivo
   - Headers di sicurezza
   - RLS policies attive

✅ 4. SEO (se applicabile)
   - Meta tags
   - Sitemap
   - robots.txt

✅ 5. Monitoring
   - Vercel Dashboard
   - Supabase Dashboard
   - Error tracking (Sentry opzionale)
```

---

## 📌 CONCLUSIONI

### Riassunto Finale

Questo documento fornisce tutte le specifiche tecniche necessarie per sviluppare il **Configuratore e Preventivatore Serramenti ALM Infissi**.

**Stack Tecnologico Scelto:**
- ✅ **Next.js 14** (App Router) - Frontend framework
- ✅ **Supabase** - Backend as a Service
- ✅ **TypeScript** - Type safety
- ✅ **Tailwind CSS + shadcn/ui** - Styling
- ✅ **Fabric.js** - Canvas editor
- ✅ **jsPDF** - PDF generation
- ✅ **Vercel** - Hosting

**Tempi di Sviluppo Stimati:**
- Setup iniziale: 3-4 giorni
- Database + Auth: 2-3 giorni
- UI Components: 1-2 settimane
- Canvas Editor: 2-3 settimane
- Sistema Prezzi: 1 settimana
- PDF Generation: 3-4 giorni
- Testing: 1 settimana
- **TOTALE: 6-8 settimane**

**Costi Mensili Stimati:**
- Supabase: €0-25/mese (Free tier / Pro)
- Vercel: €0-20/mese (Hobby / Pro)
- Dominio: €10-15/anno
- **TOTALE: €25-45/mese**

### Prossimi Passi

1. **Setup Progetto** (Giorno 1)
   ```bash
   npx create-next-app@latest alm-infissi
   # Installa dipendenze come da Sezione 1
   ```

2. **Setup Supabase** (Giorno 1)
   - Crea progetto su supabase.com
   - Esegui SQL schema (Sezione 4)
   - Configura environment variables

3. **Sviluppo Iterativo**
   - Sprint 1: Auth + Base UI (settimana 1-2)
   - Sprint 2: Gestione Clienti/Progetti (settimana 2-3)
   - Sprint 3: Canvas Editor (settimana 4-6)
   - Sprint 4: Sistema Prezzi + PDF (settimana 7-8)

4. **Testing & Deploy**
   - Testing continuo durante sviluppo
   - Deploy incrementale su Vercel
   - Launch MVP fine settimana 8

### Supporto e Risorse

**Documentazione Ufficiale:**
- Next.js: https://nextjs.org/docs
- Supabase: https://supabase.com/docs
- Fabric.js: http://fabricjs.com/docs
- Tailwind CSS: https://tailwindcss.com/docs

**Community:**
- Next.js Discord: https://discord.gg/nextjs
- Supabase Discord: https://discord.supabase.com
- Stack Overflow: Tag `next.js`, `supabase`

---

**Documento Tecnico Versione 1.0**  
**ALM Infissi - Dicembre 2025**  
**Tutti i diritti riservati**

---

🚀 **Ready to Build!** 🚀
