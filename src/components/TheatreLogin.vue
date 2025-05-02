<template>
  <div class="bg">
    <div class="d-flex justify-content-center mt-4 marr">
      <div class="form-container align-items-center">
        <p class="title">{{ isLoginForm ? 'Theatre Login' : 'Sign Up' }}</p>

        <!-- Login Form -->
        <form v-if="isLoginForm" class="form" @submit.prevent="theatrelogin">
          <input type="email" v-model="email" class="input" placeholder="Email" required />
          <input type="password" v-model="password" class="input" placeholder="Password" required />
          <p class="page-link">
            <span class="page-link-label" @click="forgotPassword">Forgot Password?</span>
          </p>
          <button class="form-btn">Log in</button>
        </form>

        <!-- Signup Form -->
        <form v-else class="form" @submit.prevent="theatrereg">
          <input type="text" v-model="name" class="input" placeholder="Name" required />
          <input type="email" v-model="email" class="input" placeholder="Email" required />
          <input type="text" v-model="contact" class="input" placeholder="Contact" required />
          <input type="text" v-model="location" class="input" placeholder="Location" required />
          <input type="number" v-model.number="noOfScreens" class="input" placeholder="Number of Screens" required min="1" />
          <input type="password" v-model="password" class="input" placeholder="Password" required />
          <button class="form-btn">Sign up</button>
        </form>

        <p class="sign-up-label pt-2">
          <span v-if="isLoginForm" @click="toggleForm">
            Don't have an account? <span class="sign-up-link">Sign up</span>
          </span>
          <span v-else @click="toggleForm">
            Already have an account? <span class="sign-up-link">Log in</span>
          </span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'TheatreLogin',
  data() {
    return {
      isLoginForm: true,
      email: '',
      password: '',
      name: '',
      contact: '',
      location: '',
      noOfScreens: 0,
    };
  },
  methods: {
    toggleForm() {
      this.isLoginForm = !this.isLoginForm;
      this.resetForm();
    },
    forgotPassword() {
      alert('Redirect to password recovery (not implemented yet).');
    },
    async theatrereg() {
      const payload = {
        'name': this.name,
        'email': this.email,
        'password': this.password,
        'contact': this.contact,
        'location': this.location,
        'noOfScreens': this.noOfScreens,
      };
      try {
        const res = await this.$store.dispatch('theatreReg', payload);
        if (res) {
          alert("Successfully registered!");
          // this.$router.push('/login');
        }
      } catch (error) {
        console.error(error);
      }
    },
    async theatrelogin() {
      const payload = { 'email': this.email, 'password': this.password };
      try {
        const res = await this.$store.dispatch('theatrelogin', payload);
        if (res) {
          alert("Successfully logged in!");
          this.$router.push('/dashboard')
        }
      } catch (error) {
        console.error(error);
      }
    },
    resetForm() {
      this.name = '';
      this.email = '';
      this.contact = '';
      this.location = '';
      this.noOfScreens = '';
      this.password = '';
    }
  }
};
</script>

<style scoped>
.marr {
  margin-right: 200px;
}
.form-container {
  width: 350px;
  height: auto;
  background-color: #fff;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  border-radius: 10px;
  box-sizing: border-box;
  padding: 20px 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.title {
  text-align: center;
  font-size: 28px;
  font-weight: 800;
}
.form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.input {
  border-radius: 20px;
  border: 1px solid #c0c0c0;
  padding: 10px;
}
.page-link {
  text-decoration: underline;
  text-align: end;
  color: #747474;
}
.page-link-label {
  cursor: pointer;
  font-size: 12px;
  font-weight: 700;
}
.form-btn {
  padding: 10px;
  border-radius: 20px;
  background: rgb(74, 77, 77);
  color: white;
  cursor: pointer;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
}
.sign-up-label {
  font-size: 12px;
  color: #747474;
}
.sign-up-link {
  font-size: 11px;
  text-decoration: underline;
  color: rgb(0, 0, 0);
  cursor: pointer;
  font-weight: 800;
}
.bg {
  height: 100vh;
  background: url(../assets/theatrelogbg.jfif) no-repeat center center;
  background-size: cover;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
@media (max-width: 640px) {
  .bg {
    justify-content: center;
  }
}
</style>
