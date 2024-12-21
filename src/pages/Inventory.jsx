// src/pages/Inventory.jsx
import { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';
import { inventoryOperations } from '../config/supabaseClient';

function Inventory() {
    // State Management
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentItem, setCurrentItem] = useState(null);

    // Form state with database schema matching fields
    const [formData, setFormData] = useState({
        product_name: '',
        sku: '',
        quantity: 0,
        price: 0,
        category: '',
        description: '',
        minimum_stock: 0
    });

    // Fetch inventory data on component mount
    useEffect(() => {
        fetchInventoryItems();
    }, []);

    // Function to fetch all inventory items from Supabase
    async function fetchInventoryItems() {
        try {
            setIsLoading(true);
            const data = await inventoryOperations.getAllItems();
            setItems(data);
            setError(null);
        } catch (error) {
            setError('Error loading inventory items. Please try again.');
            console.error('Error:', error);
        } finally {
            setIsLoading(false);
        }
    }

    // Handle form submission for both adding and editing items
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            if (currentItem) {
                // Update existing item
                await inventoryOperations.updateItem(currentItem.id, formData);
            } else {
                // Add new item
                await inventoryOperations.addItem(formData);
            }

            // Refresh the inventory list
            await fetchInventoryItems();
            
            // Reset form and close modal
            setIsModalOpen(false);
            setCurrentItem(null);
            setFormData({
                product_name: '',
                sku: '',
                quantity: 0,
                price: 0,
                category: '',
                description: '',
                minimum_stock: 0
            });
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Handle item deletion with confirmation
    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this item?')) {
            return;
        }

        try {
            setIsLoading(true);
            await inventoryOperations.deleteItem(id);
            await fetchInventoryItems();
        } catch (error) {
            setError('Error deleting item. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // Filter items based on search term
    const filteredItems = items.filter(item =>
        item.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6">
            {/* Error Message Display */}
            {error && (
                <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                    {error}
                </div>
            )}

            {/* Header Section with Search and Add Button */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 space-y-4 md:space-y-0">
                <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
                
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                    {/* Search Box */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                            type="text"
                            placeholder="Search inventory..."
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Add Item Button */}
                    <button
                        onClick={() => {
                            setCurrentItem(null);
                            setFormData({
                                product_name: '',
                                sku: '',
                                quantity: 0,
                                price: 0,
                                category: '',
                                description: '',
                                minimum_stock: 0
                            });
                            setIsModalOpen(true);
                        }}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                    >
                        <Plus className="h-5 w-5 mr-2" />
                        Add Item
                    </button>
                </div>
            </div>

            {/* Loading Overlay */}
            {isLoading && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-4 rounded-lg shadow-lg">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                </div>
            )}

            {/* Inventory Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredItems.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{item.product_name}</div>
                                        <div className="text-sm text-gray-500">{item.description}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {item.sku}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {item.quantity}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        ${item.price.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {item.category}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex space-x-3">
                                            <button
                                                onClick={() => {
                                                    setCurrentItem(item);
                                                    setFormData(item);
                                                    setIsModalOpen(true);
                                                }}
                                                className="text-blue-600 hover:text-blue-900"
                                            >
                                                <Edit2 className="h-5 w-5" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <h2 className="text-xl font-bold mb-4">
                            {currentItem ? 'Edit Item' : 'Add New Item'}
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Product Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        value={formData.product_name}
                                        onChange={(e) => setFormData({ ...formData, product_name: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">SKU</label>
                                    <input
                                        type="text"
                                        required
                                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        value={formData.sku}
                                        onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Quantity</label>
                                        <input
                                            type="number"
                                            required
                                            min="0"
                                            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            value={formData.quantity}
                                            onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Price</label>
                                        <input
                                            type="number"
                                            required
                                            min="0"
                                            step="0.01"
                                            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Category</label>
                                    <input
                                        type="text"
                                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Description</label>
                                    <textarea
                                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        rows="3"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    ></textarea>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Minimum Stock</label>
                                    <input
                                        type="number"
                                        min="0"
                                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        value={formData.minimum_stock}
                                        onChange={(e) => setFormData({ ...formData, minimum_stock: parseInt(e.target.value) })}
                                    />
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsModalOpen(false);
                                        setCurrentItem(null);
                                    }}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Saving...' : currentItem ? 'Update' : 'Add'} Item
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Inventory;