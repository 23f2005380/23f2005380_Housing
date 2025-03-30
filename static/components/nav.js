export default {
    props : ["loggedIn"],
    template: `
        <div class="d-flex">
            <div class="d-flex p-2 bg-blue-800">
            <div class="p-2">
            <router-link  v-if="!loggedIn"  to="/login" class="btn btn-primary my-2 p-2">Login</router-link>
            </div><div class="p-2">
            <router-link v-if="!loggedIn" to="/register" class="btn btn-warning my-2 p-2">Register</router-link>
            </div></div>
            
            <div v-if="loggedIn" @click="logoutUser" class="btn btn-primary my-2" >Log out</div>
            </div>
    
        </div>
    `,
    data : function(){
        return {
            // loggedIn : localStorage.getItem("auth_token")
        }
    },
    methods : {
        logoutUser(){
            localStorage.removeItem("auth_token")
            this.$router.push("/login")
            this.$emit("logout")
        }
    }
    ,
    mounted() {
        if(localStorage.getItem("auth_token")){
            console.log("auth_token")
            this.$emit("login")
        }
        
    }
}