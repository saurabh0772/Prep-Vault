import { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../services/axiosInstance';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');

      // FIX: token hi nahi hai toh /me call mat karo - register page pe yahi ho raha tha
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await axiosInstance.get('/auth/me');
        if (res.data.userId) {
          setUser({ id: res.data.userId });
        }
      } catch (error) {
        // FIX: 429 aaye toh token delete mat karo, sirf 401 pe karo
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          setUser(null);
        }
        // 429 ke liye kuch mat karo, user null rahega par token safe rahega
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await axiosInstance.post('/auth/login', { email, password });
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
      }
      setUser(res.data);
      toast.success('Logged in successfully');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
      return false;
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await axiosInstance.post('/auth/register', { name, email, password });
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
      }
      setUser(res.data);
      toast.success('Registered successfully');
      return true;
    } catch (error) {
      if (error.response?.data?.errors) {
        error.response.data.errors.forEach(err => toast.error(err.msg));
      } else {
        toast.error(error.response?.data?.message || 'Registration failed');
      }
      return false;
    }
  };

  const logout = async () => {
    try {
      await axiosInstance.post('/auth/logout');
      localStorage.removeItem('token');
      setUser(null);
      toast.success('Logged out');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};