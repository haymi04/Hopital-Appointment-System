import "../../styles/Patient/Profile.css";

function Profile() {
  return (
    <section className="profile-page">

      <div className="page-title">
        <h1>My Profile</h1>
        <p>View your personal account information.</p>
      </div>

      <div className="profile-card">

        <div className="profile-avatar">
          LD
        </div>

        <h2>Patient Profile</h2>

        <p className="profile-role">
          PATIENT
        </p>

        <div className="profile-info">

          <div className="info-item">
            <span>Name</span>
            <strong>Patient Name</strong>
          </div>

          <div className="info-item">
            <span>Email</span>
            <strong>patient@example.com</strong>
          </div>

          <div className="info-item">
            <span>Phone</span>
            <strong>Not provided</strong>
          </div>

        </div>

      </div>

    </section>
  );
}

export default Profile;