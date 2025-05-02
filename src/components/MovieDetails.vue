<template>
  <div v-if="movie" class="movie-details">
    <v-container>
      <v-row>
        <v-col cols="12" md="4">
          <v-img :src="movie.image" height="400px" contain></v-img>
        </v-col>
        <v-col cols="12" md="8">
          <h1>{{ movie.title }}</h1>
          <p><strong>Duration:</strong> {{ movie.duration }}</p>
          <p><strong>Genres:</strong> {{ getGenreName(movie.genre_id) }}</p>
          <p><strong>Languages:</strong> {{ getLanguageName(movie.lang_id) }}</p>
          <p><strong>Release Date:</strong> {{ movie.releaseDate }}</p>
          <p><strong>Description:</strong> {{ movie.description }}</p>
          <v-btn color="red" @click="bookTickets">Book Tickets</v-btn>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import axios from "axios";

export default {
  props: ["movieName"],  // ✅ Receive movieName directly as a prop

  data() {
    return {
      movie: null,
      languages: [],
      genres: [],
    };
  },

  methods: {
    async fetchMovieDetails() {
      try {
        const response = await axios.get(`http://172.20.4.88:8080/api/userdetails/searchmovie`, {
          params: { movieName: this.movieName },  
        });

        this.movie = {
          ...response.data,
          lang_id: response.data.language,
          genre_id: response.data.genre,
          image: response.data.movieposter
            ? `data:image/jpeg;base64,${response.data.movieposter}`
            : "https://via.placeholder.com/200x300?text=No+Image",
        };
      } catch (error) {
        console.error("Error fetching movie details:", error);
      }
    },
  },

  watch: {
    movieName: "fetchMovieDetails", // ✅ Re-fetch if route param changes dynamically
  },

  mounted() {
    this.fetchMovieDetails();
  },
};
</script>

