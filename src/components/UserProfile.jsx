// src/components/UserProfile.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Key, Save } from 'lucide-react';
import supabase from '../config/supabaseClient';

function UserProfile() {
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [profileData, setProfileData] = useState({
        full_name: '',
        email: '',
        role: '',
        avatar_url: null
    });

    // Load user profile data
    useEffect(() => {
        if (user) {
            fetchUserProfile();
        }
    }, [user]);

    async function fetchUserProfile() {
        try {
            setIsLoading(true);
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (error) throw error;

            if (data) {
                setProfileData({
                    full_name: data.full_name || '',
                    email: user.email,
                    role: data.role || 'user',
                    avatar_url: data.avatar_url
                });
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
            setError('Failed to load profile data');
        } finally {
            setIsLoading(false);
        }
    }

    async function handleUpdateProfile(e) {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const { error } = await supabase
                .from('profiles')
                .upsert({
                    id: user.id,
                    full_name: profileData.full_name,
                    role: profileData.role,
                    updated_at: new Date()
                });

            if (error) throw error;

            setIsEditing(false);
        } catch (error) {
            setError('Failed to update profile');
            console.error('Error updating profile:', error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="bg-white rounded-lg shadow p-6 max-w-2xl mx-auto">
            {error && (
                <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                    {error}
                </div>
            )}

            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">User Profile</h2>
                <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="text-blue-600 hover:text-blue-800"
                >
                    {isEditing ? 'Cancel' : 'Edit Profile'}
                </button>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="space-y-4">
                    {/* Full Name Field */}
                    <div>
                        <label className="flex items-center text-sm font-medium text-gray-700">
                            <User className="h-4 w-4 mr-2" />
                            Full Name
                        </label>
                        <input
                            type="text"
                            value={profileData.full_name}
                            onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
                            disabled={!isEditing}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        />
                    </div>

                    {/* Email Field */}
                    <div>
                        <label className="flex items-center text-sm font-medium text-gray-700">
                            <Mail className="h-4 w-4 mr-2" />
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={profileData.email}
                            disabled
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 cursor-not-allowed"
                        />
                    </div>

                    {/* Role Field */}
                    <div>
                        <label className="flex items-center text-sm font-medium text-gray-700">
                            <Key className="h-4 w-4 mr-2" />
                            Role
                        </label>
                        <input
                            type="text"
                            value={profileData.role}
                            disabled
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 cursor-not-allowed"
                        />
                    </div>
                </div>

                {isEditing && (
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                        >
                            {isLoading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4 mr-2" />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                )}
            </form>
        </div>
    );
}

export default UserProfile;