# HiddenTerminal

Um portfólio interativo inspirado em terminais retrô. JavaScript sem frameworks, HTML e CSS responsivo.

## Rodar localmente

Com Python instalado, na raiz do repositório:

```sh
python -m http.server 8000 --directory docs
```

Abra http://localhost:8000 no navegador.

## Testes

Com Node.js 18+:

```sh
node docs/engine.test.mjs
node docs/rabbit-animation.test.mjs
```

## Como funciona

- `engine.mjs`: interpreta comandos e devolve dados estruturados; não depende do DOM.
- `terminal.mjs`: interface, histórico (setas ↑/↓) e renderização com textContent.
- `index.html` / `terminal.css`: interface responsiva, controles por teclado e log acessível.
- `rabbit-animation.mjs`: controla a animação do coelho, reinicia ao repetir o comando e cancela com `clear`/`reset`. O SVG e o CSS respeitam a preferência por movimento reduzido.
- `rabbit`: desafio de codificação Base64. O progresso dura até recarregar a página ou usar reset.
- Não há execução de shell real, backend, coleta de dados pelo código ou acesso a arquivos locais. O conteúdo de ls e cat é simulado.

## Publicar

Settings → Pages → Deploy from a branch → main → /docs → Save.

[Voltar ao perfil](../README.md)
