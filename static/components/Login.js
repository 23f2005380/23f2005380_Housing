export default {
    props : ["loggedIn"],
    template: `
    <div class="d-flex justify-content-center">
    <form @submit.prevent="login" class="w-60">
  <div class="mb-3">
    <label for="exampleInputEmail1" class="form-label">Username</label>
    <input type="text" class="form-control" v-model="formData.username" id="exampleInputEmail1" aria-describedby="emailHelp">
    <div id="emailHelp" class="form-text">I bet you for 5 dollars, do you remember username</div>
  </div>
  <div class="mb-3">
    <label for="exampleInputPassword1" class="form-label">Password</label>
    <input type="password" class="form-control" v-model="formData.password" id="exampleInputPassword1">
  </div>
  <div class="mb-3 form-check">
    <input type="checkbox" class="form-check-input" id="exampleCheck1">
    <label class="form-check-label" for="exampleCheck1">Check me out</label>
  </div>
  <button type="submit" class="btn btn-primary">Submit</button>

        
        </form>
        </div>
    `,
    data() {
        return {
            formData : {
            username: "",
            password: ""
            }
        }
    },
    methods:{
        login(){
            console.log("button clicked", this.formData)
            fetch("/api/login", {
                method: "POST",
                headers: {
                    "Content-Type" : "application/json"
                }
                ,
                body : JSON.stringify(this.formData)
            })
            .then(response => response.json())
            .then(data => {
                localStorage.setItem("auth_token", data["auth_token"])
                localStorage.setItem("id", data["id"])
                localStorage.setItem("username", data["username"])
                localStorage.setItem("role", data["role"])
                this.$emit("login")
                console.log(data["role"])
                if (data["role"] == "admin"){
                    this.$router.push("/admin")

                }
                else if (data["role"] =="customer"){
                    this.$router.push("/user")
                }
                else if (data["role"] == "professional"){
                    this.$router.push("/professional")
                }
                else{
                    console.log(data)
                }
            })
            .catch(error => {
                console.log("error" + error)
                alert(error["message"])
            })
        }
    }
}