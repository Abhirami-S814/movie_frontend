<template>
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
</script>
