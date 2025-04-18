import React from 'react';

const TestPage: React.FC = () => {
  return (
    <div className="p-6">
      <div className="bg-white rounded-xl shadow-md overflow-hidden p-6 mb-6 border border-gray-100">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Tailwind CSS Test Page</h1>
        <p className="mt-2 text-gray-600">This page demonstrates various Tailwind CSS features and components.</p>
      </div>

      {/* Buttons */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden p-6 mb-6 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Buttons</h2>
        <div className="flex flex-wrap gap-4">
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm">
            Primary Button
          </button>
          <button className="px-4 py-2 bg-white border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors shadow-sm">
            Secondary Button
          </button>
          <button className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-colors shadow-sm">
            Gradient Button
          </button>
          <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm">
            Danger Button
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm">
            Success Button
          </button>
          <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors shadow-sm">
            Neutral Button
          </button>
        </div>
      </div>

      {/* Cards */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden p-6 mb-6 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-lg hover:translate-y-[-4px]">
            <div className="h-40 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
            <div className="p-4">
              <h3 className="text-lg font-bold text-gray-800">Card Title</h3>
              <p className="text-gray-600 text-sm mt-2">This is a sample card with a gradient background.</p>
              <button className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm w-full">
                View Details
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-lg hover:translate-y-[-4px]">
            <div className="h-40 bg-gradient-to-r from-red-500 to-orange-500"></div>
            <div className="p-4">
              <h3 className="text-lg font-bold text-gray-800">Card Title</h3>
              <p className="text-gray-600 text-sm mt-2">This is a sample card with a gradient background.</p>
              <button className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm w-full">
                View Details
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-lg hover:translate-y-[-4px]">
            <div className="h-40 bg-gradient-to-r from-green-500 to-teal-500"></div>
            <div className="p-4">
              <h3 className="text-lg font-bold text-gray-800">Card Title</h3>
              <p className="text-gray-600 text-sm mt-2">This is a sample card with a gradient background.</p>
              <button className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm w-full">
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Form Elements */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden p-6 mb-6 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Form Elements</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Input Field</label>
            <input
              type="text"
              placeholder="Enter your text here"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Field</label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
              <option>Option 1</option>
              <option>Option 2</option>
              <option>Option 3</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Textarea</label>
            <textarea
              placeholder="Enter your message here"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent h-24"
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Checkboxes</label>
            <div className="space-y-2">
              <div className="flex items-center">
                <input type="checkbox" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                <label className="ml-2 text-sm text-gray-700">Option 1</label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                <label className="ml-2 text-sm text-gray-700">Option 2</label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                <label className="ml-2 text-sm text-gray-700">Option 3</label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden p-6 mb-6 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Alerts</h2>
        <div className="space-y-4">
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">This is an informational alert message.</p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">This is a success alert message.</p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">This is a warning alert message.</p>
              </div>
            </div>
          </div>

          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">This is an error alert message.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Typography */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden p-6 mb-6 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Typography</h2>
        <div className="space-y-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Heading 1</h1>
            <h2 className="text-3xl font-bold text-gray-900">Heading 2</h2>
            <h3 className="text-2xl font-bold text-gray-900">Heading 3</h3>
            <h4 className="text-xl font-bold text-gray-900">Heading 4</h4>
            <h5 className="text-lg font-bold text-gray-900">Heading 5</h5>
            <h6 className="text-base font-bold text-gray-900">Heading 6</h6>
          </div>

          <div>
            <p className="text-base text-gray-700">Regular paragraph text. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
            <p className="text-sm text-gray-600 mt-2">Small text for less important information.</p>
            <p className="text-xs text-gray-500 mt-2">Extra small text for captions or footnotes.</p>
          </div>

          <div>
            <p className="text-base font-medium text-gray-700">Medium weight text</p>
            <p className="text-base font-semibold text-gray-700">Semibold weight text</p>
            <p className="text-base font-bold text-gray-700">Bold weight text</p>
            <p className="text-base font-extrabold text-gray-700">Extra bold weight text</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPage;
