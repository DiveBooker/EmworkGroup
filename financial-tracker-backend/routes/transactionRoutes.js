const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

// Route เพื่อสร้างรายการใหม่ (A)
router.post('/', transactionController.createTransaction);

// Route เพื่อดึงรายการทั้งหมด หรือค้นหาตามเดือน (C)
router.get('/', transactionController.getTransactions);

// Route เพื่ออัปเดตรายการด้วย ID (B)
router.put('/:id', transactionController.updateTransaction);

// Route เพื่อลบรายการด้วย ID (B)
router.delete('/:id', transactionController.deleteTransaction);

// Route เพื่อดึงรายงานสรุปรายเดือน (D)
router.get('/summary', transactionController.getMonthlySummary);

module.exports = router;