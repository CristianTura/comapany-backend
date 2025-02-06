import { createRequest, createResponse } from "node-mocks-http"
import Expense from "../../../models/Expense"
import { ExpensesController } from "../../../controllers/ExpenseController"
import { expenses } from "../../mocks/expenses"

jest.mock('../../../models/Expense', () => ({
    create: jest.fn(),
    findByPk: jest.fn()
}))

describe('ExpenseController.create', () => {
    it('should create a new expense and responde with statusCode 201', async () => {
        const mockExpense = {
            save: jest.fn()
        };
        (Expense.create as jest.Mock).mockResolvedValue(mockExpense);
        const req = createRequest({
            method: 'POST',
            url: '/api/budgets/:budgetId/expenses',
            body: { name: 'Vacaciones Test', amount: 1000 },
            budget: { id: 1 }
        });
        const res = createResponse();
        await ExpensesController.create(req, res);
        const data = res._getJSONData();

        expect(res.statusCode).toBe(201);
        expect(data).toEqual({message: 'Gasto creado correctamente'});
        expect(mockExpense.save).toHaveBeenCalled();
        expect(mockExpense.save).toHaveBeenCalledTimes(1);
        expect(Expense.create).toHaveBeenCalledWith(req.body);
    })

    it('should handle expense creation error', async () => {
        const mockExpense = {
            save: jest.fn()
        };
        (Expense.create as jest.Mock).mockRejectedValue(new Error);
        const req = createRequest({
            method: 'POST',
            url: '/api/budgets/:budgetId/expenses',
            body: { name: 'Vacaciones Test', amount: 1000 },
            budget: { id: 1 }
        });
        const res = createResponse();
        await ExpensesController.create(req, res);
        const data = res._getJSONData();

        expect(res.statusCode).toBe(500);
        expect(data).toEqual({error: 'Hubo un error'});
        expect(mockExpense.save).not.toHaveBeenCalled();
        expect(Expense.create).toHaveBeenCalledWith(req.body);
    })
})

describe('ExpenseController.getById', () => {
    it('should return expense with ID 1', async () => {
        const req = createRequest({
            method: 'GET',
            url: '/api/budgets/:budgetId/expenses/:expenseId',
            expense: expenses[0]
        });
        const res = createResponse();
        await ExpensesController.getById(req, res);
        const data = res._getJSONData();

        expect(res.statusCode).toBe(200);
        expect(data).toEqual(expenses[0]);
    })
})

describe('ExpenseController.updateById', () => {
    it('should handle expense update and return success message', async () => {
        const expenseMock = {
            ...expenses[0],
            update: jest.fn()
        }
        const req = createRequest({
            method: 'PUT',
            url: '/api/budgets/:budgetId/expenses/:expenseId',
            expense: expenseMock,
            body: { name: 'Vacaciones Test', amount: 1000 }
        });
        const res = createResponse();
        await ExpensesController.updateById(req, res);
        const data = res._getJSONData();

        expect(res.statusCode).toBe(200);
        expect(data).toBe('Gasto actualizado correctamente');
        expect(expenseMock.update).toHaveBeenCalled();
        expect(expenseMock.update).toHaveBeenCalledWith(req.body);
        expect(expenseMock.update).toHaveBeenCalledTimes(1);
    })
})

describe('ExpenseController.deleteById', () => {
    it('should delete expense and return success message', async () => {
        const expenseMock = {
            ...expenses[0],
            destroy: jest.fn()
        }
        const req = createRequest({
            method: 'DELETE',
            url: '/api/budgets/:budgetId/expenses/:expenseId',
            expense: expenseMock,
        });
        const res = createResponse();
        await ExpensesController.deleteById(req, res);
        const data = res._getJSONData();

        expect(res.statusCode).toBe(200);
        expect(data).toBe('Gasto eliminado correctamente');
        expect(expenseMock.destroy).toHaveBeenCalled();
        expect(expenseMock.destroy).toHaveBeenCalledTimes(1);
    })
})