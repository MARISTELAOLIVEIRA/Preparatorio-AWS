/* instancia.js: o decodificador de nomes de instância do EC2 (aula 6 · versão 1 · 2026-11-04).
   Lê um nome como "c7gn.xlarge" e explica cada parte: série, geração, opções e tamanho.
   Regra conferida em docs.aws.amazon.com/ec2/latest/instancetypes/instance-type-names.html (04/11/2026).
   Uso:
     <form class="decodifica">
       <input type="text" value="c7gn.xlarge">
       <button type="button" data-exemplo="t3.micro">t3.micro</button>   (opcional: preenche o campo)
       <output class="decodifica-saida" aria-live="polite"></output>
     </form>
*/
(function () {

  // séries mais comuns na prova (as de duas ou mais letras vêm primeiro, para "inf" não virar "i")
  const SERIES = [
    ["mac", "Mac: computadores com macOS"],
    ["hpc", "Hpc: computação de alto desempenho"],
    ["inf", "Inf: chips AWS Inferentia, para rodar modelos de IA"],
    ["trn", "Trn: chips AWS Trainium, para treinar modelos de IA"],
    ["im", "Im: otimizada para armazenamento"],
    ["is", "Is: otimizada para armazenamento"],
    ["vt", "VT: transcodificação de vídeo"],
    ["m", "M: uso geral, equilibrada"],
    ["t", "T: uso geral com desempenho expansível (acumula crédito de CPU quando está parada)"],
    ["c", "C: otimizada para computação (processador forte)"],
    ["r", "R: otimizada para memória"],
    ["x", "X: muita memória"],
    ["u", "U: memória altíssima"],
    ["z", "Z: memória alta e processador rápido"],
    ["p", "P: com GPU, para IA e cálculo pesado"],
    ["g", "G: com GPU, para gráficos"],
    ["f", "F: com FPGA, um chip que você reprograma"],
    ["i", "I: otimizada para armazenamento"],
    ["d", "D: armazenamento denso"],
    ["h", "H: armazenamento em disco rígido"],
    ["a", "A: processador AWS Graviton (série antiga)"]
  ];

  // letras de opção que aparecem depois do número da geração
  const OPCOES = {
    a: "processador AMD",
    g: "processador AWS Graviton (Arm)",
    i: "processador Intel",
    d: "discos locais (armazenamento de instância)",
    n: "rede e EBS mais rápidos",
    e: "extra: mais memória, disco ou memória de GPU",
    b: "otimizada para armazenamento em bloco (EBS)",
    z: "processador de frequência alta",
    q: "aceleradores de inferência Qualcomm"
  };

  function explicar(nome) {
    const texto = nome.trim().toLowerCase();
    const partes = texto.match(/^([a-z]+)(\d+)([a-z-]*)\.([a-z0-9]+)$/);
    if (!partes) {
      return ["Curto-circuito. Confere a trilha: o nome tem letras, um número, talvez mais letras, um ponto e o tamanho, como c7gn.xlarge."];
    }
    const [, serie, geracao, opcoesTexto, tamanho] = partes;
    const achada = SERIES.find((s) => s[0] === serie);
    const linhas = [];
    linhas.push("Série " + serie + ": " + (achada ? achada[1].split(": ")[1] : "série que não está na lista desta aula") + ".");
    linhas.push("Geração " + geracao + ": quanto maior o número, mais nova a máquina.");

    // o "-flex" vem no fim das opções: explica as letras primeiro e o flex depois
    const flex = opcoesTexto.endsWith("-flex");
    const opcoes = flex ? opcoesTexto.slice(0, -5) : opcoesTexto;
    opcoes.split("").forEach(function (letra) {
      if (OPCOES[letra]) linhas.push("Opção " + letra + ": " + OPCOES[letra] + ".");
    });
    if (flex) linhas.push("flex: instância flexível, mais barata para quem não usa a CPU no máximo o tempo todo.");

    if (tamanho === "metal") {
      linhas.push("Tamanho metal: o servidor físico inteiro, sem virtualização.");
    } else {
      linhas.push("Tamanho " + tamanho + ": quanto processador e memória. Cada degrau (large, xlarge, 2xlarge…) costuma dobrar o anterior.");
    }
    return linhas;
  }

  document.querySelectorAll(".decodifica").forEach(function (form) {
    const campo = form.querySelector("input");
    const saida = form.querySelector(".decodifica-saida");

    function mostrar() {
      saida.innerHTML = "";
      explicar(campo.value).forEach(function (linha) {
        const p = document.createElement("p");
        p.textContent = linha;
        saida.appendChild(p);
      });
    }

    form.querySelectorAll("[data-exemplo]").forEach(function (botao) {
      botao.addEventListener("click", function () {
        campo.value = botao.dataset.exemplo;
        mostrar();
      });
    });
    campo.addEventListener("input", mostrar);
    form.addEventListener("submit", function (evento) { evento.preventDefault(); });
    mostrar();
  });
})();
