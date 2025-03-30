
export default {
    template: `
    <div class="d-flex justify-content-center">
    <form @submit.prevent="register" class=" w-60">
        <div class="mb-3">
            <label for="exampleInputEmail1" class="form-label">Email</label>
            <input type="email" class="form-control" v-model="formData.email" id="exampleInputEmail1" aria-describedby="emailHelp">
            <div id="emailHelp" class="form-text">Have you heard the song, Ladka pagal h pagal h</div>
        </div>
        <div class="mb-3">
            <label for="exampleInputEmail1" class="form-label">Username</label>
            <input type="text" class="form-control" v-model="formData.username" id="exampleInputEmail1" aria-describedby="emailHelp">
            <div id="emailHelp" class="form-text">I bet you for 5 dollars, do you remember username</div>
        </div>
        <div class="mb-3">
            <label for="exampleInputPassword1" class="form-label">Password</label>
            <input type="password" class="form-control" v-model="formData.password" id="exampleInputPassword1">
        </div>

        <select @change="roleChange" id="role" v-model="formData.role">
            
            <option value="customer">User</option>
            <option value="professional">Professional</option>
        </select>
        <div class="mb-3" id="phone">
            <label for="exampleInputEmail1" class="form-label">Phone</label>
            <input type="number" class="form-control" v-model="formData.phone" id="exampleInputEmail1" aria-describedby="emailHelp">
            <div id="emailHelp" class="form-text">I bet you for 5 dollars, do you remember username</div>
        </div>
        <div class="mb-3" id="address">
            <label for="exampleInputEmail1" class="form-label">Address</label>
            <input type="text" class="form-control" v-model="formData.address" id="exampleInputEmail1" aria-describedby="emailHelp">
            <div id="emailHelp" class="form-text">I bet you for 5 dollars, do you remember username</div>
        </div>
        <div class="mb-3" id="pincode">
            <label for="exampleInputEmail1" class="form-label">Pincode</label>
            <input type="text" class="form-control" v-model="formData.pincode" id="exampleInputEmail1" aria-describedby="emailHelp">
            <div id="emailHelp" class="form-text">I bet you for 5 dollars, do you remember username</div>
        </div>
        
        <div class="mb-3" id="service">
            <label for="exampleInputEmail1" class="form-label">Service</label>
            <input type="text" class="form-control" v-model="formData.service" id="exampleInputEmail1" aria-describedby="emailHelp">
            <div id="emailHelp" class="form-text">I bet you for 5 dollars, do you remember username</div>
        </div>
        <div class="mb-3" id="experience">
            <label for="exampleInputEmail1" class="form-label">Experience</label>
            <input type="text" class="form-control" v-model="formData.experience" id="exampleInputEmail1" aria-describedby="emailHelp">
            <div id="emailHelp" class="form-text">I bet you for 5 dollars, do you remember username</div>
        </div>
        
        
        <div class="pt-2 d-flex justify-content-end">
        <button type="submit" class="btn btn-primary">Submit</button>
        
        
   </div>
        </form>
        </div>
    `,
    data() {
        return {
            formData : {
            username: "",
            password: "",
            phone : "",
            address: "",
            email : "",
            pincode : "",
            rating : 0,
            service : "",
            experience : "",
            status : "pending",
            role : "",
            }
        }
    },
    methods:{
        register(){
            console.log("button clicked", this.formData)
            fetch("/api/register", {
                method: "POST",
                headers: {
                    "Content-Type" : "application/json"
                }
                ,
                body : JSON.stringify(this.formData)
            })
            .then(response => response.json())
            .then(data => {
                alert(data["message"])
                this.$router.push("/login")
            })
            .catch(error => {
                console.log("error" + error)
                alert(error["message"])
            })
        },
        roleChange(){
            var role = document.getElementById("role").value

            if (role == "customer"){
                document.getElementById("phone").style.display = "block"
                document.getElementById("address").style.display = "block"
                document.getElementById("pincode").style.display = "block"
                
                
                document.getElementById("service").style.display = "none"
                document.getElementById("experience").style.display = "none"
            }
            
            else if (role == "professional"){
                
                document.getElementById("service").style.display = "block"
                document.getElementById("experience").style.display = "block"

                document.getElementById("phone").style.display = "none"
                document.getElementById("address").style.display = "none"
                document.getElementById("pincode").style.display = "none"
            }
        }
    }
}


