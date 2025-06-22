import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// A. Record Income/Expense Item
export const createTransaction = (transactionData) => api.post('/transactions', transactionData);

// C. Display Recorded Items and Search by Month
export const getTransactions = (month = '') => {
    return api.get(`/transactions`, { params: { month } });
};

// B. Update Data
export const updateTransaction = (id, transactionData) => api.put(`/transactions/${id}`, transactionData);

// B. Delete Data
export const deleteTransaction = (id) => api.delete(`/transactions/${id}`);

// D. Display Summary Report: Monthly Income, Monthly Expense, and Remaining Balance
export const getMonthlySummary = (month) => api.get(`/transactions/summary`, { params: { month } });

export default api;