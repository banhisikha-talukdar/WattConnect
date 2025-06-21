import { Link } from 'react-router-dom';

const LoginHeader = () => (
  <header className="bg-gradient-to-br from-blue-50 to-blue-100 h-16 flex items-center px-4">
    <Link
      to="/"
      className="text-blue-700 hover:underline text-sm font-medium"
    >
      ⬅ Go Back
    </Link>
  </header>
);

export default LoginHeader;

