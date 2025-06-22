import React from 'react';

const MonthlySummary = ({ summary }) => {
    if (!summary) {
        return <div className="monthly-summary"><p>Select a month to see summary.</p></div>;
    }

    return (
        <div className="monthly-summary">
            <h3>Monthly Summary ({summary.month})</h3>
            <p>Total Income: <span className="income-text">{parseFloat(summary.totalIncome).toFixed(2)} THB</span></p>
            <p>Total Expense: <span className="expense-text">{parseFloat(summary.totalExpense).toFixed(2)} THB</span></p>
            <p>Balance: <span className={summary.balance >= 0 ? 'balance-positive' : 'balance-negative'}>
                {parseFloat(summary.balance).toFixed(2)} THB
            </span></p>
        </div>
    );
};

export default MonthlySummary;