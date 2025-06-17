

const API_URL = "http://localhost:8080";
const form = document.getElementById('form-agendamento');
const pacienteSelect = document.getElementById('nome');
const vacinaSelect = document.getElementById('vacina');
const dataInput = document.getElementById('data');
const horarioSelect = document.getElementById('horario');

const token = localStorage.getItem("jwtToken"); // ou defina manualmente para testes

document.addEventListener("DOMContentLoaded", () => {
  carregarPacientes();
  carregarVacinas();
  preencherHorarios();
});

// Preenche o select com os pacientes
function carregarPacientes() {
  fetch(`http://localhost:8080/pacientes`, {
    headers: {
      'Authorization': 'Bearer ' + token
    }
  })
    .then(res => res.json())
    .then(pacientes => {
      pacienteSelect.innerHTML = '';
      pacientes.forEach(p => {
        const option = document.createElement('option');
        option.value = p.id;
        option.textContent = p.nome;
        pacienteSelect.appendChild(option);
      });
    });
}

// Preenche o select com vacinas
function carregarVacinas() {
  fetch(`http://localhost:8080/vacinas`, {
    headers: {
      'Authorization': 'Bearer ' + token
    }
  })
    .then(res => res.json())
    .then(vacinas => {
      vacinaSelect.innerHTML = '<option value="" disabled selected>Selecione uma vacina</option>';
      vacinas.forEach(v => {
        const option = document.createElement('option');
        option.value = v.id;
        option.textContent = v.nome;
        vacinaSelect.appendChild(option);
      });
    });
}

// Preenche horários padrões (08:00 às 17:00)
function preencherHorarios() {
  for (let hora = 8; hora <= 17; hora++) {
    const option = document.createElement("option");
    option.value = `${hora.toString().padStart(2, "0")}:00`;
    option.textContent = `${hora.toString().padStart(2, "0")}:00`;
    horarioSelect.appendChild(option);
  }
}

// Envio do formulário
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const pacienteId = pacienteSelect.value;
  const vacinaId = vacinaSelect.value;
  const data = dataInput.value;
  const horario = horarioSelect.value;

  const dataAplicacao = `${data}T${horario}:00`;

  const agendamento = {
    pacienteId,
    vacinaId,
    dataAplicacao
  };

  fetch(`http://localhost:8080/agendamentos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      'Authorization': 'Bearer ' + token
    },
    body: JSON.stringify(agendamento)
  })
    .then(res => {
      if (res.ok) {
        alert("Agendamento realizado com sucesso!");
        form.reset();
      } else {
        return res.json().then(err => {
          alert("Erro ao agendar: " + err.message || res.status);
        });
      }
    })
    .catch(err => {
      console.error(err);
      alert("Erro na requisição.");
    });
});
