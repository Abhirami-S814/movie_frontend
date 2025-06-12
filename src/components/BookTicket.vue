<template>
  <v-container>
    <h2 class="text-h5 mb-4">Book Ticket</h2>

    <v-card class="pa-4" outlined>
      <p><strong>User ID:</strong> {{ bookingData.userId }}</p>
      <p><strong>Movie:</strong> {{ bookingData.movieName }}</p>
      <p><strong>Theatre:</strong> {{ bookingData.theatreName }}</p>
      <p><strong>Screen:</strong> {{ bookingData.screenName }}</p>

      <!-- Show Date Dropdown -->
      <v-select
        label="Select Show Date"
        :items="availableDates"
        v-model="bookingData.showDate"
        outlined
        dense
        class="mt-4"
      />

      <!-- Show Time Dropdown -->
      <v-select
        label="Select Show Time"
        :items="availableTimes"
        v-model="bookingData.showTime"
        item-title="label"
        item-value="value"
        outlined
        dense
        class="mt-2"
      />

      <!-- Available Seats Display -->
      <div v-if="availableSeats !== null" class="mt-3">
        <strong>Available Seats: </strong> {{ availableSeats }}
      </div>

      <!-- Ticket Categories & Quantities -->
      <h3 class="text-subtitle-1 mt-4 mb-2">Select Tickets</h3>
      <v-row v-for="(category, index) in categoryBookings" :key="index" class="align-center">
        <v-col cols="6">
          <v-text-field
            label="Category Name"
            v-model="category.categoryName"
            outlined
            dense
            readonly
          />
        </v-col>
        <v-col cols="6">
          <v-text-field
            label="Quantity"
            type="number"
            min="0"
            :max="maxCategoryQuantity(category.quantity)"
            v-model.number="category.quantity"
            :disabled="availableSeats === null || !bookingData.showDate || !bookingData.showTime"
            outlined
            dense
          />
        </v-col>
      </v-row>

      <v-btn
        color="primary"
        class="mt-4"
        @click="submitBooking"
        :disabled="
          availableSeats === null ||
          !bookingData.showDate ||
          !bookingData.showTime ||
          bookingCompleted
        "
      >
        Confirm Booking
      </v-btn>

      <!-- Snackbar -->
      <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000">
        {{ snackbar.message }}
      </v-snackbar>
    </v-card>

    <!-- Booking Summary + Print Button -->
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

      <!-- Print Button -->
      <v-btn color="success" class="mt-4" @click="printTicket">
        Print Ticket
      </v-btn>
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
      availableSeats: null,
      bookingSummary: null,
      bookingCompleted: false, // <== NEW
      snackbar: {
        show: false,
        message: '',
        color: ''
      }
    };
  },

  computed: {
    totalSelectedTickets() {
      return this.categoryBookings.reduce((sum, c) => sum + (c.quantity || 0), 0);
    }
  },

  watch: {
    'bookingData.showDate'(newDate) {
      if (newDate && this.bookingData.showTime) {
        this.fetchAvailableSeats();
      } else {
        this.availableSeats = null;
      }
    },
    'bookingData.showTime'(newTime) {
      if (newTime && this.bookingData.showDate) {
        this.fetchAvailableSeats();
      } else {
        this.availableSeats = null;
      }
    },
    categoryBookings: {
      handler(newVal) {
        newVal.forEach(cat => {
          const max = this.maxCategoryQuantity(cat.quantity);
          if (cat.quantity > max) {
            cat.quantity = max;
          } else if (cat.quantity < 0) {
            cat.quantity = 0;
          }
        });
      },
      deep: true
    }
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

    maxCategoryQuantity(currentQty) {
      if (this.availableSeats === null) return 0;
      const maxPossible = this.availableSeats - (this.totalSelectedTickets - (currentQty || 0));
      return maxPossible < 0 ? 0 : maxPossible;
    },

    async fetchAvailableSeats() {
      try {
        const response = await axios.get('http://localhost:8082/api/userdetails/getAvailableSeats', {
          params: {
            screenId: this.bookingData.screenId,
            showDate: this.bookingData.showDate,
            showTime: this.bookingData.showTime
          }
        });
        this.availableSeats = response.data.availableSeats;
      } catch (error) {
        console.error('Failed to fetch available seats:', error);
        this.availableSeats = null;
        this.showSnackbar('Failed to load available seats', 'error');
      }
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

      const totalTickets = validBookings.reduce((sum, c) => sum + c.quantity, 0);
      if (this.availableSeats !== null && totalTickets > this.availableSeats) {
        this.showSnackbar(`You cannot book more than ${this.availableSeats} seats`, 'warning');
        return;
      }

      const payload = {
        ...this.bookingData,
        categoryBookings: validBookings
      };

      try {
        const response = await axios.post('http://localhost:8082/api/userdetails/bookticket', payload);
        this.bookingSummary = response.data;
        this.bookingCompleted = true; // <== disable button after success
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
    },

    printTicket() {
      const myWindow = window.open('', 'PrintWindow', 'width=800,height=600');
      myWindow.document.write(`
        <html>
          <head>
            <title>Ticket Print</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              h2 { color: #333; }
              p { margin: 5px 0; }
              ul { padding-left: 20px; }
            </style>
          </head>
          <body>
            <h2>Booking Ticket</h2>
            <p><strong>User ID:</strong> ${this.bookingData.userId}</p>
            <p><strong>Movie:</strong> ${this.bookingData.movieName}</p>
            <p><strong>Theatre:</strong> ${this.bookingData.theatreName}</p>
            <p><strong>Screen:</strong> ${this.bookingData.screenName}</p>
            <p><strong>Show Date:</strong> ${this.bookingData.showDate}</p>
            <p><strong>Show Time:</strong> ${this.bookingData.showTime}</p>
            <h3>Tickets:</h3>
            <ul>
              ${this.bookingSummary.categoryBookings
                .map(cat => `<li>${cat.categoryName} × ${cat.quantity} @ ₹${cat.pricePerTicket} = ₹${cat.totalPrice}</li>`)
                .join('')}
            </ul>
            <p><strong>Total Before Tax:</strong> ₹${this.bookingSummary.totalBeforeTax}</p>
            <p><strong>Tax (${this.bookingSummary.taxPercentage}%):</strong> ₹${this.bookingSummary.taxAmount}</p>
            <p><strong>Total Amount:</strong> ₹${this.bookingSummary.totalWithTax}</p>
            <button onclick="window.print(); window.close();" style="margin-top:20px;">Print & Close</button>
          </body>
        </html>
      `);

      myWindow.document.close();

      // After print, navigate to movie list page
      myWindow.onafterprint = () => {
        this.$router.push('/movielist'); // CHANGE this path if your movie list page has different route
      };
    }
  },

  async mounted() {
    const { userId, movieId, theatreId, screenId } = this.$route.params;

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
