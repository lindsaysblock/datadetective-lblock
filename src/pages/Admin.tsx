/**
 * Minimal Admin Page for Testing
 */

import React from 'react';
import Header from '@/components/Header';
import LegalFooter from '@/components/LegalFooter';

const Admin = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Admin Dashboard
            </h1>
            <p className="text-xl text-gray-600">
              System administration and testing tools
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Dashboard Status</h2>
            <p className="text-gray-600">Admin dashboard is loading successfully!</p>
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800">System Status</h3>
                <p className="text-blue-600">✅ Online</p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-800">Database</h3>
                <p className="text-green-600">✅ Connected</p>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-800">Services</h3>
                <p className="text-purple-600">✅ Running</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <LegalFooter />
    </div>
  );
};

export default Admin;