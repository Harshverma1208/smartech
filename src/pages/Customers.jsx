// src/pages/Customers.jsx
import { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Mail, Phone, Building } from 'lucide-react';
import { customerOperations } from '../config/supabaseClient';

function Customers() {
    // State Management
    const [customers, setCustomers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentCustomer, setCurrentCustomer] = useState(null);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        company_name: '',
        address: '',
        notes: '',
        status: 'active'
    });

    // Fetch customers on component mount
    useEffect(() => {
        fetchCustomers();
    }, []);

    // Function to fetch all customers
    async function fetchCustomers() {
        try {
            setIsLoading(true);
            const data = await customerOperations.getAllCustomers();
            setCustomers(data);
            setError(null);
        } catch (error) {
            setError('Error loading customers. Please try again.');
            console.error('Error:', error);
        } finally {
            setIsLoading(false);
        }
    }

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            if (currentCustomer) {
                await customerOperations.updateCustomer(currentCustomer.id, formData);
            } else {
                await customerOperations.addCustomer(formData);
            }

            await fetchCustomers();
            setIsModalOpen(false);
            setCurrentCustomer(null);
            setFormData({
                name: '',
                email: '',
                phone: '',
                company_name: '',
                address: '',
                notes: '',
                status: 'active'
            });
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Handle customer deletion
    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this customer?')) {
            return;
        }

        try {
            setIsLoading(true);
            await customerOperations.deleteCustomer(id);
            await fetchCustomers();
        } catch (error) {
            setError('Error deleting customer. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // Filter customers based on search
    const filteredCustomers = customers.filter(customer =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.company_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6">
            {/* Error Message Display */}
            {error && (
                <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                    {error}
                </div>
            )}

            {/* Header with Search and Add Button */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Customer Management</h1>
                
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mt-4 md:mt-0">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                            type="text"
                            placeholder="Search customers..."
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full sm:w-64"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <button
                        onClick={() => {
                            setCurrentCustomer(null);
                            setFormData({
                                name: '',
                                email: '',
                                phone: '',
                                company_name: '',
                                address: '',
                                notes: '',
                                status: 'active'
                            });
                            setIsModalOpen(true);
                        }}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        <Plus className="h-5 w-5 mr-2" />
                        Add Customer
                    </button>
                </div>
            </div>

            {/* Customers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCustomers.map((customer) => (
                    <div key={customer.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                        <div className="p-6">
                            <div className="flex justify-between">
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900">{customer.name}</h3>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                        customer.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                    }`}>
                                        {customer.status}
                                    </span>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => {
                                            setCurrentCustomer(customer);
                                            setFormData(customer);
                                            setIsModalOpen(true);
                                        }}
                                        className="text-blue-600 hover:text-blue-800"
                                    >
                                        <Edit2 className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(customer.id)}
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>

                            <div className="mt-4 space-y-2">
                                <div className="flex items-center text-gray-600">
                                    <Mail className="h-4 w-4 mr-2" />
                                    <span className="text-sm">{customer.email}</span>
                                </div>
                                {customer.phone && (
                                    <div className="flex items-center text-gray-600">
                                        <Phone className="h-4 w-4 mr-2" />
                                        <span className="text-sm">{customer.phone}</span>
                                    </div>
                                )}
                                {customer.company_name && (
                                    <div className="flex items-center text-gray-600">
                                        <Building className="h-4 w-4 mr-2" />
                                        <span className="text-sm">{customer.company_name}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <h2 className="text-xl font-bold mb-4">
                            {currentCustomer ? 'Edit Customer' : 'Add New Customer'}
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                {/* Form fields */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Email</label>
                                    <input
                                        type="email"
                                        required
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                                    <input
                                        type="tel"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Company Name</label>
                                    <input
                                        type="text"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                        value={formData.company_name}
                                        onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Address</label>
                                    <textarea
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                        rows="3"
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    ></textarea>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Notes</label>
                                    <textarea
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                        rows="3"
                                        value={formData.notes}
                                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    ></textarea>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Status</label>
                                    <select
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    >
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsModalOpen(false);
                                        setCurrentCustomer(null);
                                    }}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Saving...' : currentCustomer ? 'Update' : 'Add'} Customer
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Customers;