import "../../styles/Patient/Profile.css";

function Profile({ user }) {
  
  const initials =
    `${user?.first_name?.[0] || ""}${user?.last_name?.[0] || ""}`
      .toUpperCase();

  return (
    <section className="profile-page">

      <div className="page-title">
        <h1>My Profile</h1>
        <p>View your personal account information.</p>
      </div>

      <div className="profile-card">

        <div className="profile-avatar">
          {initials || "P"}
        </div>

        <h2>
          {user?.first_name || "Patient"}{" "}
          {user?.last_name || ""}
        </h2>

        <p className="profile-role">
          {user?.role || "PATIENT"}
        </p>

        <div className="profile-info">

          <div className="info-item">
            <span>Name</span>
            <strong>
              {user?.first_name || ""}{" "}
              {user?.last_name || ""}
            </strong>
          </div>

          <div className="info-item">
            <span>Email</span>
            <strong>
              {user?.email || "Not provided"}
            </strong>
          </div>

          <div className="info-item">
            <span>Phone</span>
            <strong>
              {user?.phone || "Not provided"}
            </strong>
          </div>

        </div>

      </div>

    </section>
  );
}

export default Profile;