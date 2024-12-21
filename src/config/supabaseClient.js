// src/config/supabaseClient.js

import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with environment variables
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// Create Supabase client instance
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Customer operations for managing customer data
export const customerOperations = {
  // Fetch all customers with optional sorting
  getAllCustomers: async () => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching customers:', error);
      throw error;
    }
  },

  // Get a single customer by ID
  getCustomerById: async (id) => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching customer:', error);
      throw error;
    }
  },

  // Create a new customer
  createCustomer: async (customerData) => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .insert([customerData])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating customer:', error);
      throw error;
    }
  },

  // Update customer information
  updateCustomer: async (id, updateData) => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating customer:', error);
      throw error;
    }
  },

  // Delete a customer
  deleteCustomer: async (id) => {
    try {
      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting customer:', error);
      throw error;
    }
  }
};

// Invoice operations for managing invoices
export const invoiceOperations = {
  // Fetch all invoices with customer details
  getAllInvoices: async () => {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select(`
          *,
          customers (
            id,
            name,
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching invoices:', error);
      throw error;
    }
  },

  // Create a new invoice
  createInvoice: async (invoiceData) => {
    try {
      // Generate invoice number
      const invoiceNumber = `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      
      const { data, error } = await supabase
        .from('invoices')
        .insert([{ ...invoiceData, invoice_number: invoiceNumber }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating invoice:', error);
      throw error;
    }
  },

  // Update existing invoice
  updateInvoice: async (id, updateData) => {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating invoice:', error);
      throw error;
    }
  },

  // Delete an invoice
  deleteInvoice: async (id) => {
    try {
      const { error } = await supabase
        .from('invoices')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting invoice:', error);
      throw error;
    }
  }
};

export const inventoryOperations = {
    // Get all items - matches the getAllItems() function called in your component
    getAllItems: async () => {
        try {
            const { data, error } = await supabase
                .from('inventory')
                .select('*')
                .order('product_name', { ascending: true }); // Changed from 'name' to 'product_name'

            if (error) throw error;
            return data || []; // Added fallback to empty array if data is null
        } catch (error) {
            console.error('Error fetching inventory:', error);
            throw new Error('Failed to fetch inventory items');
        }
    },

    // Add new item - matches the addItem() function called in your component
    addItem: async (itemData) => {
        try {
            // Add timestamps and ensure data structure matches your schema
            const newItem = {
                ...itemData,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };

            const { data, error } = await supabase
                .from('inventory')
                .insert([newItem])
                .select()
                .single();

            if (error) {
                // Special handling for duplicate SKU error
                if (error.code === '23505') {
                    throw new Error('SKU must be unique. This SKU already exists.');
                }
                throw error;
            }

            return data;
        } catch (error) {
            console.error('Error adding inventory item:', error);
            throw new Error(error.message || 'Failed to add inventory item');
        }
    },

    // Update item - matches the updateItem() function called in your component
    updateItem: async (id, updateData) => {
        try {
            const updates = {
                ...updateData,
                updated_at: new Date().toISOString()
            };

            const { data, error } = await supabase
                .from('inventory')
                .update(updates)
                .eq('id', id)
                .select()
                .single();

            if (error) {
                if (error.code === '23505') {
                    throw new Error('SKU must be unique. This SKU already exists.');
                }
                throw error;
            }

            return data;
        } catch (error) {
            console.error('Error updating inventory item:', error);
            throw new Error(error.message || 'Failed to update inventory item');
        }
    },

    // Delete item - matches the deleteItem() function called in your component
    deleteItem: async (id) => {
        try {
            const { error } = await supabase
                .from('inventory')
                .delete()
                .eq('id', id);

            if (error) throw error;
            return true;
        } catch (error) {
            console.error('Error deleting inventory item:', error);
            throw new Error('Failed to delete inventory item');
        }
    }
};

// Salary operations for managing employee salaries
export const salaryOperations = {
  // Fetch all salary records
  getAllSalaries: async () => {
    try {
      const { data, error } = await supabase
        .from('salaries')
        .select(`
          *,
          employees (
            id,
            name,
            position
          )
        `)
        .order('payment_date', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching salaries:', error);
      throw error;
    }
  },

  // Create new salary record
  createSalary: async (salaryData) => {
    try {
      const { data, error } = await supabase
        .from('salaries')
        .insert([salaryData])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating salary record:', error);
      throw error;
    }
  },

  // Update salary record
  updateSalary: async (id, updateData) => {
    try {
      const { data, error } = await supabase
        .from('salaries')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating salary record:', error);
      throw error;
    }
  },

  // Delete salary record
  deleteSalary: async (id) => {
    try {
      const { error } = await supabase
        .from('salaries')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting salary record:', error);
      throw error;
    }
  }
};

// Export default supabase instance
export default supabase;