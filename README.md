README
# Clínica Vida Imunizada 🏥💉
Sistema de controle, agendamento e histórico de vacinação, desenvolvido para oferecer aos usuários uma plataforma digital prática, segura e acessível para o gerenciamento de sua saúde vacinal.
---
## 📋 Descrição do Projeto
O projeto tem como objetivo principal permitir que os cidadãos:
- Acessem informações detalhadas de cada vacina.
- Realizem agendamentos para vacinação presencial ou domiciliar.
- Recebam notificações sobre vacinas pendentes ou agendadas.
- Consultem o histórico completo de vacinas.
- Interajam com o atendimento via WhatsApp.
- Visualizem seu caderno digital de saúde.
- Acompanhem o mapa com dados de doenças por localização.
O sistema será baseado em **arquitetura monolito**, com **interfaces web**, integradas por **APIs REST**.
---
## 👥 Perfis de Usuários
- **Usuários finais:** Cidadãos que agendam e acompanham suas vacinas.
- **Administradores da clínica:** Gerenciam vacinas e gerenciamento dos agendamentos, registrnado as aplicações.
- **Atendentes de suporte:** Prestam atendimento via WhatsApp.
---
## ❗ Problemas Resolvidos pelo Sistema
- Falta de controle digital do histórico vacinal.
- Desorganização de agendamentos.
- Esquecimento de datas importantes.
- Falta de acesso fácil a informações específicas de vacinas.
- Atendimento lento e burocrático.
---
## ✅ Requisitos Funcionais (Principais)
- Cadastro de usuários
- Login de usuários
- Consulta de vacinas disponíveis
- Visualização detalhada das vacinas
- Marcação e cancelamento de agendamentos
- Notificações de lembrete
- Visualização de histórico de vacinas
- Acesso ao caderno digital de saúde
- Atendimento via WhatsApp
- Visualização de doenças por localização no mapa
- Recuperação de senha
*(Para detalhes completos, consulte a documentação oficial dos requisitos.)*
---
## 🧱 Requisitos Não Funcionais
- Usabilidade e acessibilidade
- Performance (carregamento em até 3 segundos)
- Segurança com criptografia
- Compatibilidade entre navegadores e dispositivos
- Manutenibilidade seguindo boas práticas de código
---
## 📐 Arquitetura e Tecnologias
- **Backend:** Java.
- **Frontend:** Web.
- **API:** REST
- **Banco de Dados:** MySQL.
- **Serviços Externos:** Google Maps API (para mapa de doenças)
⚙️ Tecnologias Utilizadas
Java 17
Spring Boot
Spring Data JPA
Spring Security + JWT
Maven
Banco de dados MySQL
Jackson (JSON)
---
## 📁 Estrutura de Pacotes
com.vacinacao.agvacinacao
├── config           # Autenticação e filtros JWT
├── controller       # Endpoints REST
├── dto              # Data Transfer Objects
├── model            # Entidades JPA
├── repository       # Interfaces com o banco
├── service          # Regras de negócio
└── AgVacinacaoApplication.java  # Classe principal
---
## 🔑 Autenticação
Endpoint de login: http POST /api/login Body: { "login": "admin", "senha": "123" }
Retorna um JWT token.
Utilize o token nas requisições autenticadas: Authorization: Bearer <TOKEN>
---
## 🏃 Como Executar
Clone o repositório:
git clone https://github.com/Lealca10/agvacinacao.git
cd nome-do-repo
E o emmso poderá ser feito para o front-end: https://github.com/leopax2212/Front-ClinicaVI.git
Execute com Maven:
mvn spring-boot:run
Ou execute pela sua IDE preferida com a classe AgVacinacaoApplication.java.
---
## 🧪 Testes
A aplicação pode ser testada com ferramentas como:
Postman
Insomnia
Front-end próprio
## 🧠 Licença
Este projeto é de uso educacional e livre para modificação.
---
## 📊 Diagrama de Classe e MER
Os diagramas de classe e o modelo de entidade-relacionamento (MER) estão incluídos na documentação do projeto.
---
## 👩‍💻 Equipe Responsável
- **Carine Cavalheiro:** Documentação de Engenharia de Requisitos / Plano de Teste
- **Heloisa Margarida:** Documentação de Engenharia de Requisitos / Diagrama de Classe
- **Leandro De Alcantara:** Desenvolvimento Back End / MER
- **Leonardo Duarte:** Desenvolvimento Front End
**Professores Orientadores:**
- Heloisa Claudia Barros De Moura (Back End)
- Rodrigo Azevedo Da Costa (Front End)
---
## 📄 Licença
Projeto acadêmico sem fins comerciais.
---
## ✉️ Contato
Para dúvidas ou mais informações, entre em contato com os responsáveis pelo projeto.
---
