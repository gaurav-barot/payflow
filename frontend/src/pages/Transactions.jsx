import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  History, 
  ArrowUpRight, 
  Search,
  Download,
  Calendar,
  RefreshCw
} from 'lucide-react';
import { transactionApi, accountApi } from '../api';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

function Transactions() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const { data: transactionsData, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['transactions'],
    queryFn: () => transactionApi.getAll(),
  });

  const { data: accountsData } = useQuery({
    queryKey: ['accounts'],
    queryFn: () => accountApi.getAll(),
  });

  // Handle both direct array response and axios wrapped response
  const transactionsRaw = transactionsData?.data ?? transactionsData;
  const accountsRaw = accountsData?.data ?? accountsData;
  const transactions = Array.isArray(transactionsRaw) ? transactionsRaw : [];
  const accounts = Array.isArray(accountsRaw) ? accountsRaw : [];

  // Helper to get account holder name from account number
  const getAccountHolder = (accountNumber) => {
    const account = accounts.find(acc => acc.accountNumber === accountNumber);
    return account ? account.holderName : null;
  };
  
  const filteredTransactions = transactions.filter(tx => {
    const fromHolder = getAccountHolder(tx.fromAccount);
    const toHolder = getAccountHolder(tx.toAccount);
    const searchLower = searchTerm.toLowerCase();
    
    const matchesSearch = 
      tx.fromAccount?.toLowerCase().includes(searchLower) ||
      tx.toAccount?.toLowerCase().includes(searchLower) ||
      tx.transactionId?.toLowerCase().includes(searchLower) ||
      fromHolder?.toLowerCase().includes(searchLower) ||
      toHolder?.toLowerCase().includes(searchLower);
    
    // All transactions are transfers, filter by status instead
    const matchesType = 
      filterType === 'all' || 
      (filterType === 'completed' && tx.status === 'COMPLETED') ||
      (filterType === 'pending' && tx.status !== 'COMPLETED' && tx.status !== 'FAILED');
    
    return matchesSearch && matchesType;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED': return 'badge-success';
      case 'PENDING': return 'badge-warning';
      case 'FAILED': return 'badge-error';
      default: return 'badge-info';
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">
            Transaction History
          </h1>
          <p className="text-dark-400 text-lg">View and track all your transactions.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => refetch()}
            disabled={isFetching}
            className="btn-secondary flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button className="btn-ghost flex items-center gap-2 border border-dark-700">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div variants={itemVariants} className="glass-card p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by account number or description..."
              className="input-field pl-12"
            />
          </div>

          {/* Status Filter */}
          <div className="flex gap-2">
            {['all', 'completed', 'pending'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-4 py-2 rounded-lg font-medium capitalize transition-all
                          ${filterType === type 
                            ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30' 
                            : 'bg-dark-800 text-dark-400 border border-dark-700 hover:border-dark-600'}`}
              >
                {type === 'all' ? 'All' : type}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Stats Bar */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-4 text-center">
          <p className="text-dark-400 text-sm mb-1">Total Transactions</p>
          <p className="text-2xl font-display font-bold text-white">{transactions.length}</p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="text-dark-400 text-sm mb-1">Completed</p>
          <p className="text-2xl font-display font-bold text-primary-400">
            {transactions.filter(t => t.status === 'COMPLETED').length}
          </p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="text-dark-400 text-sm mb-1">Pending</p>
          <p className="text-2xl font-display font-bold text-accent-orange">
            {transactions.filter(t => t.status !== 'COMPLETED' && t.status !== 'FAILED').length}
          </p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="text-dark-400 text-sm mb-1">Failed</p>
          <p className="text-2xl font-display font-bold text-red-400">
            {transactions.filter(t => t.status === 'FAILED').length}
          </p>
        </div>
      </motion.div>

      {/* Transactions List */}
      <motion.div variants={itemVariants} className="glass-card overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-4 p-4 bg-dark-800/30 rounded-xl animate-pulse">
                <div className="w-12 h-12 bg-dark-700 rounded-xl"></div>
                <div className="flex-1">
                  <div className="h-4 bg-dark-700 rounded w-48 mb-2"></div>
                  <div className="h-3 bg-dark-700 rounded w-32"></div>
                </div>
                <div className="h-4 bg-dark-700 rounded w-24"></div>
              </div>
            ))}
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="p-12 text-center">
            <History className="w-16 h-16 text-dark-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-dark-300 mb-2">
              {searchTerm || filterType !== 'all' ? 'No matching transactions' : 'No transactions yet'}
            </h3>
            <p className="text-dark-500">
              {searchTerm || filterType !== 'all' 
                ? 'Try adjusting your search or filters' 
                : 'Your transaction history will appear here'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-dark-700/50">
            {/* Table Header - Desktop */}
            <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-dark-800/50 text-dark-400 text-sm font-medium">
              <div className="col-span-1"></div>
              <div className="col-span-3">Transfer Details</div>
              <div className="col-span-2">Amount</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2">Date</div>
              <div className="col-span-2">Transaction ID</div>
            </div>

            {/* Transactions */}
            {filteredTransactions.map((tx, index) => {
              const fromHolder = getAccountHolder(tx.fromAccount);
              const toHolder = getAccountHolder(tx.toAccount);
              
              return (
                <motion.div
                  key={tx.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 hover:bg-dark-800/30 transition-colors"
                >
                  {/* Mobile View */}
                  <div className="md:hidden flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-primary-500/20">
                      <ArrowUpRight className="w-6 h-6 text-primary-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-lg font-semibold text-primary-400">
                          ₹{tx.amount?.toLocaleString('en-IN')}
                        </span>
                        <span className={`badge ${getStatusColor(tx.status)}`}>{tx.status}</span>
                      </div>
                      <div className="text-sm space-y-1">
                        <p className="text-dark-400">
                          From: <span className="text-white">{fromHolder || 'Unknown'}</span>
                          <span className="text-dark-500 text-xs ml-1">({tx.fromAccount})</span>
                        </p>
                        <p className="text-dark-400">
                          To: <span className="text-primary-400">{toHolder || 'Unknown'}</span>
                          <span className="text-dark-500 text-xs ml-1">({tx.toAccount})</span>
                        </p>
                      </div>
                      <p className="text-dark-500 text-xs mt-2">
                        {new Date(tx.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Desktop View */}
                  <div className="hidden md:grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-1">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-primary-500/20">
                        <ArrowUpRight className="w-5 h-5 text-primary-400" />
                      </div>
                    </div>
                    <div className="col-span-3">
                      <div className="text-sm space-y-1">
                        <p className="text-dark-400">
                          From: <span className="text-white font-medium">{fromHolder || 'Unknown'}</span>
                          <span className="text-dark-500 text-xs ml-1">({tx.fromAccount})</span>
                        </p>
                        <p className="text-dark-400">
                          To: <span className="text-primary-400 font-medium">{toHolder || 'Unknown'}</span>
                          <span className="text-dark-500 text-xs ml-1">({tx.toAccount})</span>
                        </p>
                      </div>
                    </div>
                    <div className="col-span-2">
                      <span className="text-lg font-semibold text-primary-400">
                        ₹{tx.amount?.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="col-span-2">
                      <span className={`badge ${getStatusColor(tx.status)}`}>{tx.status}</span>
                    </div>
                    <div className="col-span-2 text-dark-400">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">
                          {new Date(tx.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                      <span className="text-xs text-dark-500">
                        {new Date(tx.createdAt).toLocaleTimeString('en-IN', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    <div className="col-span-2">
                      <code className="text-dark-400 text-xs bg-dark-800/50 px-2 py-1 rounded">
                        {tx.transactionId}
                      </code>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

export default Transactions;

