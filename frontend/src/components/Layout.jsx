import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Wallet, 
  ArrowLeftRight, 
  History,
  Zap,
  Bell,
  Search,
  User
} from 'lucide-react';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/accounts', icon: Wallet, label: 'Accounts' },
  { path: '/transfer', icon: ArrowLeftRight, label: 'Transfer' },
  { path: '/transactions', icon: History, label: 'Transactions' },
];

function Layout({ children }) {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-card border-x-0 border-t-0 rounded-none">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 
                          flex items-center justify-center shadow-lg shadow-primary-500/30
                          group-hover:shadow-xl group-hover:shadow-primary-500/40 transition-all duration-300">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-display font-bold gradient-text">PayFlow</span>
          </NavLink>

          {/* Center Navigation */}
          <nav className="hidden md:flex items-center gap-1 bg-dark-900/50 rounded-xl p-1.5 border border-dark-700/50">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className="relative"
                >
                  <motion.div
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors duration-200
                              ${isActive ? 'text-white' : 'text-dark-400 hover:text-dark-200'}`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-primary-600/20 
                                 rounded-lg border border-primary-500/30"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <Icon className={`w-4 h-4 relative z-10 ${isActive ? 'text-primary-400' : ''}`} />
                    <span className="relative z-10 text-sm">{item.label}</span>
                  </motion.div>
                </NavLink>
              );
            })}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            <button className="btn-ghost p-2.5 rounded-xl">
              <Search className="w-5 h-5" />
            </button>
            <button className="btn-ghost p-2.5 rounded-xl relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary-500 rounded-full"></span>
            </button>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-purple to-accent-pink 
                          flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity">
              <User className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className="md:hidden flex items-center justify-around px-4 py-2 border-t border-dark-700/50">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors
                          ${isActive ? 'text-primary-400' : 'text-dark-400'}`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 pt-24 md:pt-20 pb-8 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
}

export default Layout;

