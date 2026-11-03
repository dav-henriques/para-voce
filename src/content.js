/* ─────────────────────────────────────────────────────────────────────────────
   para você ♡ — conteúdo do potinho

   Este é o ÚNICO arquivo que você precisa editar para personalizar tudo:
   textos, bilhetinhos, categorias, fotos, carta especial e música.

   Dicas rápidas
   • Para adicionar um bilhete, é só colocar mais uma linha entre aspas
     dentro da categoria certa (não esqueça da vírgula no fim).
   • Para um bilhete com foto, use o formato { texto, foto, legenda }.
     Coloque a imagem na pasta  public/fotos/  e escreva o caminho
     como 'fotos/nome-da-foto.jpg'. Fotos de até ~1200px ficam leves e lindas.
   • O símbolo ♡ vira um coraçãozinho desenhado à mão automaticamente.
   • Para quebrar a linha dentro de um bilhete, use \n.
   • Tudo marcado com ✎ é um exemplo: troque pelas suas palavras.
     (os textos entre [colchetes] são moldes que só você pode escrever)
   ───────────────────────────────────────────────────────────────────────────── */

export const config = {
  // nome que aparece na aba do navegador e na tela de início do iPhone
  titulo: 'para você ♡',

  // aparece no cantinho de cada bilhete. deixe '' para não mostrar.
  assinatura: 'seu amor', // ✎

  // música de fundo (sempre começa desligada).
  // a "caixinha de música" que vem junto é uma melodia original, gerada pelo projeto.
  // para usar a música de vocês: coloque o arquivo em public/musica/
  // e troque o caminho abaixo, ex.: 'musica/nossa-musica.mp3'
  musica: {
    arquivo: 'musica/caixinha.mp3',
    volume: 0.55,
    // use true se a música for longa (mais de ~2 minutos): economiza memória no celular
    streaming: false,
  },
}

// textos da tela inicial
export const inicio = {
  saudacao: 'oi, meu amor ♡',
  subtitulo: 'fiz uma coisinha pra você.',
  texto:
    'às vezes a gente só precisa de um lembrete de que é muito amado. então coloquei alguns aqui dentro.',
  chamada: 'clique no potinho pra descobrir.',
}

// textinhos da interface (pode ajustar o tom como quiser)
export const textos = {
  guardar: 'guardar carinho ♡',
  maisUm: 'quero mais um',
  voltar: 'voltar ao potinho',
  qualquerUm: 'qualquer um',
  escolherCategoria: 'pegar um bilhete de…',
  guardarCarta: 'guardar carta ♡',
  todosAbertos: 'você já abriu todos ♡ pode pegar de novo quando quiser',
  dicaIphone: 'como guardar esse cantinho no seu iPhone?',
}

/* ── categorias ───────────────────────────────────────────────────────────────
   id      → nome interno (usado lá embaixo, em `bilhetes`)
   nome    → como aparece pra ela
   icone   → 'coracao' | 'sol' | 'carta' | 'brilho' | 'estrela'
   papel   → cor do papel por fora do bilhete dobrado
   selo    → cor do coraçãozinho que fecha o bilhete
   ───────────────────────────────────────────────────────────────────────────── */
export const categorias = [
  { id: 'carinho', nome: 'carinho', icone: 'coracao', papel: '#B83B4B', selo: '#FFF5EA' },
  { id: 'dias-dificeis', nome: 'dias difíceis', icone: 'sol', papel: '#D96B72', selo: '#FFF5EA' },
  { id: 'memorias', nome: 'nossas memórias', icone: 'carta', papel: '#8F2638', selo: '#F2C6BC' },
  { id: 'surpresinhas', nome: 'surpresinhas', icone: 'brilho', papel: '#F2C6BC', selo: '#B83B4B' },
]

/* ── bilhetinhos ──────────────────────────────────────────────────────────────
   Cada categoria tem sua listinha. Um bilhete pode ser:
     'só o texto'
     { texto: '...', foto: 'fotos/arquivo.jpg', legenda: 'opcional' }
   ───────────────────────────────────────────────────────────────────────────── */
export const bilhetes = {
  // ♡ carinho — mensagens românticas, elogios, lembretes de quanto ela é amada
  carinho: [
    'você é a minha parte favorita de qualquer dia ♡', // ✎
    'se você pudesse se ver do jeito que eu te vejo, nunca mais duvidaria do quanto é incrível.', // ✎
    'que sorte a minha você existir exatamente do jeitinho que você existe.', // ✎
    'eu escolheria você em todas as versões possíveis da minha vida.', // ✎
    'lembrete oficial do dia: você é muito, muito amada. ♡', // ✎
    {
      // ✎ exemplo de bilhete com foto — troque a imagem por uma foto de vocês
      texto: 'olha só que coisa mais linda ♡',
      foto: 'fotos/exemplo.svg',
      legenda: 'coloque aqui uma foto de vocês',
    },
  ],

  // ☀ dias difíceis — acolhimento, sem pressão pra ficar feliz
  'dias-dificeis': [
    'não precisa ficar bem agora. só queria que você soubesse que eu tô aqui, do seu lado.', // ✎
    'se hoje pesou, tudo bem descansar. você não precisa dar conta de tudo sozinha.', // ✎
    'pode chorar, pode ficar quietinha, pode reclamar do mundo. eu te amo em todas as suas versões.', // ✎
    'você não é um peso. nunca foi. ♡', // ✎
    'me chama, a qualquer hora. de verdade.', // ✎
  ],

  // ✉ nossas memórias — escreva aqui as lembranças de vocês dois
  // (estes são só moldes: não inventei nenhuma história de vocês ♡)
  memorias: [
    '[escreva aqui uma lembrança de vocês — por exemplo, o dia em que se conheceram e o que você sentiu]', // ✎
    '[lembra de quando… conte aqui um momento que você nunca esqueceu]', // ✎
    '[uma memória boba que até hoje faz vocês rirem]', // ✎
    '[o lugar favorito de vocês, e por que ele é tão especial]', // ✎
  ],

  // ✧ surpresinhas — vales, promessas, convites e bobeirinhas
  surpresinhas: [
    'vale um abraço demorado, daqueles sem hora pra acabar. válido pra sempre.', // ✎
    'convite: um encontro surpresa escolhido por mim. é só me mostrar este bilhete ♡', // ✎
    'vale uma noite de filme + o lanchinho que você quiser. (prometo não reclamar do filme.)', // ✎
    'promessa: na próxima vez que você estiver cansada, o jantar é por minha conta.', // ✎
    'fato científico: você fica linda até de cara amassada.', // ✎
  ],
}

/* ── bilhete especial ─────────────────────────────────────────────────────────
   Fica separado do potinho, com um lacinho vermelho. Nunca sai no sorteio.
   Cada item de `paragrafos` vira um parágrafo da carta.
   ───────────────────────────────────────────────────────────────────────────── */
export const cartaEspecial = {
  titulo: 'abre quando precisar de mim',
  saudacao: 'meu amor,', // ✎
  paragrafos: [
    '[esta é a carta mais especial do potinho. escreva aqui, com calma, o que você quer que ela leia num dia em que precisar de você e você não estiver por perto.]', // ✎
    '[conte por que você escreveu esta carta, e o que sente quando pensa nela.]', // ✎
    '[fale do que você gostaria que ela lembrasse sempre: do quanto ela é forte, do quanto é amada, do quanto não está sozinha.]', // ✎
    '[se quiser, deixe aqui uma promessa — ou aquilo que você diria se estivesse aí agora, abraçando ela bem apertado.]', // ✎
    '[pode escrever quanto quiser: a carta cresce e vira uma folha que dá pra rolar.]', // ✎
  ],
  despedida: 'com todo o meu amor,', // ✎
  assinatura: '[seu nome]', // ✎
}
