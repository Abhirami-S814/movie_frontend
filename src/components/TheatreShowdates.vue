<template>
  <v-container>
    <v-card>
      <v-card-title>
        Manage Show Dates
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="openDialog()">Add Show Date</v-btn>
      </v-card-title>

      <v-data-table :headers="headers" :items="showDates" class="elevation-1">
        <!-- Manually render rows with default slot -->
        <template #default="{ items }">
          <tbody>
            <tr v-for="item in items" :key="item.dateId">
              <td>{{ item.theatreName }}</td>
              <td>{{ item.screenName }}</td>
              <td>{{ item.movieId }}</td>
              <td>{{ item.startDate }}</td>
              <td>{{ item.endDate }}</td>
              <td>
                <v-btn icon @click="editShowDate(item)">
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-btn icon @click="deleteShowDate(item.dateId)">
                  <v-icon color="red">mdi-delete</v-icon>
                </v-btn>
              </td>
            </tr>
          </tbody>
        </template>
      </v-data-table>
    </v-card>

    <!-- Add/Edit Show Date Dialog -->
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>{{ editedDate.dateId ? 'Edit' : 'Add' }} Show Date</v-card-title>

        <v-card-text>
          <v-form @submit.prevent="saveShowDate">
            <v-select
              label="Theatre"
              :items="theatres"
              item-title="theatreName"
              item-value="theatreId"
              v-model="editedDate.theatreId"
              required
              @change="fetchScreens"
            />
            <v-select
              label="Screen"
              :items="screens"
              item-title="screenName"
              item-value="screenId"
              v-model="editedDate.screenId"
              required
              @change="fetchMovieId"
            />
            <v-text-field
              label="Movie ID"
              v-model="editedDate.movieId"
              readonly
            />
            <v-text-field
              label="Start Date"
              v-model="editedDate.startDate"
              type="date"
              required
            />
            <v-text-field
              label="End Date"
              v-model="editedDate.endDate"
              type="date"
              required
            />
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" type="submit">Save</v-btn>
              <v-btn text @click="closeDialog">Cancel</v-btn>
            </v-card-actions>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const showDates = ref([])
const theatres = ref([])
const screens = ref([])

const dialog = ref(false)
const editedDate = ref({
  dateId: null,
  theatreId: null,
  screenId: null,
  movieId: '',
  startDate: '',
  endDate: ''
})

const headers = [
  { title: 'Theatre Name', key: 'theatreName' },
  { title: 'Screen Name', key: 'screenName' },
  { title: 'Movie ID', key: 'movieId' },
  { title: 'Start Date', key: 'startDate' },
  { title: 'End Date', key: 'endDate' },
  { title: 'Actions', key: 'actions' }
]

const fetchShowDates = async () => {
  try {
    const res = await axios.get('/getshowdates')
    showDates.value = res.data
  } catch (error) {
    console.error('Failed to fetch show dates:', error)
  }
}

const fetchTheatres = async () => {
  try {
    const res = await axios.get('/getalltheatres')
    theatres.value = res.data
  } catch (error) {
    console.error('Failed to fetch theatres:', error)
  }
}

const fetchScreens = async () => {
  if (!editedDate.value.theatreId) {
    screens.value = []
    return
  }
  try {
    const res = await axios.get(`/screensbytheatre?theatreId=${editedDate.value.theatreId}`)
    screens.value = res.data
  } catch (error) {
    console.error('Failed to fetch screens:', error)
  }
}

const fetchMovieId = async () => {
  if (!editedDate.value.screenId) {
    editedDate.value.movieId = ''
    return
  }
  try {
    const res = await axios.get(`/getmovidbyscreen?screenId=${editedDate.value.screenId}`)
    editedDate.value.movieId = res.data.movieId
  } catch (error) {
    console.error('Failed to fetch movie id:', error)
  }
}

const saveShowDate = async () => {
  try {
    // Validate required fields before sending
    if (!editedDate.value.screenId || !editedDate.value.movieId || !editedDate.value.theatreId) {
      alert('Please select theatre, screen and ensure movie is loaded.')
      return
    }
    if (!editedDate.value.startDate || !editedDate.value.endDate) {
      alert('Please fill start and end date.')
      return
    }

    const payload = {
      screenId: editedDate.value.screenId,
      movieId: editedDate.value.movieId,
      movStart: editedDate.value.startDate,
      movEnd: editedDate.value.endDate,
      theatreId: editedDate.value.theatreId
    }
    console.log('Payload:', payload)

    if (editedDate.value.dateId) {
      // Only update movEnd for existing show date
      await axios.put(`/updateshowdate?dateId=${editedDate.value.dateId}&movEnd=${editedDate.value.endDate}`)
    } else {
      await axios.post('/addshowdates', payload)
    }

    await fetchShowDates()
    closeDialog()
  } catch (error) {
    console.error('Failed to save show date:', error.response?.data || error.message)
    alert('Error saving show date. Check console for details.')
  }
}

const editShowDate = (item) => {
  editedDate.value = { ...item }
  dialog.value = true
}

const deleteShowDate = async (id) => {
  try {
    await axios.delete(`/deleteshow?dateId=${id}`)
    await fetchShowDates()
  } catch (error) {
    console.error('Failed to delete show date:', error)
  }
}

const closeDialog = () => {
  dialog.value = false
  editedDate.value = {
    dateId: null,
    theatreId: null,
    screenId: null,
    movieId: '',
    startDate: '',
    endDate: ''
  }
}

onMounted(() => {
  fetchShowDates()
  fetchTheatres()
})
</script>
