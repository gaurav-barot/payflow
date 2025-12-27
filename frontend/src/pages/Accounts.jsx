import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { 
  Wallet, 
  Plus, 
  X,
  User,
  Mail,
  CreditCard,
  IndianRupee,
  Trash2,
  ExternalLink,
  Copy,
  CheckCircle2
} from 'lucide-react';
import { accountApi } from '../api';

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

function Accounts() {
  const [showModal, setShowModal] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [formData, setFormData] = useState({
    holderName: '',
    email: '',
    initialBalance: ''
  });

  const queryClient = useQueryClient();

  const { data: accountsData, isLoading } = useQuery({
    queryKey: ['accounts'],
    queryFn: () => accountApi.getAll(),
  });

  const createMutation = useMutation({
    mutationFn: (data) => accountApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      toast.success('Account created successfully!');
      setShowModal(false);
      setFormData({ holderName: '', email: '', initialBalance: '' });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create account');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => accountApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      toast.success('Account deleted successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete account');
    }
  });

  const accounts = accountsData?.data || [];

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate({
      holderName: formData.holderName,
      email: formData.email,
      initialBalance: parseFloat(formData.initialBalance) || 0
    });
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success('Account number copied!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getCardGradient = (index) => {
    const gradients = [
      'from-primary-500/20 via-primary-600/10 to-transparent',
      'from-accent-cyan/20 via-accent-cyan/10 to-transparent',
      'from-accent-purple/20 via-accent-purple/10 to-transparent',
      'from-accent-pink/20 via-accent-pink/10 to-transparent',
      'from-accent-orange/20 via-accent-orange/10 to-transparent',
    ];
    return gradients[index % gradients.length];
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">
            Your Accounts
          </h1>
          <p className="text-dark-400 text-lg">Manage all your PayFlow accounts in one place.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          <span className="hidden md:inline">New Account</span>
        </button>
      </motion.div>

      {/* Accounts Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-card p-6 animate-pulse">
              <div className="h-4 bg-dark-700 rounded w-24 mb-4"></div>
              <div className="h-8 bg-dark-700 rounded w-40 mb-2"></div>
              <div className="h-3 bg-dark-700 rounded w-32"></div>
            </div>
          ))}
        </div>
      ) : accounts.length === 0 ? (
        <motion.div variants={itemVariants} className="glass-card p-12 text-center">
          <Wallet className="w-20 h-20 text-dark-600 mx-auto mb-6" />
          <h3 className="text-2xl font-display font-semibold text-white mb-3">No accounts yet</h3>
          <p className="text-dark-400 mb-6 max-w-md mx-auto">
            Create your first PayFlow account to start sending and receiving money instantly.
          </p>
          <button 
            onClick={() => setShowModal(true)}
            className="btn-primary inline-flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Create Your First Account
          </button>
        </motion.div>
      ) : (
        <motion.div 
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {accounts.map((account, index) => (
            <motion.div
              key={account.id}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="glass-card-hover p-6 relative overflow-hidden group"
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${getCardGradient(index)} opacity-50`}></div>
              
              {/* Card Content */}
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">{account.holderName}</h3>
                      <p className="text-dark-400 text-sm">{account.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this account?')) {
                        deleteMutation.mutate(account.id);
                      }
                    }}
                    className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-500/20 rounded-lg transition-all"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>

                <div className="mb-4">
                  <p className="text-dark-400 text-sm mb-1">Account Number</p>
                  <div className="flex items-center gap-2">
                    <code className="text-white font-mono text-sm bg-dark-800/50 px-3 py-1.5 rounded-lg">
                      {account.accountNumber}
                    </code>
                    <button
                      onClick={() => copyToClipboard(account.accountNumber, account.id)}
                      className="p-1.5 hover:bg-dark-700 rounded-lg transition-colors"
                    >
                      {copiedId === account.id ? (
                        <CheckCircle2 className="w-4 h-4 text-primary-400" />
                      ) : (
                        <Copy className="w-4 h-4 text-dark-400" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="pt-4 border-t border-dark-700/50">
                  <p className="text-dark-400 text-sm mb-1">Available Balance</p>
                  <div className="flex items-center gap-2">
                    <IndianRupee className="w-6 h-6 text-primary-400" />
                    <span className="text-2xl font-display font-bold text-white">
                      {account.balance?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <span className={`badge ${account.status === 'ACTIVE' ? 'badge-success' : 'badge-warning'}`}>
                    {account.status || 'ACTIVE'}
                  </span>
                  <span className="text-dark-500 text-xs">
                    Created {new Date(account.createdAt).toLocaleDateString('en-IN')}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Create Account Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-dark-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card w-full max-w-md p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-display font-bold text-white">Create New Account</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-dark-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-dark-400" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-dark-300 text-sm font-medium mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
                    <input
                      type="text"
                      value={formData.holderName}
                      onChange={(e) => setFormData({ ...formData, holderName: e.target.value })}
                      placeholder="Enter your full name"
                      className="input-field pl-12"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-dark-300 text-sm font-medium mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="Enter your email"
                      className="input-field pl-12"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-dark-300 text-sm font-medium mb-2">
                    Initial Deposit (₹)
                  </label>
                  <div className="relative">
                    <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
                    <input
                      type="number"
                      value={formData.initialBalance}
                      onChange={(e) => setFormData({ ...formData, initialBalance: e.target.value })}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      className="input-field pl-12"
                    />
                  </div>
                  <p className="text-dark-500 text-xs mt-1">Minimum deposit: ₹0</p>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createMutation.isPending}
                    className="btn-primary flex-1"
                  >
                    {createMutation.isPending ? 'Creating...' : 'Create Account'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default Accounts;

