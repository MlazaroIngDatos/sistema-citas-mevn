<template>
  <div id="app" style="padding: 20px; font-family: Arial, sans-serif; max-width: 1000px; margin: 0 auto;">
    <h1 style="text-align: center;">📅 Sistema de Citas Médicas</h1>
    
    <!-- Formulario de Registro -->
    <div style="margin-bottom: 20px; border: 1px solid #ccc; padding: 20px; border-radius: 8px; background: #f9f9f9;">
      <h3 style="margin-top:0">Agendar Nueva Cita</h3>
      <form @submit.prevent="saveAppointment" style="display: flex; gap: 10px; flex-wrap: wrap;">
        <input v-model="form.patientName" placeholder="Paciente" required style="padding: 8px;">
        <input v-model="form.doctorName" placeholder="Doctor" required style="padding: 8px;">
        <input type="date" v-model="form.date" required style="padding: 8px;">
        <input type="time" v-model="form.startTime" required style="padding: 8px;">
        <input type="time" v-model="form.endTime" required style="padding: 8px;">
        <button type="submit" style="background: #28a745; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer;">Guardar</button>
      </form>
    </div>

    <!-- Buscadores -->
    <div style="margin-bottom: 15px; display: flex; gap: 10px; background: #e9ecef; padding: 15px; border-radius: 4px;">
      <input v-model="filterDoctor" @input="loadAppointments" placeholder="🔍 Buscar doctor..." style="padding: 8px; flex: 1;">
      <input type="date" v-model="filterDate" @change="loadAppointments" style="padding: 8px;">
    </div>

    <!-- Tabla de Citas -->
    <table border="1" style="width: 100%; border-collapse: collapse; text-align: center;">
      <thead>
        <tr style="background: #343a40; color: white;">
          <th style="padding: 10px;">Paciente</th>
          <th style="padding: 10px;">Doctor</th>
          <th style="padding: 10px;">Fecha</th>
          <th style="padding: 10px;">Horario</th>
          <th style="padding: 10px;">Estado</th>
          <th style="padding: 10px;">Acción</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="appo in appointments" :key="appo._id">
          <td style="padding: 10px;">{{ appo.patientName }}</td>
          <td style="padding: 10px;">{{ appo.doctorName }}</td>
          <td style="padding: 10px;">{{ new Date(appo.date).toLocaleDateString('es-ES', {timeZone: 'UTC'}) }}</td>
          <td style="padding: 10px;">{{ appo.startTime }} - {{ appo.endTime }}</td>
          <td style="padding: 10px;">
            <span :style="{ 
              padding: '4px 8px', borderRadius: '4px', color: 'white',
              background: appo.status === 'cancelled' ? '#dc3545' : '#28a745' 
            }">
              {{ appo.status || 'scheduled' }}
            </span>
          </td>
          <td style="padding: 10px;">
            <button 
              v-if="appo.status !== 'cancelled'" 
              @click="cancelApt(appo._id)" 
              style="background: #dc3545; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;"
            >
              Cancelar
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import appointmentService from './services/appointmentService';
import axios from 'axios';

const appointments = ref([]);
const filterDoctor = ref('');
const filterDate = ref('');
const form = ref({ patientName: '', doctorName: '', date: '', startTime: '', endTime: '', status: 'scheduled' });

const loadAppointments = async () => {
  const res = await appointmentService.getAll(filterDoctor.value, filterDate.value);
  appointments.value = res.data;
};

const saveAppointment = async () => {
  try {
    await appointmentService.create(form.value);
    alert("✅ Cita agendada con éxito!");
    form.value = { patientName: '', doctorName: '', date: '', startTime: '', endTime: '', status: 'scheduled' };
    loadAppointments();
  } catch (error) {
    alert(error.response?.data?.message || "❌ Error al agendar");
  }
};

const cancelApt = async (id) => {
  if (confirm("¿Estás seguro de que deseas cancelar esta cita?")) {
    try {
      await axios.patch(`http://localhost:3000/api/appointments/${id}/status`, { status: 'cancelled' });
      loadAppointments();
    } catch (e) {
      alert("Error al intentar cancelar");
    }
  }
};

onMounted(loadAppointments);
</script>
