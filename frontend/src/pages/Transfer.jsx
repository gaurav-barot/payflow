import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
  ArrowRight, 
  Send,
  Wallet,
  IndianRupee,
  FileText,
  CheckCircle,
  Loader2,
  ArrowUpRight,
  Sparkles
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

function Transfer() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [step, setStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    fromAccountNumber: '',
    toAccountNumber: '',
    amount: '',
    description: ''
  });

  const { data: accountsData, isLoading: accountsLoading } = useQuery({
    queryKey: ['accounts'],
    queryFn: () => accountApi.getAll(),
  });

  const transferMutation = useMutation({
    mutationFn: (data) => transactionApi.transfer(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      setShowSuccess(true);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Transfer failed. Please try again.');
    }
  });

  // Handle both direct array response and axios wrapped response
  const accountsRaw = accountsData?.data ?? accountsData;
  const accounts = Array.isArray(accountsRaw) ? accountsRaw : [];
  const selectedFromAccount = accounts.find(a => a.accountNumber === formData.fromAccountNumber);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (formData.fromAccountNumber === formData.toAccountNumber) {
      toast.error('Cannot transfer to the same account');
      return;
    }

    if (selectedFromAccount && parseFloat(formData.amount) > selectedFromAccount.balance) {
      toast.error('Insufficient balance');
      return;
    }

    transferMutation.mutate({
      fromAccount: formData.fromAccountNumber,
      toAccount: formData.toAccountNumber,
      amount: parseFloat(formData.amount),
      description: formData.description || 'PayFlow Transfer'
    });
  };

  const resetForm = () => {
    setFormData({
      fromAccountNumber: '',
      toAccountNumber: '',
      amount: '',
      description: ''
    });
    setStep(1);
    setShowSuccess(false);
  };

  // Success Screen
  if (showSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="min-h-[60vh] flex items-center justify-center"
      >
        <div className="text-center max-w-md">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 
                     flex items-center justify-center shadow-xl shadow-primary-500/30"
          >
            <CheckCircle className="w-12 h-12 text-white" />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-3xl font-display font-bold text-white mb-3">
              Transfer Successful!
            </h2>
            <p className="text-dark-400 mb-2">
              ₹{parseFloat(formData.amount).toLocaleString('en-IN')} sent successfully
            </p>
            <p className="text-dark-500 text-sm mb-8">
              Transaction ID: TXN{Date.now().toString().slice(-8)}
            </p>

            <div className="glass-card p-6 mb-8">
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-dark-700/50">
                <div className="text-left">
                  <p className="text-dark-500 text-sm">From</p>
                  <p className="text-white font-mono">{formData.fromAccountNumber}</p>
                </div>
                <ArrowRight className="w-6 h-6 text-primary-400" />
                <div className="text-right">
                  <p className="text-dark-500 text-sm">To</p>
                  <p className="text-white font-mono">{formData.toAccountNumber}</p>
                </div>
              </div>
              <div className="flex items-center justify-center gap-2">
                <IndianRupee className="w-8 h-8 text-primary-400" />
                <span className="text-4xl font-display font-bold text-white">
                  {parseFloat(formData.amount).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="flex gap-4">
              <button onClick={resetForm} className="btn-secondary flex-1">
                New Transfer
              </button>
              <button 
                onClick={() => navigate('/transactions')} 
                className="btn-primary flex-1"
              >
                View History
              </button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-2xl mx-auto space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary-500/20 to-primary-600/20 
                      flex items-center justify-center">
          <Send className="w-8 h-8 text-primary-400" />
        </div>
        <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">
          Send Money
        </h1>
        <p className="text-dark-400 text-lg">Transfer funds instantly between accounts.</p>
      </motion.div>

      {/* Progress Steps */}
      <motion.div variants={itemVariants} className="flex items-center justify-center gap-4">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold
                          transition-all duration-300
                          ${step >= s 
                            ? 'bg-primary-500 text-white' 
                            : 'bg-dark-800 text-dark-500 border border-dark-700'}`}>
              {s}
            </div>
            {s < 3 && (
              <div className={`w-16 h-1 rounded-full transition-all duration-300
                            ${step > s ? 'bg-primary-500' : 'bg-dark-700'}`}></div>
            )}
          </div>
        ))}
      </motion.div>

      {/* Form Card */}
      <motion.div variants={itemVariants} className="glass-card p-8">
        <form onSubmit={handleSubmit}>
          <AnimatePresence mode="wait">
            {/* Step 1: Select Accounts */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h3 className="text-xl font-semibold text-white mb-4">Select Accounts</h3>
                
                <div>
                  <label className="block text-dark-300 text-sm font-medium mb-2">
                    From Account
                  </label>
                  <select
                    value={formData.fromAccountNumber}
                    onChange={(e) => setFormData({ ...formData, fromAccountNumber: e.target.value })}
                    className="input-field"
                    required
                  >
                    <option value="">Select source account</option>
                    {accounts.map((account) => (
                      <option key={account.id} value={account.accountNumber}>
                        {account.holderName} - {account.accountNumber} (₹{account.balance?.toLocaleString('en-IN')})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-dark-300 text-sm font-medium mb-2">
                    To Account Number
                  </label>
                  <input
                    type="text"
                    value={formData.toAccountNumber}
                    onChange={(e) => setFormData({ ...formData, toAccountNumber: e.target.value })}
                    placeholder="Enter recipient's account number"
                    className="input-field font-mono"
                    required
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setStep(2)}
                  disabled={!formData.fromAccountNumber || !formData.toAccountNumber}
                  className="btn-primary w-full"
                >
                  Continue <ArrowRight className="w-5 h-5 inline ml-2" />
                </button>
              </motion.div>
            )}

            {/* Step 2: Enter Amount */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h3 className="text-xl font-semibold text-white mb-4">Enter Amount</h3>

                {selectedFromAccount && (
                  <div className="glass-card p-4 bg-dark-800/30 flex items-center justify-between">
                    <span className="text-dark-400">Available Balance</span>
                    <span className="text-white font-semibold">
                      ₹{selectedFromAccount.balance?.toLocaleString('en-IN')}
                    </span>
                  </div>
                )}

                <div>
                  <label className="block text-dark-300 text-sm font-medium mb-2">
                    Amount (₹)
                  </label>
                  <div className="relative">
                    <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-dark-500" />
                    <input
                      type="number"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      placeholder="0.00"
                      min="1"
                      step="0.01"
                      className="input-field pl-14 text-2xl font-semibold"
                      required
                    />
                  </div>
                </div>

                {/* Quick Amount Buttons */}
                <div className="flex gap-3 flex-wrap">
                  {[100, 500, 1000, 5000].map((amount) => (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => setFormData({ ...formData, amount: amount.toString() })}
                      className="px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg text-dark-300
                               hover:border-primary-500/50 hover:text-white transition-all"
                    >
                      ₹{amount.toLocaleString('en-IN')}
                    </button>
                  ))}
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="btn-secondary flex-1"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    disabled={!formData.amount || parseFloat(formData.amount) <= 0}
                    className="btn-primary flex-1"
                  >
                    Continue <ArrowRight className="w-5 h-5 inline ml-2" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Review & Confirm */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h3 className="text-xl font-semibold text-white mb-4">Review & Confirm</h3>

                <div className="glass-card p-6 bg-dark-800/30 space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-dark-700/50">
                    <span className="text-dark-400">From</span>
                    <span className="text-white font-mono">{formData.fromAccountNumber}</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-dark-700/50">
                    <span className="text-dark-400">To</span>
                    <span className="text-white font-mono">{formData.toAccountNumber}</span>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <span className="text-dark-400">Amount</span>
                    <span className="text-2xl font-display font-bold text-primary-400">
                      ₹{parseFloat(formData.amount).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-dark-300 text-sm font-medium mb-2">
                    Description (Optional)
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-4 top-3 w-5 h-5 text-dark-500" />
                    <input
                      type="text"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Add a note for this transfer"
                      className="input-field pl-12"
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="btn-secondary flex-1"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={transferMutation.isPending}
                    className="btn-primary flex-1"
                  >
                    {transferMutation.isPending ? (
                      <>
                        <Loader2 className="w-5 h-5 inline mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 inline mr-2" />
                        Send Money
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </motion.div>

      {/* Security Note */}
      <motion.div variants={itemVariants} className="flex items-center justify-center gap-2 text-dark-500 text-sm">
        <Sparkles className="w-4 h-4" />
        <span>Secured by PayFlow encryption</span>
      </motion.div>
    </motion.div>
  );
}

export default Transfer;

