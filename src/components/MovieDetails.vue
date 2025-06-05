<template>
  <v-container>
    <h2 class="text-h5 mb-4">Movie: {{ movieTitle }}</h2>

    <div v-if="screenDetails.length">
      <v-card v-for="screen in screenDetails" :key="screen.screenId" class="mb-4">
        <v-row no-gutters>
          <!-- Left Section: Movie & Theatre Info -->
          <v-col
            cols="4"
            class="pa-4 d-flex flex-column justify-center align-center"
            style="background-color: #f5f5f5;"
          >
            <v-icon size="40" color="indigo">mdi-movie-open</v-icon>
            <div class="text-subtitle-1 font-weight-bold mt-2">{{ screen.movieName }}</div>
            <div class="text-body-2">🏢 {{ screen.name }}</div>
            <div class="text-body-2">🎬 {{ screen.screenName }}</div>
          </v-col>

          <!-- Right Section: Show Details -->
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

            <v-btn color="primary" class="mt-2" @click="bookTicket(screen)">
              Book Ticket
            </v-btn>
          </v-col>
        </v-row>
      </v-card>
    </div>

    <v-alert type="info" v-else>No show details available for this movie yet.</v-alert>
  </v-container>
</template>

<script>
import axios from 'axios';

export default {
  name: 'MovieDetails',
  data() {
    return {
      screenDetails: [],
      movieTitle: '',
    };
  },
  methods: {
    async fetchMovieDetails(movieId) {
      try {
        const response = await axios.get('http://localhost:8082/api/userdetails/getmovietheatre', {
          params: { movieId },
        });
        this.screenDetails = response.data || [];
        this.movieTitle = this.screenDetails.length ? this.screenDetails[0].movieName : 'No data found';
      } catch (error) {
        console.error('Error fetching movie details:', error);
      }
    },
    formatDate(dateStr) {
      return dateStr ? new Date(dateStr).toLocaleDateString() : 'N/A';
    },
    bookTicket(screen) {
      // Navigate to BookTicket.vue, passing required data via route params or query
      this.$router.push({
        name: 'BookTicket',
        params: {
          movieId: screen.movieId,
          movieName: screen.movieName,
          theatreId: screen.theatreId || screen.theatreId || screen.theatreId, // adjust if needed
          theatreName: screen.name,
          screenId: screen.screenId,
          screenName: screen.screenName,
          seatCapacity: screen.seatCapacity,
          movStart: screen.movStart,
          movEnd: screen.movEnd,
          showTimes: JSON.stringify(screen.showTimes), // stringify for passing array
        },
      });
    },
  },
  mounted() {
    const movieId = this.$route.params.movieId;
    if (movieId) {
      this.fetchMovieDetails(movieId);
    } else {
      console.warn('No movieId found in route params');
    }
  },
};
</script>

<style scoped>
.v-card {
  border: 1px solid #ccc;
  border-radius: 12px;
}
</style>
