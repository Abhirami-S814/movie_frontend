<template>
  <div>
    <div class="bgim">
      <!-- Navbar -->
      <div class="navbar">
        <div class="logo">QuickTix</div>
        <div class="navcenter">
          <v-text-field class="search" append-inner-icon="mdi mdi-magnify" variant="underlined" label="Search Movies..."
            v-model="searchQuery"></v-text-field>
          <div class="menu-icon" @click="toggleMenu">
            <span class="mdi mdi-menu"></span>
          </div>
          <ul :class="['nav-links', { 'active': isMenuOpen }]">
            <li><router-link to="/">HOME</router-link></li>
            <li><router-link to="/movies">MOVIES</router-link></li>
            <li><router-link to="/theatrelog">THEATRE</router-link></li>
            <li><router-link to="/about">ABOUT</router-link></li>
            <li><router-link to="/login">LOGIN</router-link></li>
          </ul>
          <span class="mdi mdi-account-circle-outline accicon"></span>
        </div>
      </div>

      <!-- Movies & Filters -->
      <div class="moviecontainer">
        <!-- Filters -->
        <aside class="filters">
          <h3>FILTERS</h3>

          <!-- Language Filter -->
          <div class="filter-section">
            <h4>Languages</h4>
            <div v-for="language in languages" :key="language.lang_id">
              <input type="checkbox" :id="'lang_' + language.lang_id" v-model="selectedLanguages"
                :value="language.lang_id" />
              <label :for="'lang_' + language.lang_id">&nbsp;{{ language.lang_name }}</label>
            </div>
          </div>

          <!-- Genre Filter -->
          <div class="filter-section">
            <h4>Genres</h4>
            <div v-for="genre in genres" :key="genre.genre_id">
              <input type="checkbox" :id="'genre_' + genre.genre_id" v-model="selectedGenres" :value="genre.genre_id" />
              <label :for="'genre_' + genre.genre_id">&nbsp;{{ genre.genre_name }}</label>
            </div>
          </div>
        </aside>

        <!-- Movie List -->
        <section class="products">
          <h3>LATEST MOVIES >>></h3>
          <v-container>
            <v-row>
              <v-col v-for="movie in filteredMovies" :key="movie.movieId" cols="12" sm="6" md="4" lg="3">
                <v-card class="movie-card" @click="showMovieDialog(movie)">
                  <v-img :src="movie.image" height="200px" cover></v-img>
                  <v-card-title>{{ movie.title }}</v-card-title>
                  <v-card-subtitle>
                    🎭 {{ getGenreName(movie.genre_id) }} | 🌍 {{ getLanguageName(movie.lang_id) }}
                  </v-card-subtitle>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      isMenuOpen: false,
      searchQuery: "",
      selectedLanguages: [],
      selectedGenres: [],
      isDialogOpen: false,
      selectedMovie: {},
      defaultImage: "https://via.placeholder.com/200x300?text=No+Image",
      movies: [],
      languages: [],
      genres: []
    };
  },

  computed: {
    filteredMovies() {
      return this.movies.filter((movie) =>
        (this.selectedLanguages.length === 0 || this.selectedLanguages.includes(movie.lang_id)) &&
        (this.selectedGenres.length === 0 || this.selectedGenres.includes(movie.genre_id)) &&
        (this.searchQuery === "" || movie.title.toLowerCase().includes(this.searchQuery.toLowerCase()))
      );
    },
  },

  methods: {
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },

    async fetchMovies() {
      try {
        const response = await axios.get("http://localhost:8082/api/userdetails/getallmovies");

        this.movies = response.data.map(movie => ({
          ...movie,
          lang_id: movie.language,
          genre_id: movie.genre,
          title: movie.movieName || "Unknown Title",
          image: movie.movieposter ? `data:image/jpeg;base64,${movie.movieposter}` : this.defaultImage
        }));

        console.log("Movies Fetched:", this.movies);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    },

    async fetchLanguages() {
      try {
        const response = await axios.get("http://localhost:8082/api/admindetails/getallang");
        this.languages = response.data.map(lang => ({
          lang_id: lang.langId,
          lang_name: lang.langName
        }));
      } catch (error) {
        console.error("Error fetching languages:", error);
      }
    },

    async fetchGenres() {
      try {
        const response = await axios.get("http://localhost:8082/api/admindetails/getgenre");
        this.genres = response.data.map(genre => ({
          genre_id: genre.genreId,
          genre_name: genre.genreName
        }));
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    },

    getLanguageName(langId) {
      const lang = this.languages.find(l => String(l.lang_id) === String(langId));
      return lang ? lang.lang_name : "Unknown";
    },

    getGenreName(genreId) {
      const genre = this.genres.find(g => String(g.genre_id) === String(genreId));
      return genre ? genre.genre_name : "Unknown";
    },

    showMovieDialog(movie) {
      this.selectedMovie = movie;
      this.$router.push('/moviedash')
    }
  },

  mounted() {
    this.fetchMovies();
    this.fetchLanguages();
    this.fetchGenres();
  }
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
  width: 100%;
}

.logo {
  font-size: x-large;
}

.navcenter {
  display: flex;
  align-items: center;
  gap: 20px;
}

ul {
  display: flex;
  list-style: none;
  gap: 20px;
  margin: 0;
  padding: 0;
}

li a {
  text-decoration: none;
  color: white;
  font-weight: bold;
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
}

.moviecontainer {
  display: flex;
  padding: 20px;
}

.filters {
  width: 250px;
  padding: 20px;
  background: #f4f4f4;
}

.products {
  flex: 1;
  padding: 20px;
}

.movie-card {
  transition: transform 0.3s;
}

.movie-card:hover {
  transform: scale(1.05);
}

.movie-details {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 10;
}

.bookticket {
  display: flex;
  justify-content: center;
  padding-bottom: 40px;
}

.book-btn {
  /* margin-top: 15px; */
  background: #d32f2f;
  color: white;
  font-size: 12px;
  /* Even smaller font */
  padding: 4px 8px;
  /* Smaller padding */
  border-radius: 4px;
  min-width: 100px;
  /* Prevents shrinking too much */
  cursor: pointer;
  border: none;

}

.book-btn:hover {
  background: #b71c1c;
}
</style>
