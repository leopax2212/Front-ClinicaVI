// Carregar navbar.html no placeholder
fetch("../header.html")
  .then(res => res.text())
  .then(data => {
    document.getElementById("navbar-placeholder").innerHTML = data;
  });

const apiUrl = "http://localhost:8080/doencas";

let doencas = [];
let map, markers = [];

fetch(apiUrl)
  .then(res => res.json())
  .then(data => {
    doencas = data;
    initDashboard();
  });

function initDashboard() {
  document.getElementById('totalDoencas').textContent = doencas.length;

  const cidades = [...new Set(doencas.map(d => d.local))];
  document.getElementById('totalCidades').textContent = cidades.length;

  renderTable(doencas);
  initMap();
}

// Renderizar tabela
function renderTable(data) {
  const tbody = document.getElementById('doencasTable');
  tbody.innerHTML = '';

  data.forEach(doenca => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${doenca.nomeDoenca}</td>
      <td>${doenca.local}</td>
      <td>${doenca.casos}</td>
      <td>${doenca.sintomas}</td>
      <td>${doenca.medidasPreventivas}</td>
    `;
    row.addEventListener('click', () => showCityOnMap(doenca.local));
    tbody.appendChild(row);
  });
}

function initMap() {
  map = L.map('map').setView([-27.2423, -50.2189], 7);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);
}

function showCityOnMap(city) {
  clearMarkers();

  const geolocations = {
    "Florianópolis": [-27.5954, -48.5480],
    "Joinville": [-26.3044, -48.8487],
    "Blumenau": [-26.9155, -49.0706],
    "Chapecó": [-27.1000, -52.6152],
    "Criciúma": [-28.6775, -49.3697],
    "Itajaí": [-26.9101, -48.6705],
    "São José": [-27.6136, -48.6366],
    "Lages": [-27.8150, -50.3259],
    "Balneário Camboriú": [-26.9926, -48.6352],
    "Jaraguá do Sul": [-26.4851, -49.0713],
    "Palhoça": [-27.6455, -48.6698],
    "Brusque": [-27.0977, -48.9107],
    "Tubarão": [-28.4713, -49.0144],
    "Araranguá": [-28.9356, -49.4918],
    "Gaspar": [-26.9336, -48.9534],
    "São Bento do Sul": [-26.2500, -49.3789],
    "Biguaçu": [-27.4955, -48.6556],
    "Concórdia": [-27.2346, -52.0267],
    "Navegantes": [-26.8942, -48.6546],
    "Rio do Sul": [-27.2156, -49.6436]
  };

  const coords = geolocations[city];
  if (!coords) return;

  map.setView(coords, 10);

  const marker = L.marker(coords)
    .addTo(map)
    .bindPopup(`<strong>${city}</strong>`);
  markers.push(marker);
}

function clearMarkers() {
  markers.forEach(m => map.removeLayer(m));
  markers = [];
}

// Filtro por campo de busca
document.getElementById('searchInput').addEventListener('input', function () {
  const term = this.value.toLowerCase();
  const filtered = doencas.filter(d =>
    d.nomeDoenca.toLowerCase().includes(term) ||
    d.local.toLowerCase().includes(term)
  );
  renderTable(filtered);
});

// Botão de filtro por número de casos
document.getElementById('filterButton').addEventListener('click', () => {
  const filtradas = doencas.filter(d => parseInt(d.casos) > 100);
  renderTable(filtradas);
});
