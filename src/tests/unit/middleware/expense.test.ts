import { createRequest, createResponse } from "node-mocks-http"
import Expense from "../../../models/Expense"
import { expenses } from "../../mocks/expenses"
import { validateExpenseExists } from "../../../middleware/expense"
import { hasAccess } from "../../../middleware/budget"
import { budgets } from "../../mocks/budgets"

jest.mock('../../../models/Expense', () => ({
    findByPk: jest.fn(),
    create: jest.fn(),
    findAll: jest.fn(),
}))

describe('Expenses middleware - validateExpenseExists', () => {
    beforeEach(() => {
        (Expense.findByPk as jest.Mock).mockImplementation((id) => {
            const expense = expenses.filter( exp => exp.id === id)[0] ?? null
            return Promise.resolve(expense)
        })
    })

    it('should handle expense a non-exitent function', async () => {
        const req = createRequest({
            params: { expenseId: 120 }
        });
        const res = createResponse();
        const next = jest.fn()
        await validateExpenseExists(req, res, next)
        const data = res._getJSONData();

        expect(res.statusCode).toBe(404);
        expect(data).toEqual({error: 'No se encontró el gasto'});
        expect(Expense.findByPk).toHaveBeenCalledWith(req.params.expenseId);
        expect(next).not.toHaveBeenCalled()
    })

    it('should call next middleware if expense exists', async () => {
        const req = createRequest({
            params: { expenseId: 1 }
        });
        const res = createResponse();
        const next = jest.fn()
        await validateExpenseExists(req, res, next)

        expect(req.expense).toEqual(expenses[0]);
        expect(next).toHaveBeenCalled()
        expect(next).toHaveBeenCalledTimes(1)
    })

    it('should handle internal server errror', async () => {
        (Expense.findByPk as jest.Mock).mockRejectedValue(new Error)
        const req = createRequest({
            params: { expenseId: 1 }
        });
        const res = createResponse();
        const next = jest.fn()
        await validateExpenseExists(req, res, next)
        const data = res._getJSONData();

        expect(data).toEqual({error: 'Hubo un error'});
        expect(res.statusCode).toBe(500);
        expect(next).not.toHaveBeenCalled()
    })

    it('should prevent unauthorized users from adding expenses', async () => {
        const req = createRequest({
            method: 'POST',
            url: '/api/budget/:budgetId/expenses',
            budget: budgets[0],
            user: { id: 20 },
            body: { name: 'Expense Test', amount: 3000 }
        });
        const res = createResponse();
        const next = jest.fn()
        hasAccess(req, res, next)
        const data = res._getJSONData();

        expect(data).toEqual({error: 'No tienes acceso a este presupuesto'});
        expect(res.statusCode).toBe(401);
        expect(next).not.toHaveBeenCalled()
    })
})
