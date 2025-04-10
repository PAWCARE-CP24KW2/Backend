const expenseModel = require('../models/expenseModel');

exports.createExpense = async (req, res) => {
    try {
        const expenseData = req.body;
        const newExpense = await expenseModel.create(expenseData);
        res.status(201).json(newExpense);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create expense', details: error.message });
    }
};

exports.getExpenseById = async (req, res) => {
    try {
        const { expenseId } = req.params;
        const expense = await expenseModel.findByExpenseId(expenseId);
        if (!expense) {
            return res.status(404).json({ error: 'Expense not found' });
        }
        res.status(200).json(expense);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve expense', details: error.message });
    }
};

exports.getExpensesByPetId = async (req, res) => {
    try {
        const { petId } = req.params;
        const expenses = await expenseModel.findByPetId(petId);
        res.status(200).json(expenses);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve expenses', details: error.message });
    }
};

exports.deleteExpense = async (req, res) => {
    try {
        const { expenseId } = req.params;
        const deleted = await expenseModel.delete(expenseId);
        if (!deleted) {
            return res.status(404).json({ error: 'Expense not found' });
        }
        res.status(200).json({ message: 'Expense deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete expense', details: error.message });
    }
};