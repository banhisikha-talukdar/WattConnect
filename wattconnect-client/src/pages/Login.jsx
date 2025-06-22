import AuthForm from '../components/AuthForm';
import { Link } from 'react-router-dom';

export default function Login() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-white to-[#9cc7fc]">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-[#01195e] mb-6">Login</h1>
        <AuthForm mode="login" />
        <p className="mt-4 text-center text-sm text-gray-700">
          Don't have an account?{' '}
          <Link to="/signup" className="text-[#226c82] font-medium hover:underline">
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
}
