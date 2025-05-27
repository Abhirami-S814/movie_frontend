export default{
    settheatreId(state,payload){
      state.theatreId=payload;
      sessionStorage.setItem("theatreId",payload);
    },
    setUserlogin(state,payload){
        state.userlogin=payload;
        sessionStorage.setItem('userlogin',JSON.stringify(payload))
    },



    setUserreg(state,payload){
        state.userreg=payload;
        sessionStorage.setItem('userreg',JSON.stringify(payload))
    },
    setForgotpass(state,payload){
        state.forgotpass=payload;
        sessionStorage.setItem('forgotpass',JSON.stringify(payload))
    },
     setForgotadminpass(state,payload){
        state.forgotadminpass=payload;
        sessionStorage.setItem('forgotadminpass',JSON.stringify(payload))
    },
    setMovie(state,payload){
        state.movie=payload;
        sessionStorage.setItem('movie',JSON.stringify(payload));
    },
    setTheatrereg(state,payload){
        state.theatrereg=payload;
        sessionStorage.setItem('theatrereg',JSON.stringify(payload));
    },
    // setTheatrelogin(state, payload) {
    //     state.theatrelogin = payload;
    //     sessionStorage.setItem('theatrelogin', JSON.stringify(payload));
    // },
    setAdminlogin(state, payload) {
        state.adminlogin = payload;
        sessionStorage.setItem('adminlogin', JSON.stringify(payload));
    },
    setLanguages(state, languages) {
        state.languages = languages;
        sessionStorage.setItem('languages', JSON.stringify(languages)); 
      },
      setGenres(state, genres) {
        state.genres = genres;
        sessionStorage.setItem('genres', JSON.stringify(genres)); 
      },
      setMovies(state, movies) {
        state.movies = movies;
        sessionStorage.setItem('movies', JSON.stringify(movies)); // Store movies
      },
      
      ADD_MOVIE(state, movie) {
        state.movies.push(movie); // Add movie to state
        sessionStorage.setItem('movies', JSON.stringify(state.movies)); // Update session storage
      },
      setTheatres(state,theatres){
        state.theatres = theatres;
        sessionStorage.setItem('theatres',JSON.stringify(state.theatres))
      },
      addGenres(state,addgenres){
        state.addgenres = addgenres;
        sessionStorage.addItem('genres',JSON.stringify(addgenres))
      },
      setTheatre(state, theatreData) {
        state.theatre = theatreData;
      },
}