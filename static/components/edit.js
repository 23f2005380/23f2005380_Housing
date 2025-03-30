export default {
    template: `
    <div class="bg-info.bg-gradient row d-flex" :style="{justifyContent : 'center'}">
    <form @submit.prevent="editService" class="bg-[#654165] col-6">
        <div class="mb-3">
            <label for="serviceName" class="form-label">Service Name</label>
            <input type="text" class="form-control" value="formData.name" v-model="formData.name" />
        </div>
        <div class="mb-3">
            <label for="serviceName" class="form-label">Service Category</label>
            <input type="text" class="form-control" value="formData.category" v-model="formData.category" />
        </div>
        <div>
            <label for="serviceName" class="form-label">Description</label>
            <input type="text" class="form-control" value="formData.description" v-model="formData.description" />
        </div>
        <div>
            <label for="serviceName" class="form-label">Price</label>
            <input type="text" class="form-control" value="formData.price" v-model="formData.price" />
        </div>
        <div>
            <label for="serviceName" class="form-label">Duration</label>
            <input type="text" class="form-control" value="formData.duration" v-model="formData.duration" />
        </div>
        <button  type="submit" class="btn btn-primary">Submit</button>
    </form>
    </div>
    `,
    data() {
        return {
            formData : {
                name: '',
                category: '',
                description: '',
                price: '',
                duration: ""
            }
        }
    },
    methods: {
        editService() {
            if(!(this.formData.name && this.formData.category && this.formData.description && this.formData.price && this.formData.duration)){
                alert("Fill all fields")
                return 2
            }
            console.log("editService")
            fetch("/api/editServiceDetails/"+this.$route.params.id, {
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
            })
            .catch(error => alert(error["message"]))
        }
    },
    created(){
        fetch("/api/serviceDetails/"+this.$route.params.id,
            {
            method : "GET",
            headers : {
                "Content-Type": "application/json",
                "Authentication-token": localStorage.getItem("auth_token")
            }
        }
        )
        .then(response => response.json())
        .then(data => {
            console.log(data["data"]["name"])
            this.formData.name = data["data"]["name"]
            this.formData.price = data["data"]["price"]
            this.formData.category = data["data"]["category"]
            this.formData.description = data["data"]["description"]
            this.formData.duration = data["data"]["duration"]
            console.log(this.formData)
        })
        .catch(error => {
            console.log(error)
        })
    }
}