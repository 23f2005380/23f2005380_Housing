
export default {
    template: `
    <div class="container border h-100">
        <h1>Professional Dashboard</h1>
                <div class="row my-2">
            <div class="text-end">
        <div class="btn btn-warning"><router-link to="/analyseProfessional">Analysis</router-link></div>
        </div>
        </div>
        <div v-if="verify == 'v'">You are yet to be verified by the admin</div>
        <div v-else-if="verify == 'r'">You are rejected by the admin</div>
        <div v-else>
        <div class=""><h2>Requested Bookings</h2>
        <ul class="list-group">
        <div v-if="isEmpty(pending_services)" class="p-2" :style="{color : 'yellow'}">There are no Requested Bookings</div>
        <div v-else>
        <li v-for="l in pending_services" class="list-group-item flex w-80 p-2 rounded border border-gray-300 rounded-m bg-[#465454] text-[lightModeText] dar:text-[darkModeText]" :style="{backgroundColor : '#E5DDC8'}">
            <div class="row">
                <div class="col-8 row">
                    <div class="col-6">
                    <strong>Name : </strong>{{l.name}}
                    </div>
                    <div class="col-6">
                    <strong>Price : </strong>{{l.price}}
                    </div>
                </div>
                <div class="col-4 row flex" :style="{justifyContent : 'flex-end', alignItems : 'center'}">
                    <button class="btn btn-success col-4" @click="accept(l.id)">Accept</button>
                    <button class="btn btn-warning col-4" @click="view(l.id)">View</button>
                </div>
            </div>
        </li>
        </div>
        </ul>
        
        </div>
        <div><h2>Ongoing Services</h2>
        
        <div v-if="isEmpty(accepted_services)" >There are no Ongoing Services</div>
        <div v-else>
        <ul class="list-group">
         <div class="p-2" v-for="service in accepted_services">
        <li  class="list-group-item w-80 rounded  border border-gray-300 rounded-lg bg-[#465454] text-[lightModeText] dar:text-[darkModeText]">
        
           
        <div class="row rounded"  :style="{backgroundColor : '#E5DDC8'}">
        
            
                <div class="col-8 row">
                    <div class="col-6">
                    <strong>Services name : </strong>
                    {{service.name}}
                    </div>
                    <div class="col-6">
                    <strong>End Date : </strong>
                    {{service.end_time}}
                    </div>
                </div>
                <div class="col-4 d-flex" :style="{justifyContent : 'flex-end', alignItems : 'center'}">
                    <button class="btn btn-warning" @click="view(services.id)">View</button>
                    
                </div>
            
        </div>
        </li>
        </div>
        </ul>
        </div>
        </div>
        <div><h2>Completed Services</h2>
        
        <div v-if="isEmpty(completed_services)" >There are no Ongoing Services</div>
        <div v-else>
        <ul class="list-group">
         <div class="p-2" v-for="service in completed_services">
        <li  class="list-group-item w-80 rounded  border border-gray-300 rounded-lg bg-[#465454] text-[lightModeText] dar:text-[darkModeText]">
           
            <div class="row rounded"  :style="{backgroundColor : '#E5DDC8'}">
                <div class="col-8 row">
                    <div class="col-6">
                    <strong>Customer Name : </strong>{{service.customer_name}}
                    </div>
                    <div class="col-6">
                    <strong>Due Date : </strong>{{service.end_time}}
                    </div>
                </div>
                <div class="col-4 d-flex" :style="{justifyContent : 'flex-end', alignItems : 'center'}">
                    <button class="btn btn-warning" @click="view(service.id)">View</button>
                    
                </div>
            </div>
            
        </li>
        </div>
        </ul>
        </div>
        
        
        </div>
       
           
        
        <div class="container justify-content-center align-items-center position-absolute bg-gray-100" :style="{ display: showService ? 'flex' : 'none'}" id="createServiceRequest">
           
        </div>
        <p>Welcome to the User dashboard</p>
        
    

  </div>
  
    </div>
    `,
    data: function () {
        return {
            completed_services: [],
            pending_services: [],
            accepted_services: [],
            showService: false,
            verify : ""
        }
    },
    methods: {
       
        view(id) {
            this.$router.push("/viewService/" + id)
        },
        
        accept(id){
            console.log("accept funtion",id)
            fetch("api/accept",
                {
                    method : "POST",
                    headers : {
                        "Content-Type" : "application/json",
                        "Authentication-token" : localStorage.getItem("auth_token")
                    },
                    body : JSON.stringify({"id" : id})
                }
            )
            .then(response => response.json())
            .then(data => {console.log(data); this.loadServices(this.category)}
            )
        },
        isEmpty(l) {
          
            if (l.length == 0) {
                return true
            }
            else {
                return false
            }
        },
        loadServices() {
            console.log("loadingtrying")

            fetch("/api/professional",
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
                    console.log("Loading")
                    if (data["message"] == "not verified"){
                      this.verify = "v"
                    }
                    else if (data["message"] == "rejected"){
                      this.verify = "r"
                    }
                   console.log(data.pending_services)
                    this.completed_services = data.completed_services
                    this.pending_services = data.pending_services
                    this.accepted_services = data.accepted_services
                    // console.log("data"+data["pending_professionals"].length)
                })
                .catch(error => {
                    console.log("error" + error)
                })
        },
       
       
    },
    mounted() {
        this.loadServices()
    },



}