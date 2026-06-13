# Planejai

O Planejai é uma aplicação web voltada para planejamento financeiro pessoal. A proposta é transformar uma simples simulação em uma experiência guiada, com análise inteligente, recomendações e acompanhamento de metas financeiras.

## Visão geral

A aplicação permite que o usuário:

- informe renda, despesas, dívidas e o objetivo financeiro desejado;
- visualize quanto precisa economizar por mês para alcançar a meta;
- veja insights personalizados gerados com IA;
- converse com um educador financeiro virtual sobre a simulação;
- consulte o histórico de simulações salvas no navegador.

## Fluxo da aplicação

1. O usuário entra na tela inicial e responde um formulário em etapas.
2. As informações são salvas no `localStorage` como uma simulação.
3. A aplicação calcula a economia mensal necessária para atingir a meta.
4. A tela de resultados exibe os dados principais e os insights financeiros.
5. O usuário pode fazer perguntas adicionais para o assistente financeiro, que responde com base na simulação e no histórico da conversa.
6. As simulações podem ser acessadas posteriormente a partir do histórico.

## Funcionalidades principais

- Formulário multi-etapas para entrada de dados financeiros
- Cálculo de economia mensal necessária
- Página de resultados com resumo da simulação
- Insights financeiros personalizados com IA
- Conversa com um educador financeiro virtual
- Histórico de simulações com possibilidade de exclusão
- Persistência local das simulações e das conversas

## Arquitetura e organização do projeto

A estrutura foi organizada para separar responsabilidades por domínio e camada:

```text
src/
  components/
    features/
      Insights/
      Simulation/
      SimulationResults/
    layout/
    shared/
  context/
    theme/
  data/
    aiPrompt.ts
    simulation.ts
  hooks/
    useInsight.tsx
    useSimulationStorage.tsx
    useTheme.tsx
  pages/
    SimulationFormPage.tsx
    SimulationResultsPage.tsx
    SimulationHistoryPage.tsx
  services/
    aiService.ts
  styles/
    theme.css
  utils/
    currency.ts
    simulation.ts
```

### Principais diretórios

- `components/features/Simulation` — formulário e fluxo de simulação em etapas.
- `components/features/SimulationResults` — cards e composição da tela de resultados.
- `components/features/Insights` — renderização dos insights financeiros.
- `components/shared` — componentes reutilizáveis, como botões, header e hero.
- `context/theme` — gerenciamento de tema claro/escuro.
- `hooks` — lógica de persistência, insights e tema.
- `services` — integração com a API de IA.
- `utils` — funções auxiliares de cálculo e formatação.

## Regras e comportamento do domínio

- Cada simulação recebe um `id` único.
- Os dados são persistidos no `localStorage` para permitir recuperação posterior.
- A tela de resultados depende do `id` da simulação para carregar os dados corretos.
- O histórico exibe um resumo das simulações salvas e permite navegar para os detalhes.
- O assistente financeiro responde com base na simulação atual e no histórico da conversa.

## Tecnologias utilizadas

- React 19
- TypeScript
- Vite
- React Router DOM
- Tailwind CSS
- Lucide React
- React Loading Skeleton
- localStorage

## Variáveis de ambiente

A aplicação utiliza a API Gemini para gerar insights e respostas. Para funcionar corretamente, defina a variável abaixo no arquivo `.env` da raiz do projeto:

```env
VITE_GEMINI_API_KEY=sua_chave_aqui
```

## Como executar localmente

1. Instale as dependências:

```bash
npm install
```

2. Crie o arquivo `.env` com a chave da API Gemini.

3. Inicie o projeto:

```bash
npm run dev
```

## Scripts disponíveis

- `npm run dev` — inicia o servidor de desenvolvimento.
- `npm run build` — cria a build de produção.
- `npm run lint` — executa a análise de código com ESLint.

## Observações importantes

- O projeto ainda depende de uma chave válida de API para gerar insights e respostas de IA.
- A persistência é local, então os dados ficam salvos apenas no navegador do usuário.
- A experiência foi pensada para ser simples, visual e guiada, com foco em educação financeira.
