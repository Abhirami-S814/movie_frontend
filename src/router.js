import { createRouter, createWebHistory } from 'vue-router'; 
import LoginForm from './components/LoginForm.vue';
import RegForm from './components/RegForm.vue';
import HomePage from './components/HomePage.vue';
import TheatreLogin from './components/TheatreLogin.vue';
import AdminLogin from './components/AdminLogin.vue';
import MovieList from './components/MovieList.vue';
import MovieAdd from './components/MovieAdd.vue';
import MovieDetails from './components/MovieDetails.vue';
import TheatreList from './components/TheatreList.vue';
import AdminlistMovie from './components/AdminlistMovie.vue';
import TheatreOne from './components/TheatreOne.vue';
import TheatreShowdates from './components/TheatreShowdates.vue';




const routes = [
  { path: '/' , component:HomePage},
  { path: '/login', name: 'login', component: LoginForm },
  { path: '/reg', name: 'reg',component: RegForm },
  { path: '/adminlog', component: AdminLogin},
  { path: '/movielist', component:MovieList},
  { path: '/theatrereg', component:TheatreLogin},
  { path: '/movieadd',component:MovieAdd},
  { path: '/movie/:movieName', name:"moviedetails" , component:MovieDetails , props: true},
  { path: '/theatrelist', component: TheatreList},
  { path: '/theatrelog',name: "Login", component: TheatreLogin},
  { path: '/dashboard', name: 'TheatreDashboard',component: TheatreOne },
  { path: '/adminlistmov', component: AdminlistMovie},
  { path: '/theatreshowdates', component: TheatreShowdates},

];


const router = createRouter({
  history: createWebHistory(),  
  routes
});

export default router;


