<template>
  <v-app>
    <!-- Sidebar -->
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

        <v-list-item link @click="selectedSection = 'manageShows'">
          <v-list-item-icon><v-icon>mdi-movie-open</v-icon></v-list-item-icon>
          <v-list-item-title>Manage Shows</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- Main Content -->
    <v-main class="main-background">
      <v-container class="pa-6">
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
              <v-col v-for="(screen, index) in screens" :key="screen.screenId || index" cols="12" sm="6" md="4" lg="3">
                <v-card class="pa-3" elevation="2">
                  <v-card-title class="text-h6">Screen {{ index + 1 }}</v-card-title>
                  <v-card-text>
                    <p><strong>Name:</strong> {{ screen.screenName }}</p>
                    <p><strong>Seats:</strong> {{ screen.seatCapacity }}</p>
                    <v-select
                      v-model="selectedMovies[screen.screenId]"
                      :items="movies"
                      item-title="movieName"
                      item-value="movieId"
                      label="Select Movie"
                      dense
                      outlined
                    />
                  </v-card-text>
                  

                  <v-card-actions class="d-flex flex-wrap" style="gap: 8px; justify-content: space-between;">
                    <v-btn color="primary" @click="assignMovieToScreen(screen.screenId)">🎬 Assign Movie</v-btn>
                    <v-btn color="error" text @click="deleteScreen(screen.screenId, index)">🗑️ Delete</v-btn>
                    <v-btn color="info" text @click="navigateToShowDates(screen.screenId)">📅 Manage Shows</v-btn>
                  </v-card-actions>
                </v-card>
                
              </v-col>
            </v-row>
            <v-card v-for="screen in screens" :key="screen.screenId">
  <v-card-title>{{ screen.screenName }}</v-card-title>
  <v-card-subtitle>Seat Capacity: {{ screen.seatCapacity }}</v-card-subtitle>

  
</v-card>

          </div>
        </div>
        <!-- Manage Shows Section -->
        <div v-if="selectedSection === 'manageShows'">
          <v-card class="mb-6 pa-4" elevation="2" max-width="700" mx-auto>
            <v-card-title>🎟️ Set Show Dates</v-card-title>
            <v-card-text>
              <v-select
                v-model="selectedScreenId"
                :items="screens"
                item-title="screenName"
                item-value="screenId"
                label="Select Screen"
                dense outlined
              />
              <v-row class="mt-3">
                <v-col cols="6">
                  <v-text-field v-model="showStartDate" type="date" label="Start Date" dense outlined />
                </v-col>
                <v-col cols="6">
                  <v-text-field v-model="showEndDate" type="date" label="End Date" dense outlined />
                </v-col>
              </v-row>
              <v-btn color="primary" class="mt-4" @click="submitShowDates">📅 Save Show Dates</v-btn>
            </v-card-text>
          </v-card>

          <v-card class="pa-4" elevation="2" max-width="700" mx-auto>
            <v-card-title>⏱️ Add Show Times</v-card-title>
            <v-card-text>
              <div
                v-for="(time, index) in showTimes"
                :key="'time-' + index"
                class="d-flex align-center mb-3"
                style="gap: 12px;"
              >
                <v-text-field
                  v-model="time.showStart"
                  label="Start Time (HH:MM)"
                  type="time"
                  dense outlined
                />
                <v-text-field
                  v-model="time.showEnd"
                  label="End Time (HH:MM)"
                  type="time"
                  dense outlined
                />
                <v-btn icon color="error" @click="removeShowTime(index)">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </div>

              <v-btn color="secondary" @click="addShowTime">➕ Add Show Time</v-btn>

              <v-btn color="primary" class="mt-4" @click="submitShowTimes">💾 Save Show Times</v-btn>
            </v-card-text>
          </v-card>
          
        </div>
      </v-container>
    </v-main>
  </v-app>
  
</template>

<script setup>
import { ref, onMounted } from 'vue';
// import { useRouter } from 'vue-router';
import axios from 'axios';
import { useStore } from 'vuex';

const store = useStore();
// const router = useRouter();

const selectedSection = ref('screens');
const theatre = ref({ name: '', email: '', location: '', contact: '', noOfScreens: 0 });
const showAddScreenDialog = ref(false);
const selectedScreenIndex = ref(0);
const dynamicScreens = ref([]);
const screens = ref([]);
const movies = ref([]);
const selectedMovies = ref({});

const selectedScreenId = ref(null);
const showStartDate = ref('');
const showEndDate = ref('');
const showTimes = ref([{ showStart: '', showEnd: '' }]);


const loadTheatreDetails = async () => {
  const theatreId = store.getters.gettheatreId;
  const res = await store.dispatch('fetchTheatredetails', theatreId);
  if (res.success) {
    theatre.value = res.data[0];
    dynamicScreens.value = Array(theatre.value.noOfScreens).fill().map(() => ({ screenName: '', seatCapacity: 100 }));
  }
};

const fetchScreens = async () => {
  const theatreId = store.getters.gettheatreId;
  const res = await axios.get('http://localhost:8082/api/theatredetails/getscreens', {
    params: { theatreId },
  });
  screens.value = res.data;

  // Pre-fill selectedMovies with movieId if already assigned
  const selected = {};
  res.data.forEach(screen => {
    if (screen.movieId) {
      selected[screen.screenId] = screen.movieId;
    }
  });
  selectedMovies.value = selected;
};

const fetchMovies = async () => {
  const res = await axios.get('http://localhost:8082/api/userdetails/getallmovies');
  movies.value = res.data;
};

const isScreenAdded = (index) => screens.value.length > index;

const openScreenDialog = (index) => {
  selectedScreenIndex.value = index;
  showAddScreenDialog.value = true;
};

const addNewScreenInput = async () => {
  const theatreId = store.getters.gettheatreId;
  const newCount = theatre.value.noOfScreens + 1;
  const res = await axios.put('http://localhost:8082/api/theatredetails/updatescreencount', null, {
    params: { theatreId, count: newCount },
  });
  if (res.status === 200) {
    theatre.value.noOfScreens = newCount;
    dynamicScreens.value.push({ screenName: '', seatCapacity: 100 });
  }
};

const submitScreenDetails = async () => {
  const screen = dynamicScreens.value[selectedScreenIndex.value];
  if (!screen.screenName || !screen.seatCapacity) {
    alert('Please fill in all fields');
    return;
  }
  const theatreId = store.getters.gettheatreId;
  const res = await axios.post(`http://localhost:8082/api/theatredetails/addscreenmov/${theatreId}`, screen);
  if (res.status === 200) {
    alert(`Screen ${selectedScreenIndex.value + 1} added successfully!`);
    showAddScreenDialog.value = false;
    await fetchScreens();
  }
};



const assignMovieToScreen = async (screenId) => {
  const selectedMovieId = selectedMovies.value[screenId];
  if (!selectedMovieId) {
    alert('Please select a movie');
    return;
  }

  const screen = screens.value.find(s => s.screenId === screenId);
  if (screen?.movieId && screen.movieId !== selectedMovieId) {
    const confirmReplace = confirm('This screen already has a movie assigned. Do you want to replace it?');
    if (!confirmReplace) return;
  }

  const res = await axios.post('http://localhost:8082/api/theatredetails/addmovie', null, {
    params: { screenId, movieId: selectedMovieId }
  });

  if (res.status === 200) {
    alert('Movie assigned successfully!');
    await fetchScreens();
  } else {
    alert('Failed to assign movie');
  }
};

const deleteScreen = async (screenId, index) => {
  const theatreId = store.getters.gettheatreId;
  const confirmDelete = confirm(`Are you sure you want to delete Screen ${index + 1}?`);
  if (!confirmDelete) return;

  const res = await axios.delete('http://localhost:8082/api/theatredetails/deletescreen', {
    params: { theatreId, screenId },
  });

  if (res.status === 200) {
    alert(`Screen ${index + 1} deleted successfully!`);
    screens.value.splice(index, 1);
    dynamicScreens.value.splice(index, 1);
    const newCount = theatre.value.noOfScreens - 1;
    theatre.value.noOfScreens = newCount;
    await axios.put('http://localhost:8082/api/theatredetails/updatescreencount', null, {
      params: { theatreId, count: newCount },
    });
  }
};

const navigateToShowDates = (screenId) => {
  selectedSection.value='manageShows';
  selectedScreenId.value=screenId;
  selectedMovies.value=movies;
};

// Manage Shows
const addShowTime = () => showTimes.value.push('');
const removeShowTime = (index) => showTimes.value.splice(index, 1);

const submitShowDates = async () => {
  if (!selectedScreenId.value || !showStartDate.value || !showEndDate.value) {
    alert('Please fill all fields');
    return;
  }

  const selectedScreen = screens.value.find(
    (screen) => screen.screenId === selectedScreenId.value
  );

  if (!selectedScreen || !selectedScreen.movieId) {
    alert('No movie assigned to selected screen');
    return;
  }

  const payload = {
    screenId: selectedScreen.screenId,
    theatreId: selectedScreen.theatreId,
    movieId: selectedScreen.movieId, // ✅ Added
    movStart: showStartDate.value,
    movEnd: showEndDate.value,
  };

  try {
    const res = await axios.post(
      'http://localhost:8082/api/theatredetails/addshowdates',
      payload
    );
    if (res.status === 200) {
      alert('Show dates saved!');
    }
  } catch (error) {
    console.error(error);
    alert('Error saving show dates');
  }
};


const submitShowTimes = async () => {
  const theatreId = store.getters.gettheatreId;

  if (!selectedScreenId.value || showTimes.value.length === 0) {
    alert('Please select a screen and add at least one show time.');
    return;
  }

  for (const time of showTimes.value) {
    if (!time.showStart || !time.showEnd) {
      alert('Please fill both start and end time for all entries.');
      return;
    }

    const payload = {
      theatreId,
      screenId: selectedScreenId.value,
      showStart: time.showStart,
      showEnd: time.showEnd,
    };

    try {
      await axios.post('http://localhost:8082/api/theatredetails/addshowTime', payload);
    } catch (err) {
      console.error(err);
      alert('Error adding show time');
      return;
    }
  }

  alert('All show times saved successfully!');
  showTimes.value = [{ showStart: '', showEnd: '' }];
};


onMounted(async () => {
  await loadTheatreDetails();
  await fetchMovies();
  await fetchScreens();
});
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
