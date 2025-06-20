import { Link } from 'react-router-dom';

const LoginHeader = () => (
  <header className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <h1 className="text-xl font-semibold text-gray-800">Authentication</h1>
      <Link to="/" className="text-blue-600 hover:underline text-sm font-medium">
        ⬅ Go Back
      </Link>
    </div>
  </header>
);

export default LoginHeader;
