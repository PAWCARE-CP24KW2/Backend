const db = require('../db');

exports.create = async (expenseData) => {
    const [expenseId] = await db('expense').insert({ ...expenseData, created_at: new Date() }).returning('expense_id');
    return db('expense').where({ expense_id: expenseId }).first();
};

exports.findByExpenseId = async (expenseId) => {
    return db('expense')
        .join('pet', 'expense.pet_id', 'pet.pet_id')
        .select(
            'expense.*',
            'pet.pet_name',
            'pet.profile_path'
        )
        .where('expense.expense_id', expenseId)
        .first();
};

exports.findByPetId = async (petId) => {
    return db('expense')
        .join('pet', 'expense.pet_id', 'pet.pet_id')
        .select(
            'expense.*',
            'pet.pet_name',
            'pet.profile_path'
        )
        .where('expense.pet_id', petId);
};

exports.findByUserId = async (userId) => {
    return db('expense')
        .join('pet', 'expense.pet_id', 'pet.pet_id')
        .join('user', 'pet.user_id', 'user.user_id')
        .select(
            'expense.*',
            'pet.pet_name',
            'pet.profile_path'
        )
        .where('user.user_id', userId);
};

exports.delete = async (expenseId) => {
    return db('expense').where({ expense_id: expenseId }).del();
};