# Database Setup Instructions

## Important: Apply Database Migration

The application requires a database schema to be set up in your Supabase instance. The migration file is located at:

```
supabase/migrations/001_initial_schema.sql
```

### How to Apply the Migration

You have several options to apply this migration:

#### Option 1: Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard at https://app.supabase.com
2. Navigate to the **SQL Editor** section in the left sidebar
3. Click **New Query**
4. Copy the entire contents of `supabase/migrations/001_initial_schema.sql`
5. Paste it into the SQL Editor
6. Click **Run** to execute the migration

#### Option 2: Using Supabase CLI

If you have the Supabase CLI installed:

```bash
supabase db push
```

#### Option 3: Direct PostgreSQL Connection

If you have access to the PostgreSQL connection string:

```bash
psql <your-connection-string> < supabase/migrations/001_initial_schema.sql
```

## What the Migration Creates

The migration creates a comprehensive database structure including:

### Tables Created:
- **user_profiles** - Extended user information for auditing firms
- **staff_members** - Staff within each firm
- **services** - Services offered by the firm
- **leads** - Potential customers with tracking
- **lead_services** - Services requested by leads
- **lead_activities** - Activity log for lead interactions
- **customers** - Converted customers
- **customer_services** - Services assigned to customers
- **tasks** - Work items and assignments
- **task_assignments** - Staff assignments to tasks
- **vat_returns** - VAT return records
- **vat_return_data** - Detailed VAT filing data
- **invoices** - Customer invoices
- **invoice_items** - Invoice line items
- **payments** - Payment records

### Security Features:
- Row Level Security (RLS) enabled on all tables
- Policies ensure users can only access their own firm's data
- Complete data isolation between different firms

### Automatic Features:
- Auto-generated unique codes for leads and customers
- Auto-generated invoice numbers with yearly sequences
- Automatic timestamp updates on all records
- Trigger functions for data validation

## Verification

After applying the migration, verify it worked by:

1. Go to Supabase Dashboard → Table Editor
2. You should see all the tables listed above
3. Try creating a user profile through the app's registration

## Troubleshooting

If you encounter any errors:

1. Make sure you're connected to the correct Supabase project
2. Ensure you have sufficient permissions (you need to be the project owner or have admin access)
3. Check that the migration hasn't been partially applied - if so, you may need to manually clean up
4. Contact support if you continue to experience issues

## Next Steps

Once the migration is applied successfully:

1. Start the application with `npm run dev`
2. Register a new account
3. Start managing your auditing firm!
