const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');

router.get('/', appointmentController.getAppointments);
router.post('/', appointmentController.createAppointment);
// Ruta para el bonus de cancelación
router.patch('/:id/status', appointmentController.updateStatus);

module.exports = router;
