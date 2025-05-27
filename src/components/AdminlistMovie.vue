<template>
  <v-container>
    <h2 class="my-4">Added Movies</h2>

    <v-row>
      <v-col
        v-for="movie in movies"
        :key="movie.movieId"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <v-card class="movie-card">
          <v-img :src="movie.image" height="200px" cover></v-img>
          <v-card-title>{{ movie.title }}</v-card-title>
          <v-card-subtitle>
            🎭 {{ getGenreName(movie.genre_id) }} |
            🌍 {{ getLanguageName(movie.lang_id) }}
          </v-card-subtitle>
          <v-card-actions>
            <v-btn color="primary" @click="openUpdateDialog(movie)" small>Update</v-btn>
            <v-btn color="error" @click="deleteMovie(movie.movieId)" small>Delete</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Update Dialog -->
    <v-dialog v-model="isUpdateDialogOpen" max-width="600px">
      <v-card>
        <v-card-title class="headline">Update Movie</v-card-title>
        <v-card-text>
          <v-select
            v-model="updateMode"
            :items="['Name & Description', 'Language & Genre']"
            label="Update Type"
          />

          <template v-if="updateMode === 'Name & Description'">
            <v-text-field v-model="editedMovie.title" label="Movie Title" />
            <v-textarea v-model="editedMovie.description" label="Description" />
          </template>

          <template v-else-if="updateMode === 'Language & Genre'">
            <v-select
              v-model="editedMovie.genre_id"
              :items="genres"
              item-text="genre_name"
              item-value="genre_id"
              label="Genre"
            />
            <v-select
              v-model="editedMovie.lang_id"
              :items="languages"
              item-text="lang_name"
              item-value="lang_id"
              label="Language"
            />
          </template>
        </v-card-text>

        <v-card-actions>
          <v-btn color="success" @click="updateMovie">Save</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="grey" @click="isUpdateDialogOpen = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import axios from "axios";

export default {
  name: "AddedMovies",

  data() {
    return {
      movies: [],
      languages: [],
      genres: [],
      defaultImage: "https://via.placeholder.com/200x300?text=No+Image",
      isUpdateDialogOpen: false,
      editedMovie: {
        movieId: null,
        title: "",
        description: "",
        lang_id: null,
        genre_id: null,
      },
      updateMode: "Name & Description",
    };
  },

  methods: {
    async fetchMovies() {
      try {
        const response = await axios.get("http://localhost:8082/api/userdetails/getallmovies");
        this.movies = response.data.map((movie) => ({
          movieId: movie.movieId,
          title: movie.movieName || "Untitled",
          description: movie.description || "",
          lang_id: movie.language,
          genre_id: movie.genre,
          image: movie.movieposter
            ? `data:image/jpeg;base64,${movie.movieposter}`
            : this.defaultImage,
          releaseDate: movie.releaseDate,
          duration: movie.duration || "",
        }));
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    },

    async fetchLanguages() {
      try {
        const response = await axios.get("http://localhost:8082/api/theatredetails/getallang");
        this.languages = response.data.map((lang) => ({
          lang_id: lang.langId,
          lang_name: lang.langName,
        }));
      } catch (error) {
        console.error("Error fetching languages:", error);
      }
    },

    async fetchGenres() {
      try {
        const response = await axios.get("http://localhost:8082/api/theatredetails/getgenre");
        this.genres = response.data.map((genre) => ({
          genre_id: genre.genreId,
          genre_name: genre.genreName,
        }));
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    },

    getLanguageName(langId) {
      const lang = this.languages.find((l) => String(l.lang_id) === String(langId));
      return lang ? lang.lang_name : "Unknown";
    },

    getGenreName(genreId) {
      const genre = this.genres.find((g) => String(g.genre_id) === String(genreId));
      return genre ? genre.genre_name : "Unknown";
    },

    async deleteMovie(movieId) {
      if (confirm("Are you sure you want to delete this movie?")) {
        try {
          await axios.delete(`http://localhost:8082/api/admindetails/deletemovie?movieId=${movieId}`);
          this.fetchMovies();
        } catch (error) {
          console.error("Error deleting movie:", error);
        }
      }
    },

    openUpdateDialog(movie) {
      this.editedMovie = {
        movieId: movie.movieId,
        title: movie.title,
        description: movie.description,
        lang_id: movie.lang_id,
        genre_id: movie.genre_id,
      };
      this.updateMode = "Name & Description";
      this.isUpdateDialogOpen = true;
    },

    async updateMovie() {
      try {
        if (this.updateMode === "Name & Description") {
          await axios.put(
            "http://localhost:8082/api/admindetails/updatemovieNameDes",
            null,
            {
              params: {
                movieId: this.editedMovie.movieId,
                movieName: this.editedMovie.title,
                description: this.editedMovie.description,
              },
            }
          );
        } else if (this.updateMode === "Language & Genre") {
          await axios.put(
            "http://localhost:8082/api/admindetails/updatemovielangenre",
            null,
            {
              params: {
                movieId: this.editedMovie.movieId,
                language: this.editedMovie.lang_id,
                genre: this.editedMovie.genre_id,
              },
            }
          );
        }

        this.isUpdateDialogOpen = false;
        this.fetchMovies();
      } catch (error) {
        console.error("Update failed:", error);
        alert("Update failed. Please check network or backend log.");
      }
    },
  },

  mounted() {
    this.fetchMovies();
    this.fetchLanguages();
    this.fetchGenres();
  },
};
</script>

<style scoped>
.movie-card {
  margin-bottom: 20px;
  transition: transform 0.3s;
}
.movie-card:hover {
  transform: scale(1.03);
}
</style>
