// src/App.js
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Customers from './pages/Customers';
import Invoices from './pages/Invoices';
import Salary from './pages/Salary';
import UserProfile from './components/UserProfile';

function App() {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={<Login />} />

                    {/* Protected Dashboard Routes */}
                    <Route path="/dashboard" element={<Dashboard />}>
                        {/* Dashboard Home */}
                        <Route index element={
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {/* Dashboard summary cards are rendered by Dashboard component */}
                            </div>
                        } />

                        {/* Feature Routes */}
                        <Route path="inventory" element={<Inventory />} />
                        <Route path="customers" element={<Customers />} />
                        <Route path="invoices" element={<Invoices />} />
                        <Route path="salary" element={<Salary />} />
                    </Route>

                    {/* Profile Route */}
                    <Route path="/profile" element={<UserProfile />} />

                    {/* Redirect root to dashboard */}
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />

                    {/* Catch all route - redirect to dashboard */}
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;