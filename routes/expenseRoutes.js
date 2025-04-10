const express = require('express');
const expenseController = require('../controllers/expenseController');
const router = express.Router();

router.post('/createExpenses', expenseController.createExpense);
router.get('/getExpensesById/:expenseId', expenseController.getExpenseById);
router.get('/getExpensesByPetId/:petId', expenseController.getExpensesByPetId);
router.delete('/deleteExpenses/:expenseId', expenseController.deleteExpense);

module.exports = router;