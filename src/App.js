import React, { useState } from 'react';
import { 
  User, Shield, Upload, Calculator, FileText, CreditCard, Bell, HelpCircle,
  CheckCircle, AlertTriangle, Eye, EyeOff, Download, Send, Phone, Mail, 
  Lock, Plus, Minus, DollarSign, Home, Building, X
} from 'lucide-react';

const USFederalStateTaxSystem = () => {
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
      showMFA: false, verificationStep: 'login', verificationMethod: '',
      kbaAnswers: {}, documentUploaded: false, thirdPartyVerified: false
    });
    const [errors, setErrors] = useState({});
    const [currentKBAQuestion, setCurrentKBAQuestion] = useState(0);

    const kbaQuestions = [
      {
        question: "What was the name of your first pet?",
        options: ["Buddy", "Max", "Bella", "Charlie"],
        correct: 0
      },
      {
        question: "What street did you live on in 2020?",
        options: ["Main Street", "Oak Avenue", "Pine Road", "Elm Drive"],
        correct: 1
      },
      {
        question: "What was your first car's make?",
        options: ["Toyota", "Honda", "Ford", "Chevrolet"],
        correct: 2
      }
    ];

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

      setAuthData({ ...authData, showMFA: true, verificationStep: 'select' });
    };

    const handleVerification = (method) => {
      setAuthData({ ...authData, verificationMethod: method, verificationStep: method });
    };

    const handleKBAAnswer = (answerIndex) => {
      const currentQuestion = kbaQuestions[currentKBAQuestion];
      const isCorrect = answerIndex === currentQuestion.correct;
      
      const newAnswers = { ...authData.kbaAnswers };
      newAnswers[currentKBAQuestion] = { answer: answerIndex, correct: isCorrect };
      
      setAuthData({ ...authData, kbaAnswers: newAnswers });

      if (currentKBAQuestion < kbaQuestions.length - 1) {
        setCurrentKBAQuestion(currentKBAQuestion + 1);
      } else {
        const correctAnswers = Object.values(newAnswers).filter(a => a.correct).length;
        if (correctAnswers >= 2) {
          setAuthData({ ...authData, verificationStep: 'mfa', kbaAnswers: newAnswers });
        } else {
          setErrors({ kba: 'KBA verification failed. Please try a different verification method.' });
          setAuthData({ ...authData, verificationStep: 'select' });
          setCurrentKBAQuestion(0);
        }
      }
    };

    const handleDocumentUpload = (e) => {
      const file = e.target.files[0];
      if (file) {
        setTimeout(() => {
          setAuthData({ ...authData, verificationStep: 'mfa', documentUploaded: true });
        }, 2000);
      }
    };

    const handleThirdPartyVerification = () => {
      setTimeout(() => {
        setAuthData({ ...authData, verificationStep: 'mfa', thirdPartyVerified: true });
      }, 3000);
    };

    const handleMFAVerification = () => {
      if (authData.mfaCode.length !== 6) {
        setErrors({ mfa: 'Please enter a valid 6-digit code' });
        return;
      }
      
      if (authData.mfaCode === '123456' || authData.mfaCode.length === 6) {
        setUser({ email: authData.email, verified: true });
        setCurrentStep('dataCollection');
      } else {
        setErrors({ mfa: 'Invalid MFA code. Please try again.' });
      }
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
          <>
            {authData.verificationStep === 'select' && (
              <div className="mb-6">
                <h3 className="text-lg font-bold mb-4">Identity Verification Required</h3>
                <p className="text-gray-600 mb-4">Choose a verification method to continue:</p>
                
                {errors.kba && (
                  <div className="bg-red-50 border border-red-200 p-3 rounded-lg mb-4">
                    <p className="text-red-600 text-sm">{errors.kba}</p>
                  </div>
                )}
                
                <div className="grid grid-cols-1 gap-4">
                  <button
                    onClick={() => handleVerification('kba')}
                    className="p-4 border rounded-lg hover:bg-blue-50 transition-colors text-left"
                  >
                    <div className="flex items-center">
                      <Shield className="w-6 h-6 mr-3 text-blue-600" />
                      <div>
                        <h4 className="font-medium">Knowledge-Based Authentication (KBA)</h4>
                        <p className="text-sm text-gray-600">Answer questions about your personal history</p>
                      </div>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => handleVerification('document')}
                    className="p-4 border rounded-lg hover:bg-blue-50 transition-colors text-left"
                  >
                    <div className="flex items-center">
                      <FileText className="w-6 h-6 mr-3 text-green-600" />
                      <div>
                        <h4 className="font-medium">Document Upload</h4>
                        <p className="text-sm text-gray-600">Upload a government-issued ID</p>
                      </div>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => handleVerification('thirdparty')}
                    className="p-4 border rounded-lg hover:bg-blue-50 transition-colors text-left"
                  >
                    <div className="flex items-center">
                      <CheckCircle className="w-6 h-6 mr-3 text-purple-600" />
                      <div>
                        <h4 className="font-medium">Third-Party Verification</h4>
                        <p className="text-sm text-gray-600">Verify through external credit agencies</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {authData.verificationStep === 'kba' && (
              <div className="mb-6">
                <h3 className="text-lg font-bold mb-4">Knowledge-Based Authentication</h3>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-800 mb-4">
                    Question {currentKBAQuestion + 1} of {kbaQuestions.length}
                  </p>
                  <h4 className="font-medium mb-4">{kbaQuestions[currentKBAQuestion].question}</h4>
                  <div className="space-y-2">
                    {kbaQuestions[currentKBAQuestion].options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleKBAAnswer(index)}
                        className="w-full p-3 text-left border rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {authData.verificationStep === 'document' && (
              <div className="mb-6">
                <h3 className="text-lg font-bold mb-4">Document Upload Verification</h3>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-green-800 mb-4">
                    Upload a clear photo of your government-issued ID (Driver's License, Passport, etc.)
                  </p>
                  {!authData.documentUploaded ? (
                    <div>
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={handleDocumentUpload}
                        className="w-full p-3 border rounded-lg mb-3"
                      />
                      <p className="text-xs text-gray-600">Accepted formats: JPG, PNG, PDF</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-2" />
                      <p className="text-green-600 font-medium">Document uploaded successfully!</p>
                      <p className="text-sm text-gray-600">Processing verification...</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {authData.verificationStep === 'thirdparty' && (
              <div className="mb-6">
                <h3 className="text-lg font-bold mb-4">Third-Party Verification</h3>
                <div className="bg-purple-50 p-4 rounded-lg">
                  {!authData.thirdPartyVerified ? (
                    <div className="text-center">
                      <p className="text-sm text-purple-800 mb-4">
                        We'll verify your identity through external credit agencies and public records.
                      </p>
                      <button
                        onClick={handleThirdPartyVerification}
                        className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        Start Verification Process
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <CheckCircle className="w-12 h-12 text-purple-600 mx-auto mb-2" />
                      <p className="text-purple-600 font-medium">Verification successful!</p>
                      <p className="text-sm text-gray-600">Identity confirmed through external sources</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {authData.verificationStep === 'mfa' && (
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

            {authData.verificationStep !== 'select' && authData.verificationStep !== 'mfa' && (
              <button
                onClick={() => setAuthData({ ...authData, verificationStep: 'select' })}
                className="mt-4 text-blue-600 hover:text-blue-800 text-sm"
              >
                ← Back to verification methods
              </button>
            )}
          </>
        )}
      </div>
    );
  };

  const DataCollection = () => {
    const [activeTab, setActiveTab] = useState('personal');

    const updatePersonal = (field, value) => {
      setFormData({
        ...formData,
        personal: { ...formData.personal, [field]: value }
      });
    };

    const updateIncome = (field, value) => {
      setFormData({
        ...formData,
        income: { ...formData.income, [field]: parseFloat(value) || 0 }
      });
    };

    const addDependent = () => {
      setFormData({
        ...formData,
        personal: {
          ...formData.personal,
          dependents: [...formData.personal.dependents, { name: '', ssn: '', relationship: '' }]
        }
      });
    };

    const removeDependent = (index) => {
      setFormData({
        ...formData,
        personal: {
          ...formData.personal,
          dependents: formData.personal.dependents.filter((_, i) => i !== index)
        }
      });
    };

    return (
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
        <div className="flex border-b">
          {['personal', 'income', 'deductions'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 p-4 capitalize ${activeTab === tab ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
            >
              {tab} Information
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === 'personal' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold">Personal Information</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="SSN (XXX-XX-XXXX)"
                  value={formData.personal.ssn}
                  onChange={(e) => updatePersonal('ssn', e.target.value)}
                  className="p-3 border rounded-lg"
                />
                <select
                  value={formData.personal.filingStatus}
                  onChange={(e) => updatePersonal('filingStatus', e.target.value)}
                  className="p-3 border rounded-lg"
                >
                  <option value="">Filing Status</option>
                  <option value="single">Single</option>
                  <option value="married-joint">Married Filing Jointly</option>
                  <option value="married-separate">Married Filing Separately</option>
                  <option value="head-of-household">Head of Household</option>
                </select>
              </div>

              <input
                type="text"
                placeholder="Full Address"
                value={formData.personal.address}
                onChange={(e) => updatePersonal('address', e.target.value)}
                className="w-full p-3 border rounded-lg"
              />

              <div>
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-lg font-semibold">Dependents</h4>
                  <button
                    onClick={addDependent}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Dependent
                  </button>
                </div>

                {formData.personal.dependents.map((dependent, index) => (
                  <div key={index} className="border p-4 rounded-lg mb-4">
                    <div className="flex justify-between items-center mb-4">
                      <h5 className="font-medium">Dependent {index + 1}</h5>
                      <button
                        onClick={() => removeDependent(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <input
                        type="text"
                        placeholder="Name"
                        className="p-2 border rounded"
                      />
                      <input
                        type="text"
                        placeholder="SSN"
                        className="p-2 border rounded"
                      />
                      <input
                        type="text"
                        placeholder="Relationship"
                        className="p-2 border rounded"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'income' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold">Income Information</h3>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <label className="block font-medium mb-2">W-2 Income</label>
                  <input
                    type="number"
                    value={formData.income.w2}
                    onChange={(e) => updateIncome('w2', e.target.value)}
                    className="w-full p-3 border rounded-lg"
                    placeholder="$0.00"
                  />
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <label className="block font-medium mb-2">1099 Income</label>
                  <input
                    type="number"
                    value={formData.income.income1099}
                    onChange={(e) => updateIncome('income1099', e.target.value)}
                    className="w-full p-3 border rounded-lg"
                    placeholder="$0.00"
                  />
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <label className="block font-medium mb-2">Investment Income</label>
                  <input
                    type="number"
                    value={formData.income.investments}
                    onChange={(e) => updateIncome('investments', e.target.value)}
                    className="w-full p-3 border rounded-lg"
                    placeholder="$0.00"
                  />
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg">
                  <label className="block font-medium mb-2">State-Specific Income</label>
                  <input
                    type="number"
                    value={formData.income.stateSpecific}
                    onChange={(e) => updateIncome('stateSpecific', e.target.value)}
                    className="w-full p-3 border rounded-lg"
                    placeholder="$0.00"
                  />
                </div>
              </div>

              <div className="bg-gray-100 p-4 rounded-lg">
                <h4 className="font-bold text-lg">
                  Total Income: ${(formData.income.w2 + formData.income.income1099 + formData.income.investments + formData.income.stateSpecific).toLocaleString()}
                </h4>
              </div>
            </div>
          )}

          {activeTab === 'deductions' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold">Deductions & Credits</h3>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium mb-4">Deduction Type</h4>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="deductionType"
                      value="standard"
                      checked={formData.deductions.standardItemized === 'standard'}
                      onChange={(e) => setFormData({
                        ...formData,
                        deductions: { ...formData.deductions, standardItemized: e.target.value }
                      })}
                      className="mr-2"
                    />
                    Standard Deduction
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="deductionType"
                      value="itemized"
                      checked={formData.deductions.standardItemized === 'itemized'}
                      onChange={(e) => setFormData({
                        ...formData,
                        deductions: { ...formData.deductions, standardItemized: e.target.value }
                      })}
                      className="mr-2"
                    />
                    Itemized Deductions
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="bg-green-50 p-4 rounded-lg">
                  <label className="block font-medium mb-2">Education Credits</label>
                  <input
                    type="number"
                    value={formData.deductions.education}
                    onChange={(e) => setFormData({
                      ...formData,
                      deductions: { ...formData.deductions, education: parseFloat(e.target.value) || 0 }
                    })}
                    className="w-full p-3 border rounded-lg"
                    placeholder="$0.00"
                  />
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <label className="block font-medium mb-2">Child Tax Credit</label>
                  <input
                    type="number"
                    value={formData.deductions.childCredit}
                    onChange={(e) => setFormData({
                      ...formData,
                      deductions: { ...formData.deductions, childCredit: parseFloat(e.target.value) || 0 }
                    })}
                    className="w-full p-3 border rounded-lg"
                    placeholder="$0.00"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between mt-8">
            <button
              onClick={() => setCurrentStep('registration')}
              className="bg-gray-500 text-white px-6 py-3 rounded-lg"
            >
              Back
            </button>
            <button
              onClick={() => setCurrentStep('documentUpload')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg"
            >
              Continue to Documents
            </button>
          </div>
        </div>
      </div>
    );
  };

  const DocumentUpload = () => {
    const [documents, setDocuments] = useState([]);
    const [importSource, setImportSource] = useState('');

    const handleFileUpload = (e) => {
      const files = Array.from(e.target.files);
      files.forEach(file => {
        const newDoc = {
          id: Date.now() + Math.random(),
          name: file.name,
          type: file.type,
          size: file.size,
          status: 'processing'
        };
        setDocuments(prev => [...prev, newDoc]);
        
        setTimeout(() => {
          setDocuments(prev => prev.map(doc => 
            doc.id === newDoc.id ? { ...doc, status: 'completed' } : doc
          ));
        }, 2000);
      });

      setFormData({
        ...formData,
        documents: [...formData.documents, ...files.map(file => ({ name: file.name, size: file.size }))]
      });
    };

    const handleImport = () => {
      const importedData = {
        w2Income: 65000,
        federalWithheld: 9750,
        stateWithheld: 3250
      };
      
      setFormData({
        ...formData,
        income: { ...formData.income, w2: importedData.w2Income }
      });
      
      alert(`Data imported from ${importSource}: Income ${importedData.w2Income.toLocaleString()}`);
    };

    return (
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6">Document Upload & Import</h2>
        
        <div className="bg-blue-50 p-6 rounded-lg mb-6">
          <h3 className="text-lg font-bold mb-4">Import from External Sources</h3>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <select
              value={importSource}
              onChange={(e) => setImportSource(e.target.value)}
              className="p-3 border rounded-lg"
            >
              <option value="">Select Source</option>
              <option value="ADP Payroll">ADP Payroll</option>
              <option value="Bank of America">Bank of America</option>
              <option value="TurboTax 2023">Previous TurboTax</option>
              <option value="H&R Block">H&R Block</option>
            </select>
            <button
              onClick={handleImport}
              disabled={!importSource}
              className="bg-green-600 text-white px-4 py-3 rounded-lg disabled:bg-gray-400"
            >
              Import Data
            </button>
          </div>
        </div>

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-6">
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Upload Tax Documents</h3>
          <p className="text-gray-600 mb-4">PDF, JPG, PNG supported</p>
          
          <input
            type="file"
            multiple
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
            accept=".pdf,.jpg,.jpeg,.png"
          />
          <label
            htmlFor="file-upload"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg cursor-pointer hover:bg-blue-700"
          >
            Choose Files
          </label>
        </div>

        {documents.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-bold mb-4">Uploaded Documents</h3>
            <div className="space-y-3">
              {documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center">
                    <FileText className="w-6 h-6 text-blue-600 mr-3" />
                    <div>
                      <p className="font-medium">{doc.name}</p>
                      <p className="text-sm text-gray-600">{(doc.size / 1024).toFixed(1)}KB</p>
                    </div>
                  </div>
                  <div>
                    {doc.status === 'processing' && (
                      <span className="text-blue-600">Processing...</span>
                    )}
                    {doc.status === 'completed' && (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-between">
          <button
            onClick={() => setCurrentStep('dataCollection')}
            className="bg-gray-500 text-white px-6 py-3 rounded-lg"
          >
            Back to Data Entry
          </button>
          <button
            onClick={() => setCurrentStep('taxCalculation')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg"
          >
            Continue to Calculations
          </button>
        </div>
      </div>
    );
  };

  const TaxCalculation = () => {
    const totalIncome = formData.income.w2 + formData.income.income1099 + formData.income.investments + formData.income.stateSpecific;
    const standardDeduction = 13850;
    const taxableIncome = Math.max(0, totalIncome - standardDeduction);
    
    let federalTax = 0;
    if (taxableIncome > 0) {
      if (taxableIncome <= 11000) {
        federalTax = taxableIncome * 0.10;
      } else if (taxableIncome <= 44725) {
        federalTax = 1100 + (taxableIncome - 11000) * 0.12;
      } else if (taxableIncome <= 95375) {
        federalTax = 5147 + (taxableIncome - 44725) * 0.22;
      } else {
        federalTax = 16290 + (taxableIncome - 95375) * 0.24;
      }
    }

    const stateTax = taxableIncome * 0.05;
    const totalTax = federalTax + stateTax;
    const estimatedRefund = Math.max(0, (totalIncome * 0.18) - totalTax);

    const [errors] = useState([
      { type: 'warning', message: 'Verify W-2 income matches uploaded documents' },
      { type: 'info', message: 'Consider maximizing retirement contributions' }
    ]);

    return (
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6">Tax Calculations</h2>

        <div className="mb-6">
          <h3 className="text-lg font-bold mb-3">Error Checking & Validation</h3>
          {errors.map((error, index) => (
            <div key={index} className={`flex items-center p-3 rounded-lg mb-2 ${
              error.type === 'warning' ? 'bg-yellow-50 border border-yellow-200' : 'bg-blue-50 border border-blue-200'
            }`}>
              {error.type === 'warning' ? 
                <AlertTriangle className="w-5 h-5 text-yellow-600 mr-3" /> :
                <CheckCircle className="w-5 h-5 text-blue-600 mr-3" />
              }
              <span>{error.message}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="text-lg font-bold mb-4">Federal Tax (Form 1040)</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Total Income:</span>
                <span className="font-medium">${totalIncome.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Standard Deduction:</span>
                <span className="font-medium">-${standardDeduction.toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span>Taxable Income:</span>
                <span className="font-bold">${taxableIncome.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Federal Tax:</span>
                <span className="font-bold text-red-600">${Math.round(federalTax).toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="bg-green-50 p-6 rounded-lg">
            <h3 className="text-lg font-bold mb-4">State Tax Calculation</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Taxable Income:</span>
                <span className="font-medium">${taxableIncome.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>State Tax Rate:</span>
                <span className="font-medium">5.0%</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span>State Tax:</span>
                <span className="font-bold text-red-600">${Math.round(stateTax).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg mb-6">
          <h4 className="font-bold mb-2">Amended Returns Support</h4>
          <p className="text-sm text-gray-700 mb-3">
            Need to file an amended return? We support Form 1040X for corrections.
          </p>
          <button className="bg-yellow-600 text-white px-4 py-2 rounded text-sm">
            File Amended Return
          </button>
        </div>

        <div className="bg-gray-100 p-6 rounded-lg">
          <h3 className="text-xl font-bold mb-4">Tax Summary</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white rounded-lg">
              <p className="text-sm text-gray-600">Total Tax</p>
              <p className="text-2xl font-bold text-red-600">${Math.round(totalTax).toLocaleString()}</p>
            </div>
            <div className="text-center p-4 bg-white rounded-lg">
              <p className="text-sm text-gray-600">Estimated Refund</p>
              <p className="text-2xl font-bold text-green-600">${Math.round(estimatedRefund).toLocaleString()}</p>
            </div>
            <div className="text-center p-4 bg-white rounded-lg">
              <p className="text-sm text-gray-600">Effective Rate</p>
              <p className="text-2xl font-bold text-blue-600">{totalIncome > 0 ? ((totalTax/totalIncome)*100).toFixed(1) : 0}%</p>
            </div>
          </div>
        </div>

        <div className="flex justify-between mt-8">
          <button
            onClick={() => setCurrentStep('documentUpload')}
            className="bg-gray-500 text-white px-6 py-3 rounded-lg"
          >
            Back to Documents
          </button>
          <button
            onClick={() => setCurrentStep('reviewSubmission')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg"
          >
            Continue to Review
          </button>
        </div>
      </div>
    );
  };

  const ReviewSubmission = () => {
    const [submissionStatus, setSubmissionStatus] = useState('ready');
    const [filingMethod, setFilingMethod] = useState('efiling');

    const handleSubmission = () => {
      setSubmissionStatus('submitting');
      setTimeout(() => {
        setSubmissionStatus('submitted');
      }, 3000);
    };

    const totalIncome = formData.income.w2 + formData.income.income1099 + formData.income.investments + formData.income.stateSpecific;

    return (
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6">Review & Submission</h2>

        <div className="bg-blue-50 p-6 rounded-lg mb-6">
          <h3 className="text-lg font-bold mb-4">Return Summary</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p><strong>Filing Status:</strong> {formData.personal.filingStatus}</p>
              <p><strong>Total Income:</strong> ${totalIncome.toLocaleString()}</p>
              <p><strong>Deduction Type:</strong> {formData.deductions.standardItemized}</p>
            </div>
            <div>
              <p><strong>Documents:</strong> {formData.documents.length} uploaded</p>
              <p><strong>Federal Tax:</strong> $8,500</p>
              <p><strong>State Tax:</strong> $3,200</p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-bold mb-3">Final Validation</h3>
          <div className="space-y-2">
            <div className="flex items-center p-3 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
              <span className="text-green-800">All required fields completed</span>
            </div>
            <div className="flex items-center p-3 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
              <span className="text-green-800">Documents processed successfully</span>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 p-6 rounded-lg mb-6">
          <h3 className="text-lg font-bold mb-4">E-signature Support (IRS/State Requirements)</h3>
          <div className="space-y-3">
            <label className="flex items-center">
              <input type="checkbox" className="mr-3" />
              <span className="text-sm">I declare this return is accurate under penalties of perjury</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-3" />
              <span className="text-sm">I authorize electronic signature per IRS requirements</span>
            </label>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-bold mb-3">E-filing to IRS and State Agencies</h4>
            <label className="flex items-center">
              <input 
                type="radio" 
                name="filing" 
                value="efiling"
                checked={filingMethod === 'efiling'}
                onChange={(e) => setFilingMethod(e.target.value)}
                className="mr-2" 
              />
              Electronic Filing (Recommended)
            </label>
            <p className="text-sm text-blue-600 mt-2">Status tracking available</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-bold mb-3">Paper Filing (PDF Generation)</h4>
            <label className="flex items-center">
              <input 
                type="radio" 
                name="filing" 
                value="paper"
                checked={filingMethod === 'paper'}
                onChange={(e) => setFilingMethod(e.target.value)}
                className="mr-2" 
              />
              Generate PDF for mailing
            </label>
            <p className="text-sm text-gray-600 mt-2">Longer processing time</p>
          </div>
        </div>

        {submissionStatus === 'submitting' && (
          <div className="bg-blue-50 p-6 rounded-lg mb-6 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="font-medium">Filing to IRS and state agencies...</p>
            <p className="text-sm text-gray-600">Status tracking in progress</p>
          </div>
        )}

        {submissionStatus === 'submitted' && (
          <div className="bg-green-50 p-6 rounded-lg mb-6 text-center">
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-green-800 mb-2">Successfully Filed!</h3>
            <p className="text-green-700">Federal Confirmation: 202412345678901234</p>
            <p className="text-green-700">State Confirmation: CA-2024-987654321</p>
          </div>
        )}

        <div className="flex justify-between">
          <button
            onClick={() => setCurrentStep('taxCalculation')}
            className="bg-gray-500 text-white px-6 py-3 rounded-lg"
          >
            Back to Calculations
          </button>
          
          {submissionStatus === 'ready' && (
            <button
              onClick={handleSubmission}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 flex items-center"
            >
              <Send className="w-5 h-5 mr-2" />
              File Tax Return
            </button>
          )}

          {submissionStatus === 'submitted' && (
            <button
              onClick={() => setCurrentStep('paymentRefunds')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg"
            >
              Continue to Payment/Refunds
            </button>
          )}
        </div>
      </div>
    );
  };

  const PaymentRefunds = () => {
    const [paymentMethod, setPaymentMethod] = useState('direct-debit');
    const [refundMethod, setRefundMethod] = useState('direct-deposit');

    return (
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6">Payment & Refunds</h2>

        <div className="bg-red-50 p-6 rounded-lg mb-6">
          <h3 className="text-lg font-bold mb-4 flex items-center">
            <CreditCard className="w-6 h-6 mr-2" />
            Integration with IRS/State Payment Systems
          </h3>
          <div className="space-y-3">
            <label className="flex items-center">
              <input 
                type="radio" 
                name="payment" 
                value="direct-debit"
                checked={paymentMethod === 'direct-debit'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mr-3" 
              />
              Direct Debit (ACH) - Free
            </label>
            <label className="flex items-center">
              <input 
                type="radio" 
                name="payment" 
                value="credit-card"
                checked={paymentMethod === 'credit-card'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mr-3" 
              />
              Credit/Debit Card - 2.5% fee
            </label>
          </div>
          <p className="text-sm text-red-600 mt-3">Amount Due: $1,850 (Due: April 15, 2024)</p>
        </div>

        <div className="bg-green-50 p-6 rounded-lg mb-6">
          <h3 className="text-lg font-bold mb-4 flex items-center">
            <DollarSign className="w-6 h-6 mr-2" />
            Refund Tracking (Direct Deposit, Check)
          </h3>
          <div className="space-y-3">
            <label className="flex items-center">
              <input 
                type="radio" 
                name="refund" 
                value="direct-deposit"
                checked={refundMethod === 'direct-deposit'}
                onChange={(e) => setRefundMethod(e.target.value)}
                className="mr-3" 
              />
              Direct Deposit (7-10 days)
            </label>
            <label className="flex items-center">
              <input 
                type="radio" 
                name="refund" 
                value="check"
                checked={refundMethod === 'check'}
                onChange={(e) => setRefundMethod(e.target.value)}
                className="mr-3" 
              />
              Paper Check (3-4 weeks)
            </label>
          </div>
          <p className="text-sm text-green-600 mt-3">Expected Refund: $3,250</p>
        </div>

        <div className="bg-blue-50 p-6 rounded-lg mb-6">
          <h3 className="text-lg font-bold mb-4">Bank Account Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Routing Number (9 digits)"
              className="p-3 border rounded-lg"
            />
            <input
              type="text"
              placeholder="Account Number"
              className="p-3 border rounded-lg"
            />
          </div>
        </div>

        <div className="flex justify-between">
          <button
            onClick={() => setCurrentStep('reviewSubmission')}
            className="bg-gray-500 text-white px-6 py-3 rounded-lg"
          >
            Back to Review
          </button>
          <button
            onClick={() => setCurrentStep('notifications')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg"
          >
            Continue to Notifications
          </button>
        </div>
      </div>
    );
  };

  const NotificationsSupport = () => {
    const [notifications, setNotifications] = useState({
      email: true, sms: false, statusUpdates: true
    });

    return (
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6">Notifications & Support</h2>

        <div className="bg-blue-50 p-6 rounded-lg mb-6">
          <h3 className="text-lg font-bold mb-4 flex items-center">
            <Bell className="w-6 h-6 mr-2" />
            Email/SMS Notifications for Status Updates
          </h3>
          <div className="space-y-4">
            <label className="flex items-center justify-between">
              <span>Email Notifications</span>
              <input 
                type="checkbox" 
                checked={notifications.email}
                onChange={(e) => setNotifications({...notifications, email: e.target.checked})}
                className="w-5 h-5" 
              />
            </label>
            <label className="flex items-center justify-between">
              <span>SMS Text Updates</span>
              <input 
                type="checkbox" 
                checked={notifications.sms}
                onChange={(e) => setNotifications({...notifications, sms: e.target.checked})}
                className="w-5 h-5" 
              />
            </label>
            <label className="flex items-center justify-between">
              <span>Filing Status Updates</span>
              <input 
                type="checkbox" 
                checked={notifications.statusUpdates}
                onChange={(e) => setNotifications({...notifications, statusUpdates: e.target.checked})}
                className="w-5 h-5" 
              />
            </label>
          </div>
        </div>

        <div className="bg-green-50 p-6 rounded-lg">
          <h3 className="text-lg font-bold mb-4 flex items-center">
            <HelpCircle className="w-6 h-6 mr-2" />
            In-app Help, FAQs, and Live Support/Chat
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg text-center">
              <FileText className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h4 className="font-bold mb-2">In-App Help & FAQs</h4>
              <p className="text-sm text-gray-600 mb-3">Step-by-step guides</p>
              <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm">
                Browse Help
              </button>
            </div>
            
            <div className="bg-white p-4 rounded-lg text-center">
              <Phone className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h4 className="font-bold mb-2">Live Support Chat</h4>
              <p className="text-sm text-gray-600 mb-3">Real-time assistance</p>
              <button className="bg-green-600 text-white px-4 py-2 rounded text-sm">
                Start Chat
              </button>
            </div>

            <div className="bg-white p-4 rounded-lg text-center">
              <Mail className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <h4 className="font-bold mb-2">Email Support</h4>
              <p className="text-sm text-gray-600 mb-3">24-hour response</p>
              <button className="bg-purple-600 text-white px-4 py-2 rounded text-sm">
                Send Message
              </button>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <button
            onClick={() => setCurrentStep('complete')}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg"
          >
            Complete Setup
          </button>
        </div>
      </div>
    );
  };

  const CompleteDashboard = () => {
    const totalIncome = formData.income.w2 + formData.income.income1099 + formData.income.investments + formData.income.stateSpecific;
    const standardDeduction = 13850;
    const taxableIncome = Math.max(0, totalIncome - standardDeduction);
    
    let federalTax = 0;
    if (taxableIncome > 0) {
      if (taxableIncome <= 11000) {
        federalTax = taxableIncome * 0.10;
      } else if (taxableIncome <= 44725) {
        federalTax = 1100 + (taxableIncome - 11000) * 0.12;
      } else if (taxableIncome <= 95375) {
        federalTax = 5147 + (taxableIncome - 44725) * 0.22;
      } else {
        federalTax = 16290 + (taxableIncome - 95375) * 0.24;
      }
    }

    const stateTax = taxableIncome * 0.05;
    const totalTax = federalTax + stateTax;
    const estimatedWithheld = totalIncome * 0.18;
    const refundAmount = Math.max(0, estimatedWithheld - totalTax);

    return (
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-3xl font-bold mb-8 text-center">Tax Filing Complete!</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-green-50 p-6 rounded-lg text-center">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-green-800 mb-2">Filing Status</h3>
            <p className="text-green-700">Successfully Filed</p>
            <p className="text-sm text-gray-600 mt-2">Federal & State Returns</p>
          </div>
          
          <div className="bg-blue-50 p-6 rounded-lg text-center">
            <DollarSign className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-blue-800 mb-2">Expected Refund</h3>
            <p className="text-2xl font-bold text-blue-700">${Math.round(refundAmount).toLocaleString()}</p>
            <p className="text-sm text-gray-600 mt-2">7-10 business days</p>
          </div>
          
          <div className="bg-purple-50 p-6 rounded-lg text-center">
            <FileText className="w-16 h-16 text-purple-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-purple-800 mb-2">Tax Documents</h3>
            <p className="text-purple-700">Ready for Download</p>
            <button className="mt-2 bg-purple-600 text-white px-4 py-2 rounded text-sm flex items-center mx-auto">
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-4">Filing Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Filing Status:</span>
                <span className="font-medium">{formData.personal.filingStatus || 'Single'}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Income:</span>
                <span className="font-medium">${totalIncome.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Federal Tax:</span>
                <span className="font-medium">${Math.round(federalTax).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>State Tax:</span>
                <span className="font-medium">${Math.round(stateTax).toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="font-bold">Total Tax:</span>
                <span className="font-bold">${Math.round(totalTax).toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-4">Confirmation Details</h3>
            <div className="space-y-3">
              <div>
                <span className="text-sm text-gray-600">Federal Confirmation:</span>
                <p className="font-mono text-sm">2024{user?.email?.split('@')[0]?.slice(0,4) || '1234'}567890123</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">State Confirmation:</span>
                <p className="font-mono text-sm">TX-2024-{Math.floor(Math.random() * 1000000)}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Filing Date:</span>
                <p className="font-medium">{new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 p-6 rounded-lg mb-6">
          <h3 className="text-lg font-bold mb-4">Next Steps & Important Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Refund Tracking</h4>
              <p className="text-sm text-gray-700 mb-3">
                Track your refund status using IRS "Where's My Refund" tool or check back here for updates.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Document Storage</h4>
              <p className="text-sm text-gray-700 mb-3">
                Keep copies of your tax return and supporting documents for at least 7 years.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={() => setCurrentStep('registration')}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg mr-4"
          >
            Start New Return
          </button>
          <button
            className="bg-green-600 text-white px-8 py-3 rounded-lg text-lg"
          >
            View Tax Calendar
          </button>
        </div>
      </div>
    );
  };

  // Navigation steps
  const steps = [
    { id: 'registration', title: 'Registration', component: UserRegistrationAuth },
    { id: 'dataCollection', title: 'Data Collection', component: DataCollection },
    { id: 'documentUpload', title: 'Documents', component: DocumentUpload },
    { id: 'taxCalculation', title: 'Calculations', component: TaxCalculation },
    { id: 'reviewSubmission', title: 'Review', component: ReviewSubmission },
    { id: 'paymentRefunds', title: 'Payment', component: PaymentRefunds },
    { id: 'notifications', title: 'Notifications', component: NotificationsSupport },
    { id: 'complete', title: 'Complete', component: CompleteDashboard }
  ];

  const currentStepIndex = steps.findIndex(step => step.id === currentStep);
  const CurrentComponent = steps.find(step => step.id === currentStep)?.component || UserRegistrationAuth;

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">US Federal & State Tax Filing System</h1>
          <p className="text-gray-600">Complete tax preparation and e-filing solution</p>
        </header>

        {/* Progress Bar */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`flex items-center ${index < steps.length - 1 ? 'flex-1' : ''}`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                    index <= currentStepIndex
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  {index + 1}
                </div>
                <span className={`ml-2 text-sm ${index <= currentStepIndex ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-1 mx-4 ${index < currentStepIndex ? 'bg-blue-600' : 'bg-gray-300'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <main>
          <CurrentComponent />
        </main>

        {/* Footer */}
        <footer className="text-center mt-12 text-gray-500 text-sm">
          <p>© 2024 US Tax Filing System - Secure, Compliant, and IRS-Approved</p>
          <p className="mt-2">
            <span className="inline-flex items-center">
              <Lock className="w-4 h-4 mr-1" />
              256-bit SSL Encryption
            </span>
            <span className="mx-4">•</span>
            <span>IRS e-file Provider</span>
            <span className="mx-4">•</span>
            <span>Bank-Level Security</span>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default USFederalStateTaxSystem;
