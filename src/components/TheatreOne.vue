<template>
  <v-app>
    <!-- Sidebar -->
    <v-navigation-drawer app permanent color="deep-purple accent-4" dark>
      <v-list dense>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="text-h6 text-white"
              >🎭 {{ theatre.name }}</v-list-item-title
            >
            <v-list-item-subtitle class="text-white">{{
              theatre.location
            }}</v-list-item-subtitle>
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

        <v-list-item link @click="selectedSection = 'ticketCategory'">
          <v-list-item-icon><v-icon>mdi-ticket</v-icon></v-list-item-icon>
          <v-list-item-title>Ticket Category</v-list-item-title>
        </v-list-item>

        <v-list-item link @click="selectedSection = 'theatreTax'">
          <v-list-item-icon
            ><v-icon>mdi-cash-multiple</v-icon></v-list-item-icon
          >
          <v-list-item-title>Theatre Tax</v-list-item-title>
        </v-list-item>

        <v-list-item link @click="selectedSection = 'theatreShows'">
          <v-list-item-icon><v-icon>mdi-movie-open</v-icon></v-list-item-icon>
          <v-list-item-title> Theatre Shows</v-list-item-title>
        </v-list-item>
      </v-list>

      <v-list-item
        @click="selectedSection = 'theatreShowsList'"
        :class="{ 'active-section': selectedSection === 'theatreShowsList' }"
      >
        <v-list-item-title>Theatre ShowsDates</v-list-item-title>
      </v-list-item>
    </v-navigation-drawer>

    <!-- Main Content -->
    <v-main class="main-background">
      <v-container class="pa-6">
        <div v-if="selectedSection === 'profile'" class="profile-section">
          <v-card class="profile-card" elevation="3" max-width="700" mx-auto>
            <v-card-text>
              <h2 class="theatre-name">{{ theatre.name }}</h2>
              <p><strong>📧 Email:</strong> {{ theatre.email }}</p>
              <p><strong>📞 Contact:</strong> {{ theatre.contact }}</p>
              <p><strong>🎬 Screens:</strong> {{ theatre.noOfScreens }}</p>
            </v-card-text>
          </v-card>
        </div>

        <div v-if="selectedSection === 'screens'">
          <div class="mb-6">
            <h3 class="text-h6 font-weight-bold mb-4">Add Screens</h3>
            <v-row class="d-flex flex-wrap" style="gap: 12px">
              <v-btn
                v-for="(screen, index) in theatre.noOfScreens"
                :key="'screen-' + index"
                color="primary"
                :disabled="isScreenAdded(index)"
                @click="openScreenDialog(index)"
              >
                {{
                  isScreenAdded(index) ? "✔️ Screen " + " Added" : "Add Screen "
                }}
              </v-btn>
              <v-btn color="secondary" @click="addNewScreenInput"
                >➕ Add New Screen</v-btn
              >
            </v-row>
          </div>

          <v-dialog v-model="showAddScreenDialog" max-width="500">
            <v-card>
              <v-card-title>Add Screen</v-card-title>
              <v-card-text>
                <v-text-field
                  v-model="dynamicScreens[selectedScreenIndex].screenName"
                  label="Screen Name"
                  dense
                  outlined
                />
                <v-text-field
                  v-model.number="
                    dynamicScreens[selectedScreenIndex].seatCapacity
                  "
                  label="Seat Capacity"
                  type="number"
                  dense
                  outlined
                />
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
              <v-col
                v-for="(screen, index) in screens"
                :key="screen.screenId || index"
                cols="12"
                sm="12"
                md="6"
                lg="4"
              >
                <v-card class="pa-4" elevation="2" max-width="350">
                  <v-card-title class="text-h6"
                    >Screen : {{ screen.screenName }}</v-card-title
                  >
                  <v-card-text>
                    <p><strong>Seats:</strong> {{ screen.seatCapacity }}</p>
                    <p>
                      <strong>Assigned Movie:</strong>
                      {{ screen.movieName || "Not Assigned" }}
                    </p>

                    <v-select
                      v-model="selectedMovies[screen.screenId]"
                      :items="movies"
                      item-title="movieName"
                      item-value="movieId"
                      :label="
                        getMovieName(selectedMovies[screen.screenId]) ||
                        'Select Movie'
                      "
                      dense
                      outlined
                      :disabled="
                        screen.movieName &&
                        updatingMovieScreenId !== screen.screenId
                      "
                    />
                  </v-card-text>

                  <v-card-actions
                    class="d-flex flex-wrap"
                    style="gap: 8px; justify-content: space-between"
                  >
                    <v-btn
                      color="primary"
                      @click="assignMovieToScreen(screen.screenId)"
                      >🎬 Assign Movie</v-btn
                    >
                    <v-btn
                      color="error"
                      text
                      @click="deleteAssignedMovie(screen.screenId)"
                      >❌ Delete Movie</v-btn
                    >
                    <v-btn
                      color="success"
                      text
                      @click="enableMovieUpdate(screen.screenId)"
                      :disabled="updatingMovieScreenId === screen.screenId"
                    >
                      ✏️ Update Movie
                    </v-btn>
                    <v-btn
                      color="primary"
                      text
                      @click="updateAssignedMovie(screen.screenId)"
                      :disabled="updatingMovieScreenId !== screen.screenId"
                    >
                      Save Update
                    </v-btn>
                    <v-btn
                      color="error"
                      text
                      @click="deleteScreen(screen.screenId, index)"
                      >🗑️ Delete Screen</v-btn
                    >
                    <v-btn
                      color="info"
                      text
                      @click="navigateToShowDates(screen.screenId)"
                      >📅 Manage Shows</v-btn
                    >
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>
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
                dense
                outlined
              />
              <v-select
                v-model="selectedMovieId"
                :items="movies"
                item-title="movieName"
                item-value="movieId"
                label="Select already assigned Movie "
                dense
                outlined
              />

              <v-text-field
                v-model="showStartDate"
                type="date"
                label="Start Date"
                :min="todayDate"
                dense
                outlined
              />
              <v-text-field
                v-model="showEndDate"
                type="date"
                label="End Date"
                :min="showStartDate || todayDate"
                dense
                outlined
              />
              <!-- Add Show Date button -->
              <v-btn
                color="primary"
                class="mt-4"
                :disabled="
                  isShowDateAdded ||
                  !selectedScreenId ||
                  !selectedMovieId ||
                  !showStartDate ||
                  !showEndDate
                "
                @click="submitShowDates"
              >
                Add Show Date
              </v-btn>
            </v-card-text>
          </v-card>
          <v-snackbar
            v-model="snackbar.show"
            :color="snackbar.color"
            timeout="3000"
          >
            {{ snackbar.message }}
          </v-snackbar>

          <v-expand-transition>
            <div class="mt-4">
              <v-card class="pa-4" elevation="2">
                <h4 class="mb-4">Add Show Times</h4>

                <p><strong>📅 Show Date ID:</strong> {{ dateId }}</p>
                <p><strong>🗓️ Start Date:</strong> {{ showstartdate }}</p>
                <p><strong>🗓️ End Date:</strong> {{ showenddate }}</p>

                <v-text-field
                  label="Show Start Time"
                  v-model="showStart"
                  type="time"
                  required
                ></v-text-field>
                <v-btn color="primary" @click="submitShowTimes"
                  >Add Show Time</v-btn
                >
              </v-card>
            </div>
          </v-expand-transition>
        </div>

        <!-- Ticket Category Section -->
        <div v-if="selectedSection === 'ticketCategory'">
          <v-card class="mb-6 pa-4" elevation="2" max-width="500" mx-auto>
            <v-card-title>Add Ticket Category</v-card-title>
            <v-card-text>
              <v-text-field
                v-model="ticketCategoryName"
                label="Category Name"
                dense
                outlined
              />
              <v-text-field
                v-model.number="ticketCategoryCharge"
                label="Category Charge"
                type="number"
                dense
                outlined
              />
              <v-btn color="primary" class="mt-3" @click="submitTicketCategory"
                >Add Category</v-btn
              >
            </v-card-text>
          </v-card>

          <!-- Display Existing Categories -->
          <v-card class="pa-4" elevation="2" max-width="600" mx-auto>
            <v-card-title class="text-h6"
              >🎟️ Existing Ticket Categories</v-card-title
            >
            <v-card-text>
              <v-list dense>
                <v-list-item
                  v-for="(cat, index) in ticketCategories"
                  :key="'cat-' + index"
                >
                  <v-list-item-content>
                    <v-list-item-title>
                      <strong>{{ cat.ticketcate }}</strong>
                    </v-list-item-title>

                    <v-list-item-subtitle
                      v-if="editingCategoryId !== cat.ticketcatechargeId"
                    >
                      Charge: ₹{{ cat.ticketcharge }}
                    </v-list-item-subtitle>

                    <v-text-field
                      v-else
                      v-model.number="updatedCharge"
                      type="number"
                      label="Update Charge"
                      dense
                      outlined
                    />

                    <v-row class="mt-2" dense>
                      <v-col cols="6" sm="4" md="3">
                        <v-btn
                          color="error"
                          text
                          @click="deleteTicketCategory(cat.ticketcatechargeId)"
                          >🗑️ Delete</v-btn
                        >
                      </v-col>

                      <v-col
                        cols="6"
                        sm="4"
                        md="3"
                        v-if="editingCategoryId !== cat.ticketcatechargeId"
                      >
                        <v-btn
                          color="primary"
                          text
                          @click="
                            () => {
                              editingCategoryId = cat.ticketcatechargeId;
                              updatedCharge = cat.ticketcharge;
                            }
                          "
                        >
                          Edit
                        </v-btn>
                      </v-col>

                      <v-col cols="6" sm="4" md="3" v-else>
                        <v-btn
                          color="success"
                          text
                          @click="updateTicketCategory(cat.ticketcatechargeId)"
                        >
                          Save</v-btn
                        >
                      </v-col>

                      <v-col
                        cols="6"
                        sm="4"
                        md="3"
                        v-if="editingCategoryId === cat.ticketcatechargeId"
                      >
                        <v-btn
                          text
                          @click="
                            () => {
                              editingCategoryId = null;
                              updatedCharge = null;
                            }
                          "
                          >Cancel</v-btn
                        >
                      </v-col>
                    </v-row>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </div>

        <!-- Theatre Tax Section -->
        <div v-if="selectedSection === 'theatreTax'">
          <v-card class="mb-6 pa-4" elevation="2" max-width="500" mx-auto>
            <v-card-title>Add/Update Theatre Tax</v-card-title>
            <v-card-text>
              <v-text-field
                v-model.number="taxPercentage"
                label="Tax Amount (%)"
                type="number"
                dense
                outlined
                :disabled="!isEditingTax && theatreTax !== null"
              />

              <!-- Add Tax button is always visible -->
              <v-btn
                color="primary"
                class="mt-3"
                @click="
                  theatreTax === null ? submitTheatreTax() : updateTheatreTax()
                "
                :disabled="!isEditingTax && theatreTax !== null"
              >
                {{ theatreTax === null ? "Add Tax" : "Save Tax" }}
              </v-btn>

              <!-- Update Tax button visible only if tax exists -->
              <v-btn
                v-if="theatreTax !== null"
                color="orange"
                class="mt-3 ml-2"
                @click="enableEditingTax"
              >
                Update Tax
              </v-btn>

              <!-- Delete Tax button visible only if tax exists -->
              <v-btn
                v-if="theatreTax !== null"
                color="red"
                class="mt-3 ml-2"
                @click="deleteTheatreTax"
              >
                Delete Tax
              </v-btn>
            </v-card-text>
          </v-card>

          <v-card class="pa-4" elevation="2" max-width="500" mx-auto>
            <v-card-title class="text-h6">📊 Current Theatre Tax</v-card-title>
            <v-card-text>
              <p v-if="theatreTax !== null">
                <strong>TaxPercentage:</strong> {{ theatreTax }}%
              </p>
              <p v-else>No tax added yet.</p>
            </v-card-text>
          </v-card>
        </div>

        <!-- Show list -->

        <div v-if="selectedSection === 'theatreShowsList'">
          <h2>Theatre Shows</h2>

          <div v-if="loadingTheatreShows">Loading shows...</div>
          <div v-else-if="theatreShowsList.length === 0">
            No shows available.
          </div>
          <div v-else>
            <table class="theatre-shows-table">
              <thead>
                <tr>
                  <th>Screen Name</th>
                  <th>Movie Name</th>
                  <th>Show Dates</th>
                  <th>Seat Capacity</th>
                  <th>Show Times</th>
                  <th>Actions</th>
                </tr>
              </thead>

                <tbody>
  <tr v-for="show in theatreShowsList" :key="show.dateId">
    <td>{{ show.screenName }}</td>
    <td>{{ show.movieName }}</td>
    <td>{{ show.movStart }} to {{ show.movEnd }}</td>
    <td>{{ show.seatCapacity }}</td>
    <td>
      <ul style="padding-left: 20px; margin: 0">
        <li v-for="time in show.showTimes" :key="time.showTimeId">
          {{ time.showStart }}
        </li>
      </ul>
    </td>
    <td>
      <v-btn
        small
        color="error"
        @click="deleteShowDate(show.dateId)"
      >Delete</v-btn>
    </td>
  </tr>
</tbody>

            </table>
          </div>
        </div>

        <v-container v-if="selectedSection === 'theatreShows'">
          <h1 class="text-h4 mb-6 font-weight-bold">🎬 Active Theatre Shows</h1>

          <!-- Loading indicator -->
          <v-progress-linear
            indeterminate
            v-if="loadingShows"
          ></v-progress-linear>

          <!-- Show cards -->
          <v-row v-if="!loadingShows && theatreShows.length > 0" dense>
            <v-col
              v-for="show in theatreShows"
              :key="show.dateId"
              cols="12"
              sm="6"
              md="4"
            >
              <v-card class="pa-4" outlined elevation="2">
                <v-card-title class="text-h5 mb-2">
                  Movie: {{ show.movieName }}
                </v-card-title>

                <v-divider></v-divider>

                <v-card-text class="text-h6 mt-3">
                  <div><strong>🖥️ Screen:</strong> {{ show.screenName }}</div>
                  <div>
                    <strong> Show Start Date:</strong> {{ show.movStart }}
                  </div>
                  <div><strong> Show End Date:</strong> {{ show.movEnd }}</div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>

          <!-- No shows -->
          <v-alert
            type="info"
            v-if="!loadingShows && theatreShows.length === 0"
            class="mt-4"
          >
            No active shows found.
          </v-alert>
        </v-container>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import axios from "axios";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "TheatreDashboard",
  data() {
    return {
      selectedSection: "screens",
      theatre: {
        name: "",
        email: "",
        location: "",
        contact: "",
        noOfScreens: 0,
      },
      showAddScreenDialog: false,
      selectedScreenIndex: 0,
      dynamicScreens: [],
      screens: [],
      movies: [],
      selectedMovieId: null,
      selectedMovies: {},
      updatingMovieScreenId: null,
      selectedScreenId: null,
      showStartDate: "",
      showEndDate: "",
      dateId: null,
      showstartdate: "",
      showenddate: "",
      showTimeForm: false,
      showStart: "",
      showEnd: "",
      snackbar: {
        show: false,
        message: "",
        color: "info",
      },
      ticketCategoryName: "",
      ticketCategoryCharge: null,
      ticketCategories: [],
      editingCategoryId: null,
      updatedCharge: null,
      theatreScreens: [],
      theatreTax: null,
      taxPercentage: null,
      isEditingTax: false,
      theatreShows: [],
      loadingShows: false,
      todayDate: new Date().toISOString().split("T")[0],
      showDatesList: [],
      theatreShowsList: [],
      loadingTheatreShows: false,
      selectedDateId: null,
      newEndDate: '',
      showUpdateDialog: false
    };
  },
  computed: {
    ...mapGetters(["gettheatreId"]),
  },
  watch: {
    selectedSection(newVal) {
      if (newVal === "ticketCategory") {
        this.fetchTicketCategories();
      } else if (newVal === "theatreTax") {
        this.fetchTheatreTax();
      } else if (newVal === "theatreShows") {
        this.fetchTheatreShows();
      } else if (newVal === "theatreShowsList") {
        this.fetchTheatreShowsList();
      }
    },
  },

  methods: {
    ...mapActions(["fetchTheatredetails"]),

    async deleteShowDate(dateId) {
  if (!confirm("Are you sure you want to delete this show date?")) return;

  try {
    await axios.delete("http://localhost:8082/api/theatredetails/deleteshow", {
      params: { dateId },
    });

    alert("Show date deleted successfully");

    // ✅ Remove the row from the local array to update the table
    this.theatreShowsList = this.theatreShowsList.filter(
  (show) => show.dateId !== dateId
);

  } catch (error) {
    alert("Failed to delete show date: " + error.message);
  }
},
    openUpdateDialog(show) {
    this.selectedDateId = show.dateId;
    this.newEndDate = show.movEnd;
    this.showUpdateDialog = true;
  },
     async updateShowEndDate() {
    try {
      await axios.put("http://localhost:8082/api/theatredetails/updateshowdate", null, {
        params: {
          dateId: this.selectedDateId,
          movEnd: this.newEndDate,
        }
      });

      alert("Show end date updated");
      this.showUpdateDialog = false;
      this.fetchTheatreShowsList(); // refresh the list
    } catch (error) {
      alert("Failed to update: " + error.message);
    }
  },

    async fetchTheatreShowsList() {
      this.loadingTheatreShows = true;
      try {
        const res = await axios.get(
          "http://localhost:8082/api/theatredetails/getshow",
          {
            params: { theatreId: this.gettheatreId },
            headers: { "Content-Type": "application/json" },
          }
        );
        this.theatreShowsList = res.data;
      } catch (error) {
        alert("Failed to fetch theatre shows: " + error.message);
      } finally {
        this.loadingTheatreShows = false;
      }
    },

    async fetchTheatreShows() {
      this.loadingShows = true;

      try {
        const res = await axios.get(
          "http://localhost:8082/api/theatredetails/getallshowdates",
          {
            params: { theatreId: this.gettheatreId },
          }
        );

        this.theatreShows = res.data;
      } catch (err) {
        console.error("Failed to fetch theatre shows:", err);
        this.theatreShows = [];
      } finally {
        this.loadingShows = false;
      }
    },

    async loadTheatreDetails() {
      const res = await this.fetchTheatredetails(this.gettheatreId);
      if (res.success) {
        this.theatre = res.data[0];
        this.dynamicScreens = Array(this.theatre.noOfScreens)
          .fill()
          .map(() => ({ screenName: "", seatCapacity: 100 }));
      }
    },

    async fetchScreens() {
      const res = await axios.get(
        "http://localhost:8082/api/theatredetails/getscreens",
        {
          params: { theatreId: this.gettheatreId },
        }
      );
      this.screens = res.data;

      const selected = {};
      res.data.forEach((screen) => {
        if (screen.movieId) selected[screen.screenId] = screen.movieId;
      });
      this.selectedMovies = selected;
    },

    async fetchMovies() {
      const res = await axios.get(
        "http://localhost:8082/api/userdetails/getallmovies"
      );
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
      const res = await axios.put(
        "http://localhost:8082/api/theatredetails/updatescreencount",
        null,
        {
          params: { theatreId: this.gettheatreId, count: newCount },
        }
      );
      if (res.status === 200) {
        this.theatre.noOfScreens = newCount;
        this.dynamicScreens.push({ screenName: "", seatCapacity: 100 });
      }
    },

    async submitScreenDetails() {
      const screen = this.dynamicScreens[this.selectedScreenIndex];
      if (!screen.screenName || !screen.seatCapacity) {
        alert("Please fill in all fields");
        return;
      }

      const res = await axios.post(
        `http://localhost:8082/api/theatredetails/addscreenmov/${this.gettheatreId}`,
        screen
      );
      if (res.status === 200) {
        alert(`Screen ${this.selectedScreenIndex + 1} added successfully!`);
        this.showAddScreenDialog = false;
        await this.fetchScreens();
      }
    },

    async assignMovieToScreen(screenId) {
      const selectedMovieId = this.selectedMovies[screenId];
      if (!selectedMovieId) {
        alert("Please select a movie");
        return;
      }

      const screen = this.screens.find((s) => s.screenId === screenId);
      if (screen?.movieId && screen.movieId !== selectedMovieId) {
        const confirmReplace = confirm(
          "This screen already has a movie assigned. Do you want to replace it?"
        );
        if (!confirmReplace) return;
      }

      const res = await axios.post(
        "http://localhost:8082/api/theatredetails/addmovie",
        null,
        {
          params: { screenId, movieId: selectedMovieId },
        }
      );

      if (res.status === 200) {
        alert("Movie assigned successfully!");
        await this.fetchScreens();
      } else {
        alert("Failed to assign movie");
      }
    },

    async deleteScreen(screenId, index) {
      const confirmed = confirm("Are you sure you want to delete this screen?");
      if (!confirmed) return;

      const res = await axios.delete(
        `http://localhost:8082/api/theatredetails/deletescreen`,
        {
          params: { theatreId: this.gettheatreId, screenId },
        }
      );

      if (res.status === 200) {
        alert("Screen deleted successfully!");
        this.screens.splice(index, 1);
      } else {
        alert("Failed to delete screen");
      }
    },

    async submitShowDates() {
      if (
        !this.selectedScreenId ||
        !this.selectedMovieId ||
        !this.showStartDate ||
        !this.showEndDate
      ) {
        alert("Please fill in all fields");
        return;
      }

      try {
        const payload = {
          screenId: this.selectedScreenId,
          movieId: this.selectedMovieId,
          movStart: this.showStartDate,
          movEnd: this.showEndDate,
          theatreId: this.gettheatreId,
        };

        const res = await axios.post(
          "http://localhost:8082/api/theatredetails/addshowdates",
          payload
        );

        if (res.status === 200) {
          alert("Show dates added successfully!");

          this.showTimeForm = true;
          this.dateId = res.data.dateId;
          this.showstartdate = res.data.movStart;
          this.showenddate = res.data.movEnd;

          // Add to table data
          this.showDatesList.push({
            screenName:
              this.screens.find((s) => s.screenId === this.selectedScreenId)
                ?.screenName || this.selectedScreenId,
            movieName:
              this.movies.find((m) => m.movieId === this.selectedMovieId)
                ?.movieName || this.selectedMovieId,
            movStart: res.data.movStart,
            movEnd: res.data.movEnd,
          });
        } else {
          alert("Failed to add show dates");
        }
      } catch (error) {
        alert("Error occurred: " + error.message);
      }
    },

    addShowTime() {
      this.showTimes.push({ showStart: "", showEnd: "" });
    },

    removeShowTime(index) {
      this.showTimes.splice(index, 1);
    },

    getMovieName(movieId) {
      const movie = this.movies.find((m) => m.movieId === movieId);
      return movie ? movie.movieName : "";
    },

    navigateToShowDates(screenId) {
      this.selectedSection = "manageShows";
      this.selectedScreenId = screenId;
    },
    handleSnackbar({ message, color }) {
      this.snackbar.message = message;
      this.snackbar.color = color;
      this.snackbar.show = true;
    },
    async submitShowTimes() {
      if (
        !this.selectedScreenId ||
        !this.showStart ||
        !this.dateId ||
        !this.selectedMovieId
      ) {
        this.snackbar = {
          show: true,
          message: "Please fill all required fields.",
          color: "error",
        };
        return;
      }

      const theatreId = Number(this.theatre?.id || this.gettheatreId);

      const showTimeModel = {
        dateId: this.dateId,
        showStart: this.showStart + ":00",
        theatreId: theatreId,
        movieId: this.selectedMovieId,
        screenId: this.selectedScreenId,
      };

      try {
        const res = await axios.post(
          "http://localhost:8082/api/theatredetails/addshowTime",
          showTimeModel
        );

        if (res.status === 200) {
          this.snackbar = {
            show: true,
            message: "Show time added successfully!",
            color: "success",
          };
          this.showStart = "";
        } else {
          this.snackbar = {
            show: true,
            message: "Failed to add show time.",
            color: "error",
          };
        }
      } catch (err) {
        if (err.response && err.response.status === 404) {
          this.snackbar = {
            show: true,
            message: `${err.response.data}`,
            color: "warning",
          };
        } else {
          this.snackbar = {
            show: true,
            message: `Error: ${err.message}`,
            color: "error",
          };
        }
      }
    },
    async updateAssignedMovie(screenId) {
      const selectedMovieId = this.selectedMovies[screenId];
      if (!selectedMovieId) {
        alert("Please select a movie to update.");
        return;
      }

      try {
        const res = await axios.put(
          "http://localhost:8082/api/theatredetails/updatemovie",
          null,
          {
            params: { screenId, movieId: selectedMovieId },
          }
        );

        if (res.status === 200) {
          alert("Movie updated successfully!");
          this.updatingMovieScreenId = null;
          await this.fetchScreens();
        } else {
          alert("Failed to update movie.");
        }
      } catch (err) {
        alert("Error updating movie: " + err.message);
      }
    },

    async deleteAssignedMovie(screenId) {
      const confirmDelete = confirm(
        "Are you sure you want to remove the assigned movie from this screen?"
      );
      if (!confirmDelete) return;

      try {
        const res = await axios.delete(
          "http://localhost:8082/api/theatredetails/deletemovie",
          {
            params: { screenId },
          }
        );

        if (res.status === 200) {
          alert("Movie removed from screen successfully!");
          this.selectedMovies[screenId] = null; // clear the movie from UI binding
          await this.fetchScreens(); // refresh data
        } else {
          alert("Failed to remove movie from screen.");
        }
      } catch (err) {
        alert("Error removing movie: " + err.message);
      }
    },
    enableMovieUpdate(screenId) {
      this.updatingMovieScreenId = screenId;
    },
    async submitTicketCategory() {
      if (!this.ticketCategoryName || !this.ticketCategoryCharge) {
        alert("Please enter both category name and charge.");
        return;
      }

      const payload = {
        ticketcate: this.ticketCategoryName,
        ticketcharge: this.ticketCategoryCharge,
      };

      try {
        const res = await axios.post(
          "http://localhost:8082/api/theatredetails/addcate",
          payload,
          {
            params: { theatreId: this.gettheatreId },
          }
        );

        if (res.status === 200 || res.status === 201) {
          alert("Ticket category added successfully!");
          this.ticketCategoryName = "";
          this.ticketCategoryCharge = null;
        } else {
          alert("Failed to add ticket category.");
        }
      } catch (error) {
        alert("Error adding category: " + error.message);
      }
    },
    async fetchTicketCategories() {
      try {
        const res = await axios.get(
          "http://localhost:8082/api/theatredetails/gettheatrecate",
          {
            params: { theatreId: this.gettheatreId },
          }
        );
        this.ticketCategories = res.data;
      } catch (error) {
        alert("Error fetching ticket categories: " + error.message);
      }
    },
    async deleteTicketCategory(categoryId) {
      const confirmed = confirm(
        "Are you sure you want to delete this category?"
      );
      if (!confirmed) return;

      try {
        const res = await axios.delete(
          "http://localhost:8082/api/theatredetails/deletecate",
          {
            params: { ticketcatechargeId: categoryId },
          }
        );

        if (res.status === 200) {
          alert("Category deleted successfully!");
          await this.fetchTicketCategories();
        } else {
          alert("Failed to delete category.");
        }
      } catch (err) {
        alert("Error deleting category: " + err.message);
      }
    },

    async updateTicketCategory(categoryId) {
      if (!this.updatedCharge || isNaN(this.updatedCharge)) {
        alert("Please enter a valid charge.");
        return;
      }

      try {
        const res = await axios.put(
          "http://localhost:8082/api/theatredetails/updatecate",
          null,
          {
            params: {
              ticketcatechargeId: categoryId,
              ticketcharge: this.updatedCharge,
            },
          }
        );

        if (res.status === 200) {
          alert("Category updated successfully!");
          this.editingCategoryId = null;
          this.updatedCharge = null;
          await this.fetchTicketCategories();
        } else {
          alert("Failed to update category.");
        }
      } catch (err) {
        alert("Error updating category: " + err.message);
      }
    },
    // async fetchTheatreScreens() {
    //   try {
    //     const res = await axios.get(
    //       `http://localhost:8082/api/theatredetails/screensByTheatre/${this.theatre.id}`
    //     );
    //     this.theatreScreens = res.data;
    //   } catch (error) {
    //     alert("Failed to fetch theatre screens: " + error.message);
    //   }
    // },
    async submitTheatreTax() {
      if (this.taxPercentage === null || this.taxPercentage < 0) {
        alert("Please enter a valid tax amount.");
        return;
      }

      const taxPayload = {
        taxPercentage: this.taxPercentage,
      };

      try {
        const res = await axios.post(
          "http://localhost:8082/api/theatredetails/addtx",
          taxPayload,
          {
            params: { theatreId: this.gettheatreId },
          }
        );

        if (res.status === 200 || res.status === 201) {
          alert("Tax added successfully!");
          this.fetchTheatreTax();
          this.theatreTax = res.data.taxPercentage;
          this.taxPercentage = null;
          this.isEditingTax = false;
        } else {
          alert("Failed to add tax.");
        }
      } catch (err) {
        alert("Error adding tax: " + err.message);
      }
    },
    async fetchTheatreTax() {
      try {
        const res = await axios.get(
          "http://localhost:8082/api/theatredetails/gettax",
          {
            params: { theatreId: this.gettheatreId },
          }
        );
        this.theatreTax = res.data.taxPercentage;
        this.taxPercentage = this.theatreTax;
        this.isEditingTax = false; // input disabled initially
      } catch (err) {
        console.error("Failed to fetch tax:", err.message);
        this.theatreTax = null;
        this.taxPercentage = null;
        this.isEditingTax = true; // allow adding tax if no tax exists
      }
    },
    enableEditingTax() {
      this.isEditingTax = true;
    },
    async updateTheatreTax() {
      try {
        const response = await axios.put(
          "http://localhost:8082/api/theatredetails/updatetx",
          {
            theatreId: this.gettheatreId, // match your other code
            taxPercentage: this.taxPercentage,
          },
          {
            params: { theatreId: this.gettheatreId },
          }
        );

        this.theatreTax = response.data.taxPercentage;
        alert("Tax updated successfully!");
        this.isEditingTax = false; // disable editing again
      } catch (error) {
        console.error("Error updating tax:", error);
        alert("Failed to update tax.");
      }
    },

    async deleteTheatreTax() {
      try {
        await axios.delete(
          "http://localhost:8082/api/theatredetails/deletetx",
          {
            params: { theatreId: this.gettheatreId },
          }
        );
        this.taxPercentage = null;
        this.theatreTax = null;
        this.isEditingTax = true; // enable input for adding new tax
        alert("Tax deleted successfully!");
      } catch (error) {
        console.error("Error deleting tax:", error);
        alert("Failed to delete tax.");
      }
    },
  },

  async mounted() {
    await this.loadTheatreDetails();
    await this.fetchScreens();
    await this.fetchMovies();
  },
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

.profile-card {
  background-color: rgba(255, 255, 255, 0.85);
  padding: 30px 40px;
  border-radius: 12px;
  background-color: transparent;
  box-shadow: none;
}

.theatre-name {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 20px;
  text-align: center;
}

.profile-card p {
  font-size: 1.25rem;
  margin: 8px 0;
}

.theatre-shows-table {
  width: 100%;
  border-collapse: collapse;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.theatre-shows-table thead {
  background-color: #1976d2; /* nice blue header */
  color: white;
}

.theatre-shows-table th,
.theatre-shows-table td {
  padding: 12px 15px;
  border: 1px solid #ddd;
  text-align: left;
  vertical-align: middle;
}

.theatre-shows-table tbody tr:nth-child(even) {
  background-color: #f9f9f9;
}

.theatre-shows-table tbody tr:hover {
  background-color: #e3f2fd; /* subtle highlight on hover */
  cursor: pointer;
}

.theatre-shows-table ul {
  padding-left: 20px;
  margin: 0;
  list-style-type: disc;
  color: #333;
}

.theatre-shows-table ul li {
  line-height: 1.4;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-leave-to {
  opacity: 0;
}

</style>
