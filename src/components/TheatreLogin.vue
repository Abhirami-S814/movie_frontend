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
          <input type="number" v-model.number="noOfScreens" class="input" placeholder="Number of Screens" required min="1" />
          <input type="password" v-model="password" class="input" placeholder="Password" required />

          <p style="font-size: 14px; font-weight: bold">Pick location on map:</p>
          <p v-if="locationName">Selected Location: {{ locationName }}</p>

          <div class="location-values" v-if="latitude !== null && longitude !== null">
            <span>Lat: {{ latitude.toFixed(5) }}</span>
            <span>Lng: {{ longitude.toFixed(5) }}</span>
          </div>

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

      <!-- Map shown only during signup -->
      <div v-if="!isLoginForm" id="map" class="map-container"></div>
    </div>
  </div>
</template>

<script>
import L from 'leaflet';

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
      latitude: null,
      longitude: null,
      locationName: '',
      map: null,
      marker: null
    };
  },

  methods: {
    toggleForm() {
      this.isLoginForm = !this.isLoginForm;
      this.resetForm();

      this.$nextTick(() => {
        if (!this.isLoginForm) {
          // Set default location if lat/lng are null to avoid Leaflet errors
          if (this.latitude === null || this.longitude === null) {
            this.latitude = 20.5937; // Example default lat (India)
            this.longitude = 78.9629; // Example default lng
            this.locationName = "Default Location";
          }
          this.initMap();
        } else {
          // If switching to login, remove map to cleanup
          if (this.map) {
            this.map.off();
            this.map.remove();
            this.map = null;
            this.marker = null;
          }
        }
      });
    },

    forgotPassword() {
      alert('Redirect to password recovery (not implemented yet).');
    },

    async theatrereg() {
      const payload = {
        name: this.name,
        email: this.email,
        password: this.password,
        contact: this.contact,
        noOfScreens: this.noOfScreens,
        location: this.locationName,
        latitude: this.latitude,
        longitude: this.longitude
      };
      try {
        const res = await this.$store.dispatch('theatreReg', payload);
        if (res) {
          alert("Successfully registered!");
          this.toggleForm(); // Go back to login
        }
      } catch (error) {
        console.error(error);
      }
    },

    async theatrelogin() {
      const payload = { email: this.email, password: this.password };
      try {
        const res = await this.$store.dispatch('theatrelogin', payload);
        if (res) {
          alert("Successfully logged in!");
          this.$router.push('/dashboard');
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
      this.noOfScreens = 0;
      this.password = '';
      this.latitude = null;
      this.longitude = null;
      this.locationName = '';
    },

    initMap() {
      if (this.map) {
        this.map.off();
        this.map.remove();
        this.map = null;
        this.marker = null;
      }

      this.map = L.map('map').setView([this.latitude, this.longitude], 5);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '© OpenStreetMap contributors'
      }).addTo(this.map);

      this.marker = L.marker([this.latitude, this.longitude], { draggable: true }).addTo(this.map);

      this.marker.on('dragend', async () => {
        const pos = this.marker.getLatLng();
        this.latitude = pos.lat;
        this.longitude = pos.lng;
        this.locationName = await this.reverseGeocode(this.latitude, this.longitude);
      });

      this.map.on('click', async (e) => {
        const { lat, lng } = e.latlng;
        this.latitude = lat;
        this.longitude = lng;
        this.marker.setLatLng([lat, lng]);
        this.locationName = await this.reverseGeocode(lat, lng);
      });
    },

    async reverseGeocode(lat, lon) {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
        );
        const data = await response.json();
        return data.display_name || "Unknown location";
      } catch (error) {
        console.error("Reverse geocoding failed:", error);
        return "Unknown location";
      }
    }
  }
};
</script>

<style scoped>
.marr {
  margin-right: 50px;
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
  /* padding: 10px; */
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

.map-container {
  width: 350px;
  height: 400px;
  border-radius: 10px;
  margin-left: 20px;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
}

.location-values {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  margin-bottom: 10px;
}

@media (max-width: 768px) {
  .d-flex {
    flex-direction: column;
    align-items: center;
  }

  .marr {
    margin-right: 0;
  }

  .map-container {
    margin-left: 0;
    margin-top: 20px;
  }
}
</style>
