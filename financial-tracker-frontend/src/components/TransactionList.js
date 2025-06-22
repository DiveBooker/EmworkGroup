import React from 'react';

const TransactionList = ({ transactions, onEdit, onDelete }) => {
    return (
        <div className="transaction-list">
            <h3>Transactions</h3>
            {transactions.length === 0 ? (
                <p>No transactions found for this month.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Type</th>
                            <th>Item Name</th>
                            <th>Amount</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((t) => (
                            <tr key={t.id} className={t.type === 'Income' ? 'income-row' : 'expense-row'}>
                                <td>{t.type}</td>
                                <td>{t.itemName}</td>
                                <td>{parseFloat(t.amount).toFixed(2)}</td>
                                <td>{new Date(t.transactionDate).toLocaleDateString('th-TH', {year: 'numeric', month: 'short', day: 'numeric'})}</td>
                                <td>
                                    <button onClick={() => onEdit(t)} className="edit-btn">Edit</button>
                                    <button onClick={() => onDelete(t.id)} className="delete-btn">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default TransactionList;