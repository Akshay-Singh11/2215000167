import React, { useState, useEffect, memo, createContext, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HomeIcon, UserGroupIcon, FireIcon, ChartBarIcon, Bars3Icon, XMarkIcon, BellIcon, MagnifyingGlassIcon, Cog6ToothIcon, SunIcon, MoonIcon, RectangleGroupIcon } from '@heroicons/react/24/outline';
import { SparklesIcon } from '@heroicons/react/24/solid';

// Create a theme context
interface ThemeContextType {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  darkMode: false,
  toggleDarkMode: () => {}
});

// Custom hook to use the theme context
export const useTheme = () => useContext(ThemeContext);

interface LayoutProps {
  children: React.ReactNode;
}

// Memoized navigation item to prevent unnecessary re-renders
const NavItem = memo(({ item, isActive, onClick }: {
  item: { name: string; path: string; icon: React.ElementType };
  isActive: boolean;
  onClick?: () => void;
}) => {
  const Icon = item.icon;

  return (
    <Link
      to={item.path}
      className={`group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
        isActive
          ? 'bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 shadow-sm'
          : 'text-gray-600 hover:bg-gray-50 hover:text-indigo-600'
      }`}
      onClick={onClick}
    >
      <Icon
        className={`mr-3 flex-shrink-0 h-5 w-5 transition-colors ${
          isActive ? 'text-indigo-600' : 'text-gray-400 group-hover:text-indigo-500'
        }`}
        aria-hidden="true"
      />
      {item.name}
    </Link>
  );
});

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);
  const [darkMode, setDarkMode] = useState(false);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Navigation items
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: RectangleGroupIcon },
    { name: 'Feed', path: '/', icon: HomeIcon },
    { name: 'Top Users', path: '/top-users', icon: UserGroupIcon },
    { name: 'Trending Posts', path: '/trending', icon: FireIcon },
    { name: 'Test', path: '/test', icon: ChartBarIcon },
  ];

  // Handle scroll effect for the top navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when location changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      <div className={`flex h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-gray-50 to-gray-100'}`}>
      {/* Sidebar - Desktop */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-72">
          <div className={`flex flex-col flex-grow pt-5 overflow-y-auto ${darkMode ? 'bg-gray-800 text-white' : 'bg-white'} shadow-lg rounded-r-xl`}>
            <div className={`flex items-center flex-shrink-0 px-6 py-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <SparklesIcon className="h-8 w-8 text-indigo-600 mr-3" />
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Social Pulse</span>
            </div>
            <div className="mt-6 flex-grow flex flex-col">
              <nav className="flex-1 px-4 pb-6 space-y-2">
                {navItems.map((item) => (
                  <NavItem
                    key={item.name}
                    item={item}
                    isActive={location.pathname === item.path}
                  />
                ))}
              </nav>

              <div className="px-4 pb-6">
                <div className="p-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg shadow-md">
                  <h3 className="text-white font-medium mb-2">Pro Analytics</h3>
                  <p className="text-indigo-100 text-xs">Unlock advanced insights and real-time data visualization.</p>
                  <button className="mt-3 w-full py-1.5 bg-white text-indigo-600 rounded-md text-sm font-medium hover:bg-indigo-50 transition-colors">
                    Upgrade Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top navbar - visible on all screens */}
        <header className={`sticky top-0 z-20 transition-all duration-200 ${isScrolled
          ? darkMode ? 'bg-gray-800/95 backdrop-blur-sm shadow-sm' : 'bg-white/95 backdrop-blur-sm shadow-sm'
          : darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className={`flex items-center justify-between px-4 py-3 lg:px-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            {/* Logo and mobile menu button */}
            <div className="flex items-center lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`p-2 rounded-md ${darkMode ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'} focus:outline-none mr-2`}
              >
                {isMobileMenuOpen ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
              </button>
              <div className="flex items-center">
                <SparklesIcon className="h-7 w-7 text-indigo-600 mr-2" />
                <span className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Social Pulse</span>
              </div>
            </div>

            {/* Search bar */}
            <div className="hidden md:flex flex-1 max-w-md mx-4 lg:mx-8">
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search for users, posts, or topics..."
                  className={`block w-full pl-10 pr-3 py-2 border ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-gray-50'} rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm`}
                />
              </div>
            </div>

            {/* Right side actions */}
            <div className="flex items-center space-x-4">
              {/* Search button (mobile) */}
              <button className={`md:hidden p-2 rounded-full ${darkMode ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'} focus:outline-none`}>
                <MagnifyingGlassIcon className="h-5 w-5" />
              </button>

              {/* Notifications */}
              <div className="relative">
                <button className={`p-2 rounded-full ${darkMode ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'} focus:outline-none`}>
                  <BellIcon className="h-5 w-5" />
                  {notificationCount > 0 && (
                    <span className="absolute top-0 right-0 block h-4 w-4 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center">
                      {notificationCount}
                    </span>
                  )}
                </button>
              </div>

              {/* Settings */}
              {/* Dark mode toggle */}
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-full ${darkMode ? 'text-yellow-300 hover:text-yellow-200 hover:bg-gray-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'} focus:outline-none`}
                aria-label="Toggle dark mode"
              >
                {darkMode ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
              </button>

              {/* Settings */}
              <button className={`p-2 rounded-full ${darkMode ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'} focus:outline-none`}>
                <Cog6ToothIcon className="h-5 w-5" />
              </button>

              {/* User profile */}
              <div className="relative">
                <button className="flex items-center focus:outline-none">
                  <img
                    src="https://randomuser.me/api/portraits/men/32.jpg"
                    alt="User profile"
                    className="h-8 w-8 rounded-full object-cover border border-gray-200"
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Mobile navigation menu */}
          {isMobileMenuOpen && (
            <div className={`lg:hidden ${darkMode ? 'bg-gray-800 border-b border-gray-700' : 'bg-white border-b border-gray-200'} shadow-sm`}>
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navItems.map((item) => (
                  <NavItem
                    key={item.name}
                    item={item}
                    isActive={location.pathname === item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                  />
                ))}
              </div>
            </div>
          )}
        </header>

        {/* Main content */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
      </div>
    </ThemeContext.Provider>
  );
};

export default memo(Layout);
