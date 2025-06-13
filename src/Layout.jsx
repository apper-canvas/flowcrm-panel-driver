import { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import { routeArray } from '@/config/routes';
import NotificationsDropdownOrganism from '@/components/organisms/NotificationsDropdownOrganism';
import Input from '@/components/atoms/Input';

const Layout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
const [notificationsOpen, setNotificationsOpen] = useState(false); // No longer needed directly, managed by NotificationsDropdownOrganism
  const location = useLocation();

  const notifications = [
    { id: 1, text: "Follow up with Acme Corp due today", time: "2 hours ago", type: "task" },
    { id: 2, text: "New lead assigned: TechStart Inc", time: "4 hours ago", type: "lead" },
    { id: 3, text: "Deal moved to Negotiation stage", time: "1 day ago", type: "pipeline" }
  ];

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <header className="flex-shrink-0 h-16 bg-white border-b border-gray-200 z-40">
        <div className="h-full px-4 lg:px-6 flex items-center justify-between">
          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ApperIcon name="Menu" size={20} />
          </button>

          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <ApperIcon name="Zap" size={18} className="text-white" />
            </div>
            <h1 className="hidden sm:block text-xl font-heading font-bold text-gray-900">FlowCRM</h1>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <ApperIcon name="Search" size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
<ApperIcon name="Search" size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search contacts, deals, tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2"
              />

          {/* Header Actions */}
          <div className="flex items-center space-x-3">
            {/* Notifications */}
<NotificationsDropdownOrganism notifications={notifications} />

            {/* User Menu */}
            <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center">
              <ApperIcon name="User" size={16} className="text-white" />
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex w-64 bg-white border-r border-gray-200 z-40">
          <div className="flex-1 flex flex-col overflow-y-auto">
            <nav className="flex-1 px-4 py-6 space-y-2">
              {routeArray.map((route) => (
                <NavLink
                  key={route.id}
                  to={route.path}
                  className={({ isActive }) =>
                    `flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-primary text-white shadow-sm'
                        : 'text-gray-700 hover:bg-surface hover:text-primary'
                    }`
                  }
                >
                  <ApperIcon name={route.icon} size={18} className="mr-3" />
                  {route.label}
                </NavLink>
              ))}
            </nav>

            {/* Sidebar Footer */}
            <div className="p-4 border-t border-gray-200">
              <div className="bg-gradient-to-r from-primary to-secondary rounded-lg p-4 text-white">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Monthly Goal</span>
                  <span className="text-xs opacity-90">75%</span>
                </div>
                <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
                  <div className="bg-white h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
                <p className="text-xs mt-2 opacity-90">$180k of $240k target</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50"
                onClick={() => setMobileMenuOpen(false)}
              />
              <motion.div
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                exit={{ x: -300 }}
                transition={{ type: "tween", duration: 0.3 }}
                className="lg:hidden fixed left-0 top-0 bottom-0 w-64 bg-white z-50 overflow-y-auto"
              >
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                      <ApperIcon name="Zap" size={18} className="text-white" />
                    </div>
                    <h1 className="text-xl font-heading font-bold text-gray-900">FlowCRM</h1>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-lg hover:bg-gray-100"
                  >
                    <ApperIcon name="X" size={20} />
                  </button>
                </div>

                <nav className="px-4 py-6 space-y-2">
                  {routeArray.map((route) => (
                    <NavLink
                      key={route.id}
                      to={route.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                          isActive
                            ? 'bg-primary text-white shadow-sm'
                            : 'text-gray-700 hover:bg-surface hover:text-primary'
                        }`
                      }
                    >
                      <ApperIcon name={route.icon} size={18} className="mr-3" />
                      {route.label}
                    </NavLink>
                  ))}
                </nav>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>

      {/* Click outside to close notifications */}
{/* Notifications dropdown is now self-contained, no global click outside needed here unless other global modals are added */}
      )}
    </div>
  );
};

export default Layout;