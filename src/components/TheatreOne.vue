<template>
  <v-app id="theatre-dashboard" class="bgimg">

    <!-- Sidebar -->
    <v-navigation-drawer app permanent>
      <v-list dense>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="text-h6">🎭 Theatre Admin</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-divider></v-divider>

        <v-list-item link>
          <v-list-item-title>Dashboard</v-list-item-title>
        </v-list-item>

        <v-list-item link>
          <v-list-item-title>Add Screen</v-list-item-title>
        </v-list-item>

        <v-list-item link>
          <v-list-item-title>Bookings</v-list-item-title>
        </v-list-item>

        <v-list-item link>
          <v-list-item-title>Logout</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    

    <!-- Main Content -->
    <v-main class="pa-6 bg-gray-100">
      <div class="theatre-details-card mt-6">
        <h2 class="theatre-name">{{ theatre.name }}</h2>
        <p><strong>📧 Email:</strong> {{ theatre.email }}</p>
        <p><strong>📍 Location:</strong> {{ theatre.location }}</p>
        <p><strong>📞 Contact:</strong> {{ theatre.contact }}</p>
        <p><strong>🎭 Screens:</strong> {{ theatre.noOfScreens }}</p>
      </div>

      <!-- Screen Buttons -->
      <div class="screen-buttons text-center mt-6">
        <h3 class="mb-4">🎬 Screens</h3>
        <div v-for="index in theatre.noOfScreens" :key="index" class="mb-3">
          <v-btn
            color="blue darken-1"
            class="ma-2"
            @click="selectedScreenIndex = index"
          >
            Screen {{ index }}
          </v-btn>

          <div v-if="selectedScreenIndex === index" class="mt-2">
            <v-btn color="primary" class="ma-1">Add</v-btn>
            <v-btn color="success" class="ma-1">Update</v-btn>
            <v-btn color="error" class="ma-1">Delete</v-btn>
          </div>
        </div>
      </div>
    </v-main>

  </v-app>
</template>

<script>
export default {
  name: "TheatreDashboard",
  data() {
    return {
      theatre: {
        name: "",
        email: "",
        password: "",
        location: "",
        contact: "",
        noOfScreens: 0,
      },
      selectedScreenIndex: null,
    };
  },
  mounted() {
    this.loadTheatreDetails();
  },
  methods: {
    async loadTheatreDetails() {
      try {
        const theatreId = this.$store.getters.gettheatreId;
        const res = await this.$store.dispatch("fetchTheatredetails", theatreId);
        if (res.success) {
          this.theatre = res.data;
        } else {
          alert("Error fetching theatre details");
        }
      } catch (error) {
        console.error("Error loading theatre:", error);
      }
    },
  },
};
</script>

<style scoped>
.bgimg {
  background-image: url(../assets/Theatrebg.jfif);
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}
.theatre-details-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  padding: 30px;
  max-width: 500px;
  margin: auto;
  text-align: center;
}
.theatre-name {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}
.screen-buttons {
  margin-top: 30px;
}
</style>
