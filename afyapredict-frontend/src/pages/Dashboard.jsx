
import { Link } from "react-router-dom";
function Dashboard() {
  return (
    <div className="container mt-5">
      <h2>🏥 AfyaPredict Dashboard</h2>
      <hr />

      <div className="row">


        <div className="col-md-3 mb-3">
  <Link to="/doctors" className="text-decoration-none">
    <div className="card p-3 text-center">
      <h4>👨‍⚕️ Doctors</h4>
      <p>Manage doctors</p>
    </div>
  </Link>
</div>

        <div className="col-md-3 mb-3">
          <div className="card p-3 text-center">
            <h4>📅 Appointments</h4>
            <p>Book appointments</p>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card p-3 text-center">
            <h4>🚪 Logout</h4>
            <p>Sign out</p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;