const subjects = [
    { name: "Korean Language", hours: 2.83 },
    { name: "Physical Education", hours: 1.00 },
    { name: "Sociology", hours: 3.00 },
    { name: "Informatics", hours: 2.83 },
    { name: "Art and Culture", hours: 1.50 },
    { name: "Sundanese Language", hours: 1.33 },
    { name: "Mathematics", hours: 2.67 },
    { name: "History", hours: 1.33 },
    { name: "Economics", hours: 4.00 },
    { name: "Geography", hours: 3.67 },
    { name: "Civics", hours: 2.50 },
    { name: "Indonesian Language", hours: 2.67 },
    { name: "English Language", hours: 2.00 },
    { name: "Religious Studies", hours: 2.00 },
    { name: "Guidance and Counseling", hours: 0.67 }
];

const colors = [
    '#4a90e2', '#50e3c2', '#f5a623', '#7ed321', '#bd10e0',
    '#9013fe', '#417505', '#d0021b', '#4a4a4a', '#8b572a',
    '#b8e986', '#50e3c2', '#f8e71c', '#9b9b9b', '#7ed321'
];

// Create chart instance
const ctx = document.getElementById('hoursChart').getContext('2d');
new Chart(ctx, {
    type: 'doughnut',
    data: {
        labels: subjects.map(s => s.name),
        datasets: [{
            data: subjects.map(s => s.hours),
            backgroundColor: colors,
            borderColor: 'rgba(0, 0, 0, 0.1)',
            borderWidth: 1,
            hoverOffset: 15
        }]
    },
    options: {
        responsive: true,
        cutout: '60%',
        plugins: {
            legend: {
                display: false
            }
        }
    }
});

// Create legend items
const legendContainer = document.querySelector('.legend-container');
subjects.forEach((subject, index) => {
    const legendItem = document.createElement('div');
    legendItem.className = 'legend-item';
    legendItem.innerHTML = `
        <span class="legend-color" style="background-color: ${colors[index]}"></span>
        <span class="legend-text">${subject.name}</span>
        <span class="legend-hours">${subject.hours}h</span>
    `;
    legendContainer.appendChild(legendItem);
});
