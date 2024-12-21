// src/config/invoiceOperations.jsx

import { supabase } from './supabaseClient';

export const invoiceOperations = {
    // Fetch all invoices with related customer information
    getAllInvoices: async () => {
        try {
            // Query invoices table with a join to customers table
            const { data, error } = await supabase
                .from('invoices')
                .select(`
                    id,
                    created_at,
                    customer_id,
                    issue_date,
                    due_date,
                    subtotal,
                    tax_rate,
                    tax_amount,
                    amount,
                    status,
                    customers (
                        id,
                        name,
                        email
                    )
                `)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data || []; // Return empty array if no data
        } catch (error) {
            console.error('Error fetching invoices:', error);
            throw new Error('Failed to fetch invoices. Please try again.');
        }
    },

    // Get a single invoice by ID
    getInvoiceById: async (id) => {
        try {
            const { data, error } = await supabase
                .from('invoices')
                .select(`
                    id,
                    created_at,
                    customer_id,
                    issue_date,
                    due_date,
                    subtotal,
                    tax_rate,
                    tax_amount,
                    amount,
                    status,
                    customers (
                        id,
                        name,
                        email
                    )
                `)
                .eq('id', id)
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error fetching invoice:', error);
            throw new Error('Failed to fetch invoice details.');
        }
    },

    // Create a new invoice with calculated fields
    createInvoice: async (invoiceData) => {
        try {
            // Calculate tax and total amounts
            const subtotal = parseFloat(invoiceData.subtotal) || 0;
            const tax_rate = parseFloat(invoiceData.tax_rate) || 0;
            const tax_amount = Number((subtotal * (tax_rate / 100)).toFixed(2));
            const amount = Number((subtotal + tax_amount).toFixed(2));

            // Prepare invoice data with calculations
            const newInvoice = {
                customer_id: invoiceData.customer_id,
                issue_date: new Date().toISOString().split('T')[0], // Today's date
                due_date: invoiceData.due_date,
                subtotal,
                tax_rate,
                tax_amount,
                amount,
                status: invoiceData.status || 'pending',
                created_at: new Date().toISOString()
            };

            const { data, error } = await supabase
                .from('invoices')
                .insert([newInvoice])
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error creating invoice:', error);
            throw new Error('Failed to create invoice. Please check your input.');
        }
    },

    // Update an existing invoice
    updateInvoice: async (id, updateData) => {
        try {
            // Recalculate financial values if they're being updated
            let updates = { ...updateData };
            
            if (updateData.subtotal || updateData.tax_rate) {
                const subtotal = parseFloat(updateData.subtotal) || 0;
                const tax_rate = parseFloat(updateData.tax_rate) || 0;
                const tax_amount = Number((subtotal * (tax_rate / 100)).toFixed(2));
                const amount = Number((subtotal + tax_amount).toFixed(2));

                updates = {
                    ...updates,
                    tax_amount,
                    amount
                };
            }

            const { data, error } = await supabase
                .from('invoices')
                .update({ ...updates, updated_at: new Date().toISOString() })
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error updating invoice:', error);
            throw new Error('Failed to update invoice.');
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
            throw new Error('Failed to delete invoice.');
        }
    },

    // Get invoices by customer ID
    getInvoicesByCustomer: async (customerId) => {
        try {
            const { data, error } = await supabase
                .from('invoices')
                .select(`
                    id,
                    created_at,
                    customer_id,
                    issue_date,
                    due_date,
                    subtotal,
                    tax_rate,
                    tax_amount,
                    amount,
                    status,
                    customers (
                        id,
                        name,
                        email
                    )
                `)
                .eq('customer_id', customerId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error fetching customer invoices:', error);
            throw new Error('Failed to fetch customer invoices.');
        }
    },

    // Update invoice status
    updateInvoiceStatus: async (id, status) => {
        try {
            const { data, error } = await supabase
                .from('invoices')
                .update({ 
                    status,
                    updated_at: new Date().toISOString()
                })
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error updating invoice status:', error);
            throw new Error('Failed to update invoice status.');
        }
    }
};

export default invoiceOperations;