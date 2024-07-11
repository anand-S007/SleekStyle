
document.addEventListener('DOMContentLoaded', async () => {

    const chartSalesData = async () => {
        try {
            console.log('netry');
            const response = await fetch('/admin/dashboard/chartData');
            const data = await response.json();
            return data
        } catch (error) {
            console.log(error);
            throw error;
        }
    };

    const salesData = await chartSalesData()
    console.log('salesData',salesData);
    /*Monthly Sale statistics Chart*/
    var ctx = document.getElementById('monthlyChart').getContext('2d');
    var chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'line',
        // The data for our dataset
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [{
                label: 'Monthly sales',
                tension: 0.3,
                fill: true,
                backgroundColor: 'rgba(44, 120, 220, 0.2)',
                borderColor: 'rgba(44, 120, 220)',
                data: salesData.monthlySales
            },
            ]
        },
        options: {
            plugins: {
                legend: {
                    labels: {
                        usePointStyle: true,
                    },
                }
            },

        }
    });


    /*Yearly Sale statistics Chart*/
    const ctx2 = document.getElementById('yearlyChart').getContext('2d');
    var chart = new Chart(ctx2, {
        type: 'line',
        data: {
            labels: ['2022', '2023', '2024', '2025'], 
            datasets: [{
                label: 'Yearly sales',
                tension: 0.3,
                fill: true,
                backgroundColor: 'rgba(44, 120, 220, 0.2)',
                borderColor: 'rgba(44, 120, 220)',
                data: salesData.yearlySales
            },
            ]
        },
        options: {
            plugins: {
                legend: {
                    labels: {
                        usePointStyle: true,
                    },
                }
            },

        }
    });


    /*Sale statistics Chart*/
var ctx = document.getElementById("myChart2");
const barColors = [
    "#FFFF00","#FF0000","#87CEFA","#e8c3b9","#1e7145","#f0a30a"

];
var myChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
        labels: salesData.categoryNames,
        datasets: [
            {
                label: "Sales data",
                backgroundColor: barColors,
                barThickness: 10,
                data: salesData.categoryData
            },
        ]
    },
    options: {
        plugins: {
            legend: {
                labels: {
                    usePointStyle: true,
                },
            }
        },
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

})


