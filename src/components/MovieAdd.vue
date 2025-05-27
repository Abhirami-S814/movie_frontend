<template>
  <div class="bgimg">
    <v-container class="d-flex flex-column align-center justify-center fill-height">
      <v-card class="pa-5 text-center" max-width="600px">
        <v-card-title class="text-h4 font-weight-bold">🎉 Welcome Back, Admin!</v-card-title>
        <v-btn color="primary" class="mt-4" @click="showAddMovieDialog = true"> Add New Movie</v-btn>
      </v-card>

      <v-dialog v-model="showAddMovieDialog" max-width="600px" persistent>
        <v-card class="pa-5">
          <v-card-title class="text-h5 d-flex justify-space-between align-center">
            <v-icon class="deletebtn" @click="showAddMovieDialog = false">mdi-close-thick</v-icon>
          </v-card-title>

          <v-card-text>
            <v-form ref="form" @submit.prevent="onSubmit">
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field label="🎬 Movie Name" v-model="moviename" variant="outlined" :rules="[rules.required]" />
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field label="⏳ Duration (hh:mm:ss)" v-model="duration" variant="outlined" placeholder="hh:mm:ss"
                    :rules="[rules.required, rules.timeFormat]" />
                </v-col>

                <v-col cols="12">
                  <v-textarea label="📝 Description" v-model="description" variant="outlined" :rules="[rules.required]" />
                </v-col>

                <v-col cols="12" md="6">
                  <v-select label="🌍 Language" variant="outlined" :items="languages" item-title="langName" item-value="langId"
                    v-model="selectedLang" :rules="[rules.required]" return-object />
                </v-col>

                <v-col cols="12" md="6">
                  <v-select label="🎭 Genre" variant="outlined" :items="genres" item-title="genreName" item-value="genreId"
                    v-model="selectedGenre" :rules="[rules.required]" return-object />
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field label="📅 Release Date" v-model="releasedate" variant="outlined" type="date"
                    :rules="[rules.required]" />
                </v-col>

                <v-col cols="12" md="6">
                  <v-file-input label="🎬 Movie Poster" v-model="movieposter" accept="image/*" @change="onFileChange" variant="outlined"
                    :rules="[rules.required]" />
                </v-col>

              </v-row>

              <div class="text-center mt-4">
                <v-btn color="primary" class="addbtn" type="submit">🎥 Add Movie</v-btn>
              </div>
            </v-form>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-container>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import axios from 'axios';

export default {
  data: () => ({
    showAddMovieDialog: false,
    moviename: '',
    duration: '',
    description: '',
    releasedate: '',
    selectedLang: null,
    selectedGenre: null,
    movieposter: null,

    rules: {
      required: value => !!value || 'This field is required',
      timeFormat: value => /^([0-1]?\d|2[0-3]):[0-5]\d:[0-5]\d$/.test(value) || 'Enter a valid time (hh:mm:ss)',
    },
  }),

  computed: {
    ...mapGetters(['getLanguages', 'getGenres']),
    languages() {
      return this.getLanguages || [];
    },
    genres() {
      return this.getGenres || [];
    },
  },

  methods: {
    ...mapActions(['fetchLanguages', 'fetchGenres', 'addMovie']),

    onFileChange(event) {
      this.movieposter = event.target.files[0];
      console.log("Selected file:", this.movieposter);
    },

    async onSubmit() {
  if (!this.$refs.form) return;

  const form = this.$refs.form;
  const { valid } = await form.validate();

  if (valid) {
    try {
      const langId = this.selectedLang ? this.selectedLang.langId : null;
      const genreId = this.selectedGenre ? this.selectedGenre.genreId : null;

      // Create movie object
      const movieModel = {
        movieName: this.moviename,
        duration: this.duration,
        description: this.description,
        releaseDate: this.releasedate,
        language: langId,
        genre: genreId,
      };

      // Debugging: Log before sending
      console.log("Sending Movie Data:", movieModel);

      const movieModelBlob = new Blob([JSON.stringify(movieModel)], { type: 'application/json' });

      const formData = new FormData();
      formData.append('movieModel', movieModelBlob);
      formData.append('movieposter', this.movieposter);

      // Debugging: Print FormData before sending
      console.log("FormData before sending:");
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      const res = await axios.post('http://localhost:8082/api/admindetails/addMovie', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.status === 200) {
        alert('Movie added successfully!');
        this.$router.push('/adminlistmov')
        this.resetForm();
        this.showAddMovieDialog = false;
        this.$emit('movie-added');
      } else {
        alert('Error adding movie.');
      }
    } catch (error) {
      console.error('API Error:', error);
      alert('Error adding movie.');
    }
  }
},

    resetForm() {
      this.moviename = '';
      this.duration = '';
      this.description = '';
      this.releasedate = '';
      this.selectedLang = null;
      this.selectedGenre = null;
      this.movieposter = null;
    },
  },

  async mounted() {
    try {
      await this.fetchLanguages();
      await this.fetchGenres();
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  },
};
</script>


<style scoped>
.addbtn {
  width: 150px;
}

.deletebtn {
  font-size: 30px;
  color: rgb(122, 111, 111);
  cursor: pointer;
  transition: 0.2s;
  margin-left: auto;
}

.deletebtn:hover {
  font-size: 35px;
}
.bgimg {
  background-image: url(../assets/adminlogbg.jfif);
  background-repeat: no-repeat;
  background-size: cover;
  height: 100vh;
}
.uploaded-img {
  margin-top: 10px;
  max-width: 100px;
  border-radius: 5px;
}
</style>
