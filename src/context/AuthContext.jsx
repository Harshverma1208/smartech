// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
//import { useNavigate } from 'react-router-dom';
import supabase from '../config/supabaseClient';

const AuthContext = createContext({});

// export function AuthProvider({ children }) {
//     const [user, setUser] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const navigate = useNavigate();

//     // Check for user session on initial load
//     useEffect(() => {
//         async function getInitialSession() {
//             try {
//                 // Get session data if it exists
//                 const { data: { user } } = await supabase.auth.getUser();
//                 setUser(user ?? null);
//             } catch (error) {
//                 console.error('Error checking auth status:', error);
//             } finally {
//                 setLoading(false);
//             }
//         }

//         getInitialSession();

//         // Listen for auth changes
//         const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
//             setUser(session?.user ?? null);
//         });

//         return () => subscription.unsubscribe();
//     }, []);

//     // Sign in with email and password
//     async function signIn(email, password) {
//         try {
//             const { data, error } = await supabase.auth.signInWithPassword({
//                 email,
//                 password
//             });

//             if (error) throw error;

//             navigate('/dashboard');
//             return data;
//         } catch (error) {
//             throw new Error(error.message);
//         }
//     }

//     // Sign up new users
//     async function signUp(email, password, userData) {
//         try {
//             const { data, error } = await supabase.auth.signUp({
//                 email,
//                 password,
//                 options: {
//                     data: userData // Additional user data like name, role, etc.
//                 }
//             });

//             if (error) throw error;

//             return data;
//         } catch (error) {
//             throw new Error(error.message);
//         }
//     }

//     // Sign out
//     async function signOut() {
//         try {
//             const { error } = await supabase.auth.signOut();
//             if (error) throw error;
            
//             navigate('/login');
//         } catch (error) {
//             console.error('Error signing out:', error);
//         }
//     }

//     return (
//         <AuthContext.Provider value={{
//             user,
//             loading,
//             signIn,
//             signUp,
//             signOut
//         }}>
//             {!loading && children}
//         </AuthContext.Provider>
//     );
// }

// export const useAuth = () => {
//     const context = useContext(AuthContext);
//     if (!context) {
//         throw new Error('useAuth must be used within an AuthProvider');
//     }
//     return context;
// };


export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      // Check active sessions and sets the user
      const session = supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
  
      // Listen for changes on auth state (sign in, sign out, etc.)
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      });
  
      return () => subscription.unsubscribe();
    }, []);
  
    const signIn = async (email, password) => {
      try {
        setError(null);
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        return data;
      } catch (error) {
        setError(error.message);
        return null;
      }
    };
  
    const signOut = async () => {
      try {
        setError(null);
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
      } catch (error) {
        setError(error.message);
      }
    };
  
    return (
      <AuthContext.Provider value={{
        user,
        loading,
        error,
        signIn,
        signOut,
      }}>
        {children}
      </AuthContext.Provider>
    );
  };
  
  export const useAuth = () => {
    return useContext(AuthContext);
  };
  