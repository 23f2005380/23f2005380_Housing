
export default {
    template: `
    <div class="bg-info.bg-gradient d-flex row" :style="{justifyContent : 'center'}">
    <div class="d-flex col-6">
    <form @submit.prevent="createServiceRequest" class="bg-[#654165] w-100" :style="{width : '100%'}">
        <div class="mb-3">
            <label for="serviceName" class="form-label">Service Name</label>
            <input type="text" class="form-control" value="formData.name" v-model="formData.name" disabled/>
        </div>
        <div class="mb-3">
            <label for="serviceName" class="form-label">Service Category</label>
            <input type="text" class="form-control" v-model="formData.category" disabled/>
        </div>
        <div>
            <label for="serviceName" class="form-label">Description</label>
            <input type="text" class="form-control" v-model="formData.description" disabled/>
        </div>
        <div>
            <label for="serviceName" class="form-label">Price</label>
            <input type="text" class="form-control" v-model="formData.price"disabled />
        </div>
        <div>
            <label for="serviceName" class="form-label">Duration</label>
            <input type="text" class="form-control" v-model="formData.duration" disabled/>
        </div>
        
         <div>

           
            <label for="serviceName" class="form-label">Start</label>
             <div :style="{fontSize : '12px'}">You can only alter this</div>
            <input :style="{backgroundColor : '#DB1F48'}" type="date" class="form-control" v-model="formData.start_time" />
        </div>
        
        <button  type="submit" class="btn btn-primary">Submit</button>
    </form>
    </div>
    </div>
    `,
    data() {
        return {
            formData : {
                id : this.$route.params.id,
                name: '',
                category: '',
                description: '',
                price: '',
                duration: "",
                start_time: "",
                
            }
        }
    },
    methods : {
        createServiceRequest(){
            fetch("/api/create_service_request",
                {
                    method : "POST",
                    headers : {
                        "Content-Type" : "application/json",
                        "Authentication-token" : localStorage.getItem("auth_token")
                    },
                    body : JSON.stringify(this.formData)
                }
            ).then(r => r.json())
            .then(d => {
                alert(d)
                this.$router.push("/user")
            }).catch(err => {
                console.log(err)
                alert("Some error occured, you can try again or back to home page")
            })
        }
    },
   
    mounted(){
        fetch("/api/serviceDetails/"+this.$route.params.id,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-token": localStorage.getItem("auth_token")
                }
            }
        )
            .then(response => response.json())
            .then(data => {
                this.formData.name = data["data"]["name"],
                this.formData.description = data["data"]["description"],
                this.formData.duration = data["data"]["duration"],
                this.formData.category = data["data"]["category"],
                this.formData.price = data["data"]["price"]
            })
            .catch(error => {
                console.log("error" + error)
                alert(error["message"])
            })
    
    }
    
}