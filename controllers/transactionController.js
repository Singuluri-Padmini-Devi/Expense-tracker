const Transaction = require('../models/transactionModel');

// Add a new transaction
exports.addTransaction = async (req, res) => {
  const { type, category, amount, date, description } = req.body;
  try {
    const newTransaction = new Transaction({ type, category, amount, date, description });
    await newTransaction.save();
    res.json(newTransaction);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

// Get all transactions
exports.getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find();
    res.json(transactions);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

// Get transaction by ID
exports.getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) return res.status(404).send('Transaction not found');
    res.json(transaction);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

// Update transaction
exports.updateTransaction = async (req, res) => {
  const { type, category, amount, date, description } = req.body;
  try {
    let transaction = await Transaction.findById(req.params.id);
    if (!transaction) return res.status(404).send('Transaction not found');

    transaction = await Transaction.findByIdAndUpdate(req.params.id, { type, category, amount, date, description }, { new: true });
    res.json(transaction);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

// Delete transaction
exports.deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) return res.status(404).send('Transaction not found');
    await transaction.remove();
    res.send('Transaction deleted');
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

// Get summary
exports.getSummary = async (req, res) => {
  try {
    const transactions = await Transaction.find();
    const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const balance = totalIncome - totalExpense;
    res.json({ totalIncome, totalExpense, balance });
  } catch (err) {
    res.status(500).send('Server Error');
  }
};
