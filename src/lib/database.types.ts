export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          company_name: string
          company_logo_url: string | null
          email: string
          full_name: string
          phone: string | null
          address: string | null
          subscription_status: 'active' | 'inactive' | 'trial' | 'suspended'
          subscription_plan: 'basic' | 'professional' | 'enterprise'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          company_name: string
          company_logo_url?: string | null
          email: string
          full_name: string
          phone?: string | null
          address?: string | null
          subscription_status?: 'active' | 'inactive' | 'trial' | 'suspended'
          subscription_plan?: 'basic' | 'professional' | 'enterprise'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_name?: string
          company_logo_url?: string | null
          email?: string
          full_name?: string
          phone?: string | null
          address?: string | null
          subscription_status?: 'active' | 'inactive' | 'trial' | 'suspended'
          subscription_plan?: 'basic' | 'professional' | 'enterprise'
          created_at?: string
          updated_at?: string
        }
      }
      staff_members: {
        Row: {
          id: string
          user_id: string
          name: string
          email: string
          phone: string | null
          role: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          email: string
          phone?: string | null
          role: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          email?: string
          phone?: string | null
          role?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      services: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          default_price: number
          billing_cycle: 'monthly' | 'quarterly' | 'yearly' | 'one-time'
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          default_price?: number
          billing_cycle?: 'monthly' | 'quarterly' | 'yearly' | 'one-time'
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          default_price?: number
          billing_cycle?: 'monthly' | 'quarterly' | 'yearly' | 'one-time'
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      leads: {
        Row: {
          id: string
          user_id: string
          unique_code: string
          name: string
          company_name: string | null
          email: string | null
          phone: string | null
          mobile: string | null
          address: string | null
          status: 'new' | 'contacted' | 'qualified' | 'negotiating' | 'converted' | 'lost'
          source: string | null
          notes: string | null
          converted_to_customer_id: string | null
          converted_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          unique_code?: string
          name: string
          company_name?: string | null
          email?: string | null
          phone?: string | null
          mobile?: string | null
          address?: string | null
          status?: 'new' | 'contacted' | 'qualified' | 'negotiating' | 'converted' | 'lost'
          source?: string | null
          notes?: string | null
          converted_to_customer_id?: string | null
          converted_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          unique_code?: string
          name?: string
          company_name?: string | null
          email?: string | null
          phone?: string | null
          mobile?: string | null
          address?: string | null
          status?: 'new' | 'contacted' | 'qualified' | 'negotiating' | 'converted' | 'lost'
          source?: string | null
          notes?: string | null
          converted_to_customer_id?: string | null
          converted_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      lead_services: {
        Row: {
          id: string
          lead_id: string
          service_id: string
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          lead_id: string
          service_id: string
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          lead_id?: string
          service_id?: string
          notes?: string | null
          created_at?: string
        }
      }
      lead_activities: {
        Row: {
          id: string
          lead_id: string
          activity_type: 'call' | 'email' | 'meeting' | 'note' | 'status_change'
          description: string
          created_by: string
          created_at: string
        }
        Insert: {
          id?: string
          lead_id: string
          activity_type: 'call' | 'email' | 'meeting' | 'note' | 'status_change'
          description: string
          created_by: string
          created_at?: string
        }
        Update: {
          id?: string
          lead_id?: string
          activity_type?: 'call' | 'email' | 'meeting' | 'note' | 'status_change'
          description?: string
          created_by?: string
          created_at?: string
        }
      }
      customers: {
        Row: {
          id: string
          user_id: string
          unique_code: string
          name: string
          company_name: string | null
          email: string | null
          phone: string | null
          mobile: string | null
          address: string | null
          tax_registration_number: string | null
          is_active: boolean
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          unique_code?: string
          name: string
          company_name?: string | null
          email?: string | null
          phone?: string | null
          mobile?: string | null
          address?: string | null
          tax_registration_number?: string | null
          is_active?: boolean
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          unique_code?: string
          name?: string
          company_name?: string | null
          email?: string | null
          phone?: string | null
          mobile?: string | null
          address?: string | null
          tax_registration_number?: string | null
          is_active?: boolean
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      customer_services: {
        Row: {
          id: string
          customer_id: string
          service_id: string
          status: 'active' | 'completed' | 'paused' | 'cancelled'
          price: number
          billing_cycle: 'monthly' | 'quarterly' | 'yearly' | 'one-time'
          start_date: string
          end_date: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          customer_id: string
          service_id: string
          status?: 'active' | 'completed' | 'paused' | 'cancelled'
          price?: number
          billing_cycle?: 'monthly' | 'quarterly' | 'yearly' | 'one-time'
          start_date?: string
          end_date?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          customer_id?: string
          service_id?: string
          status?: 'active' | 'completed' | 'paused' | 'cancelled'
          price?: number
          billing_cycle?: 'monthly' | 'quarterly' | 'yearly' | 'one-time'
          start_date?: string
          end_date?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          user_id: string
          customer_id: string
          customer_service_id: string | null
          title: string
          description: string | null
          priority: 'low' | 'medium' | 'high' | 'urgent'
          status: 'pending' | 'in_progress' | 'review' | 'completed' | 'cancelled'
          due_date: string | null
          completed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          customer_id: string
          customer_service_id?: string | null
          title: string
          description?: string | null
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          status?: 'pending' | 'in_progress' | 'review' | 'completed' | 'cancelled'
          due_date?: string | null
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          customer_id?: string
          customer_service_id?: string | null
          title?: string
          description?: string | null
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          status?: 'pending' | 'in_progress' | 'review' | 'completed' | 'cancelled'
          due_date?: string | null
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      task_assignments: {
        Row: {
          id: string
          task_id: string
          staff_id: string
          assigned_at: string
          status: 'assigned' | 'working' | 'completed'
          notes: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          task_id: string
          staff_id: string
          assigned_at?: string
          status?: 'assigned' | 'working' | 'completed'
          notes?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          task_id?: string
          staff_id?: string
          assigned_at?: string
          status?: 'assigned' | 'working' | 'completed'
          notes?: string | null
          updated_at?: string
        }
      }
      vat_returns: {
        Row: {
          id: string
          user_id: string
          customer_id: string
          task_id: string | null
          period_type: 'monthly' | 'quarterly'
          period_year: number
          period_number: number
          period_start_date: string
          period_end_date: string
          due_date: string
          status: 'draft' | 'in_progress' | 'review' | 'submitted' | 'filed'
          filed_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          customer_id: string
          task_id?: string | null
          period_type: 'monthly' | 'quarterly'
          period_year: number
          period_number: number
          period_start_date: string
          period_end_date: string
          due_date: string
          status?: 'draft' | 'in_progress' | 'review' | 'submitted' | 'filed'
          filed_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          customer_id?: string
          task_id?: string | null
          period_type?: 'monthly' | 'quarterly'
          period_year?: number
          period_number?: number
          period_start_date?: string
          period_end_date?: string
          due_date?: string
          status?: 'draft' | 'in_progress' | 'review' | 'submitted' | 'filed'
          filed_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      vat_return_data: {
        Row: {
          id: string
          vat_return_id: string
          total_sales: number
          exempt_sales: number
          taxable_sales: number
          output_tax: number
          total_purchases: number
          exempt_purchases: number
          taxable_purchases: number
          input_tax: number
          net_vat_payable: number
          adjustments: number
          total_vat_due: number
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          vat_return_id: string
          total_sales?: number
          exempt_sales?: number
          taxable_sales?: number
          output_tax?: number
          total_purchases?: number
          exempt_purchases?: number
          taxable_purchases?: number
          input_tax?: number
          net_vat_payable?: number
          adjustments?: number
          total_vat_due?: number
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          vat_return_id?: string
          total_sales?: number
          exempt_sales?: number
          taxable_sales?: number
          output_tax?: number
          total_purchases?: number
          exempt_purchases?: number
          taxable_purchases?: number
          input_tax?: number
          net_vat_payable?: number
          adjustments?: number
          total_vat_due?: number
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      invoices: {
        Row: {
          id: string
          user_id: string
          customer_id: string
          invoice_number: string
          invoice_date: string
          due_date: string
          subtotal: number
          tax_amount: number
          discount_amount: number
          total_amount: number
          amount_paid: number
          balance_due: number
          status: 'draft' | 'sent' | 'paid' | 'partially_paid' | 'overdue' | 'cancelled'
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          customer_id: string
          invoice_number?: string
          invoice_date?: string
          due_date: string
          subtotal?: number
          tax_amount?: number
          discount_amount?: number
          total_amount?: number
          amount_paid?: number
          balance_due?: number
          status?: 'draft' | 'sent' | 'paid' | 'partially_paid' | 'overdue' | 'cancelled'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          customer_id?: string
          invoice_number?: string
          invoice_date?: string
          due_date?: string
          subtotal?: number
          tax_amount?: number
          discount_amount?: number
          total_amount?: number
          amount_paid?: number
          balance_due?: number
          status?: 'draft' | 'sent' | 'paid' | 'partially_paid' | 'overdue' | 'cancelled'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      invoice_items: {
        Row: {
          id: string
          invoice_id: string
          customer_service_id: string | null
          task_id: string | null
          description: string
          quantity: number
          unit_price: number
          total: number
          created_at: string
        }
        Insert: {
          id?: string
          invoice_id: string
          customer_service_id?: string | null
          task_id?: string | null
          description: string
          quantity?: number
          unit_price: number
          total: number
          created_at?: string
        }
        Update: {
          id?: string
          invoice_id?: string
          customer_service_id?: string | null
          task_id?: string | null
          description?: string
          quantity?: number
          unit_price?: number
          total?: number
          created_at?: string
        }
      }
      payments: {
        Row: {
          id: string
          invoice_id: string
          customer_id: string
          amount: number
          payment_date: string
          payment_method: 'cash' | 'bank_transfer' | 'cheque' | 'card' | 'other'
          reference_number: string | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          invoice_id: string
          customer_id: string
          amount: number
          payment_date?: string
          payment_method?: 'cash' | 'bank_transfer' | 'cheque' | 'card' | 'other'
          reference_number?: string | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          invoice_id?: string
          customer_id?: string
          amount?: number
          payment_date?: string
          payment_method?: 'cash' | 'bank_transfer' | 'cheque' | 'card' | 'other'
          reference_number?: string | null
          notes?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
