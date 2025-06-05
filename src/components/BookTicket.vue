<template>
  <v-container>
    <h2 class="text-h5 mb-4">Book Ticket</h2>

    <v-card class="pa-4" outlined>
      <p><strong>User ID:</strong> {{ bookingData.userId }}</p>
      <p><strong>Movie:</strong> {{ bookingData.movieName }}</p>
      <p><strong>Theatre:</strong> {{ bookingData.theatreName }}</p>
      <p><strong>Screen:</strong> {{ bookingData.screenName }}</p>

      <!-- Show Date Dropdown -->
      <v-select label="Select Show Date" :items="availableDates" v-model="bookingData.showDate" outlined dense
        class="mt-4" />

      <!-- Show Time Dropdown -->
      <v-select label="Select Show Time" :items="availableTimes" v-model="bookingData.showTime" item-title="label"
        item-value="value" outlined dense class="mt-2" />

      <h3 class="text-subtitle-1 mt-4 mb-2">Select Tickets</h3>
      <v-row v-for="(category, index) in categoryBookings" :key="index" class="align-center">
        <v-col cols="6">
          <v-text-field label="Category Name" v-model="category.categoryName" outlined dense readonly />
        </v-col>
        <v-col cols="6">
          <v-text-field label="Quantity" type="number" min="0" v-model.number="category.quantity" outlined dense />
        </v-col>
      </v-row>

      <v-btn color="primary" class="mt-4" @click="submitBooking">
        Confirm Booking
      </v-btn>

      <!-- Snackbar for user feedback -->
      <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000">
        {{ snackbar.message }}
      </v-snackbar>
    </v-card>

    <!-- Booking Summary After Confirm -->
    <v-card v-if="bookingSummary" class="mt-4 pa-4" outlined>
      <h3 class="text-subtitle-1 mb-2">Booking Summary</h3>
      <p><strong>Total Before Tax:</strong> ₹{{ bookingSummary.totalBeforeTax }}</p>
      <p><strong>Tax ({{ bookingSummary.taxPercentage }}%):</strong> ₹{{ bookingSummary.taxAmount }}</p>
      <p><strong>Total Amount:</strong> ₹{{ bookingSummary.totalWithTax }}</p>
      <p><strong>Booked At:</strong> {{ formatDateTime(bookingSummary.bookingDateTime) }}</p>

      <h4 class="text-subtitle-2 mt-3">Category Breakdown:</h4>
      <ul>
        <li v-for="cat in bookingSummary.categoryBookings" :key="cat.id">
          {{ cat.categoryName }} × {{ cat.quantity }} @ ₹{{ cat.pricePerTicket }} = ₹{{ cat.totalPrice }}
        </li>
      </ul>
    </v-card>

  </v-container>
</template>

<script>
import axios from 'axios';

export default {
  name: 'BookTicket',
  data() {
    return {
      bookingData: {
        userId: '',
        movieId: '',
        movieName: '',
        theatreId: '',
        theatreName: '',
        screenId: '',
        screenName: '',
        showDate: '',
        showTime: ''
      },
      categoryBookings: [],
      availableDates: [],
      availableTimes: [],
      bookingSummary: null,
      snackbar: {
        show: false,
        message: '',
        color: ''
      }
    };
  },
  methods: {

    formatDateTime(dateTimeStr) {
      if (!dateTimeStr) return '';
      const options = {
        weekday: 'short',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      };
      return new Date(dateTimeStr).toLocaleString('en-IN', options);
    },

    async submitBooking() {
      const validBookings = this.categoryBookings.filter(c => c.quantity > 0);

      if (!this.bookingData.showDate || !this.bookingData.showTime) {
        this.showSnackbar('Please select a valid show date and time', 'warning');
        return;
      }

      if (!validBookings.length) {
        this.showSnackbar('Please select at least one ticket category', 'warning');
        return;
      }

      const payload = {
        ...this.bookingData,
        categoryBookings: validBookings
      };

      try {
        const response = await axios.post('http://localhost:8082/api/userdetails/bookticket', payload);

        // Store booking summary
        this.bookingSummary = response.data;

        this.showSnackbar('Booking successful!', 'success');
      } catch (error) {
        console.error('Booking failed:', error);
        this.showSnackbar('Booking failed. Try again.', 'error');
      }
    },
    async fetchTicketCategories() {
      try {
        const response = await axios.get('http://localhost:8082/api/theatredetails/gettheatrecate', {
          params: { theatreId: this.bookingData.theatreId }
        });
        this.categoryBookings = response.data.map(cat => ({
          categoryName: cat.ticketcate,
          quantity: 0
        }));
      } catch (error) {
        console.error('Failed to fetch ticket categories:', error);
      }
    },
    generateDates(start, end) {
      const dates = [];
      const startDate = new Date(start);
      const endDate = new Date(end);
      while (startDate <= endDate) {
        dates.push(startDate.toISOString().split('T')[0]);
        startDate.setDate(startDate.getDate() + 1);
      }
      return dates;
    },
    showSnackbar(message, color) {
      this.snackbar.message = message;
      this.snackbar.color = color;
      this.snackbar.show = true;
    }
  },
  async mounted() {
    const {
      userId,
      movieId,
      theatreId,
      screenId
    } = this.$route.params;

    this.bookingData.userId = userId;
    this.bookingData.movieId = movieId;
    this.bookingData.theatreId = theatreId;
    this.bookingData.screenId = screenId;

    await this.fetchTicketCategories();

    try {
      const res = await axios.get('http://localhost:8082/api/theatredetails/getshowScreen', {
        params: { screenId }
      });

      const screenInfo = res.data[0];

      this.bookingData.movieName = screenInfo.movieName;
      this.bookingData.theatreName = screenInfo.name;
      this.bookingData.screenName = screenInfo.screenName;

      this.availableDates = this.generateDates(screenInfo.movStart, screenInfo.movEnd);

      this.availableTimes = screenInfo.showTimes.map(s => ({
        label: s.showStart,
        value: s.showStart
      }));
    } catch (error) {
      console.error('Failed to load screen data:', error);
      this.showSnackbar('Failed to load show details', 'error');
    }
  }
};
</script>

<style scoped>
.v-text-field {
  margin-bottom: 8px;
}
</style>
