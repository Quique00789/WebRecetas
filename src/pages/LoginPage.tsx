import React, { useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogIn } from 'lucide-react';
import ReCAPTCHA from 'react-google-recaptcha';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, loginWithGoogle } = useAuth();
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Ejecuta el captcha SOLO para email/password
      const token = await recaptchaRef.current?.executeAsync();
      recaptchaRef.current?.reset();

      if (!token) {
        setError('Captcha verification failed.');
        setLoading(false);
        return;
      }

      await login(email, password);
      navigate('/');
    } catch (err) {
      setError('Failed to sign in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setError('');
      setLoading(true);
      // NO ejecutar captcha aquí
      await loginWithGoogle();
      navigate('/');
    } catch (err) {
      setError('Failed to sign in with Google.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-amber-50/30 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-sm">
        <div className="text-center">
          <LogIn className="mx-auto h-12 w-12 text-amber-500" />
          <h2 className="mt-6 text-3xl font-bold text-amber-900">Welcome back</h2>
          <p className="mt-2 text-sm text-amber-700">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-amber-600 hover:text-amber-500">
              Sign up
            </Link>
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-amber-900">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-300 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-amber-900">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-300 focus:border-transparent"
              />
            </div>
          </div>

          <ReCAPTCHA
            sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
            size="invisible"
            ref={recaptchaRef}
          />
          <div className="space-y-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-amber-500 hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-300 disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-amber-300 rounded-lg shadow-sm text-sm font-medium text-amber-700 bg-white hover:bg-amber-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-300 disabled:opacity-50"
            >
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google"
                className="w-5 h-5 mr-2"
              />
              Sign in with Google
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;