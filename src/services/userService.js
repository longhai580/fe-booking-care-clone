import axios from '../axios';
const handleLoginApi =(userEmail, userPassword) => {
    return axios.post('/api/login', {email: userEmail, password : userPassword});
}


const getAllUsers = (inputId) =>{
    return axios.get(`/api/get-all-users?id=${inputId}`);
}

const createNewUserService = (data) => {
    return axios.post('/api/create-new-user', data);

}

const deleteUserService = (userId) => { 
    return axios.delete('/api/delete-user', {
        data: {
            id: userId
        }
    });
}

const editUserService = (inputData) => {
    return axios.put('/api/edit-user', inputData);
}


const getAllCodeService = (inputType) => {
    return axios.get(`/api/allcode?type=${inputType}`);

}

const getTopDoctorHomeService = (limit) => { 
    return axios.get(`/api/top-doctor-home?limit=${limit}`);
}
const getAllDoctors = () => { 
    return axios.get(`/api/get-all-doctors`);
}

const saveDetailDoctorService = (data) => { 
    return axios.post('/api/save-infor-doctors', data);

}

const getDetailInforDoctorService = (inputId) => { 
    return axios.get(`/api/get-detail-doctor-by-id?id=${inputId}`);

}
const saveBulkScheduleDoctor = (data) => {
    return axios.post('/api/bulk-create-schedule', data);

}

const getScheduleDoctorByDateService = (doctorId, date) => { 
    return axios.get(`/api/get-schedule-doctor-by-date?doctorId=${doctorId}&date=${date}`);
}
const getExtraInforDoctorById = (doctorId) => { 
    return axios.get(`/api/get-extra-infor-doctor-by-id?doctorId=${doctorId}`);
}
const getProfileDoctorById = (doctorId) => { 
    return axios.get(`/api/get-profile-doctor-by-id?doctorId=${doctorId}`);
}
const postPatientBookingAppoinment = (data) => {
    return axios.post('/api/patient-book-appoinment', data);

}
const postVerifyBookingAppoinment = (data) => {
    return axios.post('/api/verify-book-appoinment', data);

}
const createNewSpecialty = (data) => {
    return axios.post('/api/create-new-specialty', data);

}


const getAllSpecialty = () => {
    return axios.get(`/api/get-specialty`);

}
const getAllDetailSpecialtyById = (data) => {
    return axios.get(`/api/get-detail-specialty-by-id?id=${data.id}&location=${data.location}`);

}

// Clinic
const createNewClinic = (data) => {
    return axios.post('/api/create-new-clinic', data);

}
const getAllClinic = () => {
    return axios.get(`/api/get-clinic`);

}
const getAllDetailClinicById = (data) => {
    return axios.get(`/api/get-detail-clinic-by-id?id=${data.id}`);

}

const getAllPatientForDoctor = (data) => {
    return axios.get(`/api/get-list-patient-for-doctor?doctorId=${data.doctorId}&date=${data.date}&statusId=${data.statusId || 'S2'}`);

}


const postSendRemedy = (data) => {
    return axios.post('/api/send-remedy', data);

}
const editSpecialty = (data) => {
    return axios.put('/api/edit-specialty', data);
}
const deleteSpecialty = (id) => {
    return axios.delete('/api/delete-specialty', { data: { id } });
}
const editClinic = (data) => {
    return axios.put('/api/edit-clinic', data);
}
const deleteClinic = (id) => {
    return axios.delete('/api/delete-clinic', { data: { id } });
}

// Handbook
const createNewHandbook = (data) => {
    return axios.post('/api/create-new-handbook', data);
}
const getAllHandbook = (limit) => {
    return axios.get(`/api/get-handbook${limit ? `?limit=${limit}` : ''}`);
}
const getDetailHandbookById = (id) => {
    return axios.get(`/api/get-detail-handbook-by-id?id=${id}`);
}
const editHandbook = (data) => {
    return axios.put('/api/edit-handbook', data);
}
const deleteHandbook = (id) => {
    return axios.delete('/api/delete-handbook', { data: { id } });
}

// Site
const searchAll = (keyword) => {
    return axios.get(`/api/search?q=${encodeURIComponent(keyword)}`);
}
const getListDoctors = (filter = {}) => {
    let params = new URLSearchParams();
    Object.keys(filter).forEach(key => {
        if (filter[key]) params.append(key, filter[key]);
    });
    return axios.get(`/api/get-list-doctors?${params.toString()}`);
}
const getStatistics = () => {
    return axios.get('/api/statistics');
}
const getPatientBookings = (email) => {
    return axios.get(`/api/patient-bookings?email=${encodeURIComponent(email)}`);
}
const cancelBooking = (data) => {
    return axios.post('/api/cancel-booking', data);
}

export {
    editSpecialty, deleteSpecialty, editClinic, deleteClinic,
    createNewHandbook, getAllHandbook, getDetailHandbookById, editHandbook, deleteHandbook,
    searchAll, getListDoctors, getStatistics, getPatientBookings, cancelBooking,
    handleLoginApi, getAllUsers,
    createNewUserService, deleteUserService,
    editUserService, getAllCodeService,
    getTopDoctorHomeService, getAllDoctors,
    saveDetailDoctorService, getDetailInforDoctorService,
    saveBulkScheduleDoctor, getScheduleDoctorByDateService,
    getExtraInforDoctorById, getProfileDoctorById,
    postPatientBookingAppoinment, postVerifyBookingAppoinment,
    createNewSpecialty, getAllSpecialty,
    getAllDetailSpecialtyById, createNewClinic,
    getAllClinic, getAllDetailClinicById,
    getAllPatientForDoctor, postSendRemedy
}