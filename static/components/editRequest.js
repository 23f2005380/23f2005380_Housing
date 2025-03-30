export default {
    template: `
    <div class="bg-info.bg-gradient row d-flex" :style="{justifyContent : 'center'}">

    <form @submit.prevent="editService" class="bg-[#654165] col-6">
        <div>
            <label for="serviceName" class="form-label">Start</label>
            <input type="date" class="form-control" v-model="formData.start_time" />
        </div>
        
        <button class="p-2 btn btn-primary" type="submit">Submit</button>
    </form>
    </div>
    `,
    data() {
        return {
            formData : {
                start_time: "",
               
            }
        }
    },
    methods: {
        editService() {
            if(!(this.formData.start_time)){
                alert("Fill all fields")
                return 2
            }
            console.log("editService")
            fetch("/api/edit_service_request/"+this.$route.params.id, {
                method: "POST",
                body: JSON.stringify(this.formData),
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-token": localStorage.getItem("auth_token")
                }
            })
            .then(response => response.json())
            .then(data => {
                console.log(data)
                alert(data["message"])
                this.$router.push("/user")
            })
            .catch(error => alert(error["message"]))
        }
    },
    created(){
    //     fetch("/api/serviceDetails/"+this.$route.params.id,
    //         {
    //         method : "GET",
    //         headers : {
    //             "Content-Type": "application/json",
    //             "Authentication-token": localStorage.getItem("auth_token")
    //         }
    //     }
    //     )
    //     .then(response => response.json())
    //     .then(data => {
    //         console.log(data["data"]["name"])
    //         this.formData.name = data["data"]["name"]
    //         this.formData.price = data["data"]["price"]
    //         this.formData.category = data["data"]["category"]
    //         this.formData.description = data["data"]["description"]
    //         this.formData.duration = data["data"]["duration"]
    //         console.log(this.formData)
    //     })
    //     .catch(error => {
    //         console.log(error)
    //     })
    }
}