import { useEffect, useState } from 'react';
import DoctorList from './components/DoctorList';
import Appointment from './components/Appointment';
import './App.css';

const App = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_SERVER_URL}api/doctors`)
      .then(res => res.json())
      .then((data) => {
        if (data.status == 'OK') {
         setDoctors(data.data)
        }
      }
      )
      .catch(err => {
        console.error('Error fetching doctors:-> ', err)
        alert(err.message)
      });
  }, []);

  const handleMakeAppointment = (doctor) => {
    setSelectedDoctor(doctor);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDoctor(null);
  };

  return (
    <div className="app-container">
      <h1 className="app-header">Doctor Appointment Booking</h1>
      <DoctorList doctors={doctors} onMakeAppointment={handleMakeAppointment} />
      {isModalOpen && (
        <Appointment doctor={selectedDoctor} onClose={closeModal} />
      )}
    </div>
  );
}

export default App;
