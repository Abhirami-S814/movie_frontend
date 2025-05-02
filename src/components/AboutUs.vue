<template>
    <v-container class="about-container">
      <v-row justify="center">
        <v-col cols="12" md="8">
          <v-card class="pa-5">
            <v-card-title class="text-center text-h4 font-weight-bold">
              🎬 About Us
            </v-card-title>
            <v-card-text class="text-center">
              <p class="text-body-1">
                Welcome to <strong>MovieHub</strong> – your ultimate destination for seamless and hassle-free movie ticket booking. 
                Whether you're a movie enthusiast or a casual viewer, we ensure a smooth experience with just a few clicks.
              </p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
  
      <v-row justify="center" class="mt-5">
        <v-col cols="12" md="6">
          <v-card class="pa-4">
            <v-card-title class="text-h5 font-weight-bold">🎯 Our Mission</v-card-title>
            <v-card-text>
              Our goal is to provide a convenient, fast, and secure way for movie lovers to book tickets online, 
              eliminating long queues and last-minute disappointments.
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="6">
          <v-card class="pa-4">
            <v-card-title class="text-h5 font-weight-bold">🚀 Why Choose Us?</v-card-title>
            <v-list dense>
              <v-list-item>
                <v-icon color="primary" class="mr-2">mdi-check-circle</v-icon>
                <span>Instant booking confirmation</span>
              </v-list-item>
              <v-list-item>
                <v-icon color="primary" class="mr-2">mdi-check-circle</v-icon>
                <span>Wide selection of movies & theaters</span>
              </v-list-item>
              <v-list-item>
                <v-icon color="primary" class="mr-2">mdi-check-circle</v-icon>
                <span>Secure payment options</span>
              </v-list-item>
              <v-list-item>
                <v-icon color="primary" class="mr-2">mdi-check-circle</v-icon>
                <span>Easy cancellation & refund policies</span>
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>
      </v-row>
  
      <v-row justify="center" class="mt-5">
        <v-col cols="12" md="8">
          <v-card class="pa-4">
            <v-card-title class="text-center text-h5 font-weight-bold">📞 Contact Us</v-card-title>
            <v-card-text class="text-center">
              <p>📍 Address: 123 Movie Street, Cinema City, 45678</p>
              <p>📧 Email: support@moviehub.com</p>
              <p>📞 Phone: +123 456 7890</p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script>
  export default {
    name: "AboutUs",
  };
  </script>
  
  <style scoped>
  .about-container {
    background: linear-gradient(to right, #1e3c72, #2a5298);
    min-height: 100vh;
    padding: 40px;
    color: white;
  }
  
  .v-card {
    background-color: rgba(255, 255, 255, 0.9);
    border-radius: 12px;
  }
  
  .v-card-title,
  .v-card-text {
    color: black;
  }
  </style>
  