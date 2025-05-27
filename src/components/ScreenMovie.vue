<!-- <template>
  <div class="p-6">
    <h2 class="text-xl font-bold mb-4">{{ theatreName }}</h2>
    <p><strong>🎬 Screen:</strong> {{ screenName }}</p>
    <p><strong>🎞️ Movie:</strong> {{ movieName }} (ID: {{ movieId }})</p>
    <p><strong>💺 Seats:</strong> {{ seatCapacity }}</p>

    <v-btn color="primary" class="mt-4" @click="goToShowDates">Manage Show Dates</v-btn>
  </div>
</template>

<script>
export default {
  props: {
    theatreName: String,
    screenName: String,
    movieId: Number,
    movieName: String,
    seatCapacity: Number,
  },
  methods: {
    goToShowDates() {
      this.$router.push({
        name: 'ShowDates',
        params: {
          screenName: this.screenName,
          movieId: this.movieId,
        },
      });
    },
  },
};
</script> -->

<template>
  <v-app>
    <v-navigation-drawer app permanent color="deep-purple accent-4" dark>
      <v-list dense>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="text-h6 text-white">🎭 {{ theatre.name }}</v-list-item-title>
            <v-list-item-subtitle class="text-white">{{ theatre.location }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-divider class="my-2" color="white" />

        <v-list-item link @click="selectedSection = 'profile'">
          <v-list-item-icon><v-icon>mdi-account</v-icon></v-list-item-icon>
          <v-list-item-title>Profile</v-list-item-title>
        </v-list-item>

        <v-list-item link @click="selectedSection = 'screens'">
          <v-list-item-icon><v-icon>mdi-movie-open</v-icon></v-list-item-icon>
          <v-list-item-title>Screens</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main class="main-background">
      <v-container class="pa-6">
        <!-- Profile Section -->
        <div v-if="selectedSection === 'profile'">
          <v-card class="mb-8" elevation="3" max-width="700" mx-auto>
            <v-card-text>
              <p><strong>📧 Email:</strong> {{ theatre.email }}</p>
              <p><strong>📍 Location:</strong> {{ theatre.location }}</p>
              <p><strong>📞 Contact:</strong> {{ theatre.contact }}</p>
              <p><strong>🎬 Screens:</strong> {{ theatre.noOfScreens }}</p>
            </v-card-text>
          </v-card>
        </div>

        <!-- Screens Section -->
        <div v-if="selectedSection === 'screens'">
          <div class="mb-6">
            <h3 class="text-h6 font-weight-bold mb-4">Add Screens</h3>
            <v-row class="d-flex flex-wrap" style="gap: 12px;">
              <v-btn
                v-for="(screen, index) in theatre.noOfScreens"
                :key="'screen-' + index"
                color="primary"
                :disabled="isScreenAdded(index)"
                @click="openScreenDialog(index)"
              >
                {{ isScreenAdded(index) ? '✔️ Screen ' + (index + 1) + ' Added' : 'Add Screen ' + (index + 1) }}
              </v-btn>
              <v-btn color="secondary" @click="addNewScreenInput">➕ Add New Screen</v-btn>
            </v-row>
          </div>

          <v-dialog v-model="showAddScreenDialog" max-width="500">
            <v-card>
              <v-card-title>Add Screen {{ selectedScreenIndex + 1 }}</v-card-title>
              <v-card-text>
                <v-text-field v-model="dynamicScreens[selectedScreenIndex].screenName" label="Screen Name" dense outlined />
                <v-text-field v-model.number="dynamicScreens[selectedScreenIndex].seatCapacity" label="Seat Capacity" type="number" dense outlined />
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn text @click="showAddScreenDialog = false">Cancel</v-btn>
                <v-btn color="primary" @click="submitScreenDetails">Save</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <div>
            <h3 class="text-h6 font-weight-bold mb-4">Existing Screens</h3>
            <v-row dense>
              <v-col v-for="(screen, index) in screens" :key="screen.screenId" cols="12" sm="6" md="4" lg="3">
                <v-card class="pa-3" elevation="2">
                  <v-card-title class="text-h6">Screen {{ index + 1 }}</v-card-title>
                  <v-card-text>
                    <p><strong>Name:</strong> {{ screen.screenName }}</p>
                    <p><strong>Seats:</strong> {{ screen.seatCapacity }}</p>
                    <p v-if="screen.movieName"><strong>🎞️ Current Movie:</strong> {{ screen.movieName }}</p>
                    <v-select
                      v-model="selectedMovies[screen.screenId]"
                      :items="movies"
                      item-title="movieName"
                      item-value="movieId"
                      label="Select Movie"
                      dense outlined
                    />
                  </v-card-text>
                  <v-card-actions class="d-flex flex-wrap" style="gap: 8px; justify-content: space-between;">
                    <v-btn color="primary" @click="assignMovieToScreen(screen)">🎬 Assign Movie</v-btn>
                    <v-btn color="error" text @click="deleteScreen(screen, index)">🗑️ Delete</v-btn>
                    <v-btn color="info" text @click="navigateToShowDates(screen.screenId)">📅 Manage Shows</v-btn>
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>
          </div>
        </div>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import axios from 'axios';
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      selectedSection: 'screens',
      theatre: { name: '', email: '', location: '', contact: '', noOfScreens: 0 },
      showAddScreenDialog: false,
      selectedScreenIndex: 0,
      dynamicScreens: [],
      screens: [],
      movies: [],
      selectedMovies: {},
    };
  },
  computed: {
    ...mapGetters(['gettheatreId']),
  },
  methods: {
    async loadTheatreDetails() {
      const res = await this.$store.dispatch('fetchTheatredetails', this.gettheatreId);
      if (res.success) {
        this.theatre = res.data[0];
        this.dynamicScreens = Array(this.theatre.noOfScreens).fill().map(() => ({ screenName: '', seatCapacity: 100 }));
      }
    },
    async fetchScreens() {
      const res = await axios.get('http://localhost:8082/api/theatredetails/getscreens', {
        params: { theatreId: this.gettheatreId },
      });
      this.screens = res.data;
      res.data.forEach(screen => {
        if (screen.movieId) {
          this.selectedMovies[screen.screenId] = screen.movieId;
        }
      });
    },
    async fetchMovies() {
      const res = await axios.get('http://localhost:8082/api/userdetails/getallmovies');
      this.movies = res.data;
    },
    isScreenAdded(index) {
      return this.screens.length > index;
    },
    openScreenDialog(index) {
      this.selectedScreenIndex = index;
      this.showAddScreenDialog = true;
    },
    async addNewScreenInput() {
      const newCount = this.theatre.noOfScreens + 1;
      const res = await axios.put('http://localhost:8082/api/theatredetails/updatescreencount', null, {
        params: { theatreId: this.gettheatreId, count: newCount },
      });
      if (res.status === 200) {
        this.theatre.noOfScreens = newCount;
        this.dynamicScreens.push({ screenName: '', seatCapacity: 100 });
      }
    },
    async submitScreenDetails() {
      const screen = this.dynamicScreens[this.selectedScreenIndex];
      if (!screen.screenName || !screen.seatCapacity) {
        alert('Please fill in all fields');
        return;
      }
      const res = await axios.post(`http://localhost:8082/api/theatredetails/addscreenmov/${this.gettheatreId}`, screen);
      if (res.status === 200) {
        alert(`Screen ${this.selectedScreenIndex + 1} added successfully!`);
        this.showAddScreenDialog = false;
        await this.fetchScreens();
      }
    },
    async assignMovieToScreen(screen) {
      const movieId = this.selectedMovies[screen.screenId];
      if (!movieId) {
        alert('Please select a movie');
        return;
      }

      const newMovie = this.movies.find(m => m.movieId === movieId);

      if (screen.movieId === movieId) {
        alert(`🎬 Movie "${screen.movieName}" is already assigned to this screen.`);
        return;
      }

      if (screen.movieId && screen.movieId !== movieId) {
        const confirmReplace = confirm(
          `Screen "${screen.screenName}" already has the movie "${screen.movieName}".\nDo you want to replace it with "${newMovie?.movieName}"?`
        );
        if (!confirmReplace) return;
      }

      const res = await axios.post('http://localhost:8082/api/theatredetails/addmovie', null, {
        params: { screenId: screen.screenId, movieId }
      });

      if (res.status === 200) {
        alert(`✅ Movie "${newMovie.movieName}" assigned to "${screen.screenName}" successfully!`);
        await this.fetchScreens();
      } else {
        alert('❌ Failed to assign movie');
      }
    },
    async deleteScreen(screen, index) {
      const confirmDelete = confirm(`Are you sure you want to delete Screen ${index + 1}?`);
      if (!confirmDelete) return;

      const res = await axios.delete('http://localhost:8082/api/theatredetails/deletescreen', {
        params: { theatreId: this.gettheatreId, screenId: screen.screenId },
      });

      if (res.status === 200) {
        alert(`Screen ${index + 1} deleted successfully!`);
        this.screens.splice(index, 1);
        this.dynamicScreens.splice(index, 1);
        const newCount = this.theatre.noOfScreens - 1;
        this.theatre.noOfScreens = newCount;
        await axios.put('http://localhost:8082/api/theatredetails/updatescreencount', null, {
          params: { theatreId: this.gettheatreId, count: newCount },
        });
      }
    },
    navigateToShowDates(screenId) {
      this.$router.push({ name: 'ShowDates', query: { screenId } });
    }
  },
  mounted() {
    this.loadTheatreDetails();
    this.fetchScreens();
    this.fetchMovies();
  }
};
</script>

<style scoped>
.main-background {
  background: linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%);
  min-height: 100vh;
  padding-left: 260px;
}
.v-list-item-title,
.v-list-item-subtitle {
  font-weight: 500;
}
</style>

