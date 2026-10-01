# Pokédex

Interface em português feita com React, Vite e Tailwind CSS 4. O catálogo reúne uma seleção de Pokémon de Kanto, com ilustrações locais, busca por nome ou número, filtros por tipo, ordenação, paginação e estatísticas.

## Executar

```sh
npm install
npm run dev
```

Abra o endereço indicado pelo Vite. O catálogo funciona sem o servidor. A seção **Minha coleção** e os formulários de cadastro e edição usam a API existente em `http://localhost:8000/api`.

Para outro endereço de API, copie `.env.example` para `.env.local` e ajuste `VITE_API_URL`. Reinicie o Vite após alterar a variável.

## Funcionalidades

- `/`: catálogo com cartões, visualização em lista e detalhes de cada Pokémon.
- `/favoritos`: favoritos do catálogo e da coleção, salvos no navegador via `localStorage`.
- `/colecao`: Pokémon cadastrados na API, incluindo nível e acesso à edição.
- `/pokemon`: cadastro com validação de nome, tipo e nível de 1 a 100.
- `/pokemon/:id`: edição de um registro existente.

O catálogo ilustrativo não cria registros no banco de dados. Registros da coleção são associados às ilustrações pelo nome da espécie; apelidos ou espécies fora do catálogo recebem um ícone de Pokébola. Se a API estiver indisponível, a coleção mostra uma mensagem com opção de tentar novamente; o catálogo permanece acessível.

## Verificações

```sh
npm run lint
npm run build
```

O build é gerado em `dist/`. O servidor de hospedagem deve direcionar as rotas do aplicativo para `index.html`.

Dados e ilustrações: [PokéAPI](https://pokeapi.co/) e [repositório de sprites](https://github.com/PokeAPI/sprites). Projeto de fã; Pokémon pertence à Nintendo, Creatures e GAME FREAK.
