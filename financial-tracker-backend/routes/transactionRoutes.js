const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

// Route to create a new transaction (A)
router.post('/', transactionController.createTransaction);

// Route to fetch all transactions or search by month (C)
router.get('/', transactionController.getTransactions);

// Route to update a transaction by ID (B)
router.put('/:id', transactionController.updateTransaction);

// Route to delete a transaction by ID (B)
router.delete('/:id', transactionController.deleteTransaction);

// Route to fetch monthly summary report (D)
router.get('/summary', transactionController.getMonthlySummary);

module.exports = router;