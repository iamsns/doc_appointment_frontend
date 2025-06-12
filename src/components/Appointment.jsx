import { useState } from 'react';
import Select from 'react-select'

const generateTimeSlots = () => {
    const slots = [];
    let hour = 10;
    let minutes = 1;
    while (hour < 22) {
        const startHour = hour;
        const startMinute = minutes;
        const endMinute = minutes + 14;

        const startTime = `${startHour.toString().padStart(2, "0")}:${startMinute
            .toString()
            .padStart(2, "0")}`;

        let endHour = startHour;
        let finalEndMinute = endMinute;
        if (endMinute >= 60) {
            endHour += 1;
            finalEndMinute = endMinute - 60;
        }

        const endTime = `${endHour.toString().padStart(2, "0")}:${finalEndMinute
            .toString()
            .padStart(2, "0")}`;

        slots.push({ value: startTime, end: endTime });

        minutes += 15;
        if (minutes >= 60) {
            hour += 1;
            minutes = minutes - 60;
        }
    }

    return slots;
};

const selectStyle = {
    menuList: (provided) => ({
        ...provided,
        maxHeight: '200px',
        overflowY: 'auto',
    }),
};


const Appointment = ({ doctor, onClose }) => {
    const [inputData, setInputData] = useState({ patientName: '', patientEmail: '', date: '', slot: '' });
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        const updatedForm = { ...inputData, [name]: value };
        setInputData(updatedForm);
        if (updatedForm.patientName && updatedForm.patientEmail && updatedForm.date && updatedForm.slot) {
            setMessage('');
        } else {
            setMessage("Please fill all fields.");
        }
    };
    const handleSlotChange = (selectedOption) => {
        if (selectedOption === null) {
            setMessage('Please fill all fields.');
            setSelectedSlot(null)
        } else {
            setSelectedSlot(selectedOption)
            if (inputData.patientName && inputData.patientEmail && inputData.date) {
                setMessage('');
            }
            setInputData((prev) => ({ ...prev, slot: selectedOption?.value }))
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { patientName, patientEmail, date, slot } = inputData;

            if (!patientName || !patientEmail || !date || !slot) {
                setMessage("Please fill all fields.");
                return;
            }

            const fullSlot = new Date(`${date}T${slot}:00`);
            const res = await fetch(`${process.env.REACT_APP_SERVER_URL}api/appointment`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    doctor: doctor._id,
                    patientName,
                    patientEmail,
                    slot: fullSlot.toISOString(),
                }),
            });

            const data = await res.json();
            if (res.status === 201) {
                alert('Appointment booked successfully.');
                setInputData({ patientName: '', patientEmail: '', date: '', slot: '' });
                setSelectedSlot(null)
                setMessage('');
                onClose();
            } else {
                alert(data.message);
            }
        } catch (err) {
            console.log("Error in make appointment -> ", err)
            alert(err.message);
        }
    }

    const slots = generateTimeSlots();
    const selectOptions = slots.map(slot => ({
        label: `${slot.value} - ${slot.end}`,
        value: slot.value,
        end: slot.end
    }));

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>Book Appointment with {doctor.name}</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        name="patientName"
                        type="text"
                        placeholder="Your Name"
                        value={inputData.patientName}
                        onChange={handleChange}
                    />
                    <input
                        name="patientEmail"
                        type="email"
                        placeholder="Your Email"
                        value={inputData.patientEmail}
                        onChange={handleChange}
                    />
                    <input
                        name="date"
                        type="date"
                        value={inputData.date}
                        min={new Date().toISOString().split("T")[0]}
                        onChange={handleChange}
                    />
                    <Select
                        options={selectOptions}
                        onChange={handleSlotChange}
                        value={selectedSlot}
                        placeholder="Select time slot"
                        isClearable
                        styles={selectStyle}
                    />
                    <button type="submit">Book</button>
                    <button type="button" onClick={onClose} className="cancel-btn">Cancel</button>
                </form>
                {message && <p className="message">{message}</p>}
            </div>
        </div>
    );
};

export default Appointment;
