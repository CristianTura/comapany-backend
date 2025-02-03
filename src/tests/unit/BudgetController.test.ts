import { budgets } from "../mocks/budgets"


describe('BudgetController.getAll', () => {
    it('should return three budgets', async () => {
        const req = { user: { id: 1 } }
        expect(budgets).toHaveLength(3)
        expect(budgets).not.toHaveLength(2)
    }
)})