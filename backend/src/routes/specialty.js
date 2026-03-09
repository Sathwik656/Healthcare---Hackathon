const router = require('express').Router();
const ctrl = require('../controllers/specialtyController');
const { authenticate, authorise } = require('../middleware/auth');

router.get('/', ctrl.getSpecialties);

router.post('/', authenticate, authorise('admin'), ctrl.createSpecialty);
router.put('/:id', authenticate, authorise('admin'), ctrl.updateSpecialty);
router.delete('/:id', authenticate, authorise('admin'), ctrl.deleteSpecialty);

module.exports = router;