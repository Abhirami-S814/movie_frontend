<template>
  <v-container class="movie-detail-container py-10">
    <v-row justify="center">
      <v-col cols="12" md="10" lg="8">
        <v-card v-if="movie" class="pa-5 elevation-4">
          <v-row>
            <v-col cols="12" sm="5">
              <v-img
                :src="movie.image"
                aspect-ratio="2/3"
                class="movie-poster"
                :lazy-src="defaultImage"
              />
            </v-col>
            <v-col cols="12" sm="7">
              <h2 class="text-h4 font-weight-bold">{{ movie.movieName }}</h2>
              <div class="my-2">
                <p><strong>🎭 Genre:</strong> {{ getGenreName(movie.genre) }}</p>
                <p><strong>🌍 Language:</strong> {{ getLanguageName(movie.language) }}</p>
                <p><strong>⏳ Duration:</strong> {{ movie.duration }}</p>
                <p><strong>📅 Release Date:</strong> {{ movie.releaseDate }}</p>
              </div>
              <p class="mt-4"><strong>📝 Description:</strong></p>
              <p>{{ movie.description }}</p>

              <v-btn color="error" class="mt-4" @click="bookTicket">🎟️ Book Now</v-btn>
            </v-col>
          </v-row>
        </v-card>
        <v-alert v-else type="error" class="mt-4">Movie not found or loading failed.</v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      movie: null,
      defaultImage: "https://via.placeholder.com/200x300?text=No+Image",
      languages: [],
      genres: [],
    };
  },
  methods: {
    async fetchMovie() {
      const movieId = this.$route.params.id;
      try {
        const response = await axios.get(`http://localhost:8082/api/userdetails/getmovie/${movieId}`);
        const data = response.data;

        this.movie = {
          ...data,
          image: data.movieposter
            ? `data:image/jpeg;base64,${data.movieposter}`
            : this.defaultImage,
        };
      } catch (error) {
        console.error("Error fetching movie:", error);
      }
    },
    async fetchLanguages() {
      try {
        const res = await axios.get("http://localhost:8082/api/admindetails/getallang");
        this.languages = res.data;
      } catch (err) {
        console.error("Error fetching languages", err);
      }
    },
    async fetchGenres() {
      try {
        const res = await axios.get("http://localhost:8082/api/admindetails/getgenre");
        this.genres = res.data;
      } catch (err) {
        console.error("Error fetching genres", err);
      }
    },
    getLanguageName(id) {
      const lang = this.languages.find(l => l.langId == id);
      return lang ? lang.langName : "Unknown";
    },
    getGenreName(id) {
      const genre = this.genres.find(g => g.genreId == id);
      return genre ? genre.genreName : "Unknown";
    },
    bookTicket() {
      // Navigate to booking page or show booking dialog
      this.$router.push(`/book/${this.movie.movieId}`);
    },
  },
  mounted() {
    this.fetchMovie();
    this.fetchLanguages();
    this.fetchGenres();
  },
};
</script>

<style scoped>
.movie-poster {
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.movie-detail-container {
  background-color: #f9f9f9;
  min-height: 100vh;
}

.v-card {
  border-radius: 12px;
}
</style>
