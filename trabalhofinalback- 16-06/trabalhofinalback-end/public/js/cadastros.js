// VACINA.HTML --- CADASTRO DA VACINA

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("form-agendamento");

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const vacina = document.getElementById("vacina").value.trim();
    const descricao = document.getElementById("descricao").value.trim();
    const quantidade = parseInt(document.getElementById("quantidade").value);
    const reaplicacao = document.getElementById("reaplicacao").value || null;

    const novaVacina = {
      vacina: vacina,
      descricao: descricao,
      quantidade: quantidade,
      reaplicacao: reaplicacao // deve ser uma string em formato "YYYY-MM-DD"
    };

    try {
      const response = await fetch("http://localhost:8080/api/vacinas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(novaVacina)
      });

      if (response.ok) {
        alert("Vacina cadastrada com sucesso!");
        form.reset();
      } else {
        const erro = await response.text();
        alert("Erro ao cadastrar vacina: " + erro);
      }
    } catch (err) {
      console.error("Erro na requisição:", err);
      alert("Erro de conexão com o servidor.");
    }
  });
});

// DOENCAS.HTML --- CADASTRO DE DOENÇA

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("form-agendamento");

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    // Captura os valores dos inputs
    const nome = document.getElementById("nome").value.trim();
    const local = document.getElementById("local").value.trim();
    const casos = document.getElementById("casos").value.trim();
    const sintomas = document.getElementById("sintomas").value.trim();
    const medidas = document.getElementById("medidas").value.trim();

    // Monta o objeto de doença
    const novaDoenca = {
      nome: nome,
      local: local,
      casos: casos,
      sintomas: sintomas,
      medidasPreventivas: medidas
    };

    try {
      const response = await fetch("http://localhost:8080/api/doencas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(novaDoenca)
      });

      if (response.ok) {
        alert("Doença cadastrada com sucesso!");
        form.reset();
      } else {
        const erro = await response.text();
        alert("Erro ao cadastrar doença: " + erro);
      }
    } catch (err) {
      console.error("Erro na requisição:", err);
      alert("Erro de conexão com o servidor.");
    }
  });
});



