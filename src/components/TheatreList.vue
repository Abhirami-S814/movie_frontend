<template>
    <div class="bg">
      <div class="h2bg">
        <h2>Theatre Details!!!</h2>
      </div>
  
      <div class="p-6 bg-gray-100 min-h-screen">
        <div class="grid-container">
          <div
            v-for="theatre in theatres"
            :key="theatre.theatreId"
            class="theatre-card"
            @click="goToTheatreOne(theatre.theatreId)"
          >
            <h2 class="theatre-name">{{ theatre.name }}</h2>
            <p><strong>📧 Email:</strong> {{ theatre.email }}</p>
            <p><strong>📍 Location:</strong> {{ theatre.location }}</p>
            <p><strong>📞 Contact:</strong> {{ theatre.contact }}</p>
            <p><strong>🎭 Screens:</strong> {{ theatre.noOfScreens }}</p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    data() {
      return {
        theatres: [],
      };
    },
    mounted() {
      this.fetchTheatres();
    },
    methods: {
      async fetchTheatres() {
        try {
          const response = await axios.get(
            "http://localhost:8082/api/theatredetails/allTheatres"
          );
          this.theatres = response.data;
        } catch (error) {
          console.error("Error fetching theatres:", error);
        }
      },
      // goToTheatreOne(theatreId) {
      //   this.$router.push({ path: `/theatrelists/${theatreId}` });
      // },
    },
  };
  </script>
  
  <style scoped>
  .bg {
    height: 100vh;
    background: url(../assets/theatrelogbg.jfif) no-repeat center center;
    background-size: cover;
  }
  .h2bg {
    background-color: rgb(59, 58, 58);
    color: white;
    padding: 10px;
    text-align: center;
  }
  .grid-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
    padding: 20px;
  }
  .theatre-card {
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    padding: 16px;
    transition: transform 0.3s ease-in-out;
    cursor: pointer;
  }
  .theatre-card:hover {
    transform: scale(1.05);
  }
  .theatre-name {
    font-size: 21px;
    font-weight: bold;
    color: #333;
    display: flex;
    justify-content: center;
  }
  </style>
  