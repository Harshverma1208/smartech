// src/pages/Dashboard.jsx
import { useState, useEffect } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { 
    Menu,
    Package, 
    Users, 
    FileText, 
    DollarSign,
    LogOut
} from 'lucide-react';
import UserDropdown from '../components/shared/UserDropdown';
import supabase from '../config/supabaseClient';

function Dashboard() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [statistics, setStatistics] = useState({
        inventory: 0,
        customers: 0,
        invoices: 0,
        salary: 0
    });

    // Menu items configuration
    const menuItems = [
        { 
            title: 'Inventory', 
            icon: Package, 
            route: '/dashboard/inventory',
            description: 'Manage your stock and products',
            bgColor: 'bg-blue-100',
            iconColor: 'text-blue-600',
            total: statistics.inventory
        },
        { 
            title: 'Customers', 
            icon: Users, 
            route: '/dashboard/customers',
            description: 'View and manage customer information',
            bgColor: 'bg-purple-100',
            iconColor: 'text-purple-600',
            total: statistics.customers
        },
        { 
            title: 'Invoices', 
            icon: FileText, 
            route: '/dashboard/invoices',
            description: 'Create and manage invoices',
            bgColor: 'bg-indigo-100',
            iconColor: 'text-indigo-600',
            total: statistics.invoices
        },
        { 
            title: 'Salary', 
            icon: DollarSign, 
            route: '/dashboard/salary',
            description: 'Employee salary management',
            bgColor: 'bg-green-100',
            iconColor: 'text-green-600',
            total: statistics.salary
        }
    ];

    // Fetch statistics on mount
    useEffect(() => {
        async function fetchStatistics() {
            try {
                const [inventoryCount, customerCount, invoiceCount, salaryCount] = await Promise.all([
                    supabase.from('inventory').select('id', { count: 'exact', head: true }),
                    supabase.from('customers').select('id', { count: 'exact', head: true }),
                    supabase.from('invoices').select('id', { count: 'exact', head: true }),
                    supabase.from('salary').select('id', { count: 'exact', head: true })
                ]);

                setStatistics({
                    inventory: inventoryCount.count || 0,
                    customers: customerCount.count || 0,
                    invoices: invoiceCount.count || 0,
                    salary: salaryCount.count || 0
                });
            } catch (error) {
                console.error('Error fetching statistics:', error);
            }
        }

        fetchStatistics();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 bg-white w-64 shadow-xl transform transition-transform duration-300 ease-in-out ${
                isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
            } lg:translate-x-0 z-30`}>
                {/* Logo Section */}
                <div className="h-16 bg-blue-600 flex items-center justify-center">
                    <h1 className="text-white text-2xl font-bold tracking-wider">SmartTech</h1>
                </div>

                {/* Navigation Menu */}
                <nav className="mt-8">
                    {menuItems.map((item, index) => (
                        <div
                            key={index}
                            onClick={() => navigate(item.route)}
                            className={`flex items-center px-6 py-4 cursor-pointer transition-all duration-200
                                ${location.pathname.includes(item.route.split('/').pop()) 
                                    ? `${item.bgColor} border-l-4 border-blue-600` 
                                    : 'border-l-4 border-transparent'}
                                hover:bg-gray-50`}
                        >
                            <item.icon className={`h-5 w-5 ${item.iconColor}`} />
                            <span className="ml-3 font-medium text-gray-700">{item.title}</span>
                        </div>
                    ))}
                </nav>

                {/* Logout Button */}
                <div className="absolute bottom-0 w-full p-4 border-t border-gray-100">
                    <button 
                        onClick={() => navigate('/login')}
                        className="flex items-center px-6 py-3 text-red-600 hover:bg-red-50 w-full rounded-lg transition-all duration-200 group"
                    >
                        <LogOut className="h-5 w-5 group-hover:rotate-12 transition-transform duration-200" />
                        <span className="ml-3 font-medium">Logout</span>
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:ml-64 min-h-screen">
                {/* Header */}
                <header className="bg-white shadow-sm sticky top-0 z-20">
                    <div className="flex items-center justify-between h-16 px-6">
                        <button
                            className="lg:hidden text-gray-500 hover:text-gray-700 focus:outline-none"
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        >
                            <Menu className="h-6 w-6" />
                        </button>

                        {/* User Profile Dropdown */}
                        <div className="ml-auto">
                            <UserDropdown />
                        </div>
                    </div>
                </header>

                {/* Dashboard Content */}
                <main className="p-6">
                    {location.pathname === '/dashboard' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {menuItems.map((item, index) => (
                                <div 
                                    key={index}
                                    onClick={() => navigate(item.route)}
                                    className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group"
                                >
                                    <div className="p-6">
                                        <div className="flex items-center">
                                            <div className={`p-3 rounded-lg ${item.bgColor} group-hover:scale-110 transition-transform duration-200`}>
                                                <item.icon className={`h-6 w-6 ${item.iconColor}`} />
                                            </div>
                                            <div className="ml-4">
                                                <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                                                    {item.title}
                                                </h3>
                                                <p className="text-gray-500 text-sm">
                                                    {item.total} Total
                                                </p>
                                            </div>
                                        </div>
                                        <p className="mt-4 text-sm text-gray-600">
                                            {item.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <Outlet />
                    )}
                </main>
            </div>
        </div>
    );
}

export default Dashboard;