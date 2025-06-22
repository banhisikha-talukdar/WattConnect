import { Heart, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-[#60dbea] to-[#031517] text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/*                About Section                */}
          <div>
            <h3 className="text-lg font-semibold mb-4">About APDCL</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Assam Power Distribution Company Limited (APDCL) is committed to providing 
              reliable and efficient power distribution services across Assam. Our Smart 
              Energy Saver platform helps customers monitor and optimize their electricity consumption.
            </p>
          </div>

          {/*                  Contact Information               */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm text-gray-300">
                <Phone className="w-4 h-4 text-primary-400" />
                <span>+91-361-2840234</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-300">
                <Mail className="w-4 h-4 text-primary-400" />
                <span>support@apdcl.gov.in</span>
              </div>
              <div className="flex items-start space-x-3 text-sm text-gray-300">
                <MapPin className="w-4 h-4 text-primary-400 mt-0.5" />
                <span>Bijulee Bhawan, Paltanbazar<br />Guwahati, Assam - 781001</span>
              </div>
            </div>
          </div>

          {/*              Quick Links                 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <div className="space-y-2">
              <Link to="/contact" className="block text-sm text-gray-300 hover:text-primary-400 transition-colors">
                Customer Care
              </Link>
              <Link to="/tariff" className="block text-sm text-gray-300 hover:text-primary-400 transition-colors">
                Tariff Schedule
              </Link>
              <Link to="/outages" className="block text-sm text-gray-300 hover:text-primary-400 transition-colors">
                Power Outage Updates
              </Link>
              <Link to="/tips" className="block text-sm text-gray-300 hover:text-primary-400 transition-colors">
                Energy Conservation Tips
              </Link>
              <Link to="/complaints" className="block text-sm text-gray-300 hover:text-primary-400 transition-colors">
                Complaint Portal
              </Link>
            </div>
          </div>
        </div>

        {/*                     Last Section                    */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <p className="text-sm text-gray-400">
              © 2025 APDCL Internship Project. All rights reserved.
            </p>
            <div className="flex items-center space-x-1 text-sm text-gray-400">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500" />
              <span>for sustainable energy management</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;