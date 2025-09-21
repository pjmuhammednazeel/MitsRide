import React from 'react';
import './AboutUs.css';

function AboutUs() {
  return (
    <div className="about-us-container">
      {/* Header */}
      <header className="about-header">
        <h1>About MitsRide</h1>
        <p>Real-Time College Bus Tracking System</p>
      </header>

      {/* Project Description */}
      <section className="project-description">
        <h2>About Our Project</h2>
        <p>
          MitsRide is an innovative real-time bus tracking system designed specifically for college transportation management. 
          Our system allows students and staff to track college bus locations in real-time  
          and access route information conveniently through a user-friendly web interface.
        </p>
        <p>
          Built using modern web technologies including React.js and Firebase, MitsRide provides a seamless experience 
          for tracking multiple buses simultaneously, managing driver information, and ensuring efficient campus transportation.
        </p>
        <p>
          This project was developed as part of our S3 MCA (Master of Computer Applications) curriculum, showcasing our 
          skills in full-stack web development, real-time data management, and user interface design.
        </p>
      </section>

      {/* Group Photo - First Section */}
      <section className="group-photo-section">
        <h2>Our Team</h2>
        <div className="group-photo">
          <img src="/images/group.jpeg" alt="MitsRide Development Team" />
          <p>The MitsRide Development Team</p>
        </div>
      </section>

      {/* Team Members Section */}
      <section className="team-section">
        <h2>Team Members</h2>
        <div className="team-grid">
          <div className="team-member">
            <div className="member-photo">
              <img src="/images/jude.jpg" alt="Jude Baby K" />
            </div>
            <h3>Jude Baby K</h3>
            <p>Full Stack Developer</p>
            <div className="social-links">
              <a href="https://linkedin.com/in/jude-baby-k" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-linkedin"></i> LinkedIn
              </a>
              <a href="https://github.com/judebabyk" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-github"></i> GitHub
              </a>
            </div>
          </div>

          <div className="team-member">
            <div className="member-photo">
              <img src="/images/nazeel.jpg" alt="P J Muhammed Nazeel" />
            </div>
            <h3>P J Muhammed Nazeel</h3>
            <p>Frontend Developer</p>
            <div className="social-links">
              <a href="https://linkedin.com/in/pjmuhammednazeel" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-linkedin"></i> LinkedIn
              </a>
              <a href="https://github.com/pjmuhammednazeel" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-github"></i> GitHub
              </a>
            </div>
          </div>

          <div className="team-member">
            <div className="member-photo">
              <img src="/images/ribin.jpg" alt="Ribin Roy" />
            </div>
            <h3>Ribin Roy</h3>
            <p>Backend Developer</p>
            <div className="social-links">
              <a href="https://linkedin.com/in/ribin-roy" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-linkedin"></i> LinkedIn
              </a>
              <a href="https://github.com/ribinroy" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-github"></i> GitHub
              </a>
            </div>
          </div>

          <div className="team-member">
            <div className="member-photo">
              <img src="/images/madhav.jpg" alt="Sai Madhav Raj" />
            </div>
            <h3>Sai Madhav Raj</h3>
            <p>Database Developer</p>
            <div className="social-links">
              <a href="https://linkedin.com/in/sai-madhav-raj" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-linkedin"></i> LinkedIn
              </a>
              <a href="https://github.com/saimadhavraj" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-github"></i> GitHub
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Guide Section */}
      <section className="guide-section">
        <h2>Project Guide</h2>
        <div className="guide-info">
          <div className="guide-photo">
            <img src="/images/smitha.jpg" alt="Dr. Smitha Anu Thomas" />
          </div>
          <div className="guide-details">
            <h3>Dr. Smitha Anu Thomas</h3>
            <p>Project Supervisor & Mentor</p>
            <p>
              Under the expert guidance of Dr. Smitha Anu Thomas, we developed this comprehensive 
              bus tracking system as part of our academic curriculum. Her valuable insights and 
              continuous support made this project a successful learning experience.
            </p>
          </div>
        </div>
      </section>

      {/* Special Contributors Section */}
      <section className="contributor-section">
        <h2>Special Contributors</h2>
        <div className="contributors-grid">
          <div className="contributor-card">
            <div className="contributor-photo">
              <img src="/images/sivadas.jpg" alt="Sivadas T Nair" />
            </div>
            <h3>Sivadas T Nair</h3>
            <p>Professor & Mentor</p>
            <p>
              We are deeply grateful to Professor Sivadas T Nair for his invaluable guidance 
              and mentorship throughout our academic journey. His expertise and support have 
              been instrumental in shaping our understanding and approach to this project.
            </p>
          </div>

          <div className="contributor-card">
            <div className="contributor-photo">
              <img src="/images/akhil.jpg" alt="Akhil Mohanan" />
            </div>
            <h3>Akhil Mohanan</h3>
            <p>Colleague & Collaborator</p>
            <p>
              We extend our heartfelt gratitude to our colleague Akhil Mohanan for his valuable 
              contributions and collaborative support throughout the development of this project. 
              His insights and assistance were instrumental in bringing MitsRide to life.
            </p>
          </div>
        </div>
      </section>

      {/* Academic Info */}
      <section className="academic-info">
        <h2>Academic Details</h2>
        <div className="academic-details">
          <div className="detail-item">
            <h4>Course</h4>
            <p>S3 MCA (Master of Computer Applications)</p>
          </div>
          <div className="detail-item">
            <h4>Institution</h4>
            <p>Muthoot Institute of Technology and Science</p>
          </div>
          <div className="detail-item">
            <h4>Project Type</h4>
            <p>Web Application Development</p>
          </div>
          <div className="detail-item">
            <h4>Technologies Used</h4>
            <p>React.js, Firebase, CSS3, JavaScript, Real-time Database</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AboutUs;
