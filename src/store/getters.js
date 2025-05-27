export default {
    getUrl : (state) => state.base_url,
    gettheatreId : (state) => state.theatreId,
    getUserlogin : (state) =>state.userlogin,

    getUserreg : (state) =>state.userreg,
    getForgotpass : (state) =>state.forgotpass,
    getForgotadminpass : (state) =>state.forgotadminpass,
    getMovie : (state) =>state.movie,
    getTheatrereg : (state) =>state.theatrereg,
    getTheatreLogin: (state) => state.theatrelogin,
    getAdminlogin: (state) => state.adminlogin,
    getLanguages: state => state.languages,
    getGenres: state => state.genres,
    getMovies: state => state.movies,
    getTheatres: state => state.theatres,
    getTheatre(state) {
        return state.theatre;
      },
}