import { Router } from "express";
import { BudgetController } from "../controllers/BudgetController";
import { body } from "express-validator";
import { handleInputErrors } from "../middleware/validations";


const router = Router()

router.get('/', BudgetController.getAll)
router.post('/',
    body('name').notEmpty().withMessage('El nombre del presupuesto no puede ir vacio'),
    body('amount').notEmpty().withMessage('La cantidad del presupuesto no puede ir vacia')
                .isNumeric().withMessage('La cantidad no es válida')
                .custom(value => value > 0).withMessage('La cantidad debe ser mayor a 0'),
    handleInputErrors,
    BudgetController.create
)
router.get('/:id', BudgetController.getById)
router.put('/:id', BudgetController.updateById)
router.delete('/:id', BudgetController.deleteById)

export default router