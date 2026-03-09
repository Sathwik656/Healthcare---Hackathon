const router = require('express').Router();
const ctrl = require('../controllers/healthCenterController');
const { authenticate, authorise } = require('../middleware/auth');

router.get('/', ctrl.getHealthCenters);

router.post('/', authenticate, authorise('admin'), ctrl.createHealthCenter);
router.put('/:id', authenticate, authorise('admin'), ctrl.updateHealthCenter);
router.delete('/:id', authenticate, authorise('admin'), ctrl.deleteHealthCenter);

module.exports = router;