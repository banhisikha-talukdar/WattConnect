import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, BarChart3, Shield, Users, TrendingDown, Lightbulb, ArrowRight } from 'lucide-react';

const Landing = () => {
  const features = [
    {
      icon: BarChart3,
      title: 'Real-time Monitoring',
      description: 'Track your energy consumption in real-time with detailed analytics and insights.',
    },
    {
      icon: TrendingDown,
      title: 'Cost Optimization',
      description: 'Identify energy-saving opportunities and reduce your electricity bills significantly.',
    },
    {
      icon: Lightbulb,
      title: 'Smart Recommendations',
      description: 'Get personalized tips and suggestions to optimize your energy usage patterns.',
    },
    {
      icon: Shield,
      title: 'Secure & Reliable',
      description: 'Your data is protected with enterprise-grade security and reliable infrastructure.',
    },
  ];
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-indigo-100">
      <section className="relative px-4 sm:px-6 lg:px-8 py-20 lg:py-32 bg-[url('./assets/hero-img2.jpeg')] bg-cover bg-center bg-no-repeat">
        {/* Bottom Gradient Fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-[#b0daf2] pointer-events-none z-0" />

        {/* Main Content */}
        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-400 to-[#2550da] rounded-3xl shadow-2xl">
              <Zap className="w-10 h-10 text-white" />
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-blue-700 mb-4">
            Watt Connect
            <span className="block text-[#c9d7fe] text-shadow-lg/30">Smart Energy Management Made Simple</span>
          </h1>

          <p className="text-xl text-white mb-8 max-w-3xl mx-auto leading-relaxed">
            Welcome to APDCL's Smart Energy Saver platform. Monitor, analyze, and optimize your electricity consumption with our intelligent dashboard.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/signup"
              className="group inline-flex items-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-400 to-[#2550da] hover:from-blue-300 hover:to-blue-400 hover:text-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Get Started Today
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/*             Cards Section            */}
      <section className="py-20 bg-gradient-to-b from-[#b0daf2] to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Why Choose Watt Connect?
            </h2>
            <p className="text-xl text-[#7fa9eb] max-w-3xl mx-auto">
              Our comprehensive platform provides everything you need to monitor, understand, and optimize your energy consumption.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl border border-gray-200 hover:border-blue-200 transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl mb-6 group-hover:from-blue-400 group-hover:to-[#031517] transition-all duration-300">
                  <feature.icon className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/*             Last Section          */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              Ready to Start Saving Energy?
            </h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Join thousands of customers who are already saving money and reducing their environmental impact with our smart energy management platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup" className="inline-flex items-center px-8 py-4 text-lg font-semibold text-[#031517] bg-white hover:bg-blue-50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <Users className="mr-2 w-5 h-5" />
                Create Free Account
              </Link>
              <Link to="/login" className="inline-flex items-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-br from-blue-400 to-[#01217e] hover:bg-blue-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                Access Your Dashboard
              </Link> 
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing
