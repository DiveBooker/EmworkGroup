import React, { useState, useEffect, useCallback } from 'react';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import MonthlySummary from './components/MonthlySummary';
import { createTransaction, getTransactions, updateTransaction, deleteTransaction, getMonthlySummary } from './api';
import './App.css';

function App() {
    const [transactions, setTransactions] = useState([]);
    const [summary, setSummary] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
    const [editingTransaction, setEditingTransaction] = useState(null);

    const fetchTransactionsAndSummary = useCallback(async () => {
        try {
            const [transactionsRes, summaryRes] = await Promise.all([
                getTransactions(selectedMonth),
                getMonthlySummary(selectedMonth)
            ]);
            setTransactions(transactionsRes.data);
            setSummary(summaryRes.data);
        } catch (error) {
            console.error('Error fetching data:', error);
            alert('Failed to load data. Please check if backend is running.');
            setTransactions([]);
            setSummary(null);
        }
    }, [selectedMonth]);

    useEffect(() => {
        fetchTransactionsAndSummary();
    }, [fetchTransactionsAndSummary]);

    const handleFormSubmit = async (transactionData) => {
        try {
            if (editingTransaction) {
                await updateTransaction(editingTransaction.id, transactionData);
                alert('Transaction updated successfully!');
            } else {
                await createTransaction(transactionData);
                alert('Transaction added successfully!');
            }
            setEditingTransaction(null);
            fetchTransactionsAndSummary();
        } catch (error) {
            console.error('Error submitting transaction:', error);
            alert('Failed to save transaction.');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this transaction?')) {
            try {
                await deleteTransaction(id);
                alert('Transaction deleted successfully!');
                fetchTransactionsAndSummary();
            } catch (error) {
                console.error('Error deleting transaction:', error);
                alert('Failed to delete transaction.');
            }
        }
    };

    const handleEdit = (transaction) => {
        setEditingTransaction(transaction);
    };

    const handleCancelEdit = () => {
        setEditingTransaction(null);
    };

    const generateMonthOptions = () => {
        const options = [];
        const today = new Date();
        const currentYear = today.getFullYear();
        const currentMonth = today.getMonth();

        for (let i = 0; i < 12; i++) {
            const date = new Date(currentYear, currentMonth - i, 1);
            const year = date.getFullYear();
            const month = (date.getMonth() + 1).toString().padStart(2, '0');

            const value = `${year}-${month}`;
            const label = date.toLocaleDateString('th-TH', { year: 'numeric', month: 'long' });
            options.push(<option key={value} value={value}>{label}</option>);
        }
        return options;
    };


    return (
        <div className="App">
            <header className="App-header">
                <h1>Financial Tracker</h1>
            </header>

            <div className="controls-section">
                <label htmlFor="month-selector">Select Month:</label>
                <select
                    id="month-selector"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                >
                    {generateMonthOptions()}
                </select>
            </div>

            <main className="main-content">
                <section className="form-section">
                    <TransactionForm
                        onSubmit={handleFormSubmit}
                        initialData={editingTransaction}
                        onCancel={handleCancelEdit}
                    />
                </section>

                <section className="display-section">
                    <MonthlySummary summary={summary} />
                    <TransactionList
                        transactions={transactions}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                </section>
            </main>
        </div>
    );
}

export default App;