/*
  # Auditing Firm Management System - Complete Database Schema

  ## Overview
  This migration creates a comprehensive database structure for an auditing firm management system
  that handles user registration, lead tracking, customer management, service delivery, staff assignments,
  VAT filing, billing, and comprehensive reporting.

  ## New Tables

  ### 1. User & Authentication
    - `user_profiles` - Extended user profile information linked to auth.users
      - `id` (uuid, primary key, references auth.users)
      - `company_name` (text) - Name of the auditing firm
      - `company_logo_url` (text) - URL to company logo for documents
      - `email` (text, unique)
      - `full_name` (text)
      - `phone` (text)
      - `address` (text)
      - `subscription_status` (text) - active, inactive, trial
      - `subscription_plan` (text) - basic, professional, enterprise
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  ### 2. Staff Management
    - `staff_members` - Staff within each firm
      - `id` (uuid, primary key)
      - `user_id` (uuid, references user_profiles) - The firm owner
      - `name` (text)
      - `email` (text)
      - `phone` (text)
      - `role` (text) - accountant, auditor, junior, senior, etc.
      - `is_active` (boolean)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  ### 3. Services
    - `services` - Available services the firm offers
      - `id` (uuid, primary key)
      - `user_id` (uuid, references user_profiles) - The firm owner
      - `name` (text) - VAT Filing, Audit, Bookkeeping, etc.
      - `description` (text)
      - `default_price` (decimal)
      - `billing_cycle` (text) - monthly, quarterly, yearly, one-time
      - `is_active` (boolean)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  ### 4. Leads
    - `leads` - Potential customers
      - `id` (uuid, primary key)
      - `user_id` (uuid, references user_profiles) - The firm owner
      - `unique_code` (text, unique) - Auto-generated unique identifier
      - `name` (text)
      - `company_name` (text)
      - `email` (text)
      - `phone` (text)
      - `mobile` (text)
      - `address` (text)
      - `status` (text) - new, contacted, qualified, negotiating, converted, lost
      - `source` (text) - website, referral, cold-call, etc.
      - `notes` (text)
      - `converted_to_customer_id` (uuid, nullable)
      - `converted_at` (timestamptz, nullable)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `lead_services` - Services requested by leads
      - `id` (uuid, primary key)
      - `lead_id` (uuid, references leads)
      - `service_id` (uuid, references services)
      - `notes` (text)
      - `created_at` (timestamptz)

    - `lead_activities` - Activity log for leads
      - `id` (uuid, primary key)
      - `lead_id` (uuid, references leads)
      - `activity_type` (text) - call, email, meeting, note
      - `description` (text)
      - `created_by` (uuid, references user_profiles)
      - `created_at` (timestamptz)

  ### 5. Customers
    - `customers` - Converted customers
      - `id` (uuid, primary key)
      - `user_id` (uuid, references user_profiles) - The firm owner
      - `unique_code` (text, unique) - Auto-generated unique identifier
      - `name` (text)
      - `company_name` (text)
      - `email` (text)
      - `phone` (text)
      - `mobile` (text)
      - `address` (text)
      - `tax_registration_number` (text)
      - `is_active` (boolean)
      - `notes` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `customer_services` - Services assigned to customers
      - `id` (uuid, primary key)
      - `customer_id` (uuid, references customers)
      - `service_id` (uuid, references services)
      - `status` (text) - active, completed, paused, cancelled
      - `price` (decimal)
      - `billing_cycle` (text)
      - `start_date` (date)
      - `end_date` (date, nullable)
      - `notes` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  ### 6. Tasks & Assignments
    - `tasks` - Work assigned to staff
      - `id` (uuid, primary key)
      - `user_id` (uuid, references user_profiles) - The firm owner
      - `customer_id` (uuid, references customers)
      - `customer_service_id` (uuid, references customer_services)
      - `title` (text)
      - `description` (text)
      - `priority` (text) - low, medium, high, urgent
      - `status` (text) - pending, in_progress, review, completed, cancelled
      - `due_date` (date)
      - `completed_at` (timestamptz, nullable)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `task_assignments` - Staff assigned to tasks
      - `id` (uuid, primary key)
      - `task_id` (uuid, references tasks)
      - `staff_id` (uuid, references staff_members)
      - `assigned_at` (timestamptz)
      - `status` (text) - assigned, working, completed
      - `notes` (text)
      - `updated_at` (timestamptz)

  ### 7. VAT Filing System
    - `vat_returns` - VAT return records
      - `id` (uuid, primary key)
      - `user_id` (uuid, references user_profiles) - The firm owner
      - `customer_id` (uuid, references customers)
      - `task_id` (uuid, references tasks, nullable)
      - `period_type` (text) - monthly, quarterly
      - `period_year` (integer)
      - `period_number` (integer) - 1-12 for monthly, 1-4 for quarterly
      - `period_start_date` (date)
      - `period_end_date` (date)
      - `due_date` (date)
      - `status` (text) - draft, in_progress, review, submitted, filed
      - `filed_date` (date, nullable)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `vat_return_data` - Detailed VAT data
      - `id` (uuid, primary key)
      - `vat_return_id` (uuid, references vat_returns)
      - `total_sales` (decimal, default 0)
      - `exempt_sales` (decimal, default 0)
      - `taxable_sales` (decimal, default 0)
      - `output_tax` (decimal, default 0)
      - `total_purchases` (decimal, default 0)
      - `exempt_purchases` (decimal, default 0)
      - `taxable_purchases` (decimal, default 0)
      - `input_tax` (decimal, default 0)
      - `net_vat_payable` (decimal, default 0) - output_tax - input_tax
      - `adjustments` (decimal, default 0)
      - `total_vat_due` (decimal, default 0)
      - `notes` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  ### 8. Billing & Invoicing
    - `invoices` - Customer invoices
      - `id` (uuid, primary key)
      - `user_id` (uuid, references user_profiles) - The firm owner
      - `customer_id` (uuid, references customers)
      - `invoice_number` (text, unique)
      - `invoice_date` (date)
      - `due_date` (date)
      - `subtotal` (decimal, default 0)
      - `tax_amount` (decimal, default 0)
      - `discount_amount` (decimal, default 0)
      - `total_amount` (decimal, default 0)
      - `amount_paid` (decimal, default 0)
      - `balance_due` (decimal, default 0)
      - `status` (text) - draft, sent, paid, partially_paid, overdue, cancelled
      - `notes` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `invoice_items` - Line items in invoices
      - `id` (uuid, primary key)
      - `invoice_id` (uuid, references invoices)
      - `customer_service_id` (uuid, references customer_services, nullable)
      - `task_id` (uuid, references tasks, nullable)
      - `description` (text)
      - `quantity` (decimal, default 1)
      - `unit_price` (decimal)
      - `total` (decimal)
      - `created_at` (timestamptz)

    - `payments` - Payment records
      - `id` (uuid, primary key)
      - `invoice_id` (uuid, references invoices)
      - `customer_id` (uuid, references customers)
      - `amount` (decimal)
      - `payment_date` (date)
      - `payment_method` (text) - cash, bank_transfer, cheque, card
      - `reference_number` (text)
      - `notes` (text)
      - `created_at` (timestamptz)

  ## Security
    - Enable Row Level Security (RLS) on all tables
    - Users can only access their own firm's data
    - Policies enforce data isolation between different firms

  ## Indexes
    - Created on foreign keys and frequently queried columns for optimal performance
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ======================
-- 1. USER PROFILES TABLE
-- ======================
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  company_name text NOT NULL,
  company_logo_url text,
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  phone text,
  address text,
  subscription_status text DEFAULT 'trial' CHECK (subscription_status IN ('active', 'inactive', 'trial', 'suspended')),
  subscription_plan text DEFAULT 'basic' CHECK (subscription_plan IN ('basic', 'professional', 'enterprise')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- ======================
-- 2. STAFF MEMBERS TABLE
-- ======================
CREATE TABLE IF NOT EXISTS staff_members (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  role text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE staff_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own staff"
  ON staff_members FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE INDEX idx_staff_user_id ON staff_members(user_id);
CREATE INDEX idx_staff_is_active ON staff_members(is_active);

-- ======================
-- 3. SERVICES TABLE
-- ======================
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  default_price decimal(10, 2) DEFAULT 0,
  billing_cycle text DEFAULT 'monthly' CHECK (billing_cycle IN ('monthly', 'quarterly', 'yearly', 'one-time')),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own services"
  ON services FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE INDEX idx_services_user_id ON services(user_id);
CREATE INDEX idx_services_is_active ON services(is_active);

-- ======================
-- 4. LEADS TABLES
-- ======================
CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  unique_code text UNIQUE NOT NULL,
  name text NOT NULL,
  company_name text,
  email text,
  phone text,
  mobile text,
  address text,
  status text DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'negotiating', 'converted', 'lost')),
  source text,
  notes text,
  converted_to_customer_id uuid,
  converted_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own leads"
  ON leads FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE INDEX idx_leads_user_id ON leads(user_id);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_unique_code ON leads(unique_code);

-- Lead Services
CREATE TABLE IF NOT EXISTS lead_services (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id uuid NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  service_id uuid NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE lead_services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own lead services"
  ON lead_services FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM leads
      WHERE leads.id = lead_services.lead_id
      AND leads.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM leads
      WHERE leads.id = lead_services.lead_id
      AND leads.user_id = auth.uid()
    )
  );

CREATE INDEX idx_lead_services_lead_id ON lead_services(lead_id);
CREATE INDEX idx_lead_services_service_id ON lead_services(service_id);

-- Lead Activities
CREATE TABLE IF NOT EXISTS lead_activities (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id uuid NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  activity_type text NOT NULL CHECK (activity_type IN ('call', 'email', 'meeting', 'note', 'status_change')),
  description text NOT NULL,
  created_by uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE lead_activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own lead activities"
  ON lead_activities FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM leads
      WHERE leads.id = lead_activities.lead_id
      AND leads.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM leads
      WHERE leads.id = lead_activities.lead_id
      AND leads.user_id = auth.uid()
    )
  );

CREATE INDEX idx_lead_activities_lead_id ON lead_activities(lead_id);

-- ======================
-- 5. CUSTOMERS TABLES
-- ======================
CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  unique_code text UNIQUE NOT NULL,
  name text NOT NULL,
  company_name text,
  email text,
  phone text,
  mobile text,
  address text,
  tax_registration_number text,
  is_active boolean DEFAULT true,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own customers"
  ON customers FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE INDEX idx_customers_user_id ON customers(user_id);
CREATE INDEX idx_customers_unique_code ON customers(unique_code);
CREATE INDEX idx_customers_is_active ON customers(is_active);

-- Add foreign key constraint to leads after customers table exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'leads_converted_to_customer_id_fkey'
  ) THEN
    ALTER TABLE leads
    ADD CONSTRAINT leads_converted_to_customer_id_fkey
    FOREIGN KEY (converted_to_customer_id)
    REFERENCES customers(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Customer Services
CREATE TABLE IF NOT EXISTS customer_services (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id uuid NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  service_id uuid NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  status text DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'cancelled')),
  price decimal(10, 2) DEFAULT 0,
  billing_cycle text DEFAULT 'monthly' CHECK (billing_cycle IN ('monthly', 'quarterly', 'yearly', 'one-time')),
  start_date date DEFAULT CURRENT_DATE,
  end_date date,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE customer_services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own customer services"
  ON customer_services FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM customers
      WHERE customers.id = customer_services.customer_id
      AND customers.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM customers
      WHERE customers.id = customer_services.customer_id
      AND customers.user_id = auth.uid()
    )
  );

CREATE INDEX idx_customer_services_customer_id ON customer_services(customer_id);
CREATE INDEX idx_customer_services_service_id ON customer_services(service_id);
CREATE INDEX idx_customer_services_status ON customer_services(status);

-- ======================
-- 6. TASKS & ASSIGNMENTS
-- ======================
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  customer_id uuid NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  customer_service_id uuid REFERENCES customer_services(id) ON DELETE SET NULL,
  title text NOT NULL,
  description text,
  priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'review', 'completed', 'cancelled')),
  due_date date,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own tasks"
  ON tasks FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_customer_id ON tasks(customer_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);

-- Task Assignments
CREATE TABLE IF NOT EXISTS task_assignments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id uuid NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  staff_id uuid NOT NULL REFERENCES staff_members(id) ON DELETE CASCADE,
  assigned_at timestamptz DEFAULT now(),
  status text DEFAULT 'assigned' CHECK (status IN ('assigned', 'working', 'completed')),
  notes text,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE task_assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own task assignments"
  ON task_assignments FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM tasks
      WHERE tasks.id = task_assignments.task_id
      AND tasks.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM tasks
      WHERE tasks.id = task_assignments.task_id
      AND tasks.user_id = auth.uid()
    )
  );

CREATE INDEX idx_task_assignments_task_id ON task_assignments(task_id);
CREATE INDEX idx_task_assignments_staff_id ON task_assignments(staff_id);

-- ======================
-- 7. VAT FILING SYSTEM
-- ======================
CREATE TABLE IF NOT EXISTS vat_returns (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  customer_id uuid NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  task_id uuid REFERENCES tasks(id) ON DELETE SET NULL,
  period_type text NOT NULL CHECK (period_type IN ('monthly', 'quarterly')),
  period_year integer NOT NULL,
  period_number integer NOT NULL,
  period_start_date date NOT NULL,
  period_end_date date NOT NULL,
  due_date date NOT NULL,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'in_progress', 'review', 'submitted', 'filed')),
  filed_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(customer_id, period_type, period_year, period_number)
);

ALTER TABLE vat_returns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own vat returns"
  ON vat_returns FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE INDEX idx_vat_returns_user_id ON vat_returns(user_id);
CREATE INDEX idx_vat_returns_customer_id ON vat_returns(customer_id);
CREATE INDEX idx_vat_returns_status ON vat_returns(status);
CREATE INDEX idx_vat_returns_due_date ON vat_returns(due_date);

-- VAT Return Data
CREATE TABLE IF NOT EXISTS vat_return_data (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  vat_return_id uuid NOT NULL REFERENCES vat_returns(id) ON DELETE CASCADE,
  total_sales decimal(15, 2) DEFAULT 0,
  exempt_sales decimal(15, 2) DEFAULT 0,
  taxable_sales decimal(15, 2) DEFAULT 0,
  output_tax decimal(15, 2) DEFAULT 0,
  total_purchases decimal(15, 2) DEFAULT 0,
  exempt_purchases decimal(15, 2) DEFAULT 0,
  taxable_purchases decimal(15, 2) DEFAULT 0,
  input_tax decimal(15, 2) DEFAULT 0,
  net_vat_payable decimal(15, 2) DEFAULT 0,
  adjustments decimal(15, 2) DEFAULT 0,
  total_vat_due decimal(15, 2) DEFAULT 0,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(vat_return_id)
);

ALTER TABLE vat_return_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own vat return data"
  ON vat_return_data FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM vat_returns
      WHERE vat_returns.id = vat_return_data.vat_return_id
      AND vat_returns.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM vat_returns
      WHERE vat_returns.id = vat_return_data.vat_return_id
      AND vat_returns.user_id = auth.uid()
    )
  );

CREATE INDEX idx_vat_return_data_vat_return_id ON vat_return_data(vat_return_id);

-- ======================
-- 8. BILLING & INVOICING
-- ======================
CREATE TABLE IF NOT EXISTS invoices (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  customer_id uuid NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  invoice_number text UNIQUE NOT NULL,
  invoice_date date DEFAULT CURRENT_DATE,
  due_date date NOT NULL,
  subtotal decimal(15, 2) DEFAULT 0,
  tax_amount decimal(15, 2) DEFAULT 0,
  discount_amount decimal(15, 2) DEFAULT 0,
  total_amount decimal(15, 2) DEFAULT 0,
  amount_paid decimal(15, 2) DEFAULT 0,
  balance_due decimal(15, 2) DEFAULT 0,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'partially_paid', 'overdue', 'cancelled')),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own invoices"
  ON invoices FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE INDEX idx_invoices_user_id ON invoices(user_id);
CREATE INDEX idx_invoices_customer_id ON invoices(customer_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_invoice_number ON invoices(invoice_number);

-- Invoice Items
CREATE TABLE IF NOT EXISTS invoice_items (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_id uuid NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  customer_service_id uuid REFERENCES customer_services(id) ON DELETE SET NULL,
  task_id uuid REFERENCES tasks(id) ON DELETE SET NULL,
  description text NOT NULL,
  quantity decimal(10, 2) DEFAULT 1,
  unit_price decimal(15, 2) NOT NULL,
  total decimal(15, 2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own invoice items"
  ON invoice_items FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM invoices
      WHERE invoices.id = invoice_items.invoice_id
      AND invoices.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM invoices
      WHERE invoices.id = invoice_items.invoice_id
      AND invoices.user_id = auth.uid()
    )
  );

CREATE INDEX idx_invoice_items_invoice_id ON invoice_items(invoice_id);

-- Payments
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_id uuid NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  customer_id uuid NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  amount decimal(15, 2) NOT NULL,
  payment_date date DEFAULT CURRENT_DATE,
  payment_method text DEFAULT 'bank_transfer' CHECK (payment_method IN ('cash', 'bank_transfer', 'cheque', 'card', 'other')),
  reference_number text,
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own payments"
  ON payments FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM invoices
      WHERE invoices.id = payments.invoice_id
      AND invoices.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM invoices
      WHERE invoices.id = payments.invoice_id
      AND invoices.user_id = auth.uid()
    )
  );

CREATE INDEX idx_payments_invoice_id ON payments(invoice_id);
CREATE INDEX idx_payments_customer_id ON payments(customer_id);

-- ======================
-- FUNCTIONS & TRIGGERS
-- ======================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to relevant tables
DO $$
DECLARE
  t text;
BEGIN
  FOR t IN
    SELECT table_name
    FROM information_schema.columns
    WHERE column_name = 'updated_at'
    AND table_schema = 'public'
  LOOP
    EXECUTE format('
      DROP TRIGGER IF EXISTS update_%I_updated_at ON %I;
      CREATE TRIGGER update_%I_updated_at
        BEFORE UPDATE ON %I
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    ', t, t, t, t);
  END LOOP;
END $$;

-- Function to generate unique code
CREATE OR REPLACE FUNCTION generate_unique_code(prefix text)
RETURNS text AS $$
DECLARE
  new_code text;
  code_exists boolean;
BEGIN
  LOOP
    new_code := prefix || '-' || LPAD(FLOOR(RANDOM() * 1000000)::text, 6, '0');

    -- Check if code exists in leads or customers
    SELECT EXISTS (
      SELECT 1 FROM leads WHERE unique_code = new_code
      UNION
      SELECT 1 FROM customers WHERE unique_code = new_code
    ) INTO code_exists;

    EXIT WHEN NOT code_exists;
  END LOOP;

  RETURN new_code;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate unique code for leads
CREATE OR REPLACE FUNCTION set_lead_unique_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.unique_code IS NULL OR NEW.unique_code = '' THEN
    NEW.unique_code := generate_unique_code('LD');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_lead_unique_code_trigger ON leads;
CREATE TRIGGER set_lead_unique_code_trigger
  BEFORE INSERT ON leads
  FOR EACH ROW
  EXECUTE FUNCTION set_lead_unique_code();

-- Trigger to auto-generate unique code for customers
CREATE OR REPLACE FUNCTION set_customer_unique_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.unique_code IS NULL OR NEW.unique_code = '' THEN
    NEW.unique_code := generate_unique_code('CU');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_customer_unique_code_trigger ON customers;
CREATE TRIGGER set_customer_unique_code_trigger
  BEFORE INSERT ON customers
  FOR EACH ROW
  EXECUTE FUNCTION set_customer_unique_code();

-- Function to auto-generate invoice numbers
CREATE OR REPLACE FUNCTION generate_invoice_number(firm_id uuid)
RETURNS text AS $$
DECLARE
  new_number text;
  year_suffix text;
  sequence_num integer;
BEGIN
  year_suffix := TO_CHAR(CURRENT_DATE, 'YY');

  SELECT COALESCE(MAX(CAST(SUBSTRING(invoice_number FROM 'INV-\d+-(\d+)') AS integer)), 0) + 1
  INTO sequence_num
  FROM invoices
  WHERE user_id = firm_id
  AND invoice_number LIKE 'INV-' || year_suffix || '-%';

  new_number := 'INV-' || year_suffix || '-' || LPAD(sequence_num::text, 5, '0');

  RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate invoice number
CREATE OR REPLACE FUNCTION set_invoice_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.invoice_number IS NULL OR NEW.invoice_number = '' THEN
    NEW.invoice_number := generate_invoice_number(NEW.user_id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_invoice_number_trigger ON invoices;
CREATE TRIGGER set_invoice_number_trigger
  BEFORE INSERT ON invoices
  FOR EACH ROW
  EXECUTE FUNCTION set_invoice_number();
