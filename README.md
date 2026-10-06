# Pokédex

Uma aplicação web para explorar Pokémon, escolher favoritos e cadastrar uma
coleção. O projeto combina uma interface em React com uma API em Express e um
banco de dados MongoDB.

## Funcionalidades

- Explorar o catálogo com busca por nome ou número.
- Filtrar por tipo, ordenar os resultados e alternar entre grade e lista.
- Consultar detalhes ou descobrir um Pokémon aleatório com “Surpreenda-me”.
- Marcar Pokémon como favoritos e consultar a página de favoritos.
- Cadastrar e editar Pokémon da coleção, informando nome, tipo e nível.

O formulário valida o preenchimento dos campos e aceita níveis inteiros entre
1 e 100. A interface apresenta mensagens de carregamento, confirmação e erro
nas operações com a API.

## De onde vêm os dados?

| Dados | Onde ficam | Como são usados |
| --- | --- | --- |
| Catálogo da Pokédex | `client/src/data/catalog.json` | A página inicial lê os dados que acompanham o frontend, sem consultar a API do servidor. |
| Coleção cadastrada | MongoDB Atlas | A API salva e consulta os Pokémon criados pelo formulário. |
| Favoritos | `localStorage` do navegador | O navegador guarda os identificadores dos Pokémon marcados como favoritos. |

Explorar o catálogo não depende da conexão com o banco. Já cadastrar, editar
e carregar a coleção exige que o backend e o MongoDB estejam disponíveis.
Os favoritos ficam no navegador utilizado e não são sincronizados entre
dispositivos. A coleção atual não possui separação por usuário ou login.

## Como a aplicação funciona

O **frontend** é a parte que aparece no navegador: páginas, cartões, filtros e
formulários. O **backend** recebe as requisições HTTP e executa as operações no
banco de dados. O **MongoDB** mantém os registros da coleção.

Por exemplo, ao cadastrar um Pokémon:

1. A pessoa preenche nome, tipo e nível no formulário.
2. O frontend valida os campos e envia um `POST /api/pokemon` com os dados em JSON.
3. O Express recebe a requisição e chama o controlador responsável pelo cadastro.
4. O controlador usa o modelo Mongoose para salvar o registro no MongoDB.
5. A API devolve o Pokémon salvo, e o frontend atualiza a coleção e mostra a confirmação.

As consultas e edições seguem o mesmo caminho: navegador → API → banco de dados.

## Tecnologias

| Tecnologia | Papel no projeto |
| --- | --- |
| React e Vite | Construção da interface e geração dos arquivos para publicação. |
| React Router | Navegação entre páginas sem recarregar toda a aplicação. |
| Tailwind CSS | Estilização da interface. |
| Axios | Envio das requisições HTTP à API. |
| TanStack Query | Gerenciamento das consultas, cache e atualização dos dados da coleção. |
| React Hook Form | Controle dos campos e validação dos formulários. |
| Node.js e Express | Execução do servidor e definição das rotas da API. |
| Mongoose e MongoDB Atlas | Modelagem e armazenamento dos Pokémon cadastrados. |

## Organização do repositório

```text
pokedex/
├── client/                      # Frontend React
│   ├── services/                # Funções que chamam a API
│   └── src/
│       ├── components/          # Cartões, formulário e detalhes
│       ├── data/                # Catálogo e informações dos tipos
│       ├── pages/               # Listagem da Pokédex, favoritos e coleção
│       └── App.jsx              # Rotas e estrutura principal da interface
├── server/                      # Backend Express
│   ├── controllers/             # Cadastro, consulta, edição e exclusão
│   ├── models/                  # Modelo dos registros no MongoDB
│   ├── routes/                  # Endpoints da API
│   ├── db.js                    # Conexão com o MongoDB Atlas
│   └── server.js                # Configuração e entrada do servidor
└── vercel.json                  # Serviços e roteamento para publicação
```

## Páginas e endpoints

| Página | Caminho |
| --- | --- |
| Catálogo da Pokédex | `/` |
| Favoritos | `/favoritos` |
| Coleção cadastrada | `/colecao` |
| Cadastro de Pokémon | `/pokemon` |
| Edição de Pokémon | `/pokemon/:id` |

Na API, `:id` representa o identificador do registro no MongoDB, e não o número
do Pokémon no catálogo.

| Método | Endpoint | Operação |
| --- | --- | --- |
| `GET` | `/api/pokemon` | Listar a coleção. |
| `GET` | `/api/pokemon/:id` | Consultar um registro. |
| `POST` | `/api/pokemon` | Cadastrar um registro. |
| `PATCH` | `/api/pokemon/:id` | Editar um registro. |
| `DELETE` | `/api/pokemon/:id` | Excluir um registro pela API. |

Exemplo de corpo JSON para cadastro:

```json
{
  "name": "Pikachu",
  "type": "electric",
  "level": 10
}
```

## Executar localmente

Você precisa de Node.js, npm e uma conexão MongoDB Atlas para as funcionalidades
da coleção. Instale as dependências de cada parte, a partir da raiz:

```sh
npm install --prefix client
npm install --prefix server
```

Configure `ATLAS_URL` em `server/.env` com sua conexão do Atlas. O servidor
carrega esse arquivo ao ser iniciado dentro da pasta `server`:

```dotenv
ATLAS_URL=mongodb+srv://USUARIO:SENHA@SEU_CLUSTER/SEU_BANCO
PORT=8000
```

Para usar dois servidores separados, crie `client/.env.local` com:

```dotenv
VITE_API_URL=http://localhost:8000/api
```

Em um terminal, execute o backend:

```sh
cd server
npm run dev
```

Em outro terminal, execute o frontend:

```sh
cd client
npm run dev
```

Abra o endereço informado pelo Vite. O backend usa a porta 8000 por padrão.
O comando `npm start` na pasta `server` também inicia o backend, sem o
reinício automático oferecido pelo comando de desenvolvimento.

Para verificar o frontend, execute na pasta `client`:

```sh
npm run lint
npm run build
```

## Publicação na Vercel

Importe o repositório como um único projeto e configure a **Root Directory**
como a raiz do repositório. O `vercel.json` define dois serviços independentes:

- `client`: frontend Vite, público em `/` e nos caminhos que não pertencem à API.
- `server`: backend Express, público em `/api` e `/api/*`.

O navegador chama `/api` no mesmo domínio da aplicação. O Express recebe o
caminho completo, incluindo esse prefixo. O frontend possui uma regra para
carregar a aplicação ao abrir diretamente páginas como `/colecao`.

Na Vercel, deixe `VITE_API_URL` sem definição ou use `/api`. Remova qualquer
valor de localhost dessa configuração. Essa variável é incorporada ao frontend
durante o build; ela não é uma variável de binding em tempo de execução.

Não há bindings entre serviços: as chamadas à API partem do navegador, e o
backend se conecta ao MongoDB Atlas, que é externo. Bindings da Vercel atendem
a chamadas entre funções de serviços no servidor.

Defina `ATLAS_URL` nas variáveis de ambiente do projeto Vercel para os ambientes
de publicação utilizados e configure o acesso de rede no Atlas. Mantenha a
string de conexão fora do código versionado e das variáveis do frontend.

### Verificar os serviços juntos

Com a CLI da Vercel disponível, execute na raiz do repositório:

```sh
vercel dev
```

Use `vercel dev --local` para executar sem autenticação na nuvem. Nesse modo,
as variáveis do projeto remoto não são importadas; forneça `ATLAS_URL` no
ambiente local. Para verificar o roteamento compartilhado, deixe `VITE_API_URL`
sem definição ou use `/api` também na configuração local do cliente.

Verifique a página inicial, abra `/colecao` diretamente e consulte
`/api/pokemon`. Um caminho desconhecido da API deve retornar um erro 404 do
Express, em vez do HTML do frontend.

## Licença

O código é distribuído sob a [licença MIT](LICENSE). Pokémon é uma marca de
Nintendo, Creatures e GAME FREAK; esta aplicação é um projeto de fã.
