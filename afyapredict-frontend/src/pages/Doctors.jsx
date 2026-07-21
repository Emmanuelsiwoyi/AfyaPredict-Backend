
import { useEffect, useState } from "react";
import api from "../services/api";

function Doctors() {
  const [doctors, setDoctors] = useState([]);
const [fullName, setFullName] = useState("");
const [specialization, setSpecialization] = useState("");
const [phone, setPhone] = useState("");
const [email, setEmail] = useState("");

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get("/doctors", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setDoctors(response.data);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };
const addDoctor = async (e) => {
  e.preventDefault();

  try {
    const token = localStorage.getItem("token");

    await api.post(
      "/doctors",
      {
        full_name: fullName,
        specialization,
        phone,
        email,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setFullName("");
    setSpecialization("");
    setPhone("");
    setEmail("");

    fetchDoctors();

    alert("Doctor added successfully!");
  } catch (error) {
    console.error(error);
    alert("Failed to add doctor.");
  }
};
const deleteDoctor = async (id) => {
  if (!window.confirm("Delete this doctor?")) return;

  try {
    const token = localStorage.getItem("token");

    await api.delete(`/doctors/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    fetchDoctors();

    alert("Doctor deleted successfully!");
  } catch (error) {
    console.error(error);
    alert("Failed to delete doctor.");
  }
};
  return (
    <div className="container mt-4">
      <h2>Doctors</h2>

      <form onSubmit={addDoctor} className="mb-4">
  <input
    className="form-control mb-2"
    placeholder="Full Name"
    value={fullName}
    onChange={(e) => setFullName(e.target.value)}
  />

  <input
    className="form-control mb-2"
    placeholder="Specialization"
    value={specialization}
    onChange={(e) => setSpecialization(e.target.value)}
  />

  <input
    className="form-control mb-2"
    placeholder="Phone"
    value={phone}
    onChange={(e) => setPhone(e.target.value)}
  />

  <input
    className="form-control mb-2"
    placeholder="Email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
  />

  <button type="submit" className="btn btn-success">
    Add Doctor
  </button>
</form>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Full Name</th>
            <th>Specialization</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {doctors.map((doctor) => (
            <tr key={doctor.id}>
              <td>{doctor.id}</td>
              <td>{doctor.full_name}</td>
              <td>{doctor.specialization}</td>
              <td>{doctor.phone}</td>
              <td>{doctor.email}</td>
              <td>
  <button
    className="btn btn-danger btn-sm"
    onClick={() => deleteDoctor(doctor.id)}
  >
    Delete
  </button>
</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Doctors;