// Configuração do gráfico
const ctx = document.getElementById('fluxoChart').getContext('2d');
const chart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: [],  // Tempo
    datasets: [{
      label: 'Fluxo de Água (L/min)',
      data: [],
      borderColor: 'rgba(75, 192, 192, 1)',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderWidth: 1
    }]
  },
  options: {
    scales: {
      x: {
        title: {
          display: true,
          text: 'Tempo'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Fluxo (L/min)'
        },
        beginAtZero: true
      }
    }
  }
});

// Atualizar o gráfico com novos dados
function updateChart() {
  fetch('http://192.168.115.221/dados')  // Substitua pelo IP do ESP
    .then(response => response.json())
    .then(data => {
      const time = new Date().toLocaleTimeString();  // Hora atual
      chart.data.labels.push(time);  // Adiciona tempo no eixo X
      chart.data.datasets[0].data.push(data.fluxo);  // Adiciona fluxo no eixo Y

      // Limita o gráfico a 10 pontos
      if (chart.data.labels.length > 10) {
        chart.data.labels.shift();
        chart.data.datasets[0].data.shift();
      }

      chart.update();  // Atualiza o gráfico
    })
    .catch(error => console.error('Erro ao buscar dados:', error));
}

// Atualizar dados a cada segundo
setInterval(updateChart, 1000);
