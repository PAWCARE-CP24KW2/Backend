const express = require('express');
const expenseController = require('../controllers/expenseController');
const router = express.Router();
const auth = require('../middleware/auth');

router.post('/createExpenses', auth, expenseController.createExpense);
router.get('/getExpensesById/:expenseId', auth, expenseController.getExpenseById);
router.get('/getExpensesByPetId/:petId', auth, expenseController.getExpensesByPetId);
router.get('/getExpensesByUserId', auth, expenseController.getExpensesByUserId);
router.delete('/deleteExpenses/:expenseId', auth, expenseController.deleteExpense);

module.exports = router;