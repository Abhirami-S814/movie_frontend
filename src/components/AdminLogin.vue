<template>
  <div class="bgim">
  <div class="d-flex justify-content-center">
  <div class="form-container align-items-center">
      <p class="title">ADMIN LOGIN</p>
      <form class="form" @submit.prevent="onSubmit()">
        <input type="email" v-model="email" class="input" placeholder="Email">
        <input type="password" v-model="password" class="input" placeholder="Password">
        <p class="page-link">
          <span class="page-link-label">Forgot Password?</span>
        </p>
        <button class="form-btn">Log in</button>
      </form>
      
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
      loading: false,
      required: v => !!v || 'This field is required',
    };
  },
  methods: {
    forgotPassword() {
      alert('Redirect to password recovery');
    },
    async adminlogin() {
      const payload = {
        'email': this.email,
        'password': this.password,
      };
      try {
        const res = await this.$store.dispatch('adminlogin', payload);
        if (res) {
          // alert("Successfully logged in!");
          // You can redirect the user after login if needed
          this.$router.push('/movieadd');
        }
      } catch (error) {
        console.error(error);
      }
    },
    onSubmit() {
      this.adminlogin();
    },
  }
};
</script>

<style scoped>
  .form-container {
  width: 350px;
  height: 400px;
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

.bgim{
  background-image: url(../assets/adminlogbg.jfif);
  background-repeat: no-repeat;
  background-size: cover;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
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
  background: rgb(122, 122, 122);
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

.buttons-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  margin-top: 20px;
  gap: 15px;
}

</style>