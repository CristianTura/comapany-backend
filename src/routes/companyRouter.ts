import { Router } from "express";
import { handleInputErrors } from "../middleware/validations";
import { authenticate } from "../middleware/auth";
import { CompanyController } from "../controllers/CompanyController";
import { validateCompanyExists, validateCompanyId, validateCompanyInput } from "../middleware/company";
import { validateProductExists, validateProductId, validateProductInput } from "../middleware/product";
import { ProductController } from "../controllers/ProductController";


const router = Router()

router.use(authenticate)

router.param('companyId', validateCompanyId)
router.param('companyId', validateCompanyExists)
// router.param('budgetId', hasAccess)

router.param('productId', validateProductId)
router.param('productId', validateProductExists)

router.get('/', CompanyController.getAll)
router.post('/',
    validateCompanyInput,
    handleInputErrors,
    CompanyController.create
)
router.get('/:companyId', CompanyController.getById)

router.put('/:companyId',
    validateCompanyInput,
    handleInputErrors,
    CompanyController.updateById
)
router.delete('/:companyId',
    CompanyController.deleteById
)

// Routers for expenses
router.post('/:companyId/products', 
    validateProductInput,
    handleInputErrors,
    ProductController.create
)
router.get('/1/products', ProductController.getAll)
router.get('/:companyId/products/:productId', ProductController.getById)
router.put('/:companyId/products/:productId',
    validateProductInput,
    handleInputErrors, 
    ProductController.updateById
)
router.delete('/:productId/products/:productId', ProductController.deleteById)


export default router