import React, { useState, useEffect } from 'react';

const TransactionForm = ({ onSubmit, initialData = {}, onCancel }) => {
    const [type, setType] = useState(initialData?.type || 'Expense');
    const [itemName, setItemName] = useState(initialData?.itemName || '');
    const [amount, setAmount] = useState(initialData?.amount || '');
    const [transactionDate, setTransactionDate] = useState(
        initialData?.transactionDate || new Date().toISOString().split('T')[0]
    );

    useEffect(() => {
        if (initialData?.id) {
            setType(initialData.type);
            setItemName(initialData.itemName);
            setAmount(initialData.amount);
            setTransactionDate(
                initialData.transactionDate ? new Date(initialData.transactionDate).toISOString().split('T')[0] : ''
            );
        } else {
            setType('Expense');
            setItemName('');
            setAmount('');
            setTransactionDate(new Date().toISOString().split('T')[0]);
        }
    }, [initialData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!itemName || !amount || !transactionDate) {
            alert('Please fill in all fields.');
            return;
        }
        if (isNaN(parseFloat(amount))) {
            alert('Amount must be a valid number.');
            return;
        }

        onSubmit({ type, itemName, amount: parseFloat(amount), transactionDate });
        if (!initialData?.id) {
            setItemName('');
            setAmount('');
            setTransactionDate(new Date().toISOString().split('T')[0]);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="transaction-form">
            <h3>{initialData?.id ? 'Edit Transaction' : 'Add New Transaction'}</h3>
            <div className="form-group">
                <label>Type:</label>
                <select value={type} onChange={(e) => setType(e.target.value)}>
                    <option value="Expense">Expense</option>
                    <option value="Income">Income</option>
                </select>
            </div>
            <div className="form-group">
                <label>Item Name:</label>
                <input
                    type="text"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    placeholder="e.g., ค่าอาหาร, เงินเดือน"
                    required
                />
            </div>
            <div className="form-group">
                <label>Amount:</label>
                <input
                    type="number"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="e.g., 100.50"
                    required
                />
            </div>
            <div className="form-group">
                <label>Date:</label>
                <input
                    type="date"
                    value={transactionDate}
                    onChange={(e) => setTransactionDate(e.target.value)}
                    required
                />
            </div>
            <button type="submit">{initialData?.id ? 'Update' : 'Add'}</button>
            {initialData?.id && <button type="button" onClick={onCancel} className="cancel-btn">Cancel</button>}
        </form>
    );
};

export default TransactionForm;