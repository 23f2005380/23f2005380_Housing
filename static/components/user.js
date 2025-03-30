
export default {
    template: `
    <div class="container h-100">
        <h1>User Dashboard</h1>

        <div>
    <template>
        <div v-if="!isEmpty(category_list)">
            <div class="d-flex">
            <div class="d-flex p-2" v-for="i in category_list" :key="i">
                <button  :style="{backgroundColor : 'rgb(255 110 143)'}" class="p-3 align-items-center rounded-3" @click="category_selected(i)">{{i}}</button>
            </div>
            </div>
            <div class="p-2">
            
                <div class="p-2 bg-[#004369] rounded " v-if="category">
                
                    <div class="d-flex row p-2 " v-for="j in service_list_for_booking" :key="j.id"  :style="{'background-color': 'rgb(230 166 166 / 91%)'}">
                        <div class="p-2 rounded d-flex" :style="{'background-color': 'rgb(138 111 111 / 91%)'}">
                    <div class="col-6 fs-4" >
                            Name : {{j.name}}
                            Category : {{j.category}}
                        </div>
                        <div class="col-6">
                            <button class="btn btn-primary" @click="request(j.id)">Book today</button>
                            <button class="btn btn-warning"><router-link :to="{name : 'createRequest', params : {id : j.id} }">Book on a specific date</router-link></button>
                        </div>
                        </div>
                    </div>
                </div>


                <div v-else>
                    No category Selected
                </div>
            </div>
        </div>
        <div v-else> No category</div>
    </template>
</div>
        
        <div class=""><h2>Pending Requests</h2>
            <ul class="list-group">
            
                <div v-if="isEmpty(pending_services)" :style="{color: 'orange'}">There are no Ongoing Services</div>
                <div v-else>
                  <div  v-for="l in pending_services" class="p-2">
                    <li class="list-group-item flex w-80 rounded border border-gray-300 rounded-m bg-[#465454] text-[lightModeText] dar:text-[darkModeText]">
                        <div class="d-flex row rounded p-2"  :style="{backgroundColor : '#E5DDC8'}">
                            <div class="w-1/2 row col-8 d-flex">
                                <div class="w-1/2 col-6 d-flex">
                                   <strong> Name : </strong> {{l.name}}
                                </div>
                                <div class="w-1/2 col-6 d-flex">
                                    <strong>Price : </strong>{{l.price}}
                                </div>
                            </div>
                            <div class="w-1/2 col-4 d-flex justify-items-end" :style="{justifyContent : 'flex-end', alignItems : 'center'}">
                                    <button class="btn btn-success" @click="edit(l.id)">Edit</button>
                                    <button class="btn btn-warning" @click="deleteService(l.id)">Delete</button>
                            </div>
                        </div>
                    </li>
                    </div>
                </div>
            </ul>
        </div>
        
        <div><h2>Accepted Services</h2>
        
        <ul class="list-group">
        <div v-if="isEmpty(accepted_services)" style="{color: 'orange'}">There are no Ongoing Services</div>
                <div v-else>
                <div  v-for="services in accepted_services" class="p-2">
        <li class="list-group-item w-80 border border-gray-300 rounded bg-[#465454] text-[lightModeText] dar:text-[darkModeText]">
            <div class="d-flex row rounded p-2"  :style="{backgroundColor : '#E5DDC8'}">
                <div class="w-1/2 row col-8 d-flex">
                    <div class="w-1/2 col-6">
                    <strong>Professional Name : </strong>{{services.professional_name}}
                    </div>
                    <div class="w-1/2 col-6">
                    <strong>Service Due Date : </strong>
                    {{services.end_time}}
                    </div>
                </div>
                <div class="w-1/2 col-4 d-flex" :style="{justifyContent : 'flex-end', alignItems : 'center'}">
                    <button class="btn btn-warning" @click="view(services.id)">View</button>
                    <button class="btn btn-primary" @click="review(services.id)">Done</button>
                </div>
            </div>
        </li>
        </div>
        </div>
        </ul>
        <div><h2>Completed Services</h2>
        <ul class="list-group">
         <div v-if="isEmpty(completed_services)" style="{color: 'orange'}">There are no Ongoing Services</div>
        <div v-else class="">
        <div  v-for="service in completed_services" class="p-2">
        <li  class="list-group-item w-80 border border-gray-300 rounded bg-[#465454] text-[lightModeText] dar:text-[darkModeText]">
            <div class="d-flex row p-2 rounded"  :style="{backgroundColor : '#E5DDC8'}">
                <div class="w-1/2 row col-8">
                    <div class="w-1/2 col-6">
                    <strong>Service Name : </strong>{{service.name}}
                    </div>
                    <div class="w-1/2 col-6">
                    <strong>Price : </strong>
                    {{service.price}}
                    </div>
                </div>
                <div class="w-1/2 col-4 d-flex" :style="{justifyContent : 'flex-end', alignItems : 'center'}">
                    <button class="btn btn-warning" @click="view(service.id)">View</button>
                    
                </div>
            </div>
        </li>
        </div>
        </div>
        </ul>
        </div>
        <div><h2>Inappropriate Services</h2>
        <ul  class="list-group">

         <div v-if="isEmpty(deleted_services)" style="{color: 'orange'}">There are no Ongoing Services</div>
        <div v-else>
        <div v-for="service in deleted_services" class="p-2">
        <li  class="list-group-item w-80 border border-gray-300 rounded bg-[#465454] text-[lightModeText] dar:text-[darkModeText]">
            <div class="d-flex row rounded p-2" :style="{backgroundColor : '#E5DDC8'}">
                <div class="w-1/2 row col-8">
                    <div class="w-1/2 col-6">
                    <strong>Service Name : </strong>
                    {{service.name}}
                    </div>
                    <div class="w-1/2 col-6">
                    <strong>Price</strong>
                    {{service.price}}
                    </div>
                </div>
                <div class="w-1/2 col-4 d-flex" :style="{justifyContent : 'flex-end', alignItems : 'center'}">
                    <button class="btn btn-warning" @click="view(service.id)">View</button>
                    
                </div>
            </div>
        </li>
        </div>
        </div>
        </ul>
        </div>
        </div>
        <div class="container justify-content-center align-items-center position-absolute bg-gray-100" :style="{ display: showService ? 'flex' : 'none'}" id="createServiceRequest">
           
        </div>
        <div class="p-5 position-fixed top-50 rounded-2 translate-middle start-50 bg-[#326545] z-9999" :style="{ backgroundColor: '#8e6eed', display: reviewDisplay ? 'flex' : 'none'}" id="review">
            <form class="bg-[#654165]">
                <div class="mb-3">
                    <label for="serviceName" class="form-label">Review</label>
                    <input type="text" class="form-control" v-model="formData.review" />
                </div>
                Rating
                <select v-model="formData.rating">
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                </select>
                <button  class="btn btn-primary pt-2" @click='done'>Submit</button>
            </form>
        </div>
        <p>Welcome to the User dashboard</p>
    </div>
    `,
    data: function () {
        return {
            completed_services: [],
            pending_services: [],
            deleted_services: [],
            accepted_services: [],
            showService: false,
            category: null,
            category_list: [],
            available_services: [],
            service_list_for_booking: [],
            formData : {
                "review" : "",
                "rating" : ""
            },
            reviewDisplay : false
        }
    },
    methods: {
        create_service_request() {
            // document.getElementById("createService").style.display = "block";
            document.getElementById("createServiceRequest").style.display = "flex";
            
            this.showService = true
        },
        review(id){
            document.getElementById("review").style.display = "block";
            console.log(id)
            localStorage.setItem("ser_id", id)
            this.reviewDisplay = !this.reviewDisplay
            console.log("Review", this.reviewDisplay)
        },
        done() {
            let id = localStorage.getItem("ser_id")
            console.log(id)
            fetch("/api/complete_service_request",
                {
                    method :"POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authentication-token": localStorage.getItem("auth_token")
                    },
                    body: 
                        JSON.stringify({
                            "id" : id,
                            "rating" : this.formData.rating,
                            "review" : this.formData.review
                        })
                    
                }
            )
                .then(response => response.json())
                .then(data => {
                    this.loadServices()
                    alert(data["message"])
                    this.reviewDisplay = !this.reviewDisplay
                })
        },


        view(id) {
            this.$router.push("/viewService/" + id)
        },
        edit(id) {
            this.$router.push("/editRequest/" + id)
        },
        deleteService(id) {
            fetch("/api/delete_service_request/" + id,
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
                    this.loadServices()
                    console.log(data)
                    alert(data["message"])
                })
                .catch(error => alert(error["message"]))
        },
        request(id){
            console.log("reques funtion")
            fetch("api/request/"+id,
                {
                    method : "GET",
                    headers : {
                        "Content-Type" : "application/json",
                        "Authentication-token" : localStorage.getItem("auth_token")
                    }
                }
            )
            .then(response => response.json())
            .then(data => {
                console.log(data);
                 this.loadServices(this.category)
                alert(data["message"])}
            )
            .catch(error => alert(error["message"]))
        },
        isEmpty(l) {
          
            if (l.length == 0) {
                return true
            }
            else {
                return false
            }
        },
        loadServices(category) {
            console.log("loadingtrying")
            fetch("/api/user",
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
                    
                    this.available_services = data.available_services
                    console.log(this.available_services[0].category)
                    for (var i = 0; i < this.available_services.length; i++) {
                        console.log(this.available_services[i].category, this.category_list, this.available_services[i].category in this.category_list)
                        if (!(this.category_list.includes(this.available_services[i].category))) {
                            this.category_list.push(this.available_services[i].category)
                        }
                    }
                    // console.log(category)
                    if (category != null) {
                        let l = []
                        for (var i = 0; i < this.available_services.length; i++) {
                            console.log(this.available_services[i].category, category)
                            
                            if (this.available_services[i].category == category) {
                                l.push(this.available_services[i])
                            }
                            
                        }
                        this.service_list_for_booking = l
                    }
                    console.log(this.service_list_for_booking)
                    this.completed_services = data.completed_services
                    this.deleted_services = data.deleted_services
                    this.pending_services = data.pending_services
                    this.accepted_services = data.accepted_services
                    // console.log("data"+data["pending_professionals"].length)
                })
                .catch(error => {
                    console.log("error" + error)
                    alert(error["message"])
                })
        },
        category_selected(category) {
            this.category = category
            this.loadServices(category)
        
        }
        // loadDeletedServices(){
        //     fetch("/api/user",
        //         {
        //             method: "GET",
        //             headers: {
        //                 "Content-Type": "application/json",
        //                 "Authentication-token": localStorage.getItem("auth_token")
        //             }
        //         }
        //     )
        //     .then(response => response.json())
        //     .then(data => {
        //         // this.pending_professionals = data.pending_professionals,
        //         // this.pending_services = data.pending_services,
        //         this.deleted_services = data.deleted_services
        //         console.log("data"+data["pending_professionals"].length)
        //     })
        //     .catch(error => {
        //         console.log("error" + error)
        //     })
        // },
        // loadPendingServices(){
        //     fetch("/api/admin",
        //     {
        //         method: "GET",
        //         headers: {
        //             "Content-Type": "application/json",
        //             "Authentication-token": localStorage.getItem("auth_token")
        //         }
        //     }
        // )
        // .then(response => response.json())
        // .then(data => {
        //     // this.pending_professionals = data.pending_professionals,
        //     this.pending_services = data.pending_services

        // })
        // .catch(error => {
        //     console.log("error" + error)
        // })
        // },
        //     loadServices(){
        //         fetch("/api/getCustomerDashboardData",
        //             {
        //                 method: "GET",
        //                 headers: {
        //                     "Content-Type": "application/json",
        //                     "Authentication-token": localStorage.getItem("auth_token")
        //                 }
        //             }
        //         )
        //         .then(response => response.json())
        //         .then(data => {
        //             // this.pending_professionals = data.pending_professionals,
        //             this.loadServices = data.load_services

        //         })
        //         .catch(error => {
        //             console.log("error" + error)
        //         })
        //     }

        // },
    },
    mounted() {
        this.loadServices(null)
    },



}