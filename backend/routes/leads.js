const router = require('express').Router();
const auth   = require('../middleware/auth');
const c      = require('../controllers/leadController');

router.use(auth);   // protect all lead routes

router.get('/stats/summary', c.getStats);
router.get('/export',        c.exportCSV);
router.get('/',              c.getLeads);
router.get('/:id',           c.getLead);
router.post('/',             c.createLead);
router.put('/:id',           c.updateLead);
router.delete('/:id',        c.deleteLead);
router.post('/:id/notes',    c.addNote);

module.exports = router;
