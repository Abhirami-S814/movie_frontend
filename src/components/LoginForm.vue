<template>
  <div>
    <div class="bgim">
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
          <li><router-link to="/">HOME</router-link></li>
          <li><router-link to="/login">MOVIES</router-link></li>
          <li><router-link to="">THEATRE</router-link></li>
          <li><a href="#about">ABOUT</a></li>
          <li><router-link to="/login">Login</router-link></li>
        </ul>
        <span class="mdi mdi-account-circle-outline accicon"></span>
      </div>
    </div>
  </div>
    
      <div class="d-flex justify-content-center mt-4">
        <div class="form-container align-items-center" :class="{ 'shift-left': showForgotPassword }">
          <p class="title">LOGIN</p>
          <form class="form" @submit.prevent="onSubmit()">
            <input type="email" v-model="email" class="input" placeholder="Email">
            <input type="password" v-model="password" class="input" placeholder="Password">
            <p class="page-link">
              <span class="page-link-label" @click="toggleForgotPassword">Forgot Password?</span>
            </p>
            <button class="form-btn">Log in</button>
          </form>
          <p class="sign-up-label">
            Don't have an account?<span class="sign-up-link" @click="goToRegistration">Sign up</span>
          </p>

          <!-- LOGIN WITH GOOGLE (NOT WORKING) -->
          <div class="buttons-container">
            <div class="google-login-button">
              <span class="mdi mdi-google"></span>
              <span>Log in with Google</span>
            </div>
          </div>
          <!-- *********************************** -->


        </div>
        <div v-if="showForgotPassword" class="form-container align-items-center rsize">
          <p class="title">Reset Password</p>
          <form class="form" @submit.prevent="onResetPassword()">
            <input type="email" v-model="email" class="input" placeholder="Enter your email">
            <input type="password" v-model="password" class="input" placeholder="Enter new password">
            <button class="form-btn">Reset Password</button>
          </form>
          <p class="sign-up-label">
            Remembered your password?<span class="sign-up-link" @click="toggleForgotPassword">Log in</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      password: '',
      resetEmail: '',
      showForgotPassword: false,
      isMenuOpen: false,
    };
  },
  methods: {
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
    toggleForgotPassword() {
      this.showForgotPassword = !this.showForgotPassword;
    },
    goToRegistration() {
      this.$router.push({ name: 'reg' });
    },
    
    // *****************************USER LOGIN*********************************
    async loginUser() {
      const payload = { 'email': this.email, 'password': this.password };
      try {
        const res = await this.$store.dispatch('userlogin', payload);
        if (res) {
          alert("Successfully logged in!");
          this.$router.push('/movielist')
        }
      } catch (error) {
        console.error(error);
      }
    },
    // ***********************************************************************

    // *************************FORGOT PASSWORD*****************************
    async forgotpass(){
      const payload = { 'email': this.email, 'password': this.password };
      try {
        const res = await this.$store.dispatch('forgotPass', payload);
        if (res) {
          alert("Password Changed Successfully!!!");
          this.showForgotPassword = false; // Hide reset form
          this.email = "";
          this.password = "";
          this.$router.push('/login');
        }
      } catch (error) {
        console.error(error);
      }
    },
    // ***************************************************************************
    onSubmit() {
      this.loginUser();
    },
    onResetPassword() {
      // alert(`Password reset link sent to ${this.resetEmail}`);
      this.forgotpass();
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

.form-container {
  width: 350px;
  height: 500px;
  background-color: #fff;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  border-radius: 10px;
  box-sizing: border-box;
  padding: 20px 30px;
  display: flex;
  flex-direction: column;
  transition: transform 0.5s ease;
}

.shift-left {
  transform: translateX(-200px);
}


.title {
  text-align: center;
  font-family: "Lucida Sans", "Lucida Sans Regular", "Lucida Grande",
        "Lucida Sans Unicode", Geneva, Verdana, sans-serif;
  margin: 10px 0 30px 0;
  font-size: 28px;
  font-weight: 800;
}

.form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 18px;
  margin-bottom: 15px;
}

.input {
  border-radius: 20px;
  border: 1px solid #c0c0c0;
  outline: 0 !important;
  box-sizing: border-box;
  padding: 12px 15px;
}

.page-link {
  text-decoration: underline;
  margin: 0;
  text-align: end;
  color: #747474;
  text-decoration-color: #747474;
}

.page-link-label {
  cursor: pointer;
  font-family: sans-serif;
  font-size: 12px;
  font-weight: 700;
}

.page-link-label:hover {
  color: #000;
}

.form-btn {
  padding: 10px 15px;
  font-family: "Lucida Sans", "Lucida Sans Regular", "Lucida Grande",
        "Lucida Sans Unicode", Geneva, Verdana, sans-serif;
  border-radius: 20px;
  border: 0 !important;
  outline: 0 !important;
  background: indigo;
  color: white;
  cursor: pointer;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  justify-content: center;
  align-items: center;
}

.form-btn:active {
  box-shadow: none;
}

.sign-up-label {
  margin: 0;
  font-size: 12px;
  color: #747474;
  font-family: sans-serif;
}

.sign-up-link {
  margin-left: 1px;
  font-size: 11px;
  text-decoration: underline;
  text-decoration-color: indigo;
  color: indigo;
  cursor: pointer;
  font-weight: 800;
  font-family: "Lucida Sans", "Lucida Sans Regular", "Lucida Grande",
        "Lucida Sans Unicode", Geneva, Verdana, sans-serif;
}

.buttons-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  margin-top: 20px;
  gap: 15px;
}

.google-login-button {
  border-radius: 20px;
  box-sizing: border-box;
  padding: 10px 15px;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 10px 36px 0px,
        rgba(0, 0, 0, 0.06) 0px 0px 0px 1px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family:sans-serif;
  font-size: 12px;
  gap: 5px;
}

.google-login-button {
  border: 2px solid #747474;
}

.latestmov{
  background-color: antiquewhite;
}

.rsize{
  height: 350px;
  margin-top: 60px;
}


</style>
