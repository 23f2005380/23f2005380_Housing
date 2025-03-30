export default {
    template: `
    <div class="chart-container row d-flex" :style="{display: 'flex', justifyContent : 'center'}">
    <div class="col-10">
        <!-- Bar Chart for Professional Services -->
        <canvas id="professional-bar-chart"></canvas>
        </div>
    </div>
    `,
    data() {
        return {
            // Data for Bar Chart (Professional Services)
            barChartData: {
                labels: [],
                datasets: [
                    {
                        label: "Services Count",
                        data: [],
                        backgroundColor: ["#DB1F48", "#66BB6A"], // Colors for bars
                    },
                ],
            },
            barChartOptions: {
                responsive: true,
                plugins: {
                    legend: {
                        display: true,
                        position: "top",
                    },
                    title: {
                        display: true,
                        text: "Services (Accepted vs Completed)",
                    },
                },
            },
        };
    },
    mounted() {
        this.loadBarChartData();
    },
    methods: {
        async loadBarChartData() {
            try {
                const response = await fetch("http://127.0.0.1:5000/api/professionalServices", {
                    headers: {
                        "Content-Type": "application/json",
                        "Authentication-token": localStorage.getItem("auth_token"),
                    },
                });
                const data = await response.json();
                console.log("Bar Chart Data:", data);
  
                // Extract labels and values for bar chart
                const labels = data.map((item) => item.label);
                const values = data.map((item) => item.value);
  
                this.barChartData.labels = labels;
                this.barChartData.datasets[0].data = values;
  
                // Render Bar Chart
                this.renderBarChart();
            } catch (err) {
                console.error("Error fetching bar chart data:", err);
            }
        },
  
        renderBarChart() {
            const ctx = document.getElementById("professional-bar-chart").getContext("2d");
            new Chart(ctx, {
                type: "bar", // Bar chart type
                data: this.barChartData,
                options: this.barChartOptions,
            });
        },
    },
  };
  