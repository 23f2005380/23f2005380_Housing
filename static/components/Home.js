export default {
    template: `
        <div class="container d-flex" :style="{height: '90vh', display: 'flex', flexDirection : 'column', justifyContent : 'center'} ">
            <div  class="row pl-3 mt-2" :style="{height: '40%'}">
                <div class="col-6 text-center">
                    <div class="fs-2 pt-10">Hey, Welcome to _______ app
                    </div>
                    <div class="fs-4">It is a multi-user app (requires one admin and other service professionals/ customers) which acts as platform for providing comprehensive home servicing and solutions.
                    </div>
                </div>

                <div class="col-6 d-flex pt-0 mt-0 rounded" :style="{display:'flex',alignItems: 'center',flexDirection: 'column'}"><img class="rounded" src="static/hom.png" width="80%" height="60%" alt="image" /></div>
            </div>
           
        </div>
    `
}