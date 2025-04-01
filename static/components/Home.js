export default {
    template: `
      <div class="container d-flex" 
           :style="{ height: '90vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }">
        
        <!-- Welcome Text Section -->
        <div class="row text-center mb-4" :style="{ width: '80%' }">
          <div class="col-12">
            <h1 class="fs-1 fw-bold">Hey, Welcome to HouseHold V2 App</h1>
            <p class="fs-5 mt-3">
              A multi-user platform connecting admins, service professionals, and customers to provide comprehensive home servicing solutions.
            </p>
          </div>
        </div>
  
        <!-- Image and Animation Section -->
        <div class="row d-flex align-items-center justify-content-center" :style="{ width: '80%' }">
          <div class="col-md-6 text-center">
            <img 
              src="static/hom.png" 
              alt="Home Service Image" 
              class="animated-image rounded shadow"
              :style="{ width: '80%', height: 'auto' }"
            />
          </div>
          
        </div>
      </div>
    `,
  };
  
