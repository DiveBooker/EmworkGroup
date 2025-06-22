const { pool } = require('../config/db');

// A. Create/Record an Income/Expense Item
exports.createTransaction = async (req, res) => {
    const { type, itemName, amount, transactionDate } = req.body;
    if (!type || !itemName || !amount || !transactionDate) {
        return res.status(400).json({ message: 'Please provide type, itemName, amount, and transactionDate.' });
    }

    try {
        const [result] = await pool.execute(
            'INSERT INTO transactions (type, itemName, amount, transactionDate) VALUES (?, ?, ?, ?)',
            [type, itemName, amount, transactionDate]
        );
        res.status(201).json({ message: 'Transaction created successfully', id: result.insertId });
    } catch (error) {
        console.error('Error creating transaction:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// C. Display Recorded Items and Search by Month
exports.getTransactions = async (req, res) => {
    const { month } = req.query; // month in YYYY-MM format

    try {
        let query = 'SELECT * FROM transactions ORDER BY transactionDate DESC, createdAt DESC';
        let params = [];

        if (month) {
            // Validate month format
            if (!/^\d{4}-\d{2}$/.test(month)) {
                return res.status(400).json({ message: 'Invalid month format. Use YYYY-MM.' });
            }
            query = 'SELECT * FROM transactions WHERE DATE_FORMAT(transactionDate, "%Y-%m") = ? ORDER BY transactionDate DESC, createdAt DESC';
            params = [month];
        }

        const [rows] = await pool.execute(query, params);
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// B. Update a Transaction
exports.updateTransaction = async (req, res) => {
    const { id } = req.params;
    const { type, itemName, amount, transactionDate } = req.body;

    if (!type || !itemName || !amount || !transactionDate) {
        return res.status(400).json({ message: 'Please provide type, itemName, amount, and transactionDate.' });
    }

    try {
        const [result] = await pool.execute(
            'UPDATE transactions SET type = ?, itemName = ?, amount = ?, transactionDate = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?',
            [type, itemName, amount, transactionDate, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Transaction not found.' });
        }
        res.status(200).json({ message: 'Transaction updated successfully.' });
    } catch (error) {
        console.error('Error updating transaction:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// B. Delete a Transaction
exports.deleteTransaction = async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await pool.execute('DELETE FROM transactions WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Transaction not found.' });
        }
        res.status(200).json({ message: 'Transaction deleted successfully.' });
    } catch (error) {
        console.error('Error deleting transaction:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// D. Display Summary Report: Monthly Income, Monthly Expense, and Remaining Balance
exports.getMonthlySummary = async (req, res) => {
    const { month } = req.query; // month in YYYY-MM format

    if (!month || !/^\d{4}-\d{2}$/.test(month)) {
        return res.status(400).json({ message: 'Please provide month in YYYY-MM format.' });
    }

    try {
        const [incomeRows] = await pool.execute(
            'SELECT SUM(amount) AS totalIncome FROM transactions WHERE type = "Income" AND DATE_FORMAT(transactionDate, "%Y-%m") = ?',
            [month]
        );

        const [expenseRows] = await pool.execute(
            'SELECT SUM(amount) AS totalExpense FROM transactions WHERE type = "Expense" AND DATE_FORMAT(transactionDate, "%Y-%m") = ?',
            [month]
        );

        // Convert values to Number and handle null/undefined cases
        const totalIncome = Number(incomeRows[0]?.totalIncome || 0);
        const totalExpense = Number(expenseRows[0]?.totalExpense || 0);
        const balance = totalIncome - totalExpense;

        res.status(200).json({
            month: month,
            totalIncome: totalIncome.toFixed(2),
            totalExpense: totalExpense.toFixed(2),
            balance: balance.toFixed(2)
        });

    } catch (error) {
        console.error('Error fetching monthly summary:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};