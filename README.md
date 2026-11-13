# CircleTour

Laboratório visual de trigonometria feito com HTML, CSS e módulos JavaScript nativos.

## Executar localmente

Como o projeto usa módulos ES, abra-o por um servidor local. Na pasta do projeto, execute:

```sh
python3 -m http.server 8000
```

Depois acesse `http://localhost:8000`.

## Estrutura

```text
index.html
style.css
styles/
  01-foundation.css
  02-layout.css
  03-components-and-tweaks.css
src/
  config.js
  dom.js
  main.js
  controllers/
    animation-controller.js
  math/
    graph.js
    trigonometry.js
  utils/
    svg.js
  views/
    circle-view.js
    graph-view.js
```

- `config.js` reúne escalas, tempos e definições das famílias de funções.
- `math/` contém cálculos e formatação sem dependências da interface.
- `views/` desenha e atualiza o círculo e os gráficos.
- `controllers/` coordena as animações e os controles relacionados.
- `main.js` liga as partes e mantém o estado da aplicação.
- `style.css` carrega os arquivos de estilo em ordem para preservar a cascata visual existente.
