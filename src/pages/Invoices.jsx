// src/pages/Invoices.jsx

import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { supabase, invoiceOperations } from '../config/supabaseClient'; // Added supabase import here

export default function Invoices() {
  // State for invoice data and UI controls
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [customers, setCustomers] = useState([]);

      // Add statistics calculations
    const calculateStatistics = () => {
    const total = invoices.reduce((sum, inv) => sum + Number(inv.amount), 0);
    const pending = invoices.filter(inv => inv.status === 'pending').length;
    const avgTime = 15; // This would be calculated based on actual payment data

    return { total, pending, avgTime };
};

  // Form state with proper initialization
  const [formData, setFormData] = useState({
    customer_id: '',
    amount: '',
    due_date: format(new Date(), 'yyyy-MM-dd'), // Initialize with today's date
    notes: '',
    status: 'pending'
  });

  // Load invoice data when component mounts
  useEffect(() => {
    fetchInvoices();
    fetchCustomers(); // Fetch customers for the dropdown
  }, []);

  // Function to fetch invoices from the database
  const fetchInvoices = async () => {
    try {
      setLoading(true);
      console.log('Starting to fetch invoices...'); // Beginning of the request
      const data = await invoiceOperations.getAllInvoices();
      console.log('API Response:', data); // Raw API response

      setInvoices(data);
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch invoices:', err);
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch customers for the dropdown
  const fetchCustomers = async () => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('id, name')
        .order('name');
      
      if (error) throw error;
      setCustomers(data);
    } catch (err) {
      console.error('Failed to fetch customers:', err);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value
    }));
  };

  // Reset form to initial state
  const resetForm = () => {
    setFormData({
      customer_id: '',
      amount: '',
      due_date: format(new Date(), 'yyyy-MM-dd'),
      notes: '',
      status: 'pending'
    });
    setSelectedInvoice(null);
  };

  // Handle invoice creation
  const handleCreateInvoice = async (e) => {
    e.preventDefault();
    try {
      const created = await invoiceOperations.createInvoice(formData);
      setInvoices(prev => [created, ...prev]);
      setIsCreateModalOpen(false);
      resetForm();
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle invoice update
  const handleUpdateInvoice = async (e) => {
    e.preventDefault();
    try {
      const updated = await invoiceOperations.updateInvoice(selectedInvoice.id, formData);
      setInvoices(prev => prev.map(invoice => 
        invoice.id === updated.id ? updated : invoice
      ));
      setSelectedInvoice(null);
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle invoice deletion with confirmation
  const handleDeleteInvoice = async (id) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      try {
        await invoiceOperations.deleteInvoice(id);
        setInvoices(prev => prev.filter(invoice => invoice.id !== id));
      } catch (err) {
        setError(err.message);
      }
    }
  };

  // Handle edit invoice click
  const handleEditClick = (invoice) => {
    setSelectedInvoice(invoice);
    setFormData({
      customer_id: invoice.customer_id,
      amount: invoice.amount,
      due_date: format(new Date(invoice.due_date), 'yyyy-MM-dd'),
      notes: invoice.notes || '',
      status: invoice.status
    });
  };

    // Enhanced loading state with better visual feedback
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading invoices...</p>
                </div>
            </div>
        );
    }

  // Error state UI
  if (error) {
    return (
      <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
        <p>Error: {error}</p>
        <button 
          onClick={fetchInvoices}
          className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-blue-700"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Create Invoice
        </button>
      </div>

      {/* Invoices Table */}
      <div className="bg-white shadow overflow-hidden rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Due Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {invoices.map((invoice) => (
              <tr key={invoice.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {invoice.customers?.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    ${parseFloat(invoice.amount).toFixed(2)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {format(new Date(invoice.due_date), 'MMM dd, yyyy')}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                    ${invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                      invoice.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'}`}>
                    {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleEditClick(invoice)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteInvoice(invoice.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create/Edit Modal */}
      {(isCreateModalOpen || selectedInvoice) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {selectedInvoice ? 'Edit Invoice' : 'Create Invoice'}
            </h2>
            <form onSubmit={selectedInvoice ? handleUpdateInvoice : handleCreateInvoice}>
              <div className="space-y-4">
                {/* Customer Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Customer
                  </label>
                  <select
                    name="customer_id"
                    value={formData.customer_id}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Customer</option>
                    {customers.map(customer => (
                      <option key={customer.id} value={customer.id}>
                        {customer.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Amount Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Amount
                  </label>
                  <input
                    type="number"
                    name="amount"
                    step="0.01"
                    value={formData.amount}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Due Date Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Due Date
                  </label>
                  <input
                    type="date"
                    name="due_date"
                    value={formData.due_date}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Status Field (only for editing) */}
                {selectedInvoice && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="overdue">Overdue</option>
                    </select>
                  </div>
                )}

                {/* Notes Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Notes
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows="3"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Modal Actions */}
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    setSelectedInvoice(null);
                    resetForm();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {selectedInvoice ? 'Update Invoice' : 'Create Invoice'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}