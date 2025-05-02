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
          <li><a href="#about">ABOUT</a></li> <!-- Scrolls to About Us Section -->
          <li><router-link to="/login">Login</router-link></li>
        </ul>
        <span class="mdi mdi-account-circle-outline accicon "></span>
      </div>
    </div>

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
        <h2 class="about-title">About Us</h2>
        <h6>Welcome to <strong>QuickTix</strong> – your ultimate destination for seamless and hassle-free movie ticket booking.</h6>
        <h6>We provide a convenient, fast, and secure way for movie lovers to book tickets online, eliminating long queues and last-minute disappointments.</h6>

        <div class="about-content">
          <!-- Why Choose Us Section -->
          <div class="about-sections">
            <h3>Why Choose Us?</h3>
            <p>🎬 Instant booking confirmation</p>
            <p>🎟 Wide selection of movies & theaters</p>
            <p>📞🔒 Secure payment options</p>
          </div>

          <!-- Contact Us Section -->
          <div class="contact-section">
            <h3>Contact Us</h3>
            <p>📍 Address: 123 Movie Street, Cinema City, 45678</p>
            <p>📧 Email: support@quicktix.com</p>
            <p>📞 Phone: +123 456 7890</p>
          </div>
        </div>
      </div>
    </div>
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
/* Navbar */
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

/* Hide menu links initially on mobile */
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

/* Main Content */
.content-container {
  display: flex;
  justify-content: space-between;
  padding: 20px;
  height: 80vh;
}

.text-content {
  flex: 0.9;
  /* text-align: center; */
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

/* About Us Section - Full Width */
.about-section {
  width: 100vw;
  padding: 50px 20px;
  background-color: #f5f5f5;
  text-align: center;
}

/* Container for About Us */
.about-container {
  width: 100%;
  max-width: 1200px;
  margin: auto;
}

/* About Us Content */
.about-content {
  display: flex;
  justify-content: space-around;
  align-items:normal;
  line-height: normal;
  width: 100%;
  gap: 50px;
  padding: 20px;
}

/* Individual Sections */
.about-sections,
.contact-section {
  flex: 1;
  text-align: left;
  padding: 20px;
}

/* Ensure lists align properly */
.about-sections ul {
  padding-left: 0;
  display: flex;
  flex-direction: column;
}

.about-sections li {
  list-style: none;
  display: block;
  padding: 5px;
}

/* Responsive: Stack sections on small screens */
@media (max-width: 768px) {
  .text-content h1 {
    font-size: 40px;
  }

  .background-image {
    background-size: cover;
  }

  .about-content {
    flex-direction: column;
    text-align: center;
    gap: 20px;
  }

  .about-sections,
  .contact-section {
    width: 100%;
    text-align: center;
  }
}
</style>
