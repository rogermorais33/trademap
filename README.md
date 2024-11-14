# Project TradeMap

Este projeto tem como objetivo buscar dados da ComtradeAPI, processá-los no backend e gerar arquivos CSV ou XLS com as informações recuperadas. O frontend é desenvolvido em React puro e permite ao usuário selecionar filtros e parâmetros para refinar sua pesquisa, enquanto o backend é responsável por processar as requisições e interagir com a ComtradeAPI.

## Arquitetura do Projeto

O projeto é dividido em duas partes principais:

1. **Frontend** - Responsável pela interface do usuário e pela interação com o backend.
2. **Backend** - Responsável pela lógica de negócios, comunicação com a ComtradeAPI e geração dos arquivos de saída.

### Fluxo do Sistema

1. O usuário interage com o frontend, selecionando filtros e parâmetros para refinar a pesquisa.
2. O frontend envia esses parâmetros ao backend via uma requisição HTTP.
3. O backend usa a ComtradeAPI para buscar os dados conforme os filtros fornecidos.
4. O backend processa os dados e gera um arquivo CSV ou XLS.
5. O usuário pode então fazer o download do arquivo gerado.

---

## Frontend

O frontend é desenvolvido utilizando **React** e é responsável por fornecer a interface para o usuário selecionar os parâmetros de pesquisa.

### Descrição do Frontend
- React: Biblioteca principal utilizada para criar a interface do usuário.
- Axios: Biblioteca para fazer requisições HTTP ao backend.
- MUI (Material-UI): Framework de componentes React que facilita a criação da interface do usuário.
- React Router Dom: Usada para navegação entre diferentes páginas da aplicação.

## Backend

O backend é desenvolvido utilizando Node.js com TypeScript e é responsável por processar as requisições do frontend, acessar a ComtradeAPI e gerar os arquivos CSV ou XLS.

### Descrição do Backend
- Express: Framework para construção de APIs RESTful.
- Axios: Biblioteca para fazer requisições HTTP à ComtradeAPI.
- CSV-Writer: Biblioteca para escrever arquivos CSV.
- ExcelJS: Biblioteca para gerar arquivos XLS.
- TypeScript: Usado para garantir tipos fortes e melhor escalabilidade do código.
- CORS: Usado para habilitar comunicação entre diferentes origens (entre frontend e backend).
- pg: Cliente PostgreSQL, caso o sistema precise armazenar dados em banco de dados.

## Como Rodar o Projeto

### Frontend
Navegue até a pasta do frontend: `cd frontend`

Instale as dependências: `npm install`

Inicie o servidor de desenvolvimento: `npm start`

A aplicação estará disponível em http://localhost:3000.

### Backend
Navegue até a pasta do backend: `cd backend`

Instale as dependências: `npm install`

Crie o arquivo .env com a subscription key, seguindo o .env.example `SUBSCRIPTION_KEY=subscription_key`

Inicie o servidor backend: `npm run dev`

O backend estará rodando em http://localhost:5000.

### Rodar com o docker
- `docker compose up -d`
- A aplicação estará disponível em http://localhost:3000.
- O backend estará rodando em http://localhost:5000.


## Fluxo de Dados
- Frontend: O usuário seleciona filtros (ex: país, ano, produto) e envia a requisição ao backend.
- Backend:
    - O backend recebe os parâmetros do frontend.
    - Faz uma requisição à ComtradeAPI usando os parâmetros fornecidos.
    - Processa os dados e gera um arquivo CSV ou XLS.
- Frontend: O arquivo gerado é enviado ao frontend, que disponibiliza um link para o download.

## Referência das Tabelas (ComtradeAPI)
- Para melhor compreensão e uso das tabelas de referência fornecidas pela ComtradeAPI, você pode consultar o arquivo JSON da lista de todas as tabelas de referência através do seguinte endpoint da ComtradeAPI:

- [List of Reference Tables](https://comtradeapi.un.org/files/v1/app/reference/ListofReferences.json).

- Este JSON contém informações sobre os parâmetros que são utilizados nas requests para a API.

## Documentação da API
- [Documentação Backend](backend/README.md)