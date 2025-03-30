export default {
  template: `
  <div class="chart-container row" :style="{display: 'flex'}">
      <!-- Pie Chart -->
      <div class="col-5">
      <canvas :style="{width: '40%'}" id="pie-chart-id"></canvas>
      </div>
      <div class="col-5" :style="{display: 'flex', flexDirection : 'column', justifyContent : 'flex-end'}">
      <!-- Bar Chart -->
      <canvas class="col-5" id="bar-chart-id"></canvas>
      </div>
  </div>
  `,
  data() {
      return {
          // Data for Pie Chart (Category Distribution)
          pieChartData: {
              labels: [],
              datasets: [
                  {
                      label: "Category Distribution",
                      data: [],
                      backgroundColor: [
                          "#FF6384",
                          "#36A2EB",
                          "#FFCE56",
                          "#4BC0C0",
                          "#9966FF",
                          "#FF9F40",
                      ],
                  },
              ],
          },
          pieChartOptions: {
              responsive: true,
              plugins: {
                  legend: {
                      display: true,
                      position: "top",
                  },
                  title: {
                      display: true,
                      text: "Category Distribution (Pie Chart)",
                  },
              },
          },

          // Data for Bar Chart (Status Distribution)
          barChartData: {
              labels: [],
              datasets: [
                  {
                      label: "Status Counts",
                      data: [],
                      backgroundColor: [ "#FF6384",
                        
                        "#FFCE56",
                        "#4BC0C0",
                        "#9966FF"]
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
                      text: "Status Distribution (Bar Chart)",
                  },
              },
          },
      };
  },
  mounted() {
      this.loadData();
  },
  methods: {
      async loadData() {
          try {
              const response = await fetch("http://127.0.0.1:5000/api/analyseAdmin", {
                  headers: {
                      "Content-Type": "application/json",
                      "Authentication-token": localStorage.getItem("auth_token"),
                  },
              });
              const data = await response.json();
              console.log("API Response:", data);

              // Populate Pie Chart Data
              const pieLabels = data.pieChartData.map((item) => item.label);
              const pieValues = data.pieChartData.map((item) => item.value);
              this.pieChartData.labels = pieLabels;
              this.pieChartData.datasets[0].data = pieValues;

              // Populate Bar Chart Data
              const barLabels = data.barChartData.map((item) => item.label);
              const barValues = data.barChartData.map((item) => item.value);
              this.barChartData.labels = barLabels;
              this.barChartData.datasets[0].data = barValues;

              // Render Charts
              this.renderPieChart();
              this.renderBarChart();
          } catch (err) {
              console.error("Error fetching chart data:", err);
          }
      },

      renderPieChart() {
          const ctx = document.getElementById("pie-chart-id").getContext("2d");
          new Chart(ctx, {
              type: "pie", // Pie chart type
              data: this.pieChartData,
              options: this.pieChartOptions,
          });
      },

      renderBarChart() {
          const ctx = document.getElementById("bar-chart-id").getContext("2d");
          new Chart(ctx, {
              type: "bar", // Bar chart type
              data: this.barChartData,
              options: this.barChartOptions,
          });
      },
  },
};
