import { useState, FormEvent } from 'react';
import { API_BASE_URL } from '../config/api';

const Membership = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/membership/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage(data.message || 'Registration successful! Welcome to Rise For Iran.');
        setFormData({ name: '', email: '', phone: '' });
      } else {
        setStatus('error');
        setMessage(data.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('An error occurred. Please try again later.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[#46A2B9] mb-4">
            Join Our Community
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Become a member of Rise For Iran and be part of a movement dedicated to 
            empowering Iranian communities worldwide.
          </p>
        </div>

        {/* Benefits Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Membership Benefits</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-[#46A2B9] rounded-full flex items-center justify-center">
                <i className="fas fa-users text-white text-xl"></i>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Community Access</h3>
                <p className="text-gray-600 text-sm">
                  Connect with like-minded individuals and build lasting relationships.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-[#46A2B9] rounded-full flex items-center justify-center">
                <i className="fas fa-calendar-alt text-white text-xl"></i>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Exclusive Events</h3>
                <p className="text-gray-600 text-sm">
                  Get early access to events, workshops, and community gatherings.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-[#46A2B9] rounded-full flex items-center justify-center">
                <i className="fas fa-graduation-cap text-white text-xl"></i>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Training Programs</h3>
                <p className="text-gray-600 text-sm">
                  Access specialized training courses and educational resources.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-[#46A2B9] rounded-full flex items-center justify-center">
                <i className="fas fa-newspaper text-white text-xl"></i>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Newsletter</h3>
                <p className="text-gray-600 text-sm">
                  Stay updated with the latest news and community updates.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Registration Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Register Now</h2>
          
          {status === 'success' && (
            <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
              <i className="fas fa-check-circle mr-2"></i>
              {message}
            </div>
          )}

          {status === 'error' && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              <i className="fas fa-exclamation-circle mr-2"></i>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#46A2B9] focus:border-transparent transition-all"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#46A2B9] focus:border-transparent transition-all"
                placeholder="your.email@example.com"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#46A2B9] focus:border-transparent transition-all"
                placeholder="+61 4XX XXX XXX"
              />
            </div>

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full bg-[#46A2B9] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#3a8ea3] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {status === 'loading' ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Registering...
                </>
              ) : (
                <>
                  <i className="fas fa-user-plus mr-2"></i>
                  Join Now
                </>
              )}
            </button>
          </form>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center text-gray-600">
          <p className="text-sm">
            By registering, you agree to receive communications from Rise For Iran.
            <br />
            You can unsubscribe at any time.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Membership;
