import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Wallet, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownLeft, // Used in Quick Actions
  Plus,
  ArrowRight,
  Sparkles,
  Activity,
  CreditCard
} from 'lucide-react';
import { accountApi, transactionApi } from '../api';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

function Dashboard() {
  const { data: accountsData, isLoading: accountsLoading } = useQuery({
    queryKey: ['accounts'],
    queryFn: () => accountApi.getAll(),
  });

  const { data: transactionsData, isLoading: transactionsLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: () => transactionApi.getAll(),
  });

  const accounts = accountsData?.data || [];
  const transactions = transactionsData?.data || [];
  
  const totalBalance = accounts.reduce((sum, acc) => sum + (acc.balance || 0), 0);
  const recentTransactions = transactions.slice(0, 5);

  // Helper to get account holder name from account number
  const getAccountHolder = (accountNumber) => {
    const account = accounts.find(acc => acc.accountNumber === accountNumber);
    return account ? account.holderName : null;
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Welcome Section */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">
            Welcome back! <span className="inline-block animate-pulse">👋</span>
          </h1>
          <p className="text-dark-400 text-lg">Here's what's happening with your money today.</p>
        </div>
        <Link to="/transfer" className="hidden md:flex btn-primary items-center gap-2">
          <Plus className="w-5 h-5" />
          New Transfer
        </Link>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Balance Card */}
        <div className="md:col-span-2 stat-card relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary-500/20 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center">
                <Wallet className="w-6 h-6 text-primary-400" />
              </div>
              <span className="text-dark-400 font-medium">Total Balance</span>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-2">
                  {accountsLoading ? (
                    <span className="animate-pulse">Loading...</span>
                  ) : (
                    <>₹{totalBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</>
                  )}
                </h2>
                <div className="flex items-center gap-2 text-primary-400">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm font-medium">+12.5% from last month</span>
                </div>
              </div>
              <div className="hidden md:flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-primary-400 animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="stat-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-accent-cyan/20 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-accent-cyan" />
            </div>
            <span className="text-dark-400 font-medium">Accounts</span>
          </div>
          <h3 className="text-3xl font-display font-bold text-white mb-1">
            {accountsLoading ? '...' : accounts.length}
          </h3>
          <p className="text-dark-500 text-sm">Active accounts</p>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants}>
        <h3 className="text-xl font-display font-semibold text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/transfer" className="glass-card-hover p-5 flex flex-col items-center gap-3 group">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500/20 to-primary-600/20 
                          flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <ArrowUpRight className="w-7 h-7 text-primary-400" />
            </div>
            <span className="text-white font-medium">Send Money</span>
          </Link>
          
          <Link to="/accounts" className="glass-card-hover p-5 flex flex-col items-center gap-3 group">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-cyan/20 to-accent-cyan/10 
                          flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <ArrowDownLeft className="w-7 h-7 text-accent-cyan" />
            </div>
            <span className="text-white font-medium">Add Account</span>
          </Link>
          
          <Link to="/transactions" className="glass-card-hover p-5 flex flex-col items-center gap-3 group">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-purple/20 to-accent-purple/10 
                          flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Activity className="w-7 h-7 text-accent-purple" />
            </div>
            <span className="text-white font-medium">History</span>
          </Link>
          
          <div className="glass-card-hover p-5 flex flex-col items-center gap-3 group cursor-pointer">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-pink/20 to-accent-pink/10 
                          flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Sparkles className="w-7 h-7 text-accent-pink" />
            </div>
            <span className="text-white font-medium">Rewards</span>
          </div>
        </div>
      </motion.div>

      {/* Recent Transactions */}
      <motion.div variants={itemVariants} className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-display font-semibold text-white">Recent Transactions</h3>
          <Link to="/transactions" className="btn-ghost flex items-center gap-1 text-primary-400 hover:text-primary-300">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {transactionsLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 p-4 bg-dark-800/30 rounded-xl animate-pulse">
                <div className="w-12 h-12 bg-dark-700 rounded-xl"></div>
                <div className="flex-1">
                  <div className="h-4 bg-dark-700 rounded w-32 mb-2"></div>
                  <div className="h-3 bg-dark-700 rounded w-24"></div>
                </div>
                <div className="h-4 bg-dark-700 rounded w-20"></div>
              </div>
            ))}
          </div>
        ) : recentTransactions.length === 0 ? (
          <div className="text-center py-12">
            <Activity className="w-16 h-16 text-dark-600 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-dark-300 mb-2">No transactions yet</h4>
            <p className="text-dark-500 mb-4">Start by creating an account and making your first transfer!</p>
            <Link to="/transfer" className="btn-primary inline-flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Make Transfer
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recentTransactions.map((tx, index) => {
              const fromHolder = getAccountHolder(tx.fromAccount);
              const toHolder = getAccountHolder(tx.toAccount);
              
              return (
                <motion.div
                  key={tx.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-4 p-4 bg-dark-800/30 rounded-xl hover:bg-dark-800/50 transition-colors"
                >
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-accent-orange/20">
                    <ArrowUpRight className="w-6 h-6 text-accent-orange" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-1 text-sm mb-1">
                      <span className="text-dark-400">From:</span>
                      <span className="text-white font-medium">
                        {fromHolder || 'Unknown'} ({tx.fromAccount})
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-1 text-sm">
                      <span className="text-dark-400">To:</span>
                      <span className="text-primary-400 font-medium">
                        {toHolder || 'Unknown'} ({tx.toAccount})
                      </span>
                    </div>
                    <p className="text-dark-500 text-xs mt-1">
                      {new Date(tx.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div className="text-lg font-semibold text-dark-300">
                    ₹{tx.amount?.toLocaleString('en-IN')}
                  </div>
                  <span className={`badge ${
                    tx.status === 'COMPLETED' ? 'badge-success' : 
                    tx.status === 'PENDING' ? 'badge-warning' : 'badge-error'
                  }`}>
                    {tx.status}
                  </span>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

export default Dashboard;

