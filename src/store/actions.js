import axios from "axios"
export default{
    //user login
    async userlogin({rootGetters},payload){ //data from frontend in payload rootgetters contain getter from vuex here getUrl
        const res = await axios.post(`${rootGetters.getUrl}/api/userdetails/userlogin`,payload)//response stroring 
                                                                                                //,payload for it in body
        if(res.status >= 200 || res.status <300){
            console.log(res);
            return true;
        }
    },
    //user registration
    async userReg({rootGetters},payload){ //data from frontb in payload
        const res = await axios.post(`${rootGetters.getUrl}/api/userdetails/userreg`,payload)//response stroring 
                                                                                                //,payload for it in body
        if(res.status >= 200 || res.status <300){
            console.log(res);
            return true;
        }
    },
    async forgotPass({rootGetters},payload){ //data from frontb in payload
        const result = await axios.put(`${rootGetters.getUrl}/api/userdetails/resetpasswordUser`,payload)//response stroring 
                                                                                                //,payload for it in body
        if(result.status >= 200 || result.status <300){
            console.log(result);
            return true;
        }
    },
    //get all movies
    async fetchMovie({commit,rootGetters}){
        const res = await axios.get(`${rootGetters.getUrl}/api/userdetails/getallmovies`)
        if(res.status >= 200 || res.status <300){
            console.log(res);
            commit('setMovie',res.data);
            return true;
        }
    },

    async fetchMovies({ commit }) {
        try {
          const response = await axios.get('/api/userdetails/getallmovies');  // Adjust API path if needed
          commit('SET_MOVIES', response.data);
        } catch (error) {
          console.error("Error fetching movies:", error);
        }
      },
    // theatre registration
    async theatreReg({ commit, rootGetters }, payload) {
      console.log("Sending payload: ",payload);
        try {
            const res = await axios.post(`${rootGetters.getUrl}/api/theatredetails/theatreregtn`, payload);
    
            if (res.status >= 200 && res.status < 300) {
                commit('settheatreId', res.data.theatreId);
                return true;
            }
            return false;
        } catch (error) {
            console.error("Error during theatre registration:", error);
            return false;
        }
    },
      
    //theatre login
    async theatrelogin({ commit, rootGetters }, payload) {
      console.log("Sending payload: ",payload);
        try {
            const res = await axios.post(`${rootGetters.getUrl}/api/theatredetails/theatrelogin`, payload);
    
            if (res.status >= 200 && res.status < 300) {  // Fixed condition
                console.log(res);
                commit('settheatreId', res.data.theatreId);  // Save login details to Vuex
                return true;
            }
        } catch (error) {
            console.error("Login failed:", error);
        }
        return false; // Ensure false is returned on failure
    },


    //fetch theatredetails
    async fetchTheatredetails({rootGetters},theatreId){
      try {
        console.log("Fetching theatre details");
        const res = await axios.get(`${rootGetters.getUrl}/api/theatredetails/gettheatre?theatreId=${theatreId}`);
        if (res.status >= 200 && res.status <300) {
          return{success:true,data: res.data}
        }
      } catch (error) {
        return {success:false, error: error.res?.data?.message||"failed to fetch theatre details"}
      }
    },
    //adding screens
    async addingscreens({rootGetters},theatreId){
      try {
        console.log("Adding screens");
        const res = await axios.post(`${rootGetters.getUrl}/api/theatredetails/gettheatre?theatreId=${theatreId}`);
        if (res.status >= 200 && res.status <300) {
          return{success:true,data: res.data}
        }
      } catch (error) {
        return {success:false, error: error.res?.data?.message||"failed to fetch theatre details"}
      }
    },



    //admin login
    async adminlogin({ commit, rootGetters }, payload) {
      try {
          const res = await axios.post(`${rootGetters.getUrl}/api/admindetails/adminlogin`, payload);
  
          if (res.status >= 200 && res.status < 300) {  
              console.log("Login successful:", res.data);
              commit('setAdminlogin', res.data);  
              return true;
          }
      } catch (error) {
          console.error("Login failed:", error.response ? error.response.data : error.message);
          return false;  // Explicit return inside catch
      }
      return false;
  },

    //language and genre dropdown

    async fetchLanguages({ commit,rootGetters }) {
      try {
        const res = await axios.get(`${rootGetters.getUrl}/api/theatredetails/getallang`);
        commit("setLanguages", res.data);
        return true;
      } catch (error) {
        console.error("Error fetching languages:", error);
      }
    },

  
    async fetchGenres({ commit,rootGetters }) {
      try {
        const res = await axios.get(`${rootGetters.getUrl}/api/theatredetails/getgenre`);
        commit("setGenres", res.data);
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    },

    async addMovie({ commit, rootGetters }, movieData) {
        try {
          const res = await axios.post(`${rootGetters.getUrl}/api/admindetails/addMovie`, movieData); // ✅ Use POST to add a movie
          commit("ADD_MOVIE", res.data); // ✅ Commit the new movie
          return res.data;
        } catch (error) {
          console.error("Error adding movie:", error);
          return null;
        }
      },
      
    //get all theatres
    async fetchTheatres({ commit,rootGetters }) {
      try {
        const res = await axios.get(`${rootGetters.getUrl}/api/theatredetails/allTheatres`);
        commit("setTheatres", res.data);
        return true;
      } catch (error) {
        console.error("Error fetching Theatres:", error);
      }
    }, 
}