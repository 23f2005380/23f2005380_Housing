export default {
    
    template: `
    <div class="bg-info.bg-gradient">
    <form class="bg-[#654165]">
        <div class="mb-3">
            <label for="serviceName" class="form-label">Service Name</label>
            <input type="text" class="form-control" v-model="formData.name" />
        </div>
        <div class="mb-3">
            <label for="serviceName" class="form-label">Service Category</label>
            <input type="text" class="form-control" v-model="formData.category" />
        </div>
        <div>
            <label for="serviceName" class="form-label">Description</label>
            <input type="text" class="form-control" v-model="formData.description" />
        </div>
        <div>
            <label for="serviceName" class="form-label">Price</label>
            <input type="text" class="form-control" v-model="formData.price" />
        </div>
        <div>
            <label for="serviceName" class="form-label">Duration</label>
            <input type="text" class="form-control" v-model="formData.duration" />
        </div>
        <div class="pt-2">
        <button  type="submit" class="btn btn-primary pt-2" @click='createService'>Submit</button>
        <button @click="hide" type="any" class="btn btn-warning pt-2">Cancel</button>
        </div>
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
        createService() {
            fetch("/api/create_service", {
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
                alert("Service Created")
                this.hide()
            })
        },
        hide(){
            document.getElementById("createService").style.display = "none";
        }
    }
}