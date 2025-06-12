const DoctorList = ({ doctors, onMakeAppointment }) => {
  return (
    <div className="doctor-list">
      {doctors.map((doc) => (
        <div className="doctor-card" key={doc._id}>
          <h3>{doc.name}</h3>
          <p>Specialization: {doc.specialization}</p>
          <p>Experience: {doc.experience} years</p>
          <p>Hospital: {doc.hospital}</p>
          <button onClick={() => onMakeAppointment(doc)}>Make Appointment</button>
        </div>
      ))}
    </div>
  );
}

export default DoctorList;
