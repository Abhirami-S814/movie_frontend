<template>
  <div>
    <div class="navbar">
      <div class="logo">QuickTix</div>
      <div class="navcenter">
        <v-text-field class="search"
            append-inner-icon="mdi mdi-magnify"
            variant="underlined"
            label="Search Movies...."
          ></v-text-field>
        <ul class="d-flex justify-space-between gap-4 pt-1">
          <li><router-link to="/">HOME</router-link></li>
          <li><router-link to="/">MOVIES</router-link></li>
          <li><router-link to="/theatrelog">THEATRE</router-link></li>
          <li><router-link to="">ABOUT</router-link></li>
          <li><router-link to="/login">Login</router-link></li>
        </ul>
        <span class="mdi mdi-account-circle-outline accicon pt-1"></span>
      </div>
    </div>
    <div class="d-flex justify-content-center mt-4">
      <div class="form-container align-items-center">
        <p class="title">SIGN UP</p>
        <form class="form" @submit.prevent="onSubmit()">
          <input type="text" v-model="name" class="input" placeholder="Username" required>
          <input type="email" v-model="email" class="input" placeholder="Email" required>
          <input type="password" v-model="password" class="input" placeholder="Password" required>
          <button class="form-btn">Sign up</button>
        </form>
        <p class="sign-up-label">
          Already have an account? <span class="sign-up-link" @click="goToLogin">Log in</span>
        </p>
        <div class="buttons-container">
          <div class="google-login-button">
            <span class="mdi mdi-google"></span>
            <span>Sign up with Google</span>
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
      name: '',
      email: '',
      password: '',
    };
  },
  methods: {
    goToLogin() {
      this.$router.push({ name: 'login' });
    },
    async registerUser() {
      const payload = {
        'name': this.name,
        'email': this.email,
        'password': this.password,
      };
      try {
        const res = await this.$store.dispatch('userReg', payload);
        if (res) {
          // alert("Successfully registered!");
          this.$router.push('/login');
        }
      } catch (error) {
        console.error(error);
      }
    },
    onSubmit() {
      this.registerUser();
    },
  },
};
</script>
<style scoped>
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
  background-color: indigo;
  color: white;
  margin: 0;
  width: 100%;
}

.logo {
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
  font-size: xx-large;
}

.navcenter {
  display: flex;
  align-items: center;
  gap: 20px;
}

ul {
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0;
  gap: 20px;
}

li a {
  text-decoration: none;
  color: white;
  font-weight: bold;
  transition: color 0.3s ease;
}

li a:hover {
  text-decoration: underline;
}

.search {
  width: 300px;
  margin-right: 50px;
}

.accicon {
  font-size: 24px;
  cursor: pointer;
  margin-left: 20px;
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
  /* align-items: center;
  justify-content: center; */
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

</style>