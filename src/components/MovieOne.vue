<template>
  <v-container>
    <h2 class="text-h5 mb-4">Movie: {{ movieTitle }}</h2>

    <div v-if="screenDetails.length">
      <v-card
        v-for="screen in screenDetails"
        :key="screen.screenId"
        class="mb-4"
      >
        <v-row no-gutters>
          <!-- Left Section -->
          <v-col cols="4" class="pa-4 d-flex flex-column justify-center align-center" style="background-color: #f5f5f5;">
            <v-icon size="40" color="indigo">mdi-movie-open</v-icon>
            <div class="text-subtitle-1 font-weight-bold mt-2">
              {{ screen.movieName }}
            </div>
            <div class="text-body-2">🏢 {{ screen.name }}</div>
            <div class="text-body-2">🎬 {{ screen.screenName }}</div>
            <v-btn color="secondary" class="mt-2" @click="viewLocation(screen)">
              View Location
            </v-btn>
          </v-col>

          <!-- Right Section -->
          <v-col cols="8" class="pa-4">
            <p><strong>Seat Capacity:</strong> {{ screen.seatCapacity }}</p>
            <p><strong>Start Date:</strong> {{ formatDate(screen.movStart) }}</p>
            <p><strong>End Date:</strong> {{ formatDate(screen.movEnd) }}</p>

            <p><strong>Show Times:</strong></p>
            <v-chip
              v-for="show in screen.showTimes"
              :key="show.showTimeId"
              class="ma-1"
              color="blue lighten-3"
              text-color="blue darken-4"
              small
            >
              {{ show.showStart }}
            </v-chip>

            <v-btn color="primary" class="mt-2 mr-2" @click="bookTicket(screen)">
              Book Ticket
            </v-btn>

            
          </v-col>
        </v-row>
      </v-card>
    </div>

    <v-alert type="info" v-else>
      No show details available for this movie yet.
    </v-alert>

    <!-- Location Dialog -->
    <v-dialog v-model="showMap" max-width="600px">
      <v-card>
        <v-card-title>Theatre Location</v-card-title>
        <v-card-text>
          <div id="map" style="height: 400px; width: 100%;"></div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="showMap = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import axios from 'axios';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default {
  name: 'MovieDetails',
  data() {
    return {
      screenDetails: [],
      movieTitle: '',
      showMap: false,
      map: null,
      currentLatLng: null,
    };
  },
  methods: {
    async fetchMovieDetails(movieId) {
      try {
        const response = await axios.get('http://localhost:8082/api/userdetails/getmovietheatre', {
          params: { movieId },
        });
        this.screenDetails = response.data;

        this.movieTitle = this.screenDetails.length
          ? this.screenDetails[0].movieName
          : 'No data found';
      } catch (error) {
        console.error('Error fetching movie details:', error);
      }
    },
    formatDate(dateStr) {
      return dateStr ? new Date(dateStr).toLocaleDateString() : 'N/A';
    },
    bookTicket(screen) {
      const userData = JSON.parse(sessionStorage.getItem("userlogin"));
      if (!userData) {
        alert("User not logged in");
        return;
      }

      this.$router.push({
        name: 'BookTicket',
        params: {
          screenId: screen.screenId,
          movieId: screen.movieId,
          theatreId: screen.theatreId,
          userId: userData.userId
        }
      });
    },
    viewLocation(screen) {
      if (!screen.latitude || !screen.longitude) {
        alert("Location not available for this theatre.");
        return;
      }

      this.currentLatLng = [screen.latitude, screen.longitude];
      this.showMap = true;

      this.$nextTick(() => {
        if (this.map) {
          this.map.remove();
        }

        this.map = L.map('map').setView(this.currentLatLng, 15);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(this.map);

        L.marker(this.currentLatLng).addTo(this.map)
          .bindPopup(screen.name || 'Theatre Location')
          .openPopup();
      });
    }
  },
  mounted() {
    const movieId = this.$route.params.movieId;
    if (movieId) {
      this.fetchMovieDetails(movieId);
    }
  }
};
</script>

<style scoped>
.v-card {
  border: 1px solid #ccc;
  border-radius: 12px;
}
#map {
  border-radius: 8px;
}
</style>
