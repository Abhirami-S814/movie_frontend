import { createStore } from "vuex";
import rootActions from './actions.js';
import rootGetters from './getters.js';
import rootMutations from './mutations.js';

const store = createStore({
    state(){
        return{
            base_url: 'http://172.20.4.65:8080',

            //session storage
            
                theatreId : sessionStorage.getItem("theatreId")||"",
                userlogin : sessionStorage.getItem("userlogin")||"",


            // userdetails:JSON.parse(sessionStorage.getItem('userdetails'))|| [],
            userreg:JSON.parse(sessionStorage.getItem('userreg')) || [],
            forgotpass:JSON.parse(sessionStorage.getItem('forgotpass')) || [],
            movie:JSON.parse(sessionStorage.getItem('movie')) || [],
            theatrereg:JSON.parse(sessionStorage.getItem('theatrereg'))|| [],
            // theatrelogin: JSON.parse(sessionStorage.getItem('theatrelogin')) || [],
            adminlogin: JSON.parse(sessionStorage.getItem('adminlogin') || '[]'),
            languages: sessionStorage.getItem('languages') ? JSON.parse(sessionStorage.getItem('languages')) : [],
            genres: sessionStorage.getItem('genres') ? JSON.parse(sessionStorage.getItem('genres')) : [],
            movies: sessionStorage.getItem('movies') ? JSON.parse(sessionStorage.getItem('movies')) : [],
            theatres: sessionStorage.getItem('theatres') ? JSON.parse(sessionStorage.getItem('theatres')) : [],
           

        };
    },
    mutations:rootMutations,
    actions:rootActions,
    getters:rootGetters
})

export default store;