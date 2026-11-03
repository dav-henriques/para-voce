# para você ♡

Um potinho de vidro cheio de bilhetinhos, para ela abrir sempre que precisar de um carinho.
Funciona no celular e no computador, pode ser instalado na tela de início do iPhone como um
app de verdade e continua funcionando sem internet depois do primeiro acesso.

---

## 1. Personalizar (o mais importante)

**Tudo o que você precisa editar está em um único arquivo: [`src/content.js`](src/content.js).**

Lá você encontra:

| o quê | onde |
| --- | --- |
| textos da tela inicial ("oi, meu amor ♡"…) | `inicio` |
| os bilhetinhos de cada categoria | `bilhetes` |
| nomes, ícones e cores das categorias | `categorias` |
| a carta "abre quando precisar de mim" | `cartaEspecial` |
| assinatura dos bilhetes, música | `config` |
| textos dos botões | `textos` |

- Tudo que tem **✎** é exemplo: troque pelas suas palavras.
- Os textos entre **[colchetes]** (memórias e carta especial) são moldes. Eu não inventei nenhuma
  história de vocês: essas partes são suas.
- Para **adicionar um bilhete**, coloque mais uma linha entre aspas na categoria, com vírgula no fim:
  ```js
  carinho: [
    'você é a minha parte favorita de qualquer dia ♡',
    'um bilhete novo aqui ♡',
  ],
  ```
- O símbolo **♡** vira um coraçãozinho desenhado. Para quebrar linha dentro do bilhete, use `\n`.
- Se você editar o texto de um bilhete que ela já leu, ele volta a contar como "não lido".

### Fotos

1. Coloque a imagem em `public/fotos/` (de preferência `.jpg` com até ~1200px de largura).
2. No `content.js`, use o formato com objeto:
   ```js
   { texto: 'olha só que coisa mais linda ♡', foto: 'fotos/nossa-foto.jpg', legenda: 'nosso dia' },
   ```
3. Pode apagar o `public/fotos/exemplo.svg` quando não precisar mais dele.

### Música

A música que vem junto é uma **caixinha de música original**, gerada pelo próprio projeto
(`npm run musica`), então não tem problema de direitos autorais. Ela começa sempre desligada.

Para usar a música de vocês: coloque o arquivo (`.mp3` ou `.m4a`) em `public/musica/` e troque
`config.musica.arquivo` no `content.js`. Se a música for longa (mais de ~2 min), deixe
`streaming: true` para economizar memória do celular.

---

## 2. Rodar no computador

Precisa do [Node.js](https://nodejs.org) 20 ou mais novo.

```bash
npm install
```

```bash
npm run dev
```

Abra o endereço que aparecer (ex.: `http://localhost:5173`). O `--host` já vem ligado, então dá
para abrir pelo celular na mesma rede Wi-Fi usando o endereço "Network" que aparece no terminal.

Para **zerar o progresso** enquanto testa, abra o site com `?recomecar` no fim do endereço
(ex.: `http://localhost:5173/?recomecar`).

---

## 3. Publicar na web

```bash
npm run build
```

Isso gera a pasta `dist/`, que é o site pronto. Qualquer hospedagem de site estático serve
(precisa ser **https** para funcionar como app no iPhone):

- **Netlify** (o mais fácil): entre em [app.netlify.com/drop](https://app.netlify.com/drop) e
  arraste a pasta `dist/`. Pronto, ele te dá um link.
- **Vercel** ou **Cloudflare Pages**: conecte o repositório; comando de build `npm run build`,
  pasta de saída `dist`.
- **GitHub Pages**: veja abaixo.

O site tem `noindex`, então não aparece no Google.

### GitHub Pages

O projeto já vem com um workflow ([.github/workflows/pages.yml](.github/workflows/pages.yml))
que gera e publica o site sozinho a cada `push` na branch `main`.

1. Crie um repositório no GitHub (ex.: `para-voce`) e envie o projeto para a branch `main`.
2. No repositório, vá em **Settings › Pages** e, em *Build and deployment*, escolha
   **Source: GitHub Actions**.
3. Pronto: em 1–2 minutos o site aparece em `https://<seu-usuario>.github.io/para-voce/`
   (o andamento fica na aba **Actions**).

O workflow ajusta a subpasta pelo nome do repositório automaticamente.

> **Atenção:** no plano gratuito, o GitHub Pages só funciona com repositório **público**, ou seja,
> qualquer pessoa pode abrir o `content.js` e ler os bilhetes no GitHub. Se preferir manter as
> mensagens mais reservadas, use o Netlify Drop (o código não fica exposto) ou um plano pago do
> GitHub, que permite Pages com repositório privado.

Para gerar a versão de subpasta no seu computador (sem o workflow):
PowerShell `$env:BASE='/para-voce/'; npm run build` · macOS/Linux `BASE=/para-voce/ npm run build`.

Sempre que você editar o `content.js`, rode `npm run build` e publique de novo. O app dela se
atualiza sozinho na próxima vez que ela abrir com internet.

---

## 4. Instalar no iPhone dela

1. Abrir o link no **Safari**.
2. Tocar no botão de **compartilhar** (no iOS mais novo, fica dentro do menu `···`).
3. Escolher **"Adicionar à Tela de Início"**.
4. Tocar em **Adicionar**.

O site também mostra essas instruções num link discreto ("como guardar esse cantinho no seu
iPhone?"), que some quando ele já está instalado.

> O iPhone guarda o progresso do app instalado separado do Safari. O ideal é ela usar sempre
> pelo ícone da tela de início.

---

## Por dentro

- **React + Vite**: componentes em `src/components/`, estilos em `src/styles/`.
- **GSAP**: o potinho flutuando e balançando, o voo do bilhete e a dobra do papel.
  O papel se desdobra de verdade, em 3 partes (bilhetes) ou 2 (carta), em `PapelDobravel.jsx`.
- **canvas-confetti**: a revoada de coraçõezinhos quando o selo do bilhete se solta.
- **Howler.js**: música de fundo (toca mesmo com o iPhone no silencioso).
- **Lucide**: os poucos ícones de interface (voltar, música, instruções).
- **vite-plugin-pwa**: manifest, service worker e cache para funcionar offline.
- Ilustrações (potinho, bilhetes, carta, rabiscos) são SVGs próprios, feitos à mão em código.
- Quem prefere menos movimento (Ajustes › Acessibilidade › Movimento) recebe transições
  suaves no lugar das animações.

### Ícones e telas de abertura

Ícones do app, `apple-touch-icon` e as telas de abertura do iPhone ficam em `public/` e são
gerados a partir de desenhos em `scripts/gerar-icones.mjs`:

```bash
npm run icones
```
