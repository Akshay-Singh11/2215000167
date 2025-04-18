import React, { useState, useEffect, memo, createContext, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  UserGroupIcon,
  FireIcon,
  ChartBarIcon,
  Bars3Icon,
  XMarkIcon,
  BellIcon,
  MagnifyingGlassIcon,
  Cog6ToothIcon,
  SunIcon,
  MoonIcon,
  RectangleGroupIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
  UserCircleIcon,
  InformationCircleIcon,
  QuestionMarkCircleIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import { SparklesIcon, BellAlertIcon } from '@heroicons/react/24/solid';
import DropdownMenu, { DropdownItem, DropdownDivider } from './DropdownMenu';
import Breadcrumbs from './Breadcrumbs';

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
const NavItem = memo(({ item, isActive, onClick, variant = 'sidebar', showLabel = true, badge }: {
  item: { name: string; path: string; icon: React.ElementType };
  isActive: boolean;
  onClick?: () => void;
  variant?: 'sidebar' | 'topbar' | 'mobile';
  showLabel?: boolean;
  badge?: number | string;
}) => {
  const { darkMode } = useTheme();
  const Icon = item.icon;

  // Different styles based on variant
  const getStyles = () => {
    switch (variant) {
      case 'topbar':
        return {
          container: `group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
            isActive
              ? darkMode
                ? 'bg-gray-700 text-white'
                : 'bg-indigo-50 text-indigo-700'
              : darkMode
                ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                : 'text-gray-600 hover:bg-gray-50 hover:text-indigo-600'
          }`,
          icon: `flex-shrink-0 h-5 w-5 transition-colors ${
            isActive
              ? 'text-indigo-500'
              : darkMode
                ? 'text-gray-400 group-hover:text-gray-300'
                : 'text-gray-400 group-hover:text-indigo-500'
          }`
        };
      case 'mobile':
        return {
          container: `group flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
            isActive
              ? darkMode
                ? 'bg-gray-700 text-white'
                : 'bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700'
              : darkMode
                ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                : 'text-gray-600 hover:bg-gray-50 hover:text-indigo-600'
          }`,
          icon: `mr-3 flex-shrink-0 h-5 w-5 transition-colors ${
            isActive
              ? 'text-indigo-500'
              : darkMode
                ? 'text-gray-400 group-hover:text-gray-300'
                : 'text-gray-400 group-hover:text-indigo-500'
          }`
        };
      default: // sidebar
        return {
          container: `group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
            isActive
              ? darkMode
                ? 'bg-gray-700 text-white'
                : 'bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 shadow-sm'
              : darkMode
                ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                : 'text-gray-600 hover:bg-gray-50 hover:text-indigo-600'
          }`,
          icon: `mr-3 flex-shrink-0 h-5 w-5 transition-colors ${
            isActive
              ? darkMode ? 'text-indigo-400' : 'text-indigo-600'
              : darkMode
                ? 'text-gray-400 group-hover:text-gray-300'
                : 'text-gray-400 group-hover:text-indigo-500'
          }`
        };
    }
  };

  const styles = getStyles();

  return (
    <Link
      to={item.path}
      className={styles.container}
      onClick={onClick}
    >
      <div className="flex items-center">
        <Icon
          className={styles.icon}
          aria-hidden="true"
        />
        {showLabel && (
          <span className={`${variant === 'topbar' ? 'ml-1' : ''} ${!showLabel && 'sr-only'}`}>
            {item.name}
          </span>
        )}
      </div>

      {badge !== undefined && (
        <span className={`ml-auto inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none rounded-full ${
          darkMode ? 'bg-indigo-900 text-indigo-200' : 'bg-indigo-100 text-indigo-800'
        }`}>
          {badge}
        </span>
      )}
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

  // User menu items
  const userMenuItems = [
    { name: 'Profile', icon: <UserCircleIcon className="h-5 w-5" />, action: () => console.log('Profile clicked') },
    { name: 'Settings', icon: <Cog6ToothIcon className="h-5 w-5" />, action: () => console.log('Settings clicked') },
    { name: 'Help', icon: <QuestionMarkCircleIcon className="h-5 w-5" />, action: () => console.log('Help clicked') },
    { name: 'About', icon: <InformationCircleIcon className="h-5 w-5" />, action: () => console.log('About clicked') },
    { name: 'Sign out', icon: <ArrowRightOnRectangleIcon className="h-5 w-5" />, action: () => console.log('Sign out clicked'), danger: true },
  ];

  // Notification items (mock data)
  const notifications = [
    { id: 1, title: 'New comment on your post', time: '5 min ago', read: false },
    { id: 2, title: 'John Doe mentioned you', time: '1 hour ago', read: false },
    { id: 3, title: 'Your post is trending!', time: '3 hours ago', read: true },
    { id: 4, title: 'New follower: Jane Smith', time: 'Yesterday', read: true },
  ];

  // Count unread notifications
  const unreadNotifications = notifications.filter(n => !n.read).length;

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
        <div className="flex flex-col w-64 xl:w-72">
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
          <div className={`flex items-center justify-between px-4 py-2 lg:px-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            {/* Logo and mobile menu button */}
            <div className="flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`lg:hidden p-2 rounded-md ${darkMode ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'} focus:outline-none mr-2`}
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

              {/* Horizontal navigation - visible on medium screens */}
              <div className="hidden md:flex ml-6 space-x-1">
                {navItems.map((item) => (
                  <NavItem
                    key={item.name}
                    item={item}
                    isActive={location.pathname === item.path}
                    variant="topbar"
                  />
                ))}
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
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Search button (mobile) */}
              <button className={`md:hidden p-2 rounded-full ${darkMode ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'} focus:outline-none`}>
                <MagnifyingGlassIcon className="h-5 w-5" />
              </button>

              {/* Notifications dropdown */}
              <DropdownMenu
                trigger={
                  <div className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                    {unreadNotifications > 0 ? (
                      <BellAlertIcon className="h-5 w-5 text-indigo-500" />
                    ) : (
                      <BellIcon className="h-5 w-5" />
                    )}
                    {unreadNotifications > 0 && (
                      <span className="absolute top-0 right-0 block h-4 w-4 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center">
                        {unreadNotifications}
                      </span>
                    )}
                  </div>
                }
                width="w-80"
              >
                <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                  <h3 className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length > 0 ? (
                    <div className="py-1">
                      {notifications.map((notification) => (
                        <button
                          key={notification.id}
                          className={`flex items-start w-full px-4 py-2 text-sm ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} ${!notification.read ? (darkMode ? 'bg-gray-700/50' : 'bg-indigo-50/50') : ''}`}
                        >
                          <div className="flex-shrink-0 mt-0.5">
                            <div className={`h-2 w-2 rounded-full ${!notification.read ? 'bg-indigo-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                          </div>
                          <div className="ml-3 flex-1">
                            <p className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>{notification.title}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{notification.time}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                      No notifications
                    </div>
                  )}
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 py-2 px-4">
                  <button className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium">
                    Mark all as read
                  </button>
                </div>
              </DropdownMenu>

              {/* Dark mode toggle */}
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-full ${darkMode ? 'text-yellow-300 hover:text-yellow-200 hover:bg-gray-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'} focus:outline-none`}
                aria-label="Toggle dark mode"
              >
                {darkMode ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
              </button>

              {/* User profile dropdown */}
              <DropdownMenu
                trigger={
                  <div className="flex items-center focus:outline-none cursor-pointer">
                    <img
                      src="https://randomuser.me/api/portraits/men/32.jpg"
                      alt="User profile"
                      className="h-8 w-8 rounded-full object-cover border border-gray-200"
                    />
                    <ChevronDownIcon className="h-4 w-4 ml-1 hidden sm:block" />
                  </div>
                }
              >
                <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                  <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>John Doe</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">john.doe@example.com</p>
                </div>

                {userMenuItems.map((item, index) => (
                  <React.Fragment key={item.name}>
                    {index === userMenuItems.length - 1 && <DropdownDivider />}
                    <DropdownItem
                      icon={item.icon}
                      onClick={item.action}
                      danger={item.danger}
                    >
                      {item.name}
                    </DropdownItem>
                  </React.Fragment>
                ))}
              </DropdownMenu>
            </div>
          </div>

          {/* Mobile navigation menu */}
          {isMobileMenuOpen && (
            <div className={`lg:hidden ${darkMode ? 'bg-gray-800 border-b border-gray-700' : 'bg-white border-b border-gray-200'} shadow-sm animate-fade-in`}>
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navItems.map((item, index) => (
                  <NavItem
                    key={item.name}
                    item={item}
                    isActive={location.pathname === item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    variant="mobile"
                    badge={index === 0 ? 'New' : undefined}
                  />
                ))}
              </div>

              {/* Mobile user actions */}
              <div className="px-2 pt-2 pb-3 border-t border-gray-200 dark:border-gray-700">
                <h3 className={`px-3 text-xs font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider mb-1`}>
                  Your Account
                </h3>
                <div className="space-y-1">
                  {userMenuItems.slice(0, 2).map((item) => (
                    <button
                      key={item.name}
                      onClick={item.action}
                      className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg w-full ${darkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-600 hover:bg-gray-50 hover:text-indigo-600'}`}
                    >
                      <span className="mr-3">{item.icon}</span>
                      {item.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Pro Analytics */}
              <div className="px-3 pb-3">
                <div className="p-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg shadow-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-medium text-sm">Pro Analytics</h3>
                      <p className="text-indigo-100 text-xs">Unlock advanced insights</p>
                    </div>
                    <button className="px-3 py-1 bg-white text-indigo-600 rounded-md text-xs font-medium hover:bg-indigo-50 transition-colors">
                      Upgrade
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </header>

        {/* Main content */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none p-3 sm:p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            <Breadcrumbs />
            {children}
          </div>
        </main>
      </div>
      </div>
    </ThemeContext.Provider>
  );
};

export default memo(Layout);
