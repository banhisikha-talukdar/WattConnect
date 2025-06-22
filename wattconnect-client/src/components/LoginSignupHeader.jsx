import { Link } from 'react-router-dom';

const LoginSignupHeader = () => (
  <header className="bg-blue-50 h-10 flex items-center px-4">
    <Link to="/" className="text-[#226c82] hover:text-gray-500 text-m font-bold">
      ⬅ Go Back
    </Link>
  </header>
);

export default LoginSignupHeader;

