import { useState } from 'react';
import API from '../api/axiosConfig';

export default function AuthForm({ onAuthSuccess, showNotification }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? '/auth/login' : '/auth/register';
    const payload = isLogin ? { email, password } : { email, password, role };

    try {
      const { data } = await API.post(endpoint, payload);
      if (data.success) {
        showNotification(data.message || 'Welcome back!');
        onAuthSuccess(data.token, data.user);
      }
    } catch (error) {
      showNotification(error.response?.data?.message || 'Authentication failed', 'error');
    }
  };

  return (
    <div class="max-w-md w-full mx-auto mt-16 bg-white p-8 rounded-xl shadow-md border border-slate-100">
      <h2 class="text-2xl font-bold text-slate-900 text-center mb-6">
        {isLogin ? 'Sign In to PrimeTrade' : 'Create Intern Workspace'}
      </h2>
      <form onSubmit={handleSubmit} class="space-y-4">
        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-1">Email Address</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
            class="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-1">Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6}
            class="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        {!isLogin && (
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1">Privilege Role</label>
            <select value={role} onChange={e => setRole(e.target.value)}
              class="w-full px-4 py-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="user">Standard User (Personal scope)</option>
              <option value="admin">Admin (Global system scope)</option>
            </select>
          </div>
        )}
        <button type="submit" class="w-full py-2.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition">
          {isLogin ? 'Log In' : 'Register Account'}
        </button>
      </form>
      <p class="text-center text-sm text-slate-600 mt-4">
        {isLogin ? "New to the platform? " : "Already have an account? "}
        <span onClick={() => setIsLogin(!isLogin)} class="text-blue-600 font-semibold cursor-pointer hover:underline">
          {isLogin ? 'Create one' : 'Sign in here'}
        </span>
      </p>
    </div>
  );
}