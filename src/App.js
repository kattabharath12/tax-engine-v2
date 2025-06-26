import React, { useState } from 'react';
import { 
  User, Shield, Upload, Calculator, FileText, CreditCard, Bell, HelpCircle,
  CheckCircle, AlertTriangle, Eye, EyeOff, Download, Send, Phone, Mail, 
  Lock, Plus, Minus, DollarSign, Home, Building, X
} from 'lucide-react';

function App() {
  const [currentStep, setCurrentStep] = useState('registration');
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    personal: { ssn: '', address: '', filingStatus: '', dependents: [] },
    income: { w2: 0, income1099: 0, investments: 0, stateSpecific: 0 },
    deductions: { standardItemized: 'standard', education: 0, childCredit: 0 },
    documents: [],
    calculations: { federal: 0, state: 0, refund: 0 }
  });

  const UserRegistrationAuth = () => {
    const [authData, setAuthData] = useState({ 
      email: '', password: '', phone: '', ssn: '', mfaCode: '', 
      showMFA: false, verificationStep: 'login'
    });
    const [errors, setErrors] = useState({});

    const validateEmail = (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };

    const validatePhone = (phone) => {
      const phoneRegex = /^[\d\s\-\(\)]+$/;
      const cleanPhone = phone.replace(/\D/g, '');
      return phoneRegex.test(phone) && cleanPhone.length === 10;
    };

    const validateSSN = (ssn) => {
      const ssnRegex = /^\d{3}-\d{2}-\d{4}$/;
      return ssnRegex.test(ssn);
    };

    const formatPhoneNumber = (value) => {
      const phoneNumber = value.replace(/\D/g, '');
      const phoneNumberLength = phoneNumber.length;
      if (phoneNumberLength < 4) {
        return phoneNumber;
      } else if (phoneNumberLength < 7) {
        return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
      } else {
        return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
      }
    };

    const formatSSN = (value) => {
      const ssn = value.replace(/\D/g, '');
      const ssnLength = ssn.length;
      if (ssnLength < 4) {
        return ssn;
      } else if (ssnLength < 6) {
        return `${ssn.slice(0, 3)}-${ssn.slice(3)}`;
      } else {
        return `${ssn.slice(0, 3)}-${ssn.slice(3, 5)}-${ssn.slice(5, 9)}`;
      }
    };

    const handleInputChange = (field, value) => {
      let formattedValue = value;
      let newErrors = { ...errors };

      delete newErrors[field];

      switch (field) {
        case 'email':
          if (value && !validateEmail(value)) {
            newErrors.email = 'Please enter a valid email address';
          }
          break;
        case 'phone':
          formattedValue = formatPhoneNumber(value);
          if (value && !validatePhone(formattedValue)) {
            newErrors.phone = 'Please enter a valid 10-digit phone number';
          }
          break;
        case 'ssn':
          formattedValue = formatSSN(value);
          if (value && !validateSSN(formattedValue)) {
            newErrors.ssn = 'Please enter a valid SSN (XXX-XX-XXXX)';
          }
          break;
        default:
          break;
      }

      setAuthData({ ...authData, [field]: formattedValue });
      setErrors(newErrors);
    };

    const handleAuth = (e) => {
      e.preventDefault();
      
      const newErrors = {};
      
      if (!authData.email) {
        newErrors.email = 'Email is required';
      } else if (!validateEmail(authData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
      
      if (!authData.password) {
        newErrors.password = 'Password is required';
      } else if (authData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }
      
      if (!authData.phone) {
        newErrors.phone = 'Phone number is required';
      } else if (!validatePhone(authData.phone)) {
        newErrors.phone = 'Please enter a valid 10-digit phone number';
      }
      
      if (!authData.ssn) {
        newErrors.ssn = 'SSN is required';
      } else if (!validateSSN(authData.ssn)) {
        newErrors.ssn = 'Please enter a valid SSN (XXX-XX-XXXX)';
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      setAuthData({ ...authData, showMFA: true });
    };

    const handleMFAVerification = () => {
      if (authData.mfaCode.length !== 6) {
        setErrors({ mfa: 'Please enter a valid 6-digit code' });
        return;
      }
      
      setUser({ email: authData.email, verified: true });
      setCurrentStep('complete');
    };

    return (
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <User className="w-6 h-6 mr-2" />
          User Registration & Authentication
        </h2>

        {!authData.showMFA ? (
          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <input
                type="email"
                placeholder="Email Address (any valid email)"
                value={authData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`w-full p-3 border rounded-lg ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                required
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Accepts all email providers: gmail.com, yahoo.com, outlook.com, etc.
              </p>
            </div>

            <div>
              <input
                type="password"
                placeholder="Password (minimum 6 characters)"
                value={authData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className={`w-full p-3 border rounded-lg ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                required
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            <div>
              <input
                type="tel"
                placeholder="Phone Number"
                value={authData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className={`w-full p-3 border rounded-lg ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                maxLength="14"
                required
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Format: (555) 555-5555 - Only numbers allowed
              </p>
            </div>

            <div>
              <input
                type="text"
                placeholder="SSN"
                value={authData.ssn}
                onChange={(e) => handleInputChange('ssn', e.target.value)}
                className={`w-full p-3 border rounded-lg ${errors.ssn ? 'border-red-500' : 'border-gray-300'}`}
                maxLength="11"
                required
              />
              {errors.ssn && (
                <p className="text-red-500 text-sm mt-1">{errors.ssn}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Format: XXX-XX-XXXX - Only numbers allowed
              </p>
            </div>

            <button 
              type="submit" 
              className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Account
            </button>
          </form>
        ) : (
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-bold mb-2">Multi-Factor Authentication</h4>
            <p className="text-sm text-gray-600 mb-3">
              Enter the 6-digit code sent to {authData.phone}
            </p>
            
            {errors.mfa && (
              <div className="bg-red-50 border border-red-200 p-2 rounded mb-3">
                <p className="text-red-600 text-sm">{errors.mfa}</p>
              </div>
            )}
            
            <input
              type="text"
              placeholder="Enter 6-digit MFA Code"
              value={authData.mfaCode}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                setAuthData({...authData, mfaCode: value});
                if (errors.mfa) {
                  setErrors({});
                }
              }}
              className="w-full p-3 border rounded-lg mb-3 text-center text-2xl tracking-widest"
              maxLength="6"
            />
            
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-3">
                Demo: Enter any 6-digit code (or use 123456)
              </p>
              <button
                onClick={handleMFAVerification}
                disabled={authData.mfaCode.length !== 6}
                className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Verify & Continue
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const CompleteDashboard = () => {
    const [activeModal, setActiveModal] = useState(null);
    
    const totalIncome = formData.income.w2 + formData.income.income1099 + formData.income.investments + formData.income.stateSpecific;
    const refundAmount = totalIncome > 0 ? Math.max(1000, totalIncome * 0.12) : 3250;

    const handleDownloadReturns = () => {
      const pdfContent = `
TAX RETURN SUMMARY - 2024
=========================

Taxpayer Information:
Name: ${user.email.split('@')[0]} (User)
Email: ${user.email}

Income Summary:
W-2 Income: $${formData.income.w2.toLocaleString()}
1099 Income: $${formData.income.income1099.toLocaleString()}
Investment Income: $${formData.income.investments.toLocaleString()}
State-Specific Income: $${formData.income.stateSpecific.toLocaleString()}
Total Income: $${totalIncome.toLocaleString()}

Expected Refund: $${Math.round(refundAmount).toLocaleString()}

Filing Date: ${new Date().toLocaleDateString()}
Filing Method: Electronic
      `;

      const blob = new Blob([pdfContent], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Tax_Return_2024_${user.email.split('@')[0]}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      alert('Your tax return summary has been downloaded!');
    };

    const closeModal = () => {
      setActiveModal(null);
    };

    return (
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">Tax Filing Complete!</h2>
          
          <div className="bg-gray-100 p-6 rounded-lg mb-6">
            <h3 className="text-xl font-bold mb-4">Your Filing Summary</h3>
            <div className="grid grid-cols-2 gap-4 text-left">
              <div>
                <p><strong>Federal Status:</strong> Filed & Accepted</p>
                <p><strong>State Status:</strong> Filed & Accepted</p>
                <p><strong>Expected Refund:</strong> ${Math.round(refundAmount).toLocaleString()}</p>
                <p><strong>Your Total Income:</strong> ${totalIncome.toLocaleString()}</p>
              </div>
              <div>
                <p><strong>Filing Method:</strong> Electronic</p>
                <p><strong>Confirmation:</strong> 2024{Math.floor(Math.random() * 1000000000)}</p>
                <p><strong>Refund Method:</strong> Direct Deposit</p>
                <p><strong>Documents Uploaded:</strong> {formData.documents.length}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <button 
              onClick={handleDownloadReturns}
              className="bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="w-6 h-6 mx-auto mb-2" />
              Download Returns
            </button>
            <button 
              onClick={() => setActiveModal('refund')}
              className="bg-green-600 text-white p-4 rounded-lg hover:bg-green-700 transition-colors"
            >
              <DollarSign className="w-6 h-6 mx-auto mb-2" />
              Track Refund
            </button>
            <button 
              onClick={() => setActiveModal('documents')}
              className="bg-purple-600 text-white p-4 rounded-lg hover:bg-purple-700 transition-colors"
            >
              <FileText className="w-6 h-6 mx-auto mb-2" />
              View Documents
            </button>
          </div>
        </div>

        {activeModal === 'refund' && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Refund Status</h3>
                <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-bold mb-3">Federal Refund: ${Math.round(refundAmount * 0.8).toLocaleString()}</h4>
                <p><strong>Status:</strong> <span className="text-green-600">Approved</span></p>
                <p><strong>Expected:</strong> March 15, 2024</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div className="bg-green-600 h-2 rounded-full w-3/4"></div>
                </div>
              </div>
              
              <div className="mt-6 text-center">
                <button onClick={closeModal} className="bg-blue-600 text-white px-6 py-2 rounded-lg">
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {activeModal === 'documents' && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-3xl w-full mx-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Tax Documents</h3>
                <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center">
                    <FileText className="w-6 h-6 text-blue-600 mr-3" />
                    <div>
                      <p className="font-medium">Form 1040 - Federal Return</p>
                      <p className="text-sm text-gray-600">PDF • 245 KB</p>
                    </div>
                  </div>
                  <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-800">
                    Filed
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center">
                    <FileText className="w-6 h-6 text-blue-600 mr-3" />
                    <div>
                      <p className="font-medium">State Return - California</p>
                      <p className="text-sm text-gray-600">PDF • 189 KB</p>
                    </div>
                  </div>
                  <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-800">
                    Filed
                  </span>
                </div>
              </div>
              
              <div className="mt-6 text-center">
                <button onClick={closeModal} className="bg-gray-500 text-white px-6 py-2 rounded-lg">
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Building className="w-8 h-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-bold text-gray-900">US Federal & State Tax Submission</h1>
            </div>
            {user && (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">Welcome, {user.email}</span>
                <button
                  onClick={() => {
                    setUser(null);
                    setCurrentStep('registration');
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <Lock className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentStep === 'registration' && <UserRegistrationAuth />}
        {currentStep === 'complete' && <CompleteDashboard />}
      </main>
    </div>
  );
}

export default App;
