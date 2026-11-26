# HiddenTerminal v2.0 — Rabbit Hole Edition

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
node docs/console-v2.test.mjs
```

## Como funciona

- `engine.mjs`: interpreta comandos e devolve dados estruturados; não depende do DOM.
- `console-v2.mjs`: interface, histórico, som opcional sintetizado no navegador e renderização com textContent.
- `console-core-v2.mjs`: banners ASCII, quadros de animação, catálogo de módulos e controle de sequências canceláveis.
- `index.html` / `console-v2.css`: interface responsiva de console, controles por teclado e log acessível. O movimento reduzido é respeitado.
- `banner`, `version`, `show modules`, `use <module>` e `sound on/off`: comandos do console.
- `rabbit`: desafio de codificação Base64. O progresso dura até recarregar a página ou usar reset.
- Não há execução de shell real, backend, coleta de dados pelo código ou acesso a arquivos locais. O conteúdo de ls e cat é simulado.

## Publicar

Settings → Pages → Deploy from a branch → main → /docs → Save.

[Voltar ao perfil](../README.md)
