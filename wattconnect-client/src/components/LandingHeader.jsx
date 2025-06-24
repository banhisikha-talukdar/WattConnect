import { Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-[#01217e] shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/*         Logo Section          */}
          <Link
            to="/"
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
          >
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-blue-300">Watt Connect</h1>
              <p className="text-xs text-gray-300 -mt-1">APDCL Dashboard</p>
            </div>
          </Link>

          {/*       Buttons        */}
          <div className="flex items-center space-x-4">
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-medium text-white bg-[#7fa9eb] hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
            >
              Signup
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
