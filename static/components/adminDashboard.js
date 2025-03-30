import createService from "./createService.js"

export default {
    template: `
    <div class="container p-5">
        <h1>Admin Dashboard</h1>
        <div class="row my-2">
            <div class="text-end">
        <button class = "btn btn-primary" @click="create_service">Create Service</button>
        </div>
        </div>
        <div class="row my-2">
            <div class="text-end">
            <button @click="csvDownload" class="btn btn-secondary">Dowload csv</button></div>
        </div>
        <div class="row my-2">
            <div class="text-end">
        <div class="btn btn-warning"><router-link to="/analyseAdmin">Analysis</router-link></div>
        </div>
        </div>
        <div class="pt-2">
        <div class="p-2 rounded" :style="{backgroundColor: 'rgb(44 101 29)'}"><h2>Pending Professionals</h2>
        
        <div class="pt-2">
        <div class="rounded list-group" :style="{backgroundColor: '#569845'}">
       
        <li v-for="professional in pending_professionals" class="list-group-item flex w-80 p-2  border-gray-300 rounded-m bg-[#465454] text-[lightModeText] dar:text-[darkModeText]"  :style="{backgroundColor: '#569845'}">
            <div class="d-flex row">
                <div class="w-1/2 row col-8 d-flex">
                    <div class="w-1/2 col-6 d-flex ">
                    <strong>Username : </strong>{{professional.username}}
                    </div>
                    <div class="w-1/2 col-6 d-flex">
                    <strong>Service : </strong>{{professional.service}}
                    </div>
                </div>
                <div class="w-1/2 col-4">
                    <button class="btn btn-success" @click="approve(professional.id)">Approve</button>
                    <button class="btn btn-warning" @click="reject(professional.id)">Reject</button>
                </div>
            </div>
        </li>
        </div>
        </div>
        </div>
        
        </div>


        <div class="pt-2">
        <div class="p-2 rounded" :style="{backgroundColor: 'rgb(44 101 29)'}"><h2>Pending Services</h2>
        
        <div class="pt-2">
        <div class="rounded list-group" :style="{backgroundColor: '#569845'}">
        <li v-for="services in pending_services" class="list-group-item w-80 p-2 border border-gray-300 rounded bg-[#465454] text-[lightModeText] dar:text-[darkModeText]"  :style="{backgroundColor: '#569845'}">
            <div class="d-flex row">
                <div class="w-1/2 row col-8">
                    <div class="w-1/2 col-6">
                    <strong>Customer : </strong>
                    {{services.customer_id}}
                    </div>
                    <div class="w-1/2 col-6">
                    <strong>start_time : </strong>{{services.start_time}}
                    </div>
                </div>
                <div class="w-1/2 col-4">
                    <button class="btn btn-warning" @click="flag(services.id)">Flag</button>
                    <button class="btn btn-primary" @click="viewService(services.id)">View</button>
                </div>
            </div>
        </li>
        </div>
        </div>
        </div>
        </div>

        <div class="pt-2">
        <div class="p-2 rounded" :style="{backgroundColor: 'rgb(44 101 29)'}"><h2>Services</h2>
        
        <div class="pt-2">
        <div class="rounded list-group">
        
        <li v-for="service in services" class=" list-group-item w-80 p-2 rounded border border-gray-300 rounded-lg bg-[#465454] text-[lightModeText] dar:text-[darkModeText]"  :style="{backgroundColor: '#569845'}">  
            <div class="d-flex row">
                <div class="w-1/2 row col-8">
                    <div class="w-1/2 col-6">
                    <strong>Name : </strong>{{service.name}}
                    </div>
                    <div class="w-1/2 col-6">
                    <strong>Category : </strong>{{service.category}}
                    </div>
                </div>
                <div class="w-1/2 col-4">
                    <button class="btn btn-warning" @click="edit(service.id)">Edit</button>
                    <button class="btn btn-danger" @click="deleteService(service.id)">Delete</button>
                </div>
            </div>
        </li>
       
        </div>
        </div>
        </div>
        </div>
        

        

        <div class="p-5 position-fixed top-50 rounded-2 translate-middle start-50 bg-[#326545] z-9999" :style="{ backgroundColor: '#8e6eed', display: showService ? 'flex' : 'none'}" id="createService">
        <create-service></create-service>
        </div>
        <p>Welcome to the Admin dashboard</p>
    </div>
    `,
    data : function(){
        return {
            pending_professionals: [],
            pending_services: [],
            services: [],
            showService: false,
            
        }
    },
    methods:{
        create_service(){
            // document.getElementById("createService").style.display = "block";
            document.getElementById("createService").style.display = "flex";
            this.showService = true
            
        },
        approve(id){
            console.log("clicked a")
            fetch("/api/admin/approve_reject_id",
                {
                    method: "POST",
                    headers:{
                        "Content-Type": "application/json",
                        "Authentication-token": localStorage.getItem("auth_token")
                    },
                    body: JSON.stringify({
                        "id": id,
                        "a_or_o": "approve"
                    })
                }
            )
            .then(response => response.json())
            .then(data => {
                this.loadPendingProfessionals()
                alert(data)
            })
        },
        reject(id){
            fetch("/api/admin/approve_reject_id",
                {
                    method: "POST",
                    headers:{
                        "Content-Type": "application/json",
                        "Authentication-token": localStorage.getItem("auth_token")
                    },
                    body: JSON.stringify({
                        "id": id,
                        "a_or_o": "reject"
                    })
                }
            )
            .then(response => response.json())
            .then(data => {
                this.loadPendingProfessionals()
                alert(data)
            })
        },
        flag(id){
            fetch("/api/admin/flag_service",
                {
                method :"POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authentication-token": localStorage.getItem("auth_token")
                    },
                    body: 
                        JSON.stringify({
                            "id" :id
                            
                        })
                    

                }
            
            )
            .then(response => response.json())
            .then(data => {
                this.loadPendingServices()
                alert(data)
            })
        },
        viewService(id){
            this.$router.push("/viewService/"+id)
        },
        edit(id){
            this.$router.push("/editService/"+id)
        },
        deleteService(id){
            fetch("/api/deleteService/"+id,
                {
                    method : "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authentication-token": localStorage.getItem("auth_token")
                    }
                }
            )
            .then(response => response.json())
            .then(data => {
                this.loadServices()
                this.loadPendingServices()
                alert("Service Deleted")
            })
            .catch(error => console.log(error))
        },
        loadPendingProfessionals(){
            fetch("/api/admin",
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
                this.pending_professionals = data.pending_professionals,
                // this.pending_services = data.pending_services,
                // this.services = data.services
                console.log("data"+data["pending_professionals"].length)
            })
            .catch(error => {
                console.log("error" + error)
            })
        },
        loadServices(){
            fetch("/api/admin",
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
                // this.pending_professionals = data.pending_professionals,
                // this.pending_services = data.pending_services,
                this.services = data.services
                console.log("data"+data["pending_professionals"].length)
            })
            .catch(error => {
                console.log("error" + error)
            })
        },
        loadPendingServices(){
            fetch("/api/admin",
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
            // this.pending_professionals = data.pending_professionals,
            this.pending_services = data.pending_services
            console.log("pending_services", this.pending_services, data.pending_services)
        })
        .catch(error => {
            console.log("error" + error)
        })
        },
        csvDownload(){
            fetch("/api/export")
            .then(response => response.json())
            .then(data => {
                window.location.href = '/api/csv_result/'+data.id
            })
        }
    },
    components: {
        "create-service": createService
    },
    beforeMount(){
        
    },
    mounted(){
        this.loadPendingProfessionals()
        this.loadPendingServices()
        this.loadServices()
        console.log(this.pending_professionals)
    },

}