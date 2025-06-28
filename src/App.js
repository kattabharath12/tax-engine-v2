// src/App.js
import React from "react";
import "./App.css";

function App() {
  return (
    <div className="bg-gray-50 text-gray-800 font-sans min-h-screen">
      {/* Header */}
      <header className="bg-blue-900 text-white py-6 shadow-md">
        <div className="max-w-5xl mx-auto px-4">
          <h1 className="text-2xl font-bold">US Federal & State Tax Filing System</h1>
          <p className="text-sm mt-1">Complete tax preparation and e-filing solution</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto mt-12 px-4">
        {/* Progress Steps */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-center mb-4">Tax Filing Progress</h2>
          <div className="grid grid-cols-4 gap-2 text-sm text-center">
            <div className="bg-blue-200 text-blue-900 p-2 rounded font-medium">1. Registration</div>
            <div className="bg-gray-200 p-2 rounded">2. Data Collection</div>
            <div className="bg-gray-200 p-2 rounded">3. Documents</div>
            <div className="bg-gray-200 p-2 rounded">4. Calculations</div>
            <div className="bg-gray-200 p-2 rounded">5. Review</div>
            <div className="bg-gray-200 p-2 rounded">6. Payment</div>
            <div className="bg-gray-200 p-2 rounded">7. Notifications</div>
            <div className="bg-gray-200 p-2 rounded">8. Complete</div>
          </div>
        </div>

        {/* Registration Form */}
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-6">User Registration & Authentication</h2>
          <form className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium">Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full mt-1 p-2 border border-gray-300 rounded"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Accepts gmail, yahoo, outlook, etc.</p>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium">Password</label>
              <input
                type="password"
                placeholder="Minimum 6 characters"
                className="w-full mt-1 p-2 border border-gray-300 rounded"
                required
                minLength="6"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium">Phone Number</label>
              <input
                type="tel"
                placeholder="(555) 555-5555"
                pattern="[0-9]{10}"
                className="w-full mt-1 p-2 border border-gray-300 rounded"
                required
              />
            </div>

            {/* SSN */}
            <div>
              <label className="block text-sm font-medium">SSN</label>
              <input
                type="text"
                placeholder="XXX-XX-XXXX"
                pattern="\d{3}-\d{2}-\d{4}"
                className="w-full mt-1 p-2 border border-gray-300 rounded"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
              Create Account
            </button>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 py-6 text-center text-sm text-gray-600 bg-gray-100">
        <p>© 2024 US Tax Filing System – Secure, Compliant, and IRS-Approved</p>
        <p className="mt-1">256-bit SSL Encryption • IRS e-file Provider • Bank-Level Security</p>
      </footer>
    </div>
  );
}

export default App;
