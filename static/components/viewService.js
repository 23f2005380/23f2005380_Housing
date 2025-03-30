export default {
    template: `
 <div class="bg-info.bg-gradient d-flex justify-content-center align-items-center">
<div class="fs-3 p-3 border rounded" :style="{backgroundColor : '#654565'}">
<div class="row">
    <div class="col-6">
    Service name
    </div>
    <div class="col-6">
    {{name}}
    </div>
</div>

<div class="row">
    <div class="col-6">
    Category
    </div>
    <div class="col-6">
    {{category}}
    </div>
</div>

<div class="row">
    <div class="col-6">
    Price
    </div>
    <div class="col-6">
    {{price}}
    </div>
</div>




<div class="row">
    <div class="col-6">
    Duration
    </div>
    <div class="col-6">
    {{duration}}
    </div>
</div>




<div class="row">
    <div class="col-6">
    Description
    </div>
    <div class="col-6">
    {{description}}
    </div>
</div>



<div v-if="status">
<div class="row">
    <div class="col-6">
    Status
    </div>
    <div class="col-6">
    {{status}}
    </div>
</div>
</div>

<div v-if="address">
<div class="row">
    <div class="col-6">
    Address
    </div>
    <div class="col-6">
    {{address}}
    </div>
</div>
</div>

<template>
<div v-if="professional">
<div class="row">
    <div class="col-6">
    professional name
    </div>
    <div class="col-6">
    {{professional}}
    </div>
</div>

</div>
<div v-if="customer">
{{professional}}
</div>
<div v-if="rating">
{{professional}}
</div>
<div v-if="review">
{{professional}}
</div>
</template>
</div>
</div>

    `,
    data() {
        return {
            name: "",
            category: "",
            price: "",
            duration: "",
            description: "",
            professional: "",
            status : "",
            address : ""
        }
    },
    created() {
        console.log("Router :" +this.$route.params)
        
        fetch("/api/viewService/"+this.$route.params.id,
            {
                method: "GET",
                headers : {
                    "Content-Type" : "application/json",
                    "Authentication-token" : localStorage.getItem("auth_token")
                }
            }
        )
        .then(response => response.json())
        .then(data => {
            console.log("data",data, data["name"])
            this.name = data["data"]["name"]
            this.price = data["data"]["price"]
            this.category = data["data"]["category"]
            this.description = data["data"]["description"]
            this.duration = data["data"]["duration"]
            this.professional = data["data"]["professional_id"]
        })
        .catch(error => {
            console.log(error)
        })
    }
}