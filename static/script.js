
import Home from "./components/Home.js"
import Login from './components/Login.js'
import Register from './components/Register.js'
import Admin from "./components/adminDashboard.js"
import viewService from "./components/viewService.js"
import edit from "./components/edit.js"
import editRequest from "./components/editRequest.js"
import User from "./components/user.js"
import createServiceRequest from "./components/createServiceRequest.js"
import Professional from "./components/professionalDashboard.js"
import Nav from "./components/nav.js"
import Analysis from "./components/analyse.js"
import analyseProf from "./components/analyseProf.js"
// import Navbar from "./components/Navbar.js"

const routes = [
    {path: "/", component: Home},
    {path: "/login", component: Login},
    {path: "/register", component: Register},
    {path: "/admin", component: Admin},
    {path: "/viewService/:id", component: viewService},
    {path: "/editService/:id", component: edit},
    {path: "/editRequest/:id", component: editRequest},
    {path: "/user", component: User},
    {path: "/createRequest/:id", name: "createRequest", component: createServiceRequest},
    {path : "/professional", component: Professional},
    {path : "/analyseAdmin", component : Analysis},
    {path : "/analyseProfessional", component : analyseProf}
]

const router = new VueRouter({
    routes
})

const app = new Vue({
    el : "#app",
    router,
    template : `
        <div class=" h-full" :style="{height: '100vh'}">
        <nav-bar class="justify-content-center" :loggedIn="loggedIn" @logout="handleLogout" @login="handleLogin"></nav-bar>
        <router-view :loggedIn="loggedIn" @login="handleLogin"></router-view>
        </div>
    `,
    data : {
        message : "Vue",
        loggedIn : false
    },
     components : {
        "nav-bar" : Nav
    // // admin : Admin
     },
     methods : {
        handleLogout() {
            this.loggedIn = false
        },
        handleLogin() {
            this.loggedIn = true
        }
     }

})