const Appointment = require('../models/Appointment');

// 1. OBTENER CITAS (Con filtros)
exports.getAppointments = async (req, res) => {
    try {
        const { doctorName, date } = req.query;
        let query = {};
        if (doctorName) query.doctorName = { $regex: doctorName, $options: 'i' };
        if (date) query.date = date;

        const appointments = await Appointment.find(query).sort({ date: 1, startTime: 1 });
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 2. CREAR CITA (Con validaciones)
exports.createAppointment = async (req, res) => {
    try {
        const { doctorName, date, startTime, endTime } = req.body;
        const today = new Date().toISOString().split('T')[0];
        
        if (date < today) {
            return res.status(400).json({ message: 'Error: No se pueden agendar citas en fechas pasadas.' });
        }
        if (startTime >= endTime) {
            return res.status(400).json({ message: 'Error: La hora de fin debe ser posterior al inicio.' });
        }

        const overlapping = await Appointment.findOne({
            doctorName,
            date,
            $and: [
                { startTime: { $lt: endTime } },
                { endTime: { $gt: startTime } }
            ]
        });

        if (overlapping) {
            return res.status(409).json({ message: 'Conflicto de horario para este doctor.' });
        }

        const newAppointment = new Appointment(req.body);
        await newAppointment.save();
        res.status(201).json(newAppointment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// 3. BONUS: ACTUALIZAR ESTADO (Cancelar)
exports.updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const updated = await Appointment.findByIdAndUpdate(id, { status }, { new: true });
        res.json(updated);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
