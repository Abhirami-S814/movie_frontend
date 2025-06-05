<template>
  <div class="bgimg">
    <div>
      <v-container class="fill-height">
        <v-row class="justify-start">
          <v-col cols="12" sm="8" md="6">
            <v-card class="pa-5 text-center transparent-card" flat>
<v-card-title class="welcome-title text-h5 text-md-h4 font-weight-bold">
  🎉 Welcome Back, Admin!
</v-card-title>
              <v-btn color="primary" class="mt-4 w-100 w-sm-auto" @click="showAddMovieDialog = true">Add New Movie</v-btn>
              <v-btn color="secondary" class="mt-4 w-100 w-sm-auto" @click="openManageDialog('language')">Manage Language</v-btn>
              <v-btn color="secondary" class="mt-2 w-100 w-sm-auto" @click="openManageDialog('genre')">Manage Genre</v-btn>
              <v-btn color="info" class="mt-2 w-100 w-sm-auto" @click="fetchBookings">View Bookings</v-btn>
            </v-card>
          </v-col>
        </v-row>

        <!-- Add Movie Dialog -->
        <!-- [Your existing Add Movie Dialog remains unchanged] -->

        <!-- Manage Dialog -->
        <!-- [Your existing Manage Dialog remains unchanged] -->

        <!-- View Bookings Dialog -->
        <v-dialog v-model="showBookingsDialog" max-width="900px" persistent>
          <v-card>
            <v-card-title class="d-flex justify-space-between align-center">
              All Bookings
              <v-icon class="deletebtn" @click="showBookingsDialog = false">mdi-close-thick</v-icon>
            </v-card-title>
            <v-card-text>
              <v-table dense>
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Movie</th>
                    <th>Theatre</th>
                    <th>Screen</th>
                    <th>Show Date</th>
                    <th>Show Time</th>
                    <th>Categories</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(booking, index) in bookings" :key="index">
                    <td>{{ booking.userId }}</td>
                    <td>{{ booking.movieName }}</td>
                    <td>{{ booking.theatreName }}</td>
                    <td>{{ booking.screenName }}</td>
                    <td>{{ booking.showDate }}</td>
                    <td>{{ booking.showTime }}</td>
                    <td>
                      <div v-for="(cat, i) in booking.categoryBookings" :key="i">
                        {{ cat.categoryName }} (x{{ cat.quantity }})
                      </div>
                    </td>
                  </tr>
                </tbody>
              </v-table>
            </v-card-text>
          </v-card>
        </v-dialog>
      </v-container>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { mapGetters, mapActions } from "vuex";

export default {
  data() {
    return {
      showAddMovieDialog: false,
      showManageDialogBox: false,
      showBookingsDialog: false,
      manageType: "",
      newItemName: "",
      moviename: "",
      duration: "",
      description: "",
      releasedate: "",
      selectedLang: null,
      selectedGenre: null,
      movieposter: null,
      bookings: [],
      rules: {
        required: (v) => !!v || "This field is required",
        timeFormat: (v) =>
          /^([0-1]?\d|2[0-3]):[0-5]\d:[0-5]\d$/.test(v) || "Enter a valid time (hh:mm:ss)",
      },
    };
  },
  computed: {
    ...mapGetters(["getLanguages", "getGenres"]),
    languages() {
      return (this.getLanguages || []).map((lang) => ({ ...lang, editName: lang.langName }));
    },
    genres() {
      return (this.getGenres || []).map((genre) => ({ ...genre, editName: genre.genreName }));
    },
    itemsList() {
      return this.manageType === "language" ? this.languages : this.genres;
    },
  },
  methods: {
    ...mapActions(["fetchLanguages", "fetchGenres"]),
    itemId(item) {
      return this.manageType === "language" ? item.langId : item.genreId;
    },
    itemLabel(item) {
      return this.manageType === "language" ? item.langName : item.genreName;
    },
    openManageDialog(type) {
      this.manageType = type;
      this.newItemName = "";
      this.showManageDialogBox = true;
    },
    async handleAdd() {
      if (!this.newItemName.trim()) {
        alert("Please enter a name before adding.");
        return;
      }

      const endpoint = this.manageType === "language" ? "/addlang" : "/addgenre";
      const modelKey = this.manageType === "language" ? "langName" : "genreName";

      try {
        await axios.post(`http://localhost:8082/api/admindetails${endpoint}`, {
          [modelKey]: this.newItemName,
        });
        this.newItemName = "";
        await this.refreshData();
      } catch (error) {
        console.error("Add error:", error);
        alert("Failed to add.");
      }
    },
    async handleUpdate(item) {
      const isLanguage = this.manageType === "language";
      const originalName = isLanguage ? item.langName : item.genreName;
      const updatedName = item.editName?.trim();

      if (!updatedName || updatedName === originalName) {
        alert(`Did you change the ${isLanguage ? "language" : "genre"} name before updating?`);
        return;
      }

      const endpoint = isLanguage ? "/updatelang" : "/updategenre";
      const idKey = isLanguage ? "langId" : "genreId";
      const nameKey = isLanguage ? "langName" : "genreName";

      try {
        await axios.put(
          `http://localhost:8082/api/admindetails${endpoint}`,
          null,
          {
            params: {
              [idKey]: item[idKey],
              [nameKey]: updatedName,
            },
          }
        );
        await this.refreshData();
      } catch (error) {
        console.error("Update error:", error);
        alert("Failed to update.");
      }
    },
    async handleDelete(item) {
      const confirmed = confirm(`Are you sure you want to delete "${this.itemLabel(item)}"?`);
      if (!confirmed) return;

      const endpoint = this.manageType === "language" ? "/deletelang" : "/deletegenre";
      const idKey = this.manageType === "language" ? "langId" : "genreId";

      try {
        await axios.delete(`http://localhost:8082/api/admindetails${endpoint}`, {
          params: { [idKey]: item[idKey] },
        });
        await this.refreshData();
      } catch (error) {
        console.error("Delete error:", error);
        alert("Failed to delete.");
      }
    },
    async refreshData() {
      if (this.manageType === "language") {
        await this.fetchLanguages();
      } else {
        await this.fetchGenres();
      }
    },
    onFileChange(file) {
      if (file && file.length) {
        this.movieposter = file[0];
      }
    },
    async submitAddMovie() {
      const isValid = await this.$refs.movieForm.validate();
      if (!isValid) {
        alert("Please fix the form errors.");
        return;
      }

      try {
        const movieData = {
          movieName: this.moviename,
          duration: this.duration,
          description: this.description,
          releaseDate: this.releasedate,
          language: this.selectedLang.langId,
          genre: this.selectedGenre.genreId,
        };

        const formData = new FormData();
        formData.append("movieModel", new Blob([JSON.stringify(movieData)], { type: "application/json" }));
        formData.append("movieposter", this.movieposter);

        await axios.post("http://localhost:8082/api/admindetails/addMovie", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        alert("Movie added successfully!");
        this.showAddMovieDialog = false;

        this.moviename = "";
        this.duration = "";
        this.description = "";
        this.releasedate = "";
        this.selectedLang = null;
        this.selectedGenre = null;
        this.movieposter = null;
      } catch (error) {
        console.error("Add movie error:", error.response || error);
        alert("Failed to add movie.");
      }
    },
    async fetchBookings() {
      try {
        const response = await axios.get("http://localhost:8082/api/userdetails/allbookings");
        this.bookings = response.data || [];
        this.showBookingsDialog = true;
      } catch (error) {
        console.error("Error fetching bookings:", error);
        alert("Failed to fetch bookings.");
      }
    },
  },
  mounted() {
    this.fetchLanguages();
    this.fetchGenres();
  },
};
</script>



<style scoped>
.addbtn {
  width: 50%;
  font-weight: bold;
  border-radius: 20px;
  text-transform: none;
}

.welcome-title {
  white-space: normal;
  word-break: break-word;
  line-height: 1.2;
}


.action-btn {
  min-width: 90px;
  font-weight: 600;
  text-transform: none;
  border-radius: 6px;
  padding: 6px 14px;
  font-size: 14px;
  margin: 6px;
}

.update-btn {
  background-color: #1976d2;
  color: white;
}

.update-btn:hover {
  background-color: #115293;
}

.delete-btn {
  background-color: #d32f2f;
  color: white;
}

.delete-btn:hover {
  background-color: #9a2323;
}

.v-btn {
  border-radius: 0;
  width: max-content;
}

.bgimg {
  background-image: url('../assets/MovieaddminBg.jpeg');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center center;
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.transparent-card {
  background-color: transparent !important;
  box-shadow: none !important;
}


@media (max-width: 600px) {
  .addbtn {
    width: 100% !important;
  }

  .action-btn {
    width: 100%;
    margin: 4px 0;
  }

  .v-card-title {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
