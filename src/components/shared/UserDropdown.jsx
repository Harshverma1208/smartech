import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ChevronDown, User, LogOut, Settings } from 'lucide-react';

export default function UserDropdown() {
    const { user, signOut } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSignOut = async () => {
        await signOut();
        navigate('/login');
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 bg-gray-50 hover:bg-gray-100 transition-colors duration-200 px-4 py-2 rounded-lg group"
            >
                <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center">
                    <span className="text-sm font-medium">
                        {user?.email?.charAt(0).toUpperCase() || 'U'}
                    </span>
                </div>
                <span className="font-medium text-gray-700">
                    {user?.email || 'User'}
                </span>
                <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <button
                        onClick={() => {
                            navigate('/profile');
                            setIsOpen(false);
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                        <User className="h-4 w-4 mr-2" />
                        Profile Settings
                    </button>

                    <button
                        onClick={handleSignOut}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                    </button>
                </div>
            )}
        </div>
    );
}