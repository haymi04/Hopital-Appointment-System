import React from "react";
import "../styles/LandingPage.css";
import hospitalimage from "../assets/hospitalimage.png";

function LandingPage( ) {
  return (
    <div className="landing-page">
      
      {/* Hero Section */}

      <section className="hero">


        <div className="hero-content">
        <style>backgroundimg </style>
          <h1>
            Your Health,
            <br/>
            Our Priority
          </h1>


          <p>
            Book appointments with our trusted doctors and get
            <br/>
            the best healthcare for you and your family.
          </p>


          <div className="hero-buttons">

            <button className="primary-btn">
              Book Appointment
            </button>


            <button className="secondary-btn">
              Learn More
            </button>

          </div>

        </div>



        <div className="hero-image">

          <img 
            src={hospitalimage}
            alt="Hospital"
          />

        </div>


      </section>




      {/* Quick Actions */}

      <section className="features">


        <Feature
          icon="👤"
          title="Find Doctors"
          text="Search and find the best doctors by specialty."
        />


        <Feature
          icon="📅"
          title="Book Appointment"
          text="Choose a convenient time and book your slot."
        />


        <Feature
          icon="♡"
          title="Get Treatment"
          text="Visit the doctor and get the best treatment."
        />


        <Feature
          icon="⚕"
          title="Stay Healthy"
          text="Regular checkups for a healthy life."
        />


      </section>




      {/* Statistics */}

      <section className="stats">


        <Stat 
          number="30+"
          title="Doctors"
        />


        <Stat
          number="5+"
          title="Departments"
        />


        <Stat
          number="10K+"
          title="Happy Patients"
        />


        <Stat
          number="99%"
          title="Satisfaction"
        />


      </section>

    </div>
  );
}




// Feature Component

function Feature({icon,title,text}){

  return(

    <div className="feature-card">

      <div className="feature-icon">
        {icon}
      </div>


      <h3>
        {title}
      </h3>


      <p>
        {text}
      </p>

    </div>

  )

}





// Statistic Component

function Stat({number,title}){

  return(

    <div className="stat-card">

      <h2>
        {number}
      </h2>

      <p>
        {title}
      </p>
    
    </div>

  )

}



export default LandingPage;