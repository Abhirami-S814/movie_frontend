<template>
  <div>
    <!-- Navigation Bar -->
    <div class="navbar">
      <div class="logo">QuickTix</div>
      <div class="navcenter">
        <v-text-field
          class="search"
          append-inner-icon="mdi mdi-magnify"
          variant="underlined"
          label="Search Movies...."
        ></v-text-field>
        <!-- Hamburger Menu for Small Screens -->
        <div class="menu-icon" @click="toggleMenu">
          <span class="mdi mdi-menu"></span>
        </div>
        <ul :class="['nav-links', { 'active': isMenuOpen }]">
          <li><router-link to="">HOME</router-link></li>
          <li><router-link to="/login">MOVIES</router-link></li>
          <li><router-link to="/theatrelist">THEATRE</router-link></li>
          <li><a href="#about">ABOUT</a></li>
          <li><router-link to="/login">Login</router-link></li>
        </ul>
        <span class="mdi mdi-account-circle-outline accicon"></span>
      </div>
    </div>

    <!-- Main Content -->
    <!-- Main Content -->
  <div class="content-container row">
    <div class="text-content col-12 col-md-4 d-flex flex-column justify-content-center align-items-center">
      <h1>BOOK YOUR TICKETS NOW...!!</h1>
      <p>Your ultimate movie destination</p>
    </div>
    <div class="background-image col-12 col-md-8"></div>
  </div>


    <!-- About Us Section -->
    <div id="about" class="about-section">
      <div class="about-container">
        <h2 class="section-title">About Us</h2>
        <div class="about-intro">
          <h3>Welcome to <span class="highlight">QuickTix</span></h3>
          <p class="intro-text">Your premier destination for hassle-free movie ticket booking. Experience cinema like never before!</p>
        </div>

        <div class="features-grid">
          <div class="feature-card">
            <span class="feature-icon">🎬</span>
            <h4>Instant Booking</h4>
            <p>Book your favorite movies in seconds with instant confirmation</p>
          </div>
          <div class="feature-card">
            <span class="feature-icon">🎟</span>
            <h4>Wide Selection</h4>
            <p>Choose from hundreds of movies and theaters near you</p>
          </div>
          <div class="feature-card">
            <span class="feature-icon">🔒</span>
            <h4>Secure Payments</h4>
            <p>Multiple secure payment options for your convenience</p>
          </div>
          <div class="feature-card">
            <span class="feature-icon">📱</span>
            <h4>Mobile Tickets</h4>
            <p>Skip the queue with digital tickets on your phone</p>
          </div>
        </div>

        <div class="contact-container">
          <h3>Get in Touch</h3>
          <div class="contact-info">
            <div class="contact-item">
              <span class="contact-icon">📍</span>
              <p>123 Movie Street, Cinema City, 45678</p>
            </div>
            <div class="contact-item">
              <span class="contact-icon">📧</span>
              <p>support@quicktix.com</p>
            </div>
            <div class="contact-item">
              <span class="contact-icon">📞</span>
              <p>+123 456 7890</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Copyright Footer -->
  <footer class="copyright">
    <p>&copy; 2024 QuickTix. All rights reserved.</p>
  </footer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isMenuOpen: false,
    };
  },
  methods: {
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
  },
};
</script>

<style scoped>
/* Navbar Styles */
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
  background-color: indigo;
  color: white;
  width: 100%;
}

.logo {
  font-size: x-large;
}

.navcenter {
  display: flex;
  align-items: center;
  gap: 20px;
}

ul {
  display: flex;
  list-style: none;
  gap: 20px;
  margin: 0;
  padding: 0;
}

li a {
  text-decoration: none;
  color: white;
  font-weight: bold;
}

li a:hover {
  text-decoration: underline;
}

.search {
  width: 300px;
  margin-right: 100px;
}

.accicon {
  font-size: 24px;
  cursor: pointer;
}

/* Hamburger Menu */
.menu-icon {
  display: none;
  font-size: 28px;
  cursor: pointer;
  color: white;
}

.nav-links {
  display: flex;
}

@media (max-width: 768px) {
  .menu-icon {
    display: block;
  }

  .nav-links {
    display: none;
    flex-direction: column;
    background-color: indigo;
    position: absolute;
    top: 60px;
    right: 0;
    width: 100%;
    padding: 10px;
    text-align: center;
  }

  .nav-links.active {
    display: flex;
  }
}

/* Main Content Styles */
.content-container {
  display: flex;
  justify-content: space-between;
  padding: 20px;
  height: 80vh;
}

.text-content {
  flex: 0.9;
  color: #333;
  margin-left: 20px;
}

.text-content h1 {
  font-size: 70px;
  font-family: Impact, sans-serif;
}

.background-image {
  flex: 1.5;
  background-image: url(../assets/backgroundimg.jpg);
  background-position: center;
  background-size: cover;
  height: 100%;
}

/* About Section Styles */
.about-section {
  background-color: #f8f9fa;
  padding: 80px 0;
  position: relative;
  min-height: 100vh;
}

.about-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.section-title {
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 50px;
  text-align: center;
  position: relative;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -15px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background-color: indigo;
}

.about-intro {
  text-align: center;
  margin-bottom: 60px;
  animation: slideUp 0.8s ease-out;
}

.highlight {
  color: indigo;
  font-weight: bold;
}

.intro-text {
  font-size: 1.2rem;
  color: #666;
  max-width: 800px;
  margin: 20px auto;
  line-height: 1.6;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  margin-bottom: 60px;
  animation: fadeIn 1s ease-in;
}

.feature-card {
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  text-align: center;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.15);
}

.feature-icon {
  font-size: 2.5rem;
  margin-bottom: 20px;
  display: block;
}

.feature-card h4 {
  color: #2c3e50;
  margin-bottom: 15px;
  font-size: 1.3rem;
}

.feature-card p {
  color: #666;
  line-height: 1.6;
}

.contact-container {
  background: white;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  animation: slideUp 0.8s ease-out;
}

.contact-container h3 {
  color: #2c3e50;
  text-align: center;
  margin-bottom: 30px;
  font-size: 1.8rem;
}

.contact-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  transition: transform 0.3s ease;
}

.contact-item:hover {
  transform: translateX(5px);
}

.contact-icon {
  font-size: 1.5rem;
  color: indigo;
}

.contact-item p {
  margin: 0;
  color: #666;
}

/* Copyright Footer */
.copyright {
  background-color: indigo;
  color: white;
  text-align: center;
  padding: 15px 0;
  width: 100%;
}

.copyright p {
  margin: 0;
  font-size: 0.9rem;
}

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive Styles for About Section */
@media (max-width: 768px) {
  .section-title {
    font-size: 2rem;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .contact-info {
    grid-template-columns: 1fr;
  }

  .about-section {
    padding: 40px 0;
  }

  .feature-card {
    padding: 20px;
  }
}

/* Dark mode support for About Section */
@media (prefers-color-scheme: dark) {
  .about-section {
    background-color: #1a1a1a;
  }

  .feature-card,
  .contact-container {
    background: #2d2d2d;
  }

  .section-title,
  .feature-card h4 {
    color: #ffffff;
  }

  .intro-text,
  .feature-card p,
  .contact-item p {
    color: #cccccc;
  }
}
</style>