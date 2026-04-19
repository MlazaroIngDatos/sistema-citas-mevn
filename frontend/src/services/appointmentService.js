import axios from 'axios';

// URL base de tu backend
const API_URL = 'http://localhost:3000/api/appointments';

export default {
    /**
     * Obtiene las citas del backend.
     * @param {String} doctor - Nombre del doctor para filtrar.
     * @param {String} date - Fecha específica para filtrar (YYYY-MM-DD).
     */
    getAll(doctor = '', date = '') {
        // Enviamos los filtros como parámetros de consulta (Query Params)
        return axios.get(`${API_URL}?doctorName=${doctor}&date=${date}`);
    },
    
    /**
     * Envía una nueva cita al backend para ser guardada.
     * @param {Object} data - Objeto con patientName, doctorName, date, etc.
     */
    create(data) {
        return axios.post(API_URL, data);
    }
};

