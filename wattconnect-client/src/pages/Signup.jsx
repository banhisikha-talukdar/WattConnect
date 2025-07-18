import AuthForm from '../components/AuthForm';
import { Link } from 'react-router-dom';
import LoginSignupHeader from '../components/LoginSignupHeader';

export default function Signup() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-[#9cc7fc]">
      <LoginSignupHeader />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-white to-[#9cc7fc]">
        <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
          <h1 className="text-3xl font-bold text-center text-[#01217e] mb-6">Sign Up</h1>
          <AuthForm mode="signup" />
          <p className="mt-4 text-center text-sm text-gray-700">
            Already have an account?{' '}
            <Link to="/login" className="text-[#226c82] font-medium hover:underline">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}