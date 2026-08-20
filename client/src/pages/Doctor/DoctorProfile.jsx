//import "../../styles/Patient/Profile.css";

function Profile({ user }) {
  console.log("Logged in user:", user);

  // Build full name from first_name + last_name
  const fullName = `${user?.first_name || ""} ${user?.last_name || ""}`.trim();

  // Get initials for avatar
  const getInitials = () => {
    if (!fullName) return "P";

    return fullName
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <section className="profile-page">

      <div className="page-title">
        <h1>My Profile</h1>
        <p>View your personal account information.</p>
      </div>

      <div className="profile-card">

        <div className="profile-avatar">
          {getInitials()}
        </div>

        <h2>{fullName || "DOCTOR"}</h2>

        <p className="profile-role">
          {user?.role || "DOCTOR"}
        </p>

        <div className="profile-info">

          <div className="info-item">
            <span>Name</span>
            <strong>{fullName || "Not provided"}</strong>
          </div>

          <div className="info-item">
            <span>Email</span>
            <strong>{user?.email || "Not provided"}</strong>
          </div>

          <div className="info-item">
            <span>Phone</span>
            <strong>{user?.phone || "Not provided"}</strong>
          </div>

        </div>

      </div>

    </section>
  );
}

export default Profile;