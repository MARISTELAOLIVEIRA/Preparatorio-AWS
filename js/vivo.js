/*
  vivo.js: as peças interativas das aulas "vivas" do Preparatório AWS. Só deste site.
  versão 11 · 2026-11-11 · aulas 1 a 10 (conceitos, cobrança, infraestrutura, segurança, redes, computação, armazenamento, bancos, arquitetura e escala)

  1. [data-gancho]  a contagem para a abertura das vendas e a votação "o site aguenta?"
  2. [data-sim]     simulador "A noite da abertura das vendas": salinha com 2, salinha com 20 ou nuvem
  3. [data-casa]    quem cuida de quê: casa própria, apê vazio, apê mobiliado ou hotel (local, IaaS, PaaS, SaaS)
  4. [data-placa]   desmonte: as peças de uma placa (aula 1) ou os campos de uma conta de luz (aula 2, data-placa="fatura")
  5. [data-susto]   a fatura que chegou alta e o palpite "o que aconteceu?" (aula 2)
  6. [data-taximetro] o taxímetro da nuvem: computação, armazenamento, dados que entram e saem, e o alerta do Budgets (aula 2)
  7. [data-pagar]   qual jeito de pagar? três perguntas e o transporte de cada um (aula 2)
  8. [data-iceberg] o iceberg do TCO: mergulhar e ver o que fica embaixo d'água (aula 2)
  9. [data-suporte] planos de suporte, do manual ao pit stop (aula 2)
  10. [data-plantao] o plantão do incêndio e o palpite "o site cai?" (aula 3; as respostas ficam nos botões, em data-explica)
  11. [data-desastre] derrube um data center: o site em zonas e regiões, três desastres e duas missões (aula 3)
  12. [data-zoom]   do globo ao prédio: região, zona, data center e ponto de presença, com analogia (aula 3)
  13. [data-funil]  o funil da região: os quatro critérios, na ordem, com e sem o contrato do órgão público (aula 3)
  14. [data-tranca] tranque a conta: segurança DA nuvem (AWS) e NA nuvem (você), cinco brechas e um invasor (aula 4)
  15. [data-porta]  a porta abre? a avaliação das políticas do IAM numa fechadura com ESP32 (aula 4)
  (a aula 4 também usa o gancho [data-plantao] e a placa [data-placa="fechadura"])
  16. [data-viagem] a viagem do pacote: portão, placas, cancela e porteiro da superquadra, com quatro chaves (aula 5)
  17. [data-memoria] com memória × sem memória: o carro que sai e volta pelo porteiro e pela cancela (aula 5)
  18. [data-bits]   a régua de bits: 32 LEDs, a máscara de /16 a /28 e os 5 endereços reservados (aula 5)
  19. [data-central] a central de tarefas: cinco tarefas, cinco motores (EC2, Fargate, Lambda, Beanstalk, spot) (aula 6)
  20. [data-conteiner] "na minha máquina funciona!": o app sem e com contêiner (aula 6)
  21. [data-lambda] o botão que acorda o Lambda: uma compra, mil compras e o relatório que bate nos 15 minutos (aula 6)
  22. [data-regua]  do ESP32 ao monstro da AWS: a memória de cada máquina, em escala normal e logarítmica (aula 6)
  23. [data-carta]  redes do zero: a carta com endereço (IP ou nome), porta e caminho (aula 5, reforço R0)
  (a central [data-central] também serve à aula 7: data-central="armazenamento", as gavetas)
  24. [data-vida]   a vida de uma foto: a idade, as regras de ciclo de vida e a gaveta do S3 em que ela está (aula 7)
  25. [data-desliga] desliga e liga: o EBS guarda, o armazenamento de instância perde, o snapshot copia (aula 7)
  26. [data-noves]  a matemática dos 11 noves: quantos objetos, de quantos em quantos anos se perde um (aula 7)
  (a central também serve à aula 8: data-central="bancos")
  27. [data-fichas] tabela × fichas: o cliente novo com Instagram no relacional e no NoSQL (aula 8)
  28. [data-plantao-banco] Multi-AZ × réplica de leitura: a zona que cai e os relatórios que pesam (aula 8)
  29. [data-cache]  o post-it do cache: dez pessoas abrem a mesma página, com e sem ElastiCache (aula 8)
  30. [data-gaveteiro] o gaveteiro: procurar gaveta por gaveta ou abrir pela etiqueta (a chave) (aula 8)
  31. [data-pilares] o raio-x dos seis pilares: cada problema no seu pilar, e o hexágono cresce (aula 9)
  32. [data-fiscal] o fiscal da conta: a verificação do Trusted Advisor, achado por achado (aula 9)
  (a aula 9 também usa a central data-central="migracao" e a placa data-placa="mudanca")
  33. [data-controle] a sala de controle da venda: balanceador, Auto Scaling, escala programada e alarme, das 9h ao meio-dia (aula 10)
  34. [data-fila]   a fila do supermercado: mais caixas (horizontal) ou um caixa mais rápido (vertical) (aula 10)
  (a aula 10 também usa a central data-central="vigias")

  Com as animações pausadas (botão do topo ou "reduzir movimento"), tudo mostra o resultado direto.
*/
(function () {
  "use strict";

  const raiz = document.documentElement;
  const pausado = () => raiz.classList.contains("pausado");
  const NS = "http://www.w3.org/2000/svg";
  const num = n => Math.round(n).toLocaleString("pt-BR");

  // cria um elemento SVG com atributos
  function svg(tag, attrs, pai) {
    const el = document.createElementNS(NS, tag);
    for (const k in attrs) el.setAttribute(k, attrs[k]);
    if (pai) pai.appendChild(el);
    return el;
  }

  // ===================== 1. gancho: a contagem =====================
  document.querySelectorAll("[data-gancho]").forEach(function (g) {
    const iniciar = g.querySelector("[data-iniciar]");
    const contagem = g.querySelector("[data-contagem]");
    const relogio = g.querySelector(".gancho-relogio");
    const fila = g.querySelector("[data-fila]");
    const voto = g.querySelector(".gancho-voto");
    const resposta = g.querySelector(".gancho-resposta");
    const RESPOSTAS = {
      aguenta: "Otimista! Mas são só dois servidores numa salinha do escritório… Teste no <a href=\"#simulador\">simulador logo abaixo</a> e veja.",
      cai: "Faro de quem já viu site cair! Teste no <a href=\"#simulador\">simulador logo abaixo</a> e descubra por quê."
    };
    let pessoas = 38000;

    function zera() {
      contagem.textContent = "0";
      relogio.style.setProperty("--falta", 0);
      fila.textContent = num(50000);
      g.classList.add("zero");
      iniciar.hidden = true;
      voto.hidden = false;
      voto.querySelector(".gancho-pergunta").focus();
    }

    iniciar.addEventListener("click", function () {
      if (pausado()) return zera();
      iniciar.disabled = true;
      let n = 10;
      const passo = setInterval(function () {
        n--;
        pessoas += 900 + Math.random() * 600;
        contagem.textContent = n;
        relogio.style.setProperty("--falta", n / 10);
        fila.textContent = num(Math.min(pessoas, 50000));
        if (n <= 0 || pausado()) {
          clearInterval(passo);
          zera();
        }
      }, 750);
    });

    g.querySelectorAll("[data-voto]").forEach(function (b) {
      b.addEventListener("click", function () {
        g.querySelectorAll("[data-voto]").forEach(x => x.setAttribute("aria-pressed", String(x === b)));
        resposta.innerHTML = RESPOSTAS[b.dataset.voto];
      });
    });
  });

  // ===================== 2. simulador da abertura das vendas =====================
  // A procura e a capacidade são medidas em "servidores": 1 servidor atende 2 mil pessoas por hora.
  const PESSOAS_POR_SRV = 2000;
  const PASSO = 0.05;            // horas por ponto da conta (3 minutos)
  const PONTOS = 24 / PASSO;
  const MAX = 20;                // servidores no rack

  // quantos servidores a procura pede na hora h: o movimento do dia e o pico das 19h, quando as vendas abrem
  function procura(h) {
    const dia = 0.6 + 0.9 * Math.exp(-((h - 13) ** 2) / 18);
    const largura = h < 19.5 ? 0.2 : 1.1;
    const pico = 17 * Math.exp(-((h - 19.5) ** 2) / (2 * largura * largura));
    return dia + pico;
  }

  // a capacidade de cada modo, ponto a ponto
  function capacidades(modo) {
    const saida = [];
    let cap = modo === "nuvem" ? 1 : 2;
    let espera = 0;
    for (let i = 0; i <= PONTOS; i++) {
      const h = i * PASSO;
      if (modo === "sala2") cap = 2;
      else if (modo === "sala20") cap = MAX;
      else {
        // nuvem: liga rápido (2 a cada 3 minutos) e desliga com calma (1 a cada 6 minutos), sempre com folga de 10%
        const alvo = Math.min(MAX, Math.max(1, Math.ceil(procura(h) * 1.1)));
        if (alvo > cap) { cap = Math.min(alvo, cap + 2); espera = 0; }
        else if (alvo < cap && ++espera >= 2) { cap--; espera = 0; }
      }
      saida.push(cap);
    }
    return saida;
  }

  const MODOS = {
    sala2: {
      titulo: "Salinha do escritório",
      fim: (r) => `💥 <strong>O site caiu às 19h.</strong> ${num(r.desistiram)} fãs desistiram e foram comprar em outro lugar. Dois servidores não davam conta do pico.`,
      cor: "var(--vivo-ruim)"
    },
    sala20: {
      titulo: "Salinha com 20 servidores",
      fim: (r) => `😴 <strong>Ninguém ficou de fora, mas ${r.paradoPct}% das horas de servidor ficaram paradas.</strong> Foram comprados 20 servidores para um pico de três horas: o resto do tempo, é dinheiro dormindo na salinha.`,
      cor: "var(--srwe)"
    },
    nuvem: {
      titulo: "Região da AWS",
      fim: (r) => `✨ <strong>${r.desistiram < 1 ? "Ninguém ficou de fora" : "Quase ninguém ficou de fora (" + num(r.desistiram) + " fãs)"}, e só ${r.paradoPct}% das horas ficaram paradas</strong> (na salinha turbinada, 90%). A nuvem ligou servidores no pico e desligou depois, sozinha. Isso é <strong>elasticidade</strong>, e você pagou só ${num(r.pago)} horas de servidor, contra 480 da salinha com 20.`,
      cor: "var(--vivo-ok)",
      vantagens: ["Despesa variável", "Parar de adivinhar a capacidade", "Velocidade e agilidade", "Elasticidade"]
    }
  };

  document.querySelectorAll("[data-sim]").forEach(function (sim) {
    const palco = sim.querySelector(".sim-palco");
    const grafico = sim.querySelector(".sim-grafico");
    const vai = sim.querySelector(".vai");
    const deNovo = sim.querySelector(".de-novo");
    const veredito = sim.querySelector(".sim-veredito");
    const aviso = sim.querySelector(".sim-aviso");
    const campos = {};
    sim.querySelectorAll("[data-n]").forEach(el => (campos[el.dataset.n] = el));
    const botoesModo = sim.querySelectorAll("[data-modo]");
    const testados = new Set();

    let modo = "sala2";
    let caps = capacidades(modo);
    let rodando = false;
    let quadro = 0;

    // ---------- o palco: a fila, as trilhas e o rack ----------
    const cena = svg("svg", { viewBox: "0 0 640 260", "aria-hidden": "true", focusable: "false" }, palco);
    const relogioTxt = svg("text", { x: 20, y: 32, class: "sim-relogio" }, cena);
    relogioTxt.textContent = "00:00";
    const filaG = svg("g", { class: "sim-fila" }, cena);
    const bolinhas = [];
    for (let c = 0; c < 6; c++) {
      for (let l = 0; l < 8; l++) {
        bolinhas.push(svg("circle", { cx: 30 + c * 16, cy: 62 + l * 20, r: 4, opacity: 0.15 }, filaG));
      }
    }
    const filaTxt = svg("text", { x: 70, y: 242, class: "sim-rotulo", "text-anchor": "middle" }, cena);
    const CAMINHOS = [
      "M125 80 H215 L255 120 H442",
      "M125 135 H442",
      "M125 190 H215 L255 150 H442"
    ].map(function (d) {
      return svg("path", { d: d, class: "sim-trilha" }, cena);
    });
    [[125, 80], [125, 135], [125, 190]].forEach(p => svg("circle", { cx: p[0], cy: p[1], r: 5, class: "sim-pad" }, cena));
    const rotuloNet = svg("text", { x: 330, y: 105, class: "sim-rotulo", "text-anchor": "middle" }, cena);
    rotuloNet.textContent = "internet";
    const rackTitulo = svg("text", { x: 538, y: 24, class: "sim-rotulo", "text-anchor": "middle" }, cena);
    svg("rect", { x: 446, y: 33, width: 184, height: 200, rx: 10, fill: "none", stroke: "#3b4a42", "stroke-width": 2 }, cena);
    const servidores = [];
    for (let i = 0; i < MAX; i++) {
      const x = 453 + (i % 5) * 35;
      const y = 42 + Math.floor(i / 5) * 48;
      const g = svg("g", { class: "srv ausente" }, cena);
      svg("rect", { x: x, y: y, width: 30, height: 40, class: "caixa" }, g);
      svg("circle", { cx: x + 8, cy: y + 8, r: 3, class: "led" }, g);
      [20, 26, 32].forEach(dy => svg("line", { x1: x + 6, x2: x + 24, y1: y + dy, y2: y + dy, class: "grade" }, g));
      servidores.push({ g: g, existe: false });
    }
    const statusTxt = svg("text", { x: 538, y: 254, class: "sim-status ok", "text-anchor": "middle" }, cena);
    const fas = svg("g", {}, cena);
    let particulas = [];

    // ---------- o gráfico do dia ----------
    const G = { x0: 42, x1: 630, y0: 170, y1: 12 };
    const gx = h => G.x0 + (h / 24) * (G.x1 - G.x0);
    const gy = v => G.y0 - (v / MAX) * (G.y0 - G.y1);
    const graf = svg("svg", { viewBox: "0 0 640 196", role: "img", "aria-label": "Gráfico do dia: a procura e a capacidade de servidores, hora a hora" }, grafico);
    const defs = svg("defs", {}, graf);
    const listras = svg("pattern", { id: "listras", width: 6, height: 6, patternUnits: "userSpaceOnUse", patternTransform: "rotate(45)" }, defs);
    svg("line", { x1: 0, y1: 0, x2: 0, y2: 6, class: "listra" }, listras);
    const recorte = svg("clipPath", { id: "ate-agora" }, defs);
    const janela = svg("rect", { x: 0, y: 0, width: G.x0, height: 196 }, recorte);
    [0, 5, 10, 15, 20].forEach(function (v) {
      svg("line", { x1: G.x0, x2: G.x1, y1: gy(v), y2: gy(v), class: "gr-eixo", opacity: v ? 0.35 : 1 }, graf);
      svg("text", { x: G.x0 - 8, y: gy(v) + 4, class: "gr-rotulo", "text-anchor": "end" }, graf).textContent = v;
    });
    for (let h = 0; h <= 24; h += 4) {
      svg("text", { x: gx(h), y: G.y0 + 18, class: "gr-rotulo", "text-anchor": "middle" }, graf).textContent = h + "h";
    }
    svg("text", { x: G.x0, y: 8, class: "gr-rotulo" }, graf).textContent = "servidores";
    const camadas = svg("g", { "clip-path": "url(#ate-agora)" }, graf);
    const sobra = svg("path", { class: "gr-sobra" }, camadas);
    const falta = svg("path", { class: "gr-falta" }, camadas);
    const linhaCap = svg("path", { class: "gr-capacidade" }, camadas);
    const linhaProcura = svg("path", { class: "gr-procura" }, camadas);
    const cursor = svg("line", { y1: G.y1, y2: G.y0, class: "gr-cursor", opacity: 0 }, graf);

    // desenha as linhas e as áreas do modo escolhido (aparecem conforme o relógio anda)
    function desenhaGrafico() {
      let dP = "", dC = "", dF = "", dS = "";
      for (let i = 0; i <= PONTOS; i++) {
        const h = i * PASSO;
        const p = procura(h);
        const c = caps[i];
        dP += (i ? "L" : "M") + gx(h).toFixed(1) + " " + gy(p).toFixed(1);
        dC += (i ? "L" : "M") + gx(h).toFixed(1) + " " + gy(c).toFixed(1);
        // falta: entre a capacidade e a procura, quando a procura passa; sobra: o contrário
        const xa = gx(h).toFixed(1);
        const xb = gx(h + PASSO).toFixed(1);
        if (p > c) dF += `M${xa} ${gy(c)}V${gy(p).toFixed(1)}H${xb}V${gy(c)}Z`;
        else dS += `M${xa} ${gy(p).toFixed(1)}V${gy(c)}H${xb}V${gy(p).toFixed(1)}Z`;
      }
      linhaProcura.setAttribute("d", dP);
      linhaCap.setAttribute("d", dC);
      falta.setAttribute("d", dF);
      sobra.setAttribute("d", dS);
    }

    // as contas do dia inteiro
    function contas() {
      let faltou = 0, usou = 0, pago = 0, parado = 0;
      for (let i = 0; i < PONTOS; i++) {
        const p = procura(i * PASSO);
        const c = caps[i];
        faltou += Math.max(0, p - c) * PASSO;
        usou += Math.min(p, c) * PASSO;
        pago += c * PASSO;
        parado += Math.max(0, c - p) * PASSO;
      }
      return {
        compraram: usou * PESSOAS_POR_SRV,
        desistiram: faltou * PESSOAS_POR_SRV,
        pago: pago,
        paradoPct: Math.round((parado / pago) * 100)
      };
    }

    // mostra o rack, a fila, o relógio e o status na hora h
    let jaCaiu = false, jaLigou = 0;
    function mostraHora(h, falar) {
      const i = Math.min(PONTOS, Math.round(h / PASSO));
      const p = procura(h);
      const c = caps[i];
      const usados = Math.min(c, Math.ceil(p - 0.02));
      const caiu = p > c + 0.05;
      const hh = Math.min(23, Math.floor(h));
      const mm = h >= 24 ? 59 : Math.floor((h % 1) * 60);
      relogioTxt.textContent = String(hh).padStart(2, "0") + ":" + String(mm).padStart(2, "0");
      // fila: acende bolinhas conforme a procura
      const acesas = Math.round((p / 18) * bolinhas.length);
      bolinhas.forEach((b, k) => b.setAttribute("opacity", k < acesas ? 0.95 : 0.15));
      filaTxt.textContent = "fila: " + num(p * 2) + " mil/h";
      servidores.forEach(function (s, k) {
        const existe = modo === "sala20" || (modo === "sala2" ? k < 2 : k < c);
        let classe = "srv ";
        if (!existe) classe += "ausente";
        else if (caiu) classe += "sobrecarga";
        else classe += k < usados ? "ativo" : "parado";
        // servidor novo na nuvem: aparece crescendo (a classe fica o tempo da animação)
        if (existe && !s.existe && modo === "nuvem" && !pausado()) s.nasceu = performance.now();
        if (existe && s.nasceu && performance.now() - s.nasceu < 450) classe += " nasce";
        s.existe = existe;
        s.g.setAttribute("class", classe);
      });
      statusTxt.textContent = caiu ? "💥 fora do ar" : "✅ no ar · " + c + (c > 1 ? " servidores" : " servidor");
      statusTxt.setAttribute("class", "sim-status " + (caiu ? "ruim" : "ok"));
      // avisos para leitores de tela, só nos momentos importantes
      if (falar) {
        if (caiu && !jaCaiu) { jaCaiu = true; aviso.textContent = "O site caiu: os servidores não dão conta da procura."; }
        if (modo === "nuvem" && c > jaLigou + 5) { jaLigou = c; aviso.textContent = "A nuvem ligou mais servidores: agora são " + c + "."; }
      }
      janela.setAttribute("width", gx(h));
      cursor.setAttribute("x1", gx(h));
      cursor.setAttribute("x2", gx(h));
    }

    // ---------- as pessoas correndo nas trilhas ----------
    function soltaFa() {
      const caminho = CAMINHOS[Math.floor(Math.random() * 3)];
      const el = svg("circle", { r: 3.5, class: "fa" }, fas);
      particulas.push({ el: el, caminho: caminho, tam: caminho.getTotalLength(), t: 0, vel: 0.7 + Math.random() * 0.5, estado: "vai", y: 0, vy: 0, x: 0 });
    }
    function andaFas(dt, h) {
      const i = Math.min(PONTOS, Math.round(h / PASSO));
      const chance = Math.min(1, caps[i] / procura(h));
      particulas = particulas.filter(function (f) {
        if (f.estado === "vai") {
          f.t += dt * f.vel;
          if (f.t >= 1) {
            f.estado = Math.random() < chance ? "servido" : "cai";
            f.el.setAttribute("class", "fa " + (f.estado === "servido" ? "servido" : "desistiu"));
            const pt = f.caminho.getPointAtLength(f.tam);
            f.x = pt.x; f.y = pt.y; f.vy = -40; f.vida = 0.5;
            return true;
          }
          const pt = f.caminho.getPointAtLength(f.t * f.tam);
          f.el.setAttribute("cx", pt.x);
          f.el.setAttribute("cy", pt.y);
          return true;
        }
        f.vida -= dt;
        if (f.estado === "cai") {
          f.vy += 500 * dt;
          f.y += f.vy * dt;
          f.x -= 30 * dt;
          f.el.setAttribute("cx", f.x);
          f.el.setAttribute("cy", f.y);
        }
        f.el.setAttribute("opacity", Math.max(0, f.vida * 2));
        if (f.vida <= 0) { f.el.remove(); return false; }
        return true;
      });
    }
    function limpaFas() {
      particulas.forEach(f => f.el.remove());
      particulas = [];
    }

    // ---------- rodar o dia ----------
    // o relógio anda depressa de manhã e devagar na hora do pico (18h30 às 22h)
    const velocidade = h => (h >= 18.5 && h < 22 ? 0.6 : 4);

    function termina() {
      rodando = false;
      cancelAnimationFrame(quadro);
      limpaFas();
      const r = contas();
      // com as animações pausadas, o rack mostra a hora do pico; animado, mostra o fim do dia
      mostraHora(pausado() ? 19.6 : 24, false);
      janela.setAttribute("width", 640);
      cursor.setAttribute("opacity", 0);
      campos.compraram.textContent = num(r.compraram);
      campos.desistiram.textContent = num(r.desistiram);
      campos.pago.textContent = num(r.pago);
      campos.parado.textContent = r.paradoPct + "%";
      const m = MODOS[modo];
      veredito.style.setProperty("--c", m.cor);
      let html = "<p>" + m.fim(r) + "</p>";
      if (m.vantagens) {
        html += '<ul class="vantagens-vistas" aria-label="Vantagens da nuvem que você acabou de ver">' +
          m.vantagens.map((v, k) => `<li style="--i:${k}">${v}</li>`).join("") + "</ul>";
      }
      testados.add(modo);
      sim.querySelector(`[data-modo="${modo}"] .feito`).textContent = " ✓";
      if (testados.size === 3) html += '<p style="margin-top:.7rem">🏆 <strong>Você testou os três modos!</strong> Agora compare: quem perdeu cliente, quem pagou à toa e quem acertou?</p>';
      veredito.innerHTML = html;
      aviso.textContent = "Fim do dia. " + veredito.textContent;
      vai.disabled = false;
      vai.textContent = "▶ Abrir as vendas de novo";
    }

    function zera() {
      rodando = false;
      cancelAnimationFrame(quadro);
      limpaFas();
      caps = capacidades(modo);
      desenhaGrafico();
      servidores.forEach(s => { s.existe = false; s.nasceu = 0; });
      jaCaiu = false; jaLigou = 0;
      mostraHora(0, false);
      janela.setAttribute("width", G.x0);
      rackTitulo.textContent = MODOS[modo].titulo;
      ["compraram", "desistiram", "pago", "parado"].forEach(k => (campos[k].textContent = "—"));
      veredito.innerHTML = "";
      vai.disabled = false;
      vai.textContent = "▶ Abrir as vendas";
    }

    function roda() {
      zera();
      if (pausado()) return termina();
      rodando = true;
      vai.disabled = true;
      vai.textContent = "Soldando os componentes…";
      aviso.textContent = "O dia começou. As vendas abrem às 19h.";
      cursor.setAttribute("opacity", 1);
      let h = 0, antes = performance.now(), acumulo = 0, abriu = false;
      function quadroDoDia(agora) {
        if (!rodando) return;
        if (pausado()) return termina();
        const dt = Math.min(0.05, (agora - antes) / 1000);
        antes = agora;
        h = Math.min(24, h + velocidade(h) * dt);
        if (!abriu && h >= 19) { abriu = true; aviso.textContent = "19h: as vendas abriram!"; }
        // mais gente nas trilhas quando a procura sobe
        acumulo += procura(h) * 2.2 * dt * (velocidade(h) > 1 ? 0.5 : 1);
        while (acumulo >= 1 && particulas.length < 170) { soltaFa(); acumulo--; }
        andaFas(dt, h);
        mostraHora(h, true);
        if (h >= 24) return termina();
        quadro = requestAnimationFrame(quadroDoDia);
      }
      quadro = requestAnimationFrame(quadroDoDia);
    }

    botoesModo.forEach(function (b) {
      b.addEventListener("click", function () {
        modo = b.dataset.modo;
        botoesModo.forEach(x => x.setAttribute("aria-pressed", String(x === b)));
        zera();
      });
    });
    vai.addEventListener("click", roda);
    deNovo.addEventListener("click", zera);
    document.addEventListener("placa:movimento", function (e) {
      if (e.detail.pausado && rodando) termina();
    });
    zera();
  });

  // ===================== 3. casa ou hotel: quem cuida de quê =====================
  const CASA = [
    { voce: 5, fala: "🏠 <strong>Casa própria = local (on-premises).</strong> Tudo é com você, do terreno à conta de luz. Como a salinha da Ingresso Candango." },
    { voce: 3, fala: "🔑 <strong>Apê vazio alugado = IaaS.</strong> O prédio, as paredes e os canos são do dono. Os móveis, a rotina e as suas coisas são com você. No <strong>Amazon EC2</strong>, a AWS entrega a máquina e você cuida do sistema operacional para cima." },
    { voce: 2, fala: "🛋️ <strong>Apê mobiliado = PaaS.</strong> Já vem com móveis e geladeira: você só vive lá. No <strong>AWS Elastic Beanstalk</strong>, você manda o código e a AWS monta e mantém o resto." },
    { voce: 1, fala: "🛎️ <strong>Hotel = SaaS.</strong> Você só leva a mala: cama feita, café pronto. Num SaaS, como o Gmail ou o Microsoft 365, você só usa. Mas repare: <strong>a mala (os dados e a senha) é sempre sua</strong>, em qualquer modelo." }
  ];
  document.querySelectorAll("[data-casa]").forEach(function (casa) {
    const botoes = casa.querySelectorAll("[data-modo]");
    const camadas = casa.querySelectorAll(".camada");
    const fala = casa.querySelector(".casa-fala");
    function escolhe(m) {
      botoes.forEach((b, k) => b.setAttribute("aria-pressed", String(k === m)));
      camadas.forEach(function (c, k) {
        const meu = k < CASA[m].voce;
        c.classList.toggle("voce", meu);
        c.classList.toggle("aws", !meu);
        c.classList.toggle("corte", k === CASA[m].voce);
        c.querySelector(".quem").textContent = meu ? "você" : m === 3 ? "hotel" : "dono";
        c.querySelector(".quem").setAttribute("aria-label", meu ? "com você" : "com o provedor");
      });
      fala.innerHTML = CASA[m].fala;
    }
    botoes.forEach((b, k) => b.addEventListener("click", () => escolhe(k)));
    escolhe(0);
  });

  // ===================== 4. desmonte a nuvem: a placa =====================
  const PECAS = {};
  PECAS.placa = {
    cpu: { nome: "Processador", aws: "vCPU", texto: "No Amazon EC2, você escolhe quantas vCPUs a máquina virtual tem. Mais vCPUs, mais contas por segundo, e mais cara a hora. Uma t3.micro tem 2 vCPUs." },
    ram: { nome: "Memória RAM", aws: "Memória (GiB)", texto: "Vem junto com o tipo de instância do EC2: a t3.micro tem 1 GiB. Precisa de mais? Troque o tipo, sem abrir gabinete nenhum." },
    disco: { nome: "Disco (SSD)", aws: "Amazon EBS", texto: "O disco da máquina virtual. Pegadinha: você paga pelos GB reservados todo mês, mesmo com a máquina desligada, até apagar o volume." },
    rede: { nome: "Placa de rede", aws: "Rede da AWS (VPC)", texto: "Liga a máquina à internet. Entrar dado na AWS é de graça; sair da AWS para a internet é cobrado por GB." },
    energia: { nome: "Fonte e cooler", aws: "Com a AWS", texto: "Energia, refrigeração, prédio e segurança física: na nuvem você nunca vê. Já estão no preço da hora. É a vantagem \"parar de gastar com data center\"." },
    _fim: "<strong>🔧 Placa desmontada!</strong> Agora você sabe o que está alugando quando liga uma máquina na nuvem.",
    _unidade: "peças"
  };
  PECAS.fechadura = {
    leitor: { nome: "Leitor de cartão", aws: "Autenticação", texto: "O leitor pergunta: quem é você? No IAM, é o login: senha, MFA ou uma credencial temporária." },
    cartoes: { nome: "Cartões cadastrados", aws: "Usuários e grupos", texto: "A lista de cartões que a fechadura conhece, separados em turmas. No IAM, cada pessoa é um usuário, e as turmas são os grupos." },
    esp: { nome: "ESP32 com as regras", aws: "Políticas (autorização)", texto: "O código gravado decide: este cartão abre esta porta, neste horário? No IAM, quem decide são as políticas em JSON." },
    sd: { nome: "Cartão SD com o registro", aws: "AWS CloudTrail", texto: "Cada tentativa fica gravada: quem, quando, qual porta. O CloudTrail grava quem fez o quê, e quando, na conta." },
    mestra: { nome: "Chave mestra de emergência", aws: "Conta raiz", texto: "Abre tudo, sem perguntar nada. Fica no cofre e só sai em emergência. Igual à conta raiz: protegida com MFA e quase nunca usada." },
    _fim: "<strong>🔐 Fechadura desmontada!</strong> Autenticação, usuários, políticas, registro e a chave mestra: o IAM inteiro cabe num ESP32.",
    _unidade: "peças"
  };
  PECAS.mudanca = {
    retire: { nome: "🗑️ Doar ou jogar fora", aws: "Desativar (retire)", texto: "O que ninguém usa mais não vai no caminhão. Na migração, desligue o sistema e economize." },
    retain: { nome: "🏠 Deixar na casa antiga", aws: "Manter (retain)", texto: "Algumas coisas ficam onde estão, por enquanto. Um sistema preso a um equipamento especial espera a hora certa." },
    rehost: { nome: "📦 Levar como está", aws: "Rehospedar (rehost, lift and shift)", texto: "O móvel vai do jeito que é, sem mudar nada. O servidor vira uma instância do EC2." },
    relocate: { nome: "🚚 O guarda-roupa montado", aws: "Realocar (relocate)", texto: "Vai inteiro, de uma vez, sem desmontar. A plataforma de máquinas virtuais muda para a versão dela na nuvem." },
    repurchase: { nome: "🛒 Vender e comprar novo", aws: "Recomprar (repurchase)", texto: "O sofá velho fica, e chega um novo na casa nova. O sistema antigo é trocado por um produto pronto, quase sempre um SaaS." },
    replatform: { nome: "🔧 Levar com ajustes", aws: "Replataformar (replatform)", texto: "Vai, mas troca os pés da mesa para caber melhor. O banco vai para o RDS, sem reescrever a aplicação." },
    refactor: { nome: "🏗️ Refazer sob medida", aws: "Refatorar (refactor)", texto: "O marceneiro faz um móvel novo, sob medida para a casa nova. A aplicação é redesenhada para a nuvem: o mais caro e o que mais aproveita." },
    _fim: "<strong>📦 Mudança completa!</strong> Sete caixas, sete jeitos de levar (ou não levar) cada sistema para a nuvem.",
    _unidade: "caixas"
  };
  PECAS.fatura = {
    consumo: { nome: "Consumo em kWh", aws: "Uso medido (pay-as-you-go)", texto: "A luz cobra o que o relógio mediu. A AWS também: horas de servidor, GB guardados, GB que saíram. Desligou, parou de contar." },
    bandeira: { nome: "Bandeira tarifária", aws: "Preço spot", texto: "Na conta de luz, o preço do kWh muda com a bandeira. Na AWS, o preço das instâncias spot também se ajusta com a oferta e a procura." },
    historico: { nome: "Histórico de consumo", aws: "AWS Cost Explorer", texto: "O gráfico dos últimos meses que vem na conta. O Cost Explorer mostra o gasto que já aconteceu, mês a mês, e faz previsão." },
    itens: { nome: "Itens da fatura", aws: "Cost and Usage Report", texto: "A conta mostra cada item cobrado. O Cost and Usage Report é a versão mais detalhada da AWS: custo e uso linha a linha." },
    titular: { nome: "Titular da conta", aws: "Conta de gerenciamento (Organizations)", texto: "Quem paga. No AWS Organizations, a conta de gerenciamento paga numa fatura só o uso de todas as contas da organização." },
    _fim: "<strong>🧾 Fatura desmontada!</strong> A conta da AWS é uma conta de luz de muitos relógios: uso medido, preço que muda, histórico e detalhe.",
    _unidade: "partes"
  };
  document.querySelectorAll("[data-placa]").forEach(function (placa) {
    const conjunto = PECAS[placa.dataset.placa || "placa"];
    const ficha = placa.querySelector(".placa-ficha");
    const vistas = new Set();
    placa.querySelectorAll("[data-peca]").forEach(function (b) {
      b.addEventListener("click", function () {
        const p = conjunto[b.dataset.peca];
        vistas.add(b.dataset.peca);
        placa.querySelectorAll("[data-peca]").forEach(x => x.setAttribute("aria-pressed", String(x === b)));
        const total = Object.keys(conjunto).filter(k => k[0] !== "_").length;
        const fim = vistas.size === total
          ? "<p>" + conjunto._fim + "</p>"
          : `<p class="placa-contagem">${vistas.size} de ${total} ${conjunto._unidade}</p>`;
        ficha.innerHTML = `<span class="olho">${p.nome}</span><h4>Na AWS:</h4><span class="na-aws">${p.aws}</span><p>${p.texto}</p>${fim}`;
        ficha.classList.remove("troca");
        void ficha.offsetWidth;
        ficha.classList.add("troca");
      });
    });
  });

  // ===================== 5. a conta do susto =====================
  document.querySelectorAll("[data-susto]").forEach(function (box) {
    const abrir = box.querySelector("[data-abrir]");
    const fatura = box.querySelector(".susto-fatura");
    const palpites = box.querySelectorAll("[data-palpite]");
    const resposta = box.querySelector(".gancho-resposta");
    const RESPOSTAS = {
      hacker: "Pode acontecer, mas não foi dessa vez. Pista: no dia da venda ligaram 20 servidores… e depois? Descubra no <a href=\"#taximetro\">taxímetro logo abaixo</a>.",
      erro: "A AWS mede tudo, e a conta bate. O erro foi de gente: ligaram 20 servidores para a venda e… Veja no <a href=\"#taximetro\">taxímetro logo abaixo</a>.",
      esqueci: "Na mosca! Os 20 servidores da venda ficaram ligados o resto do mês, cobrando por hora. É o susto mais comum da nuvem. Veja acontecer no <a href=\"#taximetro\">taxímetro logo abaixo</a>."
    };
    abrir.addEventListener("click", function () {
      box.classList.add("aberta");
      abrir.hidden = true;
      fatura.hidden = false;
      box.querySelector(".gancho-voto").hidden = false;
      box.querySelector(".gancho-pergunta").focus();
    });
    palpites.forEach(function (b) {
      b.addEventListener("click", function () {
        palpites.forEach(x => x.setAttribute("aria-pressed", String(x === b)));
        resposta.innerHTML = RESPOSTAS[b.dataset.palpite];
      });
    });
  });

  // ===================== 6. o taxímetro da nuvem =====================
  // Preços de exemplo, arredondados (avisados na página): servidor US$ 0,20 por hora; armazenamento US$ 0,10 por GB no mês;
  // dados que saem US$ 0,09 por GB; dados que entram não são cobrados. O mês tem 30 dias; a venda é no dia 10.
  const PRECO = { hora: 0.2, gbMes: 0.1, saida: 0.09 };
  const usd = n => "US$ " + n.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const MESES = {
    normal: { srv: () => 2, gb: 200, entra: 50, sai: 30 },
    esqueci: { srv: d => (d >= 10 ? 20 : 2), gb: 200, entra: 50, sai: 30 },
    desliguei: { srv: d => (d >= 10 && d < 10.25 ? 20 : 2), gb: 200, entra: 50, sai: 30 }
  };
  document.querySelectorAll("[data-taximetro]").forEach(function (tx) {
    const visor = tx.querySelector(".tx-visor strong");
    const diaTxt = tx.querySelector("[data-dia]");
    const barra = tx.querySelector(".tx-mes i");
    const fatias = {};
    tx.querySelectorAll("[data-fatia]").forEach(el => (fatias[el.dataset.fatia] = el));
    const valores = {};
    tx.querySelectorAll("[data-valor]").forEach(el => (valores[el.dataset.valor] = el));
    const controles = {};
    tx.querySelectorAll("input[data-c]").forEach(el => (controles[el.dataset.c] = el));
    const saidas = {};
    tx.querySelectorAll("output[data-c]").forEach(el => (saidas[el.dataset.c] = el));
    const rack = tx.querySelector(".tx-rack");
    const alertas = tx.querySelector(".tx-alertas");
    const limiteMarca = tx.querySelector(".tx-limite");
    const vai = tx.querySelector(".vai");
    const veredito = tx.querySelector(".sim-veredito");
    const aviso = tx.querySelector(".sim-aviso");
    const botoes = tx.querySelectorAll("[data-mes]");
    for (let i = 0; i < 20; i++) rack.appendChild(document.createElement("span"));
    const luzes = rack.querySelectorAll("span");

    let mes = "normal";
    let rodando = false;
    let quadro = 0;
    let st;

    function valorDe(c) { return Number(controles[c].value); }
    function mostraControles() {
      for (const c in controles) {
        const v = valorDe(c);
        saidas[c].textContent = c === "limite" ? usd(v) : c === "srv" ? v : v + " GB";
      }
    }
    // o que vale agora: o roteiro do mês escolhido ou os controles (no "do meu jeito")
    function agora(d) {
      if (mes === "meu") return { srv: valorDe("srv"), gb: valorDe("gb"), entra: valorDe("entra"), sai: valorDe("sai") };
      const m = MESES[mes];
      return { srv: m.srv(d), gb: m.gb, entra: m.entra, sai: m.sai };
    }
    function aplicaMes() {
      if (mes === "meu") return;
      const m = MESES[mes];
      controles.srv.value = m.srv(0);
      controles.gb.value = m.gb;
      controles.entra.value = m.entra;
      controles.sai.value = m.sai;
      mostraControles();
    }
    function desenha() {
      const total = st.comp + st.arm + st.sai;
      const lim = valorDe("limite");
      const escala = Math.max(lim * 1.25, total, 1);
      visor.textContent = usd(total);
      tx.classList.toggle("estourou", total >= lim);
      diaTxt.textContent = "dia " + Math.min(30, Math.floor(st.dia) + 1) + " de 30";
      barra.style.width = (st.dia / 30) * 100 + "%";
      fatias.comp.style.width = (st.comp / escala) * 100 + "%";
      fatias.arm.style.width = (st.arm / escala) * 100 + "%";
      fatias.sai.style.width = (st.sai / escala) * 100 + "%";
      limiteMarca.style.left = (lim / escala) * 100 + "%";
      valores.comp.textContent = usd(st.comp);
      valores.arm.textContent = usd(st.arm);
      valores.sai.textContent = usd(st.sai);
      valores.entra.textContent = usd(0);
      const ligados = agora(st.dia).srv;
      luzes.forEach((l, k) => l.classList.toggle("on", k < ligados));
      if (mes !== "meu") { controles.srv.value = ligados; saidas.srv.textContent = ligados; }
    }
    function confereAlertas() {
      const total = st.comp + st.arm + st.sai;
      const lim = valorDe("limite");
      [[0.8, "80%"], [1, "100%"]].forEach(function (a) {
        if (!st.tocou[a[1]] && total >= lim * a[0]) {
          st.tocou[a[1]] = Math.floor(st.dia) + 1;
          const li = document.createElement("li");
          li.innerHTML = `🔔 <strong>AWS Budgets</strong>: o gasto passou de ${a[1]} do limite (${usd(lim * a[0])}) no dia ${st.tocou[a[1]]}.`;
          alertas.appendChild(li);
          aviso.textContent = li.textContent;
        }
      });
    }
    // um passo = 1/100 de dia (contado em inteiros, para a conta fechar certinho)
    const PASSOS = 3000;
    function passo() {
      const a = agora(st.n / 100);
      st.comp += a.srv * PRECO.hora * 24 * 0.01;
      st.arm += a.gb * PRECO.gbMes * (0.01 / 30);
      st.sai += a.sai * PRECO.saida * 0.01;
      st.n++;
      st.dia = st.n / 100;
      confereAlertas();
    }
    const VEREDITOS = {
      normal: r => `🙂 <strong>Mês tranquilo: ${usd(r.total)}.</strong> Repare: os dados que <strong>entraram</strong> custaram US$ 0,00. Só a saída é cobrada.`,
      esqueci: r => `😱 <strong>${usd(r.total)}!</strong> Os 20 servidores da venda ficaram ligados até o fim do mês, cobrando por hora. ${r.tocou ? "O Budgets avisou no dia " + r.tocou + ": alguém leu o e-mail?" : ""} Computação foi ${r.pc}% da conta.`,
      desliguei: r => `😎 <strong>${usd(r.total)}.</strong> A venda custou só ${usd(r.extra)} a mais: liga na hora do pico, usa e desliga. É o pagamento conforme o uso.`,
      meu: r => `🧮 <strong>Conta do mês: ${usd(r.total)}.</strong> Computação ${r.pc}%, armazenamento ${r.pa}%, saída de dados ${r.ps}%. Os dados que entraram: US$ 0,00.`
    };
    function zera() {
      rodando = false;
      cancelAnimationFrame(quadro);
      st = { n: 0, dia: 0, acum: 0, comp: 0, arm: 0, sai: 0, tocou: {} };
      alertas.innerHTML = "";
      veredito.innerHTML = "";
      aplicaMes();
      desenha();
      vai.disabled = false;
      vai.textContent = "▶ Rodar o mês";
    }
    function termina() {
      rodando = false;
      cancelAnimationFrame(quadro);
      while (st.n < PASSOS) passo();
      desenha();
      const total = st.comp + st.arm + st.sai;
      const pct = v => Math.round((v / total) * 100);
      const base = 2 * PRECO.hora * 24 * 30 + 200 * PRECO.gbMes + 30 * PRECO.saida * 30;
      veredito.style.setProperty("--c", total >= valorDe("limite") ? "var(--vivo-ruim)" : "var(--vivo-ok)");
      veredito.innerHTML = "<p>" + VEREDITOS[mes]({ total: total, pc: pct(st.comp), pa: pct(st.arm), ps: pct(st.sai), extra: total - base, tocou: st.tocou["80%"] }) + "</p>";
      aviso.textContent = "Fim do mês. " + veredito.textContent;
      vai.disabled = false;
      vai.textContent = "▶ Rodar o mês de novo";
    }
    // o mês anda depressa (2 dias por segundo) e devagar perto da venda (dia 9,5 ao 11)
    const ritmo = d => (d >= 9.5 && d < 11 ? 0.35 : 2);
    function roda() {
      zera();
      if (pausado()) return termina();
      rodando = true;
      vai.disabled = true;
      vai.textContent = "O taxímetro está rodando…";
      let antes = performance.now();
      function quadroDoMes(t) {
        if (!rodando) return;
        if (pausado()) return termina();
        st.acum += Math.min(0.1, (t - antes) / 1000) * ritmo(st.dia);
        antes = t;
        // passos pequenos, para os alertas caírem no dia certo
        while (st.acum >= 0.01 && st.n < PASSOS) { passo(); st.acum -= 0.01; }
        desenha();
        if (st.n >= PASSOS) return termina();
        quadro = requestAnimationFrame(quadroDoMes);
      }
      quadro = requestAnimationFrame(quadroDoMes);
    }
    botoes.forEach(function (b) {
      b.addEventListener("click", function () {
        mes = b.dataset.mes;
        botoes.forEach(x => x.setAttribute("aria-pressed", String(x === b)));
        zera();
      });
    });
    // mexeu num controle: vira "do meu jeito" (e vale na hora, mesmo com o mês rodando)
    for (const c in controles) {
      controles[c].addEventListener("input", function () {
        if (c !== "limite" && mes !== "meu") {
          mes = "meu";
          botoes.forEach(x => x.setAttribute("aria-pressed", String(x.dataset.mes === "meu")));
        }
        mostraControles();
        if (!rodando) desenha();
      });
    }
    vai.addEventListener("click", roda);
    tx.querySelector(".de-novo").addEventListener("click", zera);
    document.addEventListener("placa:movimento", function (e) {
      if (e.detail.pausado && rodando) termina();
    });
    mostraControles();
    zera();
  });

  // ===================== 7. qual jeito de pagar? =====================
  const PAGAR = {
    demanda: "🚕 <strong>Táxi = sob demanda.</strong> Paga a corrida, sem compromisso. Na Ingresso Candango: os servidores extras, só nas horas da venda.",
    plano: "🎫 <strong>Passe mensal = Savings Plans</strong> (ou 🚗 a reserva, o carro alugado por um ano). Você promete usar por 1 ou 3 anos e ganha desconto. Na Ingresso Candango: o site, no ar o ano todo.",
    spot: "💺 <strong>Assento que sobrou = spot.</strong> Até 90% mais barato, mas a AWS pode pedir a máquina de volta. Na Ingresso Candango: os relatórios da madrugada, que recomeçam se pararem.",
    dedicado: "🚐 <strong>Van fretada = host dedicado.</strong> O servidor físico inteiro é só seu. Serve quando a licença ou uma regra exige. A Ingresso Candango não precisa."
  };
  document.querySelectorAll("[data-pagar]").forEach(function (box) {
    const perguntas = box.querySelectorAll("[data-q]");
    const tiles = box.querySelectorAll("[data-jeito]");
    const fala = box.querySelector(".casa-fala");
    function decide() {
      const sim = q => box.querySelector(`[data-q="${q}"]`).getAttribute("aria-pressed") === "true";
      const jeito = sim("fisico") ? "dedicado" : sim("parar") ? "spot" : sim("anos") ? "plano" : "demanda";
      tiles.forEach(function (t) {
        const j = t.dataset.jeito;
        t.classList.toggle("escolhido", j === jeito || (jeito === "plano" && j === "reserva"));
      });
      fala.innerHTML = PAGAR[jeito];
    }
    perguntas.forEach(function (b) {
      b.addEventListener("click", function () {
        b.setAttribute("aria-pressed", String(b.getAttribute("aria-pressed") !== "true"));
        b.querySelector(".sn").textContent = b.getAttribute("aria-pressed") === "true" ? "sim" : "não";
        decide();
      });
    });
    decide();
  });

  // ===================== 8. o iceberg do TCO =====================
  document.querySelectorAll("[data-iceberg]").forEach(function (box) {
    const itens = box.querySelectorAll(".fundo li");
    const botao = box.querySelector("[data-mergulhar]");
    const fala = box.querySelector(".iceberg-fala");
    let n = 0;
    botao.addEventListener("click", function () {
      if (n < itens.length) itens[n++].classList.add("visto");
      fala.textContent = n < itens.length ? `${n} de ${itens.length} custos achados embaixo d'água.` : "Achou todos! Isso é o TCO: o preço do servidor é só a ponta.";
      if (n >= itens.length) { botao.disabled = true; botao.textContent = "🧊 Iceberg inteiro à vista"; box.classList.add("inteiro"); }
    });
  });

  // ===================== 9. suporte: do manual ao pit stop =====================
  const SUPORTE = [
    { min: null, txt: "📖 <strong>Basic = o manual do carro.</strong> Vem com todo carro, de graça: atendimento ao cliente, documentação, re:Post e as verificações principais do Trusted Advisor. Mecânico especialista? Não tem." },
    { min: 30, txt: "🛻 <strong>Business Support+ = o guincho 24 horas.</strong> Especialistas a qualquer hora, assistente com IA e todo o Trusted Advisor. Caso crítico: até 30 minutos. A escolha da Ingresso Candango." },
    { min: 15, txt: "🧑‍🔧 <strong>Enterprise = o mecânico só seu.</strong> Um gerente técnico de conta (TAM) designado, que conhece o seu carro. Caso crítico: até 15 minutos." },
    { min: 5, txt: "🏎️ <strong>Unified Operations = a equipe de box da Fórmula 1.</strong> Uma equipe dedicada para missão crítica. Caso crítico: até 5 minutos." }
  ];
  document.querySelectorAll("[data-suporte]").forEach(function (box) {
    const botoes = box.querySelectorAll("[data-plano]");
    const carro = box.querySelector(".pit-carro");
    const tempo = box.querySelector(".pit-tempo");
    const fala = box.querySelector(".casa-fala");
    function escolhe(k) {
      botoes.forEach((b, i) => b.setAttribute("aria-pressed", String(i === k)));
      const p = SUPORTE[k];
      box.classList.toggle("sem-pista", p.min === null);
      carro.style.left = p.min === null ? "0%" : (p.min / 30) * 92 + "%";
      tempo.textContent = p.min === null ? "sem suporte técnico" : "até " + p.min + " min";
      fala.innerHTML = p.txt;
    }
    botoes.forEach((b, k) => b.addEventListener("click", () => escolhe(k)));
    escolhe(1);
  });

  // ===================== 10. o plantão (gancho com palpites) =====================
  document.querySelectorAll("[data-plantao]").forEach(function (box) {
    const abrir = box.querySelector("[data-abrir]");
    const palpites = box.querySelectorAll("[data-explica]");
    const resposta = box.querySelector(".gancho-resposta");
    abrir.addEventListener("click", function () {
      box.classList.add("aberta");
      abrir.hidden = true;
      box.querySelectorAll("[data-revela]").forEach(el => (el.hidden = false));
      box.querySelector(".gancho-pergunta").focus();
    });
    palpites.forEach(function (b) {
      b.addEventListener("click", function () {
        palpites.forEach(x => x.setAttribute("aria-pressed", String(x === b)));
        resposta.innerHTML = b.dataset.explica + (box.dataset.link ? ` <a href="${box.dataset.link}">${box.dataset.linkTexto}</a>.` : "");
      });
    });
  });

  // ===================== 11. derrube um data center =====================
  document.querySelectorAll("[data-desastre]").forEach(function (sim) {
    const palco = sim.querySelector(".sim-palco");
    const status = sim.querySelector(".sim-veredito");
    const aviso = sim.querySelector(".sim-aviso");
    const copiasTxt = sim.querySelector("[data-copias]");
    const lugares = sim.querySelectorAll("[data-lugar]");
    const desastres = sim.querySelectorAll("[data-golpe]");
    const missoes = {};
    sim.querySelectorAll("[data-missao]").forEach(el => (missoes[el.dataset.missao] = el));
    let golpe = null;
    let quadro = 0;

    // o desenho: os clientes, a região de São Paulo com três zonas (dois prédios cada) e a região da Virgínia
    const cena = svg("svg", { viewBox: "0 0 640 280", "aria-hidden": "true", focusable: "false" }, palco);
    const rot = (x, y, txt, anc) => { const el = svg("text", { x: x, y: y, class: "sim-rotulo", "text-anchor": anc || "middle" }, cena); el.textContent = txt; return el; };
    for (let c = 0; c < 3; c++) for (let l = 0; l < 6; l++) svg("circle", { cx: 30 + c * 16, cy: 90 + l * 18, r: 4, class: "fa-cliente" }, cena);
    rot(46, 214, "clientes");
    rot(46, 228, "no Brasil");
    const sp = svg("rect", { x: 150, y: 28, width: 330, height: 200, rx: 14, class: "dz-regiao" }, cena);
    rot(315, 20, "região sa-east-1 · São Paulo");
    const va = svg("rect", { x: 510, y: 28, width: 120, height: 200, rx: 14, class: "dz-regiao" }, cena);
    rot(570, 20, "us-east-1 · Virgínia");
    const ZONAS = { a: 165, b: 270, c: 375 };
    const zonaEl = {}, prediosEl = {}, chips = {};
    Object.keys(ZONAS).forEach(function (z) {
      const x = ZONAS[z];
      zonaEl[z] = svg("rect", { x: x, y: 50, width: 90, height: 160, rx: 10, class: "dz-zona" }, cena);
      rot(x + 45, 68, "zona " + z);
      prediosEl[z] = [0, 1].map(k => svg("rect", { x: x + 12 + k * 36, y: 112, width: 30, height: 56, rx: 3, class: "dz-predio" }, cena));
      chips[z] = svg("text", { x: x + 45, y: 96, class: "dz-site", "text-anchor": "middle" }, cena);
    });
    svg("rect", { x: 525, y: 50, width: 90, height: 160, rx: 10, class: "dz-zona" }, cena);
    rot(570, 68, "zonas de lá");
    [0, 1].forEach(k => svg("rect", { x: 537 + k * 36, y: 112, width: 30, height: 56, rx: 3, class: "dz-predio" }, cena));
    chips.va = svg("text", { x: 570, y: 96, class: "dz-site", "text-anchor": "middle" }, cena);
    const fogo = svg("text", { x: ZONAS.a + 27, y: 108, class: "dz-fogo", "text-anchor": "middle" }, cena);
    const raio = svg("text", { x: ZONAS.a + 45, y: 200, class: "dz-fogo", "text-anchor": "middle" }, cena);
    const tornado = svg("text", { x: 315, y: 46, class: "dz-fogo grande", "text-anchor": "middle" }, cena);
    // trilhas dos clientes até cada lugar
    // cada lugar tem a sua pista, por baixo das zonas (como trilhas de placa), e entra pela base dela
    const DESTINOS = { a: [ZONAS.a + 45, 236], b: [ZONAS.b + 45, 248], c: [ZONAS.c + 45, 260], va: [570, 272] };
    const trilhas = {};
    Object.keys(DESTINOS).forEach(function (k) {
      const d = DESTINOS[k];
      trilhas[k] = svg("path", { d: `M78 140 H112 V${d[1]} H${d[0]} V172`, class: "sim-trilha dz-trilha" }, cena);
    });
    const pulsos = svg("g", {}, cena);

    const temSite = k => sim.querySelector(`[data-lugar="${k}"]`).getAttribute("aria-pressed") === "true";
    // o lugar ainda está de pé depois do desastre?
    function vivo(k) {
      if (golpe === "regiao") return k === "va";
      if (golpe === "apagao" || golpe === "fogo") return k !== "a";
      return true;
    }
    function quemAtende() {
      return ["a", "b", "c", "va"].find(k => temSite(k) && vivo(k)) || null;
    }
    function desenha() {
      Object.keys(ZONAS).forEach(function (z) {
        const caiuZona = !vivo(z) && (golpe === "apagao" || golpe === "regiao");
        zonaEl[z].setAttribute("class", "dz-zona" + (caiuZona ? " caiu" : ""));
        prediosEl[z].forEach((p, k) => p.setAttribute("class", "dz-predio" + (caiuZona || (golpe === "fogo" && z === "a" && k === 0) ? " caiu" : "")));
        chips[z].textContent = temSite(z) ? (vivo(z) ? "🌐 site" : "💀 site") : "";
      });
      chips.va.textContent = temSite("va") ? "🌐 site" : "";
      sp.setAttribute("class", "dz-regiao" + (golpe === "regiao" ? " caiu" : ""));
      fogo.textContent = golpe === "fogo" ? "🔥" : "";
      raio.textContent = golpe === "apagao" ? "⚡" : "";
      tornado.textContent = golpe === "regiao" ? "🌪️" : "";
      const atende = quemAtende();
      Object.keys(trilhas).forEach(k => trilhas[k].classList.toggle("ativa", k === atende));
      const n = ["a", "b", "c", "va"].filter(temSite).length;
      copiasTxt.textContent = n + (n === 1 ? " cópia" : " cópias");
      // o resultado
      const NOMES = { a: "zona a", b: "zona b", c: "zona c", va: "outra região (Virgínia)" };
      const GOLPES = { fogo: "o incêndio no data center da zona a", apagao: "o apagão na zona a", regiao: "o desastre na região de São Paulo" };
      if (!n) {
        status.style.setProperty("--c", "var(--vivo-ruim)");
        status.innerHTML = "<p>Coloque o site em pelo menos um lugar.</p>";
      } else if (!golpe) {
        status.style.setProperty("--c", "var(--vivo-ok)");
        status.innerHTML = `<p>✅ <strong>Tudo normal:</strong> o site está no ar, na ${NOMES[atende]}. Agora dispare um desastre.</p>`;
      } else if (atende) {
        status.style.setProperty("--c", "var(--vivo-ok)");
        status.innerHTML = `<p>✅ <strong>O site aguentou ${GOLPES[golpe]}!</strong> Os clientes foram atendidos pela ${NOMES[atende]}.</p>`;
      } else {
        status.style.setProperty("--c", "var(--vivo-ruim)");
        status.innerHTML = `<p>💥 <strong>Site fora do ar.</strong> ${GOLPES[golpe][0].toUpperCase() + GOLPES[golpe].slice(1)} derrubou todas as cópias. ${golpe === "regiao" ? "Só uma cópia em outra região salva." : "Uma cópia em outra zona salvaria."}</p>`;
      }
      // as missões
      const zonasSP = ["a", "b", "c"].filter(temSite).length;
      if (golpe && golpe !== "regiao" && atende && zonasSP === 2 && !temSite("va")) cumpre("zonas");
      if (golpe === "regiao" && atende) cumpre("regioes");
      aviso.textContent = status.textContent;
    }
    function cumpre(m) {
      const el = missoes[m];
      if (!el || el.classList.contains("feita")) return;
      el.classList.add("feita");
      el.querySelector(".estado").textContent = "✓ cumprida";
    }
    // os pulsos: clientes correndo até quem atende (ou batendo na porta fechada)
    let lista = [];
    let acum = 0;
    let antes = performance.now();
    function anima(agora) {
      const dt = Math.min(0.05, (agora - antes) / 1000);
      antes = agora;
      if (!pausado()) {
        acum += dt * 6;
        const alvo = quemAtende() || (["a", "b", "c", "va"].find(temSite));
        while (acum >= 1 && alvo && lista.length < 40) {
          const c = trilhas[alvo];
          lista.push({ el: svg("circle", { r: 3.5, class: "fa" + (quemAtende() ? "" : " desistiu") }, pulsos), c: c, tam: c.getTotalLength(), t: 0, falha: !quemAtende() });
          acum--;
        }
        lista = lista.filter(function (f) {
          f.t += dt * 0.9;
          const lim = f.falha ? 0.85 : 1;
          if (f.t >= lim) { f.el.remove(); return false; }
          const pt = f.c.getPointAtLength(f.t * f.tam);
          f.el.setAttribute("cx", pt.x);
          f.el.setAttribute("cy", pt.y);
          return true;
        });
      } else if (lista.length) {
        lista.forEach(f => f.el.remove());
        lista = [];
      }
      quadro = requestAnimationFrame(anima);
    }
    lugares.forEach(function (b) {
      b.addEventListener("click", function () {
        b.setAttribute("aria-pressed", String(b.getAttribute("aria-pressed") !== "true"));
        desenha();
      });
    });
    desastres.forEach(function (b) {
      b.addEventListener("click", function () {
        golpe = b.dataset.golpe || null;
        desastres.forEach(x => x.setAttribute("aria-pressed", String(x === b && !!golpe)));
        desenha();
      });
    });
    desenha();
    quadro = requestAnimationFrame(anima);
  });

  // ===================== 12. do globo ao prédio =====================
  const ZOOM = {
    mundo: "🌎 <strong>A AWS no mundo = o mapa-múndi.</strong> Em 04/11/2026, eram 39 regiões no ar e mais de 750 pontos de presença, espalhados pelos continentes.",
    regiao: "🏙️ <strong>Região = a cidade.</strong> São Paulo, código <code>sa-east-1</code>. Cada cidade é separada das outras: um problema numa não derruba a outra, e nada é copiado de uma para outra sem você mandar.",
    zona: "🏘️ <strong>Zona de disponibilidade = bairros distantes da mesma cidade.</strong> Cada bairro com a sua luz, água e internet. Longe o bastante para não cair junto, perto o bastante para conversar rápido: <code>sa-east-1a</code>, <code>b</code> e <code>c</code>.",
    dc: "🏢 <strong>Data center = o prédio.</strong> Onde os servidores ficam de verdade. Uma zona tem um ou mais prédios.",
    borda: "📦 <strong>Ponto de presença = o armário de retirada perto da sua casa.</strong> Guarda cópias do que é mais pedido, para entregar rápido. Não é região nem zona: fica fora da escada, espalhado pelas cidades."
  };
  document.querySelectorAll("[data-zoom]").forEach(function (box) {
    const botoes = box.querySelectorAll("[data-nivel]");
    const caixas = box.querySelectorAll("[data-caixa]");
    const fala = box.querySelector(".casa-fala");
    function escolhe(nivel) {
      botoes.forEach(b => b.setAttribute("aria-pressed", String(b.dataset.nivel === nivel)));
      caixas.forEach(c => c.classList.toggle("ativa", c.dataset.caixa === nivel));
      fala.innerHTML = ZOOM[nivel];
    }
    botoes.forEach(b => b.addEventListener("click", () => escolhe(b.dataset.nivel)));
    escolhe("mundo");
  });

  // ===================== 13. o funil da região =====================
  const FUNIL = [
    { nome: "1. Conformidade", pergunta: "Alguma lei ou contrato exige um lugar?",
      com: { sai: { va: "o contrato exige os dados no Brasil", ie: "o contrato exige os dados no Brasil" }, fala: "O contrato do órgão público exige o Brasil: só São Paulo segue. <strong>A lei manda primeiro.</strong>" },
      sem: { sai: {}, fala: "Nenhuma lei ou contrato prende os dados: as três seguem no funil." } },
    { nome: "2. Latência", pergunta: "Onde estão os usuários?",
      com: { sai: {}, fala: "Os clientes estão no Brasil, e São Paulo é a mais perto. Confirmado." },
      sem: { sai: { va: "longe dos clientes do Brasil", ie: "longe dos clientes do Brasil" }, fala: "Os clientes estão no Brasil: São Paulo é a mais perto. Virgínia e Irlanda ficam longe." } },
    { nome: "3. Custo", pergunta: "Quanto o mesmo serviço custa em cada região?",
      com: { sai: {}, fala: "O sócio viu que Virgínia é mais barata. Mas ela já caiu no critério 1: <strong>o preço só escolhe entre quem cumpre a lei.</strong>" },
      sem: { sai: {}, fala: "O sócio viu que Virgínia é mais barata. Mas ela perdeu na latência, que vem antes do custo." } },
    { nome: "4. Serviços e recursos", pergunta: "O serviço que eu preciso existe nessa região?",
      com: { sai: {}, fala: "Os serviços do site existem em São Paulo. <strong>Região escolhida: sa-east-1.</strong> Desta vez, quem decidiu foi a lei." },
      sem: { sai: {}, fala: "Os serviços do site existem em São Paulo. <strong>Região escolhida: sa-east-1.</strong> Desta vez, quem decidiu foi a latência." } }
  ];
  document.querySelectorAll("[data-funil]").forEach(function (box) {
    const cards = {};
    box.querySelectorAll("[data-regiao]").forEach(el => (cards[el.dataset.regiao] = el));
    const crits = box.querySelectorAll("[data-crit]");
    const fala = box.querySelector(".casa-fala");
    const proximo = box.querySelector("[data-proximo]");
    const cenarios = box.querySelectorAll("[data-cenario]");
    let cenario = "com";
    let passo = 0;
    function zera() {
      passo = 0;
      Object.values(cards).forEach(c => { c.classList.remove("saiu"); c.querySelector(".motivo").textContent = ""; });
      crits.forEach(c => c.classList.remove("feito", "agora"));
      fala.innerHTML = cenario === "com" ? "Com o contrato do órgão público. Aperte <strong>Próximo critério</strong> e veja quem cai." : "Sem o contrato do órgão público. Aperte <strong>Próximo critério</strong> e veja quem cai.";
      proximo.disabled = false;
      proximo.textContent = "▶ Próximo critério";
    }
    proximo.addEventListener("click", function () {
      if (passo >= FUNIL.length) return zera();
      const c = FUNIL[passo][cenario];
      crits.forEach((el, k) => { el.classList.toggle("feito", k < passo); el.classList.toggle("agora", k === passo); });
      Object.keys(c.sai).forEach(function (r) {
        cards[r].classList.add("saiu");
        cards[r].querySelector(".motivo").textContent = "saiu: " + c.sai[r];
      });
      fala.innerHTML = c.fala;
      passo++;
      if (passo >= FUNIL.length) proximo.textContent = "↺ Recomeçar";
    });
    cenarios.forEach(function (b) {
      b.addEventListener("click", function () {
        cenario = b.dataset.cenario;
        cenarios.forEach(x => x.setAttribute("aria-pressed", String(x === b)));
        zera();
      });
    });
    zera();
  });

  // ===================== 14. tranque a conta =====================
  const BRECHAS = {
    bucket: { ico: "🪣", nome: "Bucket público", fix: "<strong>🪣 Bucket público → fechado.</strong> Ligue o bloqueio de acesso público do S3 e deixe ler só quem precisa. O que fica público é configuração: coluna do cliente." },
    raiz: { ico: "📝", nome: "Senha da raiz no papel", fix: "<strong>📝 Senha da raiz → no cofre.</strong> A conta raiz fica guardada, com MFA, só para as tarefas que exigem ela. Cada pessoa entra com o próprio acesso, pelo IAM Identity Center." },
    mfa: { ico: "📱", nome: "Sem MFA", fix: "<strong>📱 MFA ligado.</strong> Senha mais um código do celular ou uma chave de segurança. Quem roubar só a senha fica do lado de fora." },
    admin: { ico: "🎓", nome: "Estagiário administrador", fix: "<strong>🎓 Menor privilégio.</strong> O estagiário recebe só o que a tarefa pede. Sem poder de administrador, ele não consegue abrir um bucket para o mundo." },
    chave: { ico: "🔑", nome: "Chave de acesso no código", fix: "<strong>🔑 Chave fora do código.</strong> Apague a chave que vazou, crie outra e guarde no AWS Secrets Manager; para programas, prefira uma função (role)." }
  };
  const DA_NUVEM = "<strong>Isso é segurança DA nuvem:</strong> a AWS já cuida, em todos os serviços. O cliente nem tem como mexer aqui. As brechas estão do outro lado.";
  document.querySelectorAll("[data-tranca]").forEach(function (sim) {
    const palco = sim.querySelector(".sim-palco");
    const fala = sim.querySelector(".casa-fala");
    const risco = sim.querySelector(".tr-risco i");
    const riscoTxt = sim.querySelector("[data-risco]");
    const entrouTxt = sim.querySelector("[data-entrou]");
    const ids = Object.keys(BRECHAS);
    const aberta = {};
    ids.forEach(k => (aberta[k] = true));
    let entraram = 0;

    const cena = svg("svg", { viewBox: "0 0 640 300", "aria-hidden": "true", focusable: "false" }, palco);
    const t = (x, y, txt, cls, anc) => { const el = svg("text", { x: x, y: y, class: cls || "sim-rotulo", "text-anchor": anc || "middle" }, cena); el.textContent = txt; return el; };
    t(48, 160, "🦹", "tr-icone");
    t(48, 192, "invasor");
    const cofre = svg("rect", { x: 540, y: 105, width: 86, height: 90, rx: 12, class: "tr-cofre" }, cena);
    t(583, 160, "📋", "tr-icone");
    t(583, 214, "lista de clientes");
    const lanes = {}, portas = {}, cadeados = {};
    ids.forEach(function (k, i) {
      const y = 40 + i * 55;
      const c = svg("path", { d: `M80 150 C200 150 250 ${y} 350 ${y} L420 ${y} C480 ${y} 500 150 540 150`, class: "sim-trilha tr-trilha" }, cena);
      portas[k] = svg("rect", { x: 362, y: y - 20, width: 46, height: 40, rx: 8, class: "tr-porta" }, cena);
      t(385, y + 7, BRECHAS[k].ico, "tr-icone-p");
      cadeados[k] = t(420, y - 12, "🔓", "tr-cadeado", "start");
      // até onde o pulso anda antes de bater na porta
      const tam = c.getTotalLength();
      let a = 0, b = tam;
      for (let n = 0; n < 20; n++) { const m = (a + b) / 2; if (c.getPointAtLength(m).x < 360) a = m; else b = m; }
      lanes[k] = { c: c, tam: tam, porta: a / tam };
    });
    const pulsos = svg("g", {}, cena);
    let lista = [], acum = 0, antes = performance.now();

    function desenha() {
      const abertas = ids.filter(k => aberta[k]).length;
      ids.forEach(function (k) {
        portas[k].setAttribute("class", "tr-porta " + (aberta[k] ? "aberta" : "fechada"));
        cadeados[k].textContent = aberta[k] ? "🔓" : "🔒";
        const b = sim.querySelector(`[data-brecha="${k}"]`);
        b.setAttribute("aria-pressed", String(!aberta[k]));
        b.querySelector(".estado").textContent = aberta[k] ? "aberta" : "fechada";
      });
      const pct = Math.round((abertas / ids.length) * 100);
      risco.style.width = pct + "%";
      riscoTxt.textContent = pct + "%";
      sim.classList.toggle("trancada", abertas === 0);
      if (abertas === 0) fala.innerHTML = "🔒 <strong>Conta trancada!</strong> As cinco brechas eram da coluna do cliente: segurança NA nuvem. A AWS não tinha como fechar nenhuma delas por você.";
    }
    function anima(agora) {
      const dt = Math.min(0.05, (agora - antes) / 1000);
      antes = agora;
      if (!pausado()) {
        acum += dt * 4;
        while (acum >= 1 && lista.length < 30) {
          const k = ids[Math.floor(Math.random() * ids.length)];
          lista.push({ k: k, el: svg("circle", { r: 4, class: "fa desistiu" }, pulsos), t: 0 });
          acum--;
        }
        lista = lista.filter(function (f) {
          const L = lanes[f.k];
          f.t += dt * 0.55;
          if (!aberta[f.k] && f.t >= L.porta) {
            // bateu na porta fechada: vira escudo e some
            f.el.setAttribute("class", "fa servido");
            f.vida = (f.vida || 0.4) - dt;
            f.el.setAttribute("opacity", Math.max(0, f.vida * 2.5));
            if (f.vida <= 0) { f.el.remove(); return false; }
            return true;
          }
          if (f.t >= 1) {
            f.el.remove();
            entraram++;
            entrouTxt.textContent = entraram;
            cofre.classList.remove("alarme");
            void cofre.getBBox();
            cofre.classList.add("alarme");
            return false;
          }
          const pt = L.c.getPointAtLength(f.t * L.tam);
          f.el.setAttribute("cx", pt.x);
          f.el.setAttribute("cy", pt.y);
          return true;
        });
      } else if (lista.length) {
        lista.forEach(f => f.el.remove());
        lista = [];
      }
      requestAnimationFrame(anima);
    }
    sim.querySelectorAll("[data-brecha]").forEach(function (b) {
      b.addEventListener("click", function () {
        const k = b.dataset.brecha;
        aberta[k] = !aberta[k];
        fala.innerHTML = aberta[k] ? `<strong>${BRECHAS[k].ico} ${BRECHAS[k].nome}:</strong> aberta de novo. O invasor agradece.` : BRECHAS[k].fix;
        desenha();
      });
    });
    sim.querySelectorAll("[data-da-nuvem]").forEach(b => b.addEventListener("click", () => (fala.innerHTML = DA_NUVEM)));
    sim.querySelector(".de-novo").addEventListener("click", function () {
      ids.forEach(k => (aberta[k] = true));
      entraram = 0;
      entrouTxt.textContent = 0;
      fala.innerHTML = "Tudo aberto de novo. Feche as brechas da coluna da direita, uma por uma.";
      desenha();
    });
    fala.innerHTML = "O invasor está tentando. Clique nas brechas da coluna <strong>NA nuvem</strong> para fechar cada uma.";
    desenha();
    requestAnimationFrame(anima);
  });

  // ===================== 15. a porta abre? =====================
  const PEDIDOS = {
    ler: { txt: "ler uma foto do show", acao: "s3:GetObject", rec: "fotos/show.jpg" },
    apagar: { txt: "apagar uma foto do show", acao: "s3:DeleteObject", rec: "fotos/show.jpg" },
    lista: { txt: "ler a lista de clientes", acao: "s3:GetObject", rec: "lista-clientes/2026.csv" }
  };
  const POLITICAS = {
    lerfotos: { nome: "LerFotos", efeito: "Allow", serve: (p) => p.acao === "s3:GetObject" && p.rec.startsWith("fotos/"), quem: ["ana", "visitante"] },
    tudo: { nome: "TudoNoS3", efeito: "Allow", serve: () => true, quem: ["ana"] },
    protege: { nome: "ProtegeClientes", efeito: "Deny", serve: (p) => p.rec.startsWith("lista-clientes/"), quem: ["ana", "visitante", "bia"] }
  };
  const QUEM = { ana: "Ana (usuária, grupo Monitores)", visitante: "o visitante (função temporária)", bia: "Bia (usuária, sem grupo)" };
  document.querySelectorAll("[data-porta]").forEach(function (box) {
    const passos = box.querySelectorAll(".porta-passos li");
    if (!passos.length) return; // não é a fechadura da aula 4
    const led = box.querySelector(".porta-led");
    const resultado = box.querySelector(".porta-resultado");
    const pedidoTxt = box.querySelector("[data-pedido-txt]");
    let quem = "ana", pedido = "ler", espera = [];
    const ligada = k => box.querySelector(`[data-politica="${k}"]`).getAttribute("aria-pressed") === "true";
    function avalia() {
      espera.forEach(clearTimeout);
      espera = [];
      const p = PEDIDOS[pedido];
      pedidoTxt.innerHTML = `<strong>${QUEM[quem]}</strong> quer <strong>${p.txt}</strong> · <code>${p.acao}</code> em <code>${p.rec}</code>`;
      const valem = Object.keys(POLITICAS).filter(k => ligada(k) && POLITICAS[k].quem.includes(quem) && POLITICAS[k].serve(p));
      const allows = valem.filter(k => POLITICAS[k].efeito === "Allow").map(k => POLITICAS[k].nome);
      const denies = valem.filter(k => POLITICAS[k].efeito === "Deny").map(k => POLITICAS[k].nome);
      const textos = [
        "🔒 Começa negado: ninguém entra sem uma regra que libere.",
        allows.length ? `✅ Tem Allow: ${allows.join(" e ")}.` : "➖ Nenhum Allow serve para este pedido.",
        denies.length ? `⛔ Tem Deny explícito: ${denies.join(", ")}. Ele vence qualquer Allow.` : "➖ Nenhum Deny explícito."
      ];
      const abre = allows.length > 0 && denies.length === 0;
      const fim = abre ? "🟢 A porta abre: permitido." : denies.length ? "🔴 Porta trancada: o Deny explícito venceu." : "🔴 Porta trancada: ninguém liberou (negação implícita).";
      passos.forEach(li => li.classList.remove("feito"));
      led.className = "porta-led";
      resultado.textContent = "";
      const mostra = function (k) {
        if (k < 3) {
          passos[k].querySelector("span").textContent = textos[k];
          passos[k].classList.add("feito");
        } else {
          led.className = "porta-led " + (abre ? "verde" : "vermelho");
          resultado.textContent = fim;
        }
      };
      if (pausado()) { for (let k = 0; k <= 3; k++) mostra(k); return; }
      for (let k = 0; k <= 3; k++) espera.push(setTimeout(() => mostra(k), 350 + k * 550));
    }
    box.querySelectorAll("[data-quem]").forEach(function (b) {
      b.addEventListener("click", function () {
        quem = b.dataset.quem;
        box.querySelectorAll("[data-quem]").forEach(x => x.setAttribute("aria-pressed", String(x === b)));
        avalia();
      });
    });
    box.querySelectorAll("[data-pedido]").forEach(function (b) {
      b.addEventListener("click", function () {
        pedido = b.dataset.pedido;
        box.querySelectorAll("[data-pedido]").forEach(x => x.setAttribute("aria-pressed", String(x === b)));
        avalia();
      });
    });
    box.querySelectorAll("[data-politica]").forEach(function (b) {
      b.addEventListener("click", function () {
        b.setAttribute("aria-pressed", String(b.getAttribute("aria-pressed") !== "true"));
        avalia();
      });
    });
    avalia();
  });

  // ===================== 16. a viagem do pacote =====================
  const POSTOS = {
    net: { ico: "🌐", nome: "Internet", dia: "a rua" },
    hacker: { ico: "🦹", nome: "Hacker", dia: "um estranho na rua" },
    atacante: { ico: "🤖", nome: "IP atacante", dia: "um carro suspeito" },
    igw: { ico: "🚪", nome: "Gateway de internet", dia: "o portão da quadra" },
    rotaPub: { ico: "🪧", nome: "Rotas da sub-rede pública", dia: "placas do bloco comercial" },
    rotaPriv: { ico: "🪧", nome: "Rotas da sub-rede privada", dia: "placas do bloco residencial" },
    local: { ico: "🛣️", nome: "Rota local", dia: "a rua interna da quadra" },
    acl: { ico: "🚧", nome: "ACL de rede", dia: "a cancela do bloco" },
    sgSite: { ico: "🧍", nome: "Grupo de segurança do site", dia: "o porteiro do site" },
    sgBanco: { ico: "🧍", nome: "Grupo de segurança do banco", dia: "o porteiro do banco" },
    nat: { ico: "🔁", nome: "NAT gateway", dia: "a saída da garagem" },
    site: { ico: "🖥️", nome: "Servidor do site", dia: "a loja" },
    banco: { ico: "🗄️", nome: "Banco de dados", dia: "o cofre" }
  };
  // cada viagem: os postos e a regra de cada um (devolve null se passa, ou o motivo se barra)
  const VIAGENS = {
    cliente: { titulo: "Um cliente abre o site", postos: ["net", "igw", "rotaPub", "acl", "sgSite", "site"], regra: () => null,
      ok: "✅ <strong>O cliente chegou ao site.</strong> Sub-rede pública, rota para o portão, porteiro aceitando a porta do site (HTTPS)." },
    hacker: { titulo: "O hacker tenta o banco", alerta: true, postos: ["hacker", "igw", "rotaPriv", "acl", "sgBanco", "banco"],
      regra: (p, c) => (p === "rotaPriv" && !c.rota ? "Não há placa para a rua: o bloco residencial (sub-rede privada) não tem caminho vindo do portão." :
        p === "sgBanco" && c.porteiro ? "O porteiro do banco só deixa entrar quem vem do site." : null),
      ok: "💥 <strong>O hacker chegou no banco!</strong> Com rota para a internet e porteiro aceitando qualquer um, o cofre ficou de frente para a rua." },
    interno: { titulo: "O site consulta o banco", postos: ["site", "sgSite", "local", "acl", "sgBanco", "banco"], regra: () => null,
      ok: "✅ <strong>O site falou com o banco</strong> pela rua interna da quadra. O porteiro do banco conhece o porteiro do site." },
    atualizacao: { titulo: "O banco baixa atualizações", postos: ["banco", "sgBanco", "rotaPriv", "nat", "igw", "net"],
      regra: (p, c) => (p === "rotaPriv" && !c.nat ? "Nenhuma placa aponta para fora: sem NAT gateway, o banco da sub-rede privada não sai." : null),
      ok: "✅ <strong>O banco baixou as atualizações</strong> pelo NAT gateway, e a resposta voltou. Mas ninguém de fora consegue começar uma conversa com ele por ali." },
    atacante: { titulo: "Um IP ataca o site", alerta: true, postos: ["atacante", "igw", "rotaPub", "acl", "sgSite", "site"],
      regra: (p, c) => (p === "acl" && c.cancela ? "A cancela tem uma regra que nega esse IP: barrado na entrada do bloco." : null),
      ok: "😬 <strong>O atacante chegou ao site.</strong> O site é público, e o porteiro (grupo de segurança) só sabe permitir. Para barrar um IP, só a cancela: a ACL de rede, que sabe negar." }
  };
  document.querySelectorAll("[data-viagem]").forEach(function (box) {
    const trilha = box.querySelector(".viagem-trilha");
    const fala = box.querySelector(".casa-fala");
    const vai = box.querySelector(".vai");
    let viagem = "cliente";
    let espera = [];
    const chave = k => box.querySelector(`[data-chave="${k}"]`).getAttribute("aria-pressed") === "true";
    function monta() {
      espera.forEach(clearTimeout);
      espera = [];
      const v = VIAGENS[viagem];
      trilha.innerHTML = v.postos.map(function (k) {
        const p = POSTOS[k];
        return `<li data-posto="${k}"><span class="ico" aria-hidden="true">${p.ico}</span><strong>${p.nome}</strong><small>${p.dia}</small><span class="pacote" aria-hidden="true">📦</span></li>`;
      }).join("");
      fala.innerHTML = `<strong>${v.titulo}.</strong> Aperte <strong>Mandar o pacote</strong> e acompanhe os postos.`;
    }
    function manda() {
      monta();
      const v = VIAGENS[viagem];
      const c = { rota: chave("rota"), nat: chave("nat"), cancela: chave("cancela"), porteiro: chave("porteiro") };
      const itens = trilha.querySelectorAll("li");
      let barrou = -1, motivo = "";
      v.postos.some(function (k, i) {
        const m = v.regra(k, c);
        if (m) { barrou = i; motivo = m; return true; }
        return false;
      });
      const fim = barrou < 0 ? itens.length - 1 : barrou;
      const final = function () {
        fala.innerHTML = barrou < 0 ? v.ok : `⛔ <strong>Barrado no posto ${POSTOS[v.postos[barrou]].nome}</strong> (${POSTOS[v.postos[barrou]].dia}). ${motivo}`;
        vai.disabled = false;
      };
      const passo = function (i) {
        itens.forEach(li => li.classList.remove("atual"));
        // o invasor que chega ao destino deixa o destino em vermelho
        const invadiu = barrou < 0 && v.alerta && i === itens.length - 1;
        itens[i].classList.add(i === barrou || invadiu ? "barrou" : "passou", "atual");
        if (i === fim) final();
      };
      if (pausado()) { for (let i = 0; i <= fim; i++) passo(i); return; }
      vai.disabled = true;
      for (let i = 0; i <= fim; i++) espera.push(setTimeout(() => passo(i), 200 + i * 520));
    }
    box.querySelectorAll("[data-ida]").forEach(function (b) {
      b.addEventListener("click", function () {
        viagem = b.dataset.ida;
        box.querySelectorAll("[data-ida]").forEach(x => x.setAttribute("aria-pressed", String(x === b)));
        vai.disabled = false;
        monta();
      });
    });
    box.querySelectorAll("[data-chave]").forEach(function (b) {
      b.addEventListener("click", function () {
        b.setAttribute("aria-pressed", String(b.getAttribute("aria-pressed") !== "true"));
        b.querySelector(".sn").textContent = b.getAttribute("aria-pressed") === "true" ? "ligada" : "desligada";
        vai.disabled = false;
        monta();
      });
    });
    vai.addEventListener("click", manda);
    monta();
  });

  // ===================== 17. com memória × sem memória =====================
  document.querySelectorAll("[data-memoria]").forEach(function (box) {
    const carros = box.querySelectorAll(".mem-carro");
    const portoes = box.querySelectorAll(".mem-portao");
    const regra = box.querySelector("[data-regra-volta]");
    const fala = box.querySelector(".casa-fala");
    const vai = box.querySelector(".vai");
    let espera = [];
    function anda() {
      espera.forEach(clearTimeout);
      espera = [];
      const temRegra = regra.getAttribute("aria-pressed") === "true";
      const lento = !pausado();
      carros.forEach(c => { c.className = "mem-carro"; c.style.left = "4%"; });
      portoes.forEach(p => (p.className = "mem-portao"));
      const fim = function () {
        // porteiro: lembra e deixa voltar; cancela: só com a regra de volta
        carros[0].style.left = "4%";
        carros[0].classList.add("volta");
        portoes[0].classList.add("ok");
        if (temRegra) {
          carros[1].style.left = "4%";
          carros[1].classList.add("volta");
          portoes[1].classList.add("ok");
          fala.innerHTML = "✅ Os dois carros voltaram. Na cancela, só porque <strong>você criou a regra de volta</strong>: a ACL não lembra de ninguém.";
        } else {
          carros[1].style.left = "56%";
          carros[1].classList.add("barrado");
          portoes[1].classList.add("nao");
          fala.innerHTML = "🚧 O porteiro lembrou do carro e deixou voltar (<strong>com memória, stateful</strong>). A cancela barrou na volta: ela confere a volta como se fosse um carro novo (<strong>sem memória, stateless</strong>). Ligue a regra de volta e teste de novo.";
        }
        vai.disabled = false;
      };
      if (!lento) return fim();
      vai.disabled = true;
      fala.textContent = "Os dois carros saem do bloco…";
      espera.push(setTimeout(() => { carros.forEach(c => (c.style.left = "86%")); portoes.forEach(p => p.classList.add("ok")); }, 80));
      espera.push(setTimeout(() => { fala.textContent = "…e agora voltam."; portoes.forEach(p => (p.className = "mem-portao")); }, 1300));
      espera.push(setTimeout(fim, 1500));
    }
    regra.addEventListener("click", function () {
      regra.setAttribute("aria-pressed", String(regra.getAttribute("aria-pressed") !== "true"));
      regra.querySelector(".sn").textContent = regra.getAttribute("aria-pressed") === "true" ? "ligada" : "desligada";
    });
    vai.addEventListener("click", anda);
  });

  // ===================== 18. a régua de bits =====================
  document.querySelectorAll("[data-bits]").forEach(function (box) {
    const leds = box.querySelector(".bits-leds");
    const barra = box.querySelector("input[type=range]");
    const cidr = box.querySelector("[data-cidr]");
    const conta = box.querySelector("[data-conta]");
    const fala = box.querySelector(".casa-fala");
    // 10.0.0.0 em binário: o primeiro byte é 00001010
    const ip = "00001010" + "0".repeat(24);
    for (let i = 0; i < 32; i++) {
      if (i && i % 8 === 0) { const p = document.createElement("b"); p.textContent = "."; leds.appendChild(p); }
      const l = document.createElement("span");
      l.className = "bit" + (ip[i] === "1" ? " um" : "");
      leds.appendChild(l);
    }
    const bits = leds.querySelectorAll(".bit");
    function mostra() {
      const n = Number(barra.value);
      const total = 2 ** (32 - n);
      bits.forEach((b, i) => { b.classList.toggle("rede", i < n); b.classList.toggle("host", i >= n); });
      cidr.textContent = "10.0.0.0/" + n;
      conta.innerHTML = `2<sup>${32 - n}</sup> = <strong>${num(total)}</strong> endereços · menos os 5 que a AWS reserva = <strong>${num(total - 5)}</strong> para usar`;
      fala.innerHTML = `Os <strong>${n}</strong> primeiros bits (dourados) dizem <strong>qual é a quadra</strong>, a rede. Sobram <strong>${32 - n}</strong> bits (menta) para numerar <strong>os apartamentos</strong>, os aparelhos.` +
        (n === 16 ? " É o tamanho da VPC da aula: o maior que a AWS deixa." : n === 28 ? " É o menor bloco que a AWS deixa criar." : n === 24 ? " É o tamanho típico de uma sub-rede." : "");
    }
    barra.addEventListener("input", mostra);
    box.querySelectorAll("[data-mascara]").forEach(b => b.addEventListener("click", () => { barra.value = b.dataset.mascara; mostra(); }));
    mostra();
  });

  // ===================== 19. a central de tarefas =====================
  // para cada tarefa, o resultado de cada motor: [tipo, texto]; tipo: certo, meh (funciona, mas não é o melhor) ou falha
  const CENTRAL = {
    site: { certo: "ec2",
      ec2: "Servidor seu, com o sistema escolhido pela equipe, ligado o tempo todo.",
      fargate: ["meh", "Roda, mas a equipe queria escolher e cuidar do sistema operacional; no Fargate, quem cuida é a AWS."],
      lambda: ["falha", "⏱️ O Lambda acorda por evento e vai até 15 minutos. Um site no ar o tempo todo, com o sistema escolhido pela equipe, não é com ele."],
      beanstalk: ["meh", "Funciona, mas a equipe queria mexer no sistema operacional, e o Beanstalk cuida disso por você."],
      spot: ["falha", "💥 Na abertura da venda, a AWS pede a máquina de volta e o site cai. Spot não é para o que não pode cair."] },
    pdf: { certo: "lambda",
      lambda: "Acorda na compra, trabalha 2 segundos e volta a dormir. Você paga só os 2 segundos.",
      ec2: ["meh", "😴 Funciona, mas o servidor fica quase o dia inteiro parado, e você paga cada hora."],
      fargate: ["meh", "Funciona, mas é muito motor para 2 segundos de trabalho."],
      beanstalk: ["meh", "Funciona, mas deixa máquinas ligadas para um trabalho de 2 segundos."],
      spot: ["falha", "💥 Interrompido no meio da compra: o cliente fica sem o ingresso."] },
    pag: { certo: "fargate",
      fargate: "O contêiner roda igual no notebook e na AWS, e o Fargate cuida das máquinas.",
      ec2: ["meh", "Roda, mas aí a equipe cuida do servidor, e o pedido era não cuidar."],
      lambda: ["meh", "O Lambda é para tarefas curtas, por evento. O pedido era empacotar o sistema inteiro em contêiner."],
      beanstalk: ["meh", "Sobe o código, mas o pedido era o contêiner rodando igual em todo lugar."],
      spot: ["falha", "💥 Pagamento interrompido no meio? Nunca."] },
    estag: { certo: "beanstalk",
      beanstalk: "Ele envia o código, e o Beanstalk cria e cuida das máquinas. Zero servidor.",
      ec2: ["falha", "😵 Ele travou: AMI, par de chaves, grupo de segurança… sem saber nada de servidor."],
      fargate: ["falha", "😵 Ele teria que aprender contêiner primeiro."],
      lambda: ["falha", "😵 Um site inteiro em funções? Ele queria só subir o código."],
      spot: ["falha", "😵 Travou na configuração do servidor, e ainda pode ser interrompido."] },
    rel: { certo: "spot",
      spot: "Até 90% mais barato. Se a AWS pedir a máquina de volta, o relatório recomeça.",
      ec2: ["meh", "Funciona, mas sob demanda custa mais. O relatório pode parar: dava para usar spot."],
      fargate: ["meh", "Funciona, mas o pedido era o menor custo para algo que pode parar: spot."],
      lambda: ["falha", "⏱️ Parou aos 15 minutos! O relatório leva horas."],
      beanstalk: ["meh", "Funciona, mas é para sites. Para horas de cálculo que podem parar, spot."] }
  };
  const CENTRAIS = { computacao: CENTRAL };
  CENTRAIS.armazenamento = {
    sistema: { certo: "ebs",
      ebs: "O disco da máquina: o sistema fica nele e não some quando ela desliga.",
      s3: ["falha", "💥 O sistema precisa de um disco ligado à máquina. O S3 guarda objetos por endereço; não serve de disco do sistema."],
      inst: ["falha", "💥 Parou a máquina, sumiu o sistema! O armazenamento de instância é temporário."],
      glacier: ["falha", "🧊 Até 12 horas para abrir o sistema? A máquina nem liga."],
      outro: ["falha", "💥 O sistema da máquina precisa de um disco de bloco ligado a ela: o EBS."] },
    fotos: { certo: "s3",
      s3: "Milhões de arquivos, cada um com o seu endereço, abertos pela internet, com os 11 noves.",
      glacier: ["falha", "🧊 A foto do show de hoje levando até 12 horas para abrir? O cliente desistiu."],
      inst: ["falha", "💥 Parou a máquina, sumiram as fotos."],
      ebs: ["meh", "Um disco preso a uma máquina, que você aumenta na mão. Para milhões de arquivos na internet, o S3."],
      efs: ["meh", "Funciona para as máquinas, mas para entregar milhões de arquivos na internet, o S3 é o certo."],
      outro: ["meh", "O Storage Gateway é para o escritório usar a nuvem. As fotos já estão na nuvem: S3."] },
    pasta: { certo: "efs",
      efs: "Várias máquinas Linux lendo e gravando a mesma pasta, ao mesmo tempo.",
      ebs: ["falha", "💥 O EBS é o disco de uma máquina. Várias máquinas Linux na mesma pasta é EFS."],
      s3: ["meh", "Dá para guardar, mas não é uma pasta que as máquinas usam como disco compartilhado: EFS."],
      outro: ["falha", "💥 Não serve de pasta compartilhada para várias máquinas Linux. É o EFS."] },
    antigos: { certo: "glacier",
      glacier: "Cinco anos guardados pelo menor preço. Se o contador pedir, ele espera até 12 horas.",
      inst: ["falha", "💥 Parou a máquina, sumiram cinco anos de ingressos. O contador não vai gostar."],
      s3: ["meh", "💸 Funciona, mas você paga o preço de \"uso o tempo todo\" por algo que quase ninguém abre."],
      ebs: ["meh", "💸 Um disco pago todo mês, ligado a uma máquina, para algo que quase ninguém abre."],
      outro: ["meh", "💸 Funciona, mas para guardar por anos e quase nunca abrir, a gaveta mais barata é o Glacier Deep Archive."] },
    temp: { certo: "inst",
      inst: "Rapidíssimo e preso à máquina. Se sumir quando ela parar, tudo bem: era temporário.",
      glacier: ["falha", "🧊 Um arquivo temporário que leva 12 horas para abrir? Não."],
      outro: ["meh", "Funciona, mas você paga para guardar com cuidado algo que pode sumir. O armazenamento de instância resolve."] },
    backups: { certo: "gw",
      gw: "O escritório enxerga a nuvem como um disco local, e os backups vão para a AWS.",
      ebs: ["falha", "💥 O EBS liga em máquinas da AWS, não na salinha do escritório."],
      inst: ["falha", "💥 Backup em disco temporário? Na primeira parada, some tudo."],
      outro: ["meh", "Os backups podem acabar no S3, mas o pedido era o escritório usar a nuvem como um disco local: Storage Gateway."] }
  };
  CENTRAIS.bancos = {
    cli: { certo: "rds",
      rds: "Tabelas ligadas, SQL e transações: o pedido nunca fica pela metade, e a AWS cuida dos backups.",
      dynamo: ["meh", "Aguenta muito acesso, mas clientes, pedidos e pagamentos ligados entre si pedem tabelas relacionais e SQL."],
      cache: ["falha", "💥 Cache é memória rápida, não o lugar oficial dos pagamentos. Reiniciou, sumiu."],
      redshift: ["falha", "💥 O Redshift é para análise. Atender as compras na hora não é com ele."],
      dms: ["falha", "💥 O DMS migra bancos; ele não é um banco."] },
    carrinho: { certo: "dynamo",
      dynamo: "Milhões de leituras e gravações por segundo, sempre pela chave do cliente, crescendo sozinho.",
      rds: ["meh", "Funciona, mas na abertura da venda seria preciso muito banco relacional. O DynamoDB cresce sozinho para isso."],
      cache: ["meh", "Ajuda a ler rápido, mas o carrinho precisa de um banco de verdade por trás: DynamoDB."],
      redshift: ["falha", "💥 Um banco de análise não segura a fila da meia-noite."],
      dms: ["falha", "💥 O DMS migra bancos; não guarda carrinho."] },
    pagina: { certo: "cache",
      cache: "Todo mundo lê a mesma página: ela fica na memória, e o banco descansa.",
      rds: ["meh", "Funciona, mas cada visita vai ao banco: milhões de consultas iguais. Um cache na frente resolve."],
      dynamo: ["meh", "Funciona e é rápido, mas para a mesma página lida por todo mundo, o cache na memória é o certo."],
      redshift: ["falha", "💥 Banco de análise para servir uma página na hora? Não."],
      dms: ["falha", "💥 O DMS migra bancos; não serve páginas."] },
    vendas: { certo: "redshift",
      redshift: "Anos de vendas analisados com SQL, sem pesar no banco das compras.",
      rds: ["meh", "Dá para consultar, mas a análise de três anos pesa no mesmo banco que atende as compras."],
      dynamo: ["falha", "💥 O DynamoDB abre pela chave. \"Que gênero vende mais em cada cidade\" é pergunta de análise: Redshift."],
      cache: ["falha", "💥 Cache guarda o que é lido toda hora, não três anos de vendas."],
      dms: ["falha", "💥 O DMS migra bancos; não analisa vendas."] },
    migrar: { certo: "dms",
      dms: "Migra o banco para a AWS com o da salinha funcionando: as vendas não param.",
      outro: ["falha", "💥 Esse é um banco, não a migração. Para levar o banco da salinha sem parar as vendas: DMS."] }
  };
  CENTRAIS.migracao = {
    fax: { certo: "retire", retire: "Ninguém usa mais: desliga e economiza. É doar o que não serve antes da mudança.",
      outro: ["meh", "Gastar esforço para levar algo que ninguém usa? Melhor desativar."] },
    palco: { certo: "retain", retain: "Preso a uma máquina especial do palco: fica onde está, por enquanto.",
      outro: ["falha", "💥 Ele depende de uma máquina especial do palco. Por enquanto, o caminho é manter."] },
    site: { certo: "rehost", rehost: "Do jeito que está, para uma instância do EC2: levar o móvel como ele é.",
      refactor: ["meh", "Daria para redesenhar, mas o pedido era levar rápido, sem mudar nada: rehost."],
      replatform: ["meh", "Ajustes são bem-vindos depois; para levar sem mudar nada, rehost."],
      outro: ["meh", "O servidor do site pode ir como está, para uma instância do EC2: rehost."] },
    vms: { certo: "relocate", relocate: "A plataforma de máquinas virtuais inteira, de uma vez, sem mexer nos sistemas: o guarda-roupa montado no caminhão.",
      rehost: ["meh", "Quase: rehost leva servidor por servidor. Mover a plataforma inteira de uma vez é relocate."],
      outro: ["meh", "Muitas máquinas virtuais de uma vez, sem mudar a aplicação: relocate."] },
    sql: { certo: "replatform", replatform: "Leva com um ajuste: o SQL Server vai para o RDS, e a AWS cuida do banco.",
      rehost: ["meh", "Levar o banco numa máquina do EC2 funciona, mas trocar para o RDS é um ajuste que vale: replatform."],
      refactor: ["meh", "Não precisa redesenhar tudo: só trocar para um banco gerenciado já é replatform."],
      outro: ["meh", "Levar com um ajuste, como ir para um banco gerenciado, é replatform."] },
    rh: { certo: "repurchase", repurchase: "Troca o sistema velho por um SaaS de RH: vender o móvel velho e comprar um novo.",
      outro: ["meh", "Existe pronto como SaaS: o caminho é recomprar (repurchase)."] },
    vendas: { certo: "refactor", refactor: "Redesenhado para a nuvem, com contêineres e Lambda. É o mais caro e complexo, e o que mais aproveita a nuvem.",
      rehost: ["meh", "Leva, mas sem aproveitar a nuvem. O pedido era redesenhar: refactor."],
      outro: ["meh", "Redesenhar para a nuvem, com contêineres e Lambda, é refactor."] }
  };
  CENTRAIS.vigias = {
    cpu: { certo: "watch", watch: "Métrica e alarme: o CloudWatch vigia o processador e avisa.",
      outro: ["falha", "💥 Uso do processador é métrica de desempenho: CloudWatch."] },
    regra: { certo: "trail", trail: "Quem fez o quê, e quando: o CloudTrail registrou a mudança na regra.",
      config: ["meh", "O Config mostra que a configuração mudou; o nome de quem mudou está no CloudTrail."],
      outro: ["falha", "💥 \"Quem mudou\" é auditoria das ações na conta: CloudTrail."] },
    padrao: { certo: "config", config: "O Config guarda o histórico das configurações e confere se elas seguem as regras.",
      trail: ["meh", "O CloudTrail diz quem fez; para saber se a configuração segue a regra, Config."],
      outro: ["falha", "💥 Configuração fora do padrão é com o AWS Config."] },
    aws: { certo: "health", health: "O Health Dashboard mostra se a AWS tem algum problema que afeta você.",
      outro: ["falha", "💥 Para saber se o problema é da própria AWS: AWS Health Dashboard."] },
    logs: { certo: "watch", watch: "Logs da aplicação, juntos e pesquisáveis: CloudWatch Logs.",
      trail: ["meh", "O CloudTrail registra as ações na conta da AWS, não os erros da sua aplicação: CloudWatch Logs."],
      outro: ["falha", "💥 Os logs de erro da aplicação ficam no CloudWatch."] },
    apagou: { certo: "trail", trail: "A ação de apagar ficou registrada: quem, quando e de onde.",
      watch: ["falha", "💥 O CloudWatch mede desempenho; quem apagou está no CloudTrail."],
      outro: ["falha", "💥 \"Quem apagou\" é auditoria: CloudTrail."] }
  };
  document.querySelectorAll("[data-central]").forEach(function (box) {
    const linhas = box.querySelectorAll("[data-tarefa]");
    const placar = box.querySelector("[data-placar]");
    const fala = box.querySelector(".casa-fala");
    const vai = box.querySelector(".vai");
    let espera = [];
    linhas.forEach(function (l) {
      l.querySelectorAll("[data-motor]").forEach(function (b) {
        b.addEventListener("click", function () {
          l.querySelectorAll("[data-motor]").forEach(x => x.setAttribute("aria-pressed", String(x === b)));
          l.className = "central-linha";
          l.querySelector(".central-saida").textContent = "";
        });
      });
    });
    vai.addEventListener("click", function () {
      espera.forEach(clearTimeout);
      espera = [];
      let certos = 0, faltam = 0;
      linhas.forEach(function (l, i) {
        const t = l.dataset.tarefa;
        const sel = l.querySelector('[data-motor][aria-pressed="true"]');
        const saida = l.querySelector(".central-saida");
        l.className = "central-linha";
        if (!sel) { faltam++; saida.textContent = "Escolha um motor."; return; }
        const m = sel.dataset.motor;
        const r = CENTRAIS[box.dataset.central || "computacao"][t];
        const res = r[m] || r.outro;
        const tipo = m === r.certo ? "certo" : res[0];
        const texto = m === r.certo ? "✅ " + r[m] : res[1];
        if (tipo === "certo") certos++;
        const mostra = function () {
          l.classList.add("rodando", tipo);
          saida.textContent = texto;
        };
        if (pausado()) mostra(); else espera.push(setTimeout(mostra, 150 + i * 450));
      });
      const fim = function () {
        const n = linhas.length;
        const gav = box.dataset.central === "armazenamento";
        const ban = box.dataset.central === "bancos";
        const mig = box.dataset.central === "migracao";
        const vig = box.dataset.central === "vigias";
        placar.textContent = certos + " de " + n;
        fala.innerHTML = faltam ? `Faltou escolher ${gav ? "a gaveta" : "o motor"} de ${faltam} ${gav ? "pedido" : "tarefa"}${faltam > 1 ? "s" : ""}.` :
          certos === n ? (vig ? "🏆 <strong>Cada vigia no seu posto!</strong> CloudWatch mede, CloudTrail registra quem fez, Config confere a configuração e o Health Dashboard fala da AWS." : mig ? "🏆 <strong>Mudança planejada!</strong> Cada sistema com o seu R: desativar, manter, levar, realocar, recomprar, ajustar e refazer." : ban ? "🏆 <strong>Um banco para cada dado!</strong> Relacional, NoSQL, cache, análise e migração, cada um no seu lugar." :
            gav ? "🏆 <strong>Gavetas organizadas!</strong> Cada dado no lugar certo: disco, balde, pasta, depósito, temporário e ponte." :
            "🏆 <strong>Central montada!</strong> Cada tarefa no motor certo: servidor, função, contêiner, atalho e spot.") :
          `<strong>${certos} de ${n} ${gav ? "na gaveta certa" : "no motor certo"}.</strong> As amarelas funcionam, mas não são a melhor escolha; as vermelhas quebram. Troque e rode de novo.`;
      };
      if (pausado()) fim(); else espera.push(setTimeout(fim, 150 + linhas.length * 450));
    });
  });

  // ===================== 20. na minha máquina funciona! =====================
  document.querySelectorAll("[data-conteiner]").forEach(function (box) {
    const emp = box.querySelector("[data-empacotar]");
    const maquinas = box.querySelectorAll(".maquina");
    const fala = box.querySelector(".casa-fala");
    const vai = box.querySelector(".vai");
    let espera = [];
    function atualiza() {
      const sim = emp.getAttribute("aria-pressed") === "true";
      box.classList.toggle("empacotado", sim);
      maquinas.forEach(m => (m.className = "maquina"));
      fala.innerHTML = sim ? "📦 O app vai dentro do contêiner, junto com o Python 3.12 e a biblioteca 2.0. Aperte <strong>Rodar o app</strong>." : "Sem contêiner, o app usa o que cada máquina tiver instalado. Aperte <strong>Rodar o app</strong>.";
    }
    emp.addEventListener("click", function () {
      emp.setAttribute("aria-pressed", String(emp.getAttribute("aria-pressed") !== "true"));
      emp.querySelector(".sn").textContent = emp.getAttribute("aria-pressed") === "true" ? "ligado" : "desligado";
      atualiza();
    });
    vai.addEventListener("click", function () {
      espera.forEach(clearTimeout);
      espera = [];
      const sim = box.classList.contains("empacotado");
      maquinas.forEach(m => (m.className = "maquina"));
      const fim = function () {
        maquinas[0].classList.add("ok");
        maquinas[1].classList.add(sim ? "ok" : "erro");
        fala.innerHTML = sim ? "✅ <strong>Rodou igual nas duas!</strong> O contêiner levou junto a versão da linguagem e as bibliotecas. O servidor só precisa saber rodar contêiner." :
          "💥 <strong>\"Mas na minha máquina funciona!\"</strong> No servidor, o Python e a biblioteca são de outra versão, e o app quebra. Ligue o contêiner e rode de novo.";
      };
      if (pausado()) return fim();
      maquinas.forEach(m => m.classList.add("rodando"));
      fala.textContent = "Rodando…";
      espera.push(setTimeout(fim, 900));
    });
    atualiza();
  });

  // ===================== 21. o botão que acorda o Lambda =====================
  document.querySelectorAll("[data-lambda]").forEach(function (box) {
    const grade = box.querySelector(".lb-grade");
    const agoraTxt = box.querySelector("[data-agora]");
    const totalTxt = box.querySelector("[data-total]");
    const cobradoTxt = box.querySelector("[data-cobrado]");
    const escalaTxt = box.querySelector("[data-escala]");
    const relBarra = box.querySelector(".lb-rel i");
    const relTxt = box.querySelector("[data-rel]");
    const fala = box.querySelector(".casa-fala");
    for (let i = 0; i < 100; i++) grade.appendChild(document.createElement("span"));
    const luzes = grade.querySelectorAll("span");
    let fim = [], total = 0, laco = 0;
    function desenha() {
      const agora = performance.now();
      fim = fim.filter(t => t > agora);
      const n = fim.length;
      const cada = n > 100 ? 10 : 1;
      const acesas = Math.min(100, Math.ceil(n / cada));
      luzes.forEach((l, i) => l.classList.toggle("on", i < acesas));
      agoraTxt.textContent = num(n);
      totalTxt.textContent = num(total);
      cobradoTxt.textContent = num(total * 2) + " s";
      escalaTxt.textContent = cada === 1 ? "cada luz = 1 execução" : "cada luz = 10 execuções";
      if (n) laco = requestAnimationFrame(desenha); else laco = 0;
    }
    function compra(qtd) {
      total += qtd;
      // com as animações pausadas, o painel mostra o pico (as execuções ficam acesas até o próximo clique)
      if (pausado()) fim = [];
      const ate = performance.now() + (pausado() ? 3600000 : 2000);
      for (let i = 0; i < qtd; i++) fim.push(ate + Math.random() * 300);
      fala.innerHTML = qtd === 1 ? "🛒 Uma compra: o Lambda acordou, gerou o PDF em 2 segundos e voltou a dormir." :
        "🛒 <strong>Mil compras ao mesmo tempo:</strong> mil execuções, sem você ligar máquina nenhuma. Ele cresce sozinho, e você paga só os segundos usados.";
      if (pausado()) { desenha(); return; }
      if (!laco) laco = requestAnimationFrame(desenha);
    }
    box.querySelector("[data-compra='1']").addEventListener("click", () => compra(1));
    box.querySelector("[data-compra='1000']").addEventListener("click", () => compra(1000));
    box.querySelector("[data-relatorio]").addEventListener("click", function () {
      const para = function () {
        relBarra.style.width = (15 / 120) * 100 + "%";
        relBarra.parentElement.classList.add("estourou");
        relTxt.textContent = "⛔ parou aos 15 minutos";
        fala.innerHTML = "📊 <strong>Tempo esgotado!</strong> Cada execução do Lambda vai até 15 minutos, e o relatório leva 2 horas. Para ele: EC2, contêiner, spot, ou dividir em pedaços menores.";
      };
      relBarra.parentElement.classList.remove("estourou");
      relBarra.style.width = "0%";
      relTxt.textContent = "rodando…";
      if (pausado()) return para();
      requestAnimationFrame(() => (relBarra.style.width = (15 / 120) * 100 + "%"));
      setTimeout(para, 1300);
    });
    desenha();
  });

  // ===================== 22. do ESP32 ao monstro da AWS =====================
  const KB = 1024, GB = 1024 ** 3;
  const MAQUINAS = [
    { ico: "🔌", nome: "ESP32", det: "2 núcleos a 240 MHz · 520 KB de memória", mem: 520 * KB },
    { ico: "☁️", nome: "t3.micro", det: "2 vCPUs · 1 GiB de memória", mem: 1 * GB },
    { ico: "💻", nome: "Um notebook comum", det: "exemplo: 8 núcleos · 16 GB de memória", mem: 16 * GB },
    { ico: "🦾", nome: "p5.48xlarge", det: "192 vCPUs · 2 TiB de memória · 8 GPUs H100", mem: 2048 * GB }
  ];
  document.querySelectorAll("[data-regua]").forEach(function (box) {
    const lista = box.querySelector(".regua-lista");
    const escala = box.querySelector("[data-log]");
    const fala = box.querySelector(".casa-fala");
    lista.innerHTML = MAQUINAS.map((m, i) => `<li data-i="${i}"><span class="ico" aria-hidden="true">${m.ico}</span><span class="nome"><strong>${m.nome}</strong><small>${m.det}</small></span><span class="trilho" aria-hidden="true"><i></i></span><button type="button" data-cabem="${i}">🔌 quantos ESP32?</button></li>`).join("");
    const max = MAQUINAS[MAQUINAS.length - 1].mem;
    function desenha() {
      const log = escala.getAttribute("aria-pressed") === "true";
      lista.querySelectorAll("li").forEach(function (li, i) {
        const m = MAQUINAS[i].mem;
        const pct = log ? (Math.log10(m) - Math.log10(MAQUINAS[0].mem) * 0.9) / (Math.log10(max) - Math.log10(MAQUINAS[0].mem) * 0.9) * 100 : (m / max) * 100;
        li.querySelector("i").style.width = Math.max(pct, 0.15) + "%";
      });
    }
    escala.addEventListener("click", function () {
      escala.setAttribute("aria-pressed", String(escala.getAttribute("aria-pressed") !== "true"));
      const log = escala.getAttribute("aria-pressed") === "true";
      escala.querySelector(".sn").textContent = log ? "ligada" : "desligada";
      fala.innerHTML = log ? "📐 <strong>Escala logarítmica:</strong> cada pedaço da barra multiplica por 10 em vez de somar. Agora dá para ver todas as máquinas, do ESP32 ao monstro." :
        "📏 <strong>Escala normal:</strong> o ESP32, a t3.micro e o notebook somem perto da p5.48xlarge. A diferença é grande demais para uma régua comum.";
      desenha();
    });
    lista.addEventListener("click", function (e) {
      const b = e.target.closest("[data-cabem]");
      if (!b) return;
      const m = MAQUINAS[b.dataset.cabem];
      const n = Math.floor(m.mem / MAQUINAS[0].mem);
      fala.innerHTML = n <= 1 ? "🔌 É o próprio ESP32: 520 KB de memória. Pequeno, barato e roda um semáforo inteiro." :
        `🔌 Na memória de <strong>${m.nome}</strong> cabe a memória de <strong>${num(n)} ESP32</strong>. A conta: ${m.mem >= GB ? num(m.mem / GB) + " GiB" : ""} ÷ 520 KB.`;
    });
    desenha();
  });

  // ===================== 23. redes do zero: a carta =====================
  const DESTINOS_CARTA = {
    nome: { txt: "ingressocandango.com.br", ip: "203.0.113.10", dns: true },
    ip: { txt: "203.0.113.10", ip: "203.0.113.10", dns: false },
    errado: { txt: "203.0.113.99", ip: null, dns: false }
  };
  const PORTAS_CARTA = {
    443: "✅ <strong>Chegou!</strong> A porta 443 é a da loja (HTTPS, o site seguro). O site abre.",
    22: "🔒 A porta 22 (SSH, para entrar na máquina) existe, mas está <strong>fechada para a internet</strong>: só a equipe entra, e de um endereço conhecido.",
    3306: "🔒 A porta 3306 é a do cofre (o banco MySQL) e <strong>não abre para a rua</strong>: só o site conversa com o banco. É isso que a aula inteira vai montar."
  };
  document.querySelectorAll("[data-carta]").forEach(function (box) {
    const passos = box.querySelectorAll(".carta-caminho li");
    const portas = box.querySelectorAll(".carta-porta");
    const envelope = box.querySelector(".carta-envelope");
    const fala = box.querySelector(".casa-fala");
    const vai = box.querySelector(".vai");
    let para = "nome", porta = "443", espera = [];
    function rotulo() {
      const d = DESTINOS_CARTA[para];
      envelope.innerHTML = `✉️ <span>para <strong>${d.txt}</strong> · porta <strong>${porta}</strong></span>`;
    }
    function limpa() {
      espera.forEach(clearTimeout);
      espera = [];
      passos.forEach(li => li.className = "");
      portas.forEach(p => p.classList.remove("chegou", "barrou"));
      box.querySelector("[data-passo='dns'] small").textContent = "a agenda: troca o nome pelo número";
      rotulo();
    }
    function envia() {
      limpa();
      const d = DESTINOS_CARTA[para];
      const etapas = [];
      etapas.push(() => { passos[0].className = "passou"; });
      etapas.push(function () {
        const li = box.querySelector("[data-passo='dns']");
        if (d.dns) { li.className = "passou"; li.querySelector("small").textContent = `${d.txt} → ${d.ip}`; }
        else li.className = "pulou";
      });
      etapas.push(() => { box.querySelector("[data-passo='rota']").className = "passou"; });
      etapas.push(function () {
        const li = box.querySelector("[data-passo='predio']");
        if (!d.ip) {
          li.className = "barrou";
          fala.innerHTML = "📭 <strong>Endereço não existe:</strong> nenhuma casa tem o número 203.0.113.99. A carta voltou. Sem o IP certo, nada chega.";
          return;
        }
        li.className = "passou";
        const pt = box.querySelector(`.carta-porta[data-nporta="${porta}"]`);
        pt.classList.add(porta === "443" ? "chegou" : "barrou");
        fala.innerHTML = (d.dns ? "📖 A agenda (o DNS) trocou o nome pelo número. Na AWS, quem faz isso é o Route 53. " : "") + PORTAS_CARTA[porta];
      });
      const fim = () => (vai.disabled = false);
      if (pausado()) { etapas.forEach(f => f()); return fim(); }
      vai.disabled = true;
      etapas.forEach((f, i) => espera.push(setTimeout(f, 250 + i * 650)));
      espera.push(setTimeout(fim, 250 + etapas.length * 650));
    }
    box.querySelectorAll("[data-para]").forEach(function (b) {
      b.addEventListener("click", function () {
        para = b.dataset.para;
        box.querySelectorAll("[data-para]").forEach(x => x.setAttribute("aria-pressed", String(x === b)));
        limpa();
      });
    });
    box.querySelectorAll("[data-qual-porta]").forEach(function (b) {
      b.addEventListener("click", function () {
        porta = b.dataset.qualPorta;
        box.querySelectorAll("[data-qual-porta]").forEach(x => x.setAttribute("aria-pressed", String(x === b)));
        limpa();
      });
    });
    vai.addEventListener("click", envia);
    limpa();
  });

  // ===================== 24. a vida de uma foto =====================
  const IDADES = [
    { dias: 0, txt: "hoje" }, { dias: 7, txt: "1 semana" }, { dias: 30, txt: "30 dias" },
    { dias: 90, txt: "90 dias" }, { dias: 365, txt: "1 ano" }, { dias: 1825, txt: "5 anos" }
  ];
  const GAVETAS = {
    std: { nome: "S3 Standard", dia: "em cima da mesa", custo: "💰💰💰💰", abre: "na hora (milissegundos)" },
    ia: { nome: "S3 Standard-IA", dia: "na gaveta do armário", custo: "💰💰", abre: "na hora (milissegundos), pagando um pouco por abrir" },
    deep: { nome: "S3 Glacier Deep Archive", dia: "no depósito em outra cidade", custo: "💰 (centavos)", abre: "em até 12 horas" }
  };
  document.querySelectorAll("[data-vida]").forEach(function (box) {
    const barra = box.querySelector("input[type=range]");
    const idadeTxt = box.querySelector("[data-idade]");
    const gavetas = box.querySelectorAll("[data-gaveta]");
    const fala = box.querySelector(".casa-fala");
    const regra = k => box.querySelector(`[data-regra="${k}"]`).getAttribute("aria-pressed") === "true";
    function onde() {
      const d = IDADES[barra.value].dias;
      if (regra("deep") && d >= 365) return "deep";
      if (regra("ia") && d >= 30) return "ia";
      return "std";
    }
    function mostra(pedido) {
      const g = onde();
      idadeTxt.textContent = IDADES[barra.value].txt;
      gavetas.forEach(function (el) {
        const aqui = el.dataset.gaveta === g;
        el.classList.toggle("aqui", aqui);
        el.querySelector(".foto").textContent = aqui ? "🖼️" : "";
      });
      const G = GAVETAS[g];
      fala.innerHTML = pedido ?
        `📨 <strong>O contador pediu a foto.</strong> Ela está ${G.dia} (${G.nome}): chega <strong>${G.abre}</strong>.` +
          (g === "deep" ? " Para um pedido de 5 anos atrás, tudo bem esperar." : "") :
        `A foto tem <strong>${IDADES[barra.value].txt}</strong> e está ${G.dia}: <strong>${G.nome}</strong>. Custo para guardar: ${G.custo}.` +
          (g === "std" && IDADES[barra.value].dias >= 365 ? ` 💸 ${IDADES[barra.value].txt} em cima da mesa, pagando o preço mais alto! Ligue as regras de ciclo de vida.` : "");
    }
    barra.addEventListener("input", () => mostra(false));
    box.querySelectorAll("[data-regra]").forEach(function (b) {
      b.addEventListener("click", function () {
        b.setAttribute("aria-pressed", String(b.getAttribute("aria-pressed") !== "true"));
        b.querySelector(".sn").textContent = b.getAttribute("aria-pressed") === "true" ? "ligada" : "desligada";
        mostra(false);
      });
    });
    box.querySelector("[data-pedido-foto]").addEventListener("click", () => mostra(true));
    mostra(false);
  });

  // ===================== 25. desliga e liga =====================
  document.querySelectorAll("[data-desliga]").forEach(function (box) {
    const discos = box.querySelectorAll("[data-disco]");
    const fala = box.querySelector(".casa-fala");
    const snap = box.querySelector(".dl-snap");
    const ARQ = "📄📄📄";
    let espera = [];
    function enche() { discos.forEach(d => (d.querySelector(".arquivos").textContent = ARQ)); }
    box.querySelector("[data-reinicia]").addEventListener("click", function () {
      espera.forEach(clearTimeout);
      espera = [];
      enche();
      box.classList.add("desligada");
      fala.textContent = "⏻ Parando a máquina…";
      const liga = function () {
        box.classList.remove("desligada");
        box.querySelector('[data-disco="inst"] .arquivos').textContent = "💨";
        fala.innerHTML = "⏻ A máquina voltou. O <strong>EBS</strong> guardou tudo; o <strong>armazenamento de instância</strong> ficou vazio: ele é temporário e perde os dados quando a máquina para.";
      };
      if (pausado()) liga(); else espera.push(setTimeout(liga, 1100));
    });
    box.querySelector("[data-snapshot]").addEventListener("click", function () {
      snap.hidden = false;
      snap.classList.remove("nova");
      void snap.offsetWidth;
      snap.classList.add("nova");
      fala.innerHTML = "📸 <strong>Snapshot feito:</strong> uma cópia do disco EBS neste momento. Dá para restaurar quando quiser, até em outra zona ou região.";
    });
    box.querySelector("[data-enche]").addEventListener("click", function () {
      enche();
      fala.textContent = "📄 Arquivos de volta nos dois discos.";
    });
    enche();
  });

  // ===================== 26. a matemática dos 11 noves =====================
  document.querySelectorAll("[data-noves]").forEach(function (box) {
    const barra = box.querySelector("input[type=range]");
    const qtd = box.querySelector("[data-qtd]");
    const anos = box.querySelector("[data-anos]");
    const conta = box.querySelector("[data-conta-noves]");
    const fala = box.querySelector(".casa-fala");
    const POT = [1000, 10000, 100000, 1000000, 10000000, 100000000, 1000000000];
    const NOMES = ["mil", "10 mil", "100 mil", "1 milhão", "10 milhões", "100 milhões", "1 bilhão"];
    function mostra() {
      const i = Number(barra.value);
      const n = POT[i];
      const a = 1 / (n * 1e-11); // chance de perder um objeto num ano: 0,000000001% = 1e-11
      qtd.textContent = NOMES[i] + " de objetos";
      anos.textContent = a >= 1 ? "1 a cada " + num(a) + " anos" : "";
      conta.innerHTML = `1 ÷ (${num(n)} × 0,00000000001) = <strong>${num(a)}</strong> anos`;
      fala.innerHTML = a >= 1e6 ? `🦕 Mais tempo do que existe gente na Terra. Com ${NOMES[i]} de objetos, perder um é quase impossível.` :
        a >= 1000 ? `🏛️ Com ${NOMES[i]} de objetos, a expectativa é perder um a cada ${num(a)} anos. Um pendrive na gaveta não chega nem perto.` :
        `📦 Com ${NOMES[i]} de objetos (um volume gigante), a conta cai para um a cada ${num(a)} anos. Ainda assim, guarde backup do que é importante.`;
    }
    barra.addEventListener("input", mostra);
    mostra();
  });

  // ===================== 27. tabela × fichas =====================
  document.querySelectorAll("[data-fichas]").forEach(function (box) {
    const tabela = box.querySelector(".fichas-tabela");
    const cartas = box.querySelector(".fichas-cartas");
    const fala = box.querySelector(".casa-fala");
    const BASE = [{ nome: "Ana", email: "ana@exemplo.com" }, { nome: "Bruno", email: "bruno@exemplo.com" }];
    const NOVOS = [
      { nome: "Carla", email: "carla@exemplo.com", instagram: "@carla.shows" },
      { nome: "Davi", tiktok: "@davi.musica" }
    ];
    let pessoas = [], novas = 0;
    function desenha(destaque) {
      const cols = ["nome"];
      pessoas.forEach(p => Object.keys(p).forEach(k => { if (!cols.includes(k)) cols.push(k); }));
      tabela.innerHTML = "<thead><tr>" + cols.map(c => `<th class="${destaque && destaque.includes(c) ? "nova" : ""}">${c}</th>`).join("") + "</tr></thead><tbody>" +
        pessoas.map(p => "<tr>" + cols.map(c => p[c] ? `<td>${p[c]}</td>` : `<td class="vazio">vazio</td>`).join("") + "</tr>").join("") + "</tbody>";
      cartas.innerHTML = pessoas.map((p, i) => `<li class="${i >= BASE.length && i === pessoas.length - 1 && destaque ? "nova" : ""}">` +
        Object.keys(p).map(k => `<span><b>${k}:</b> ${p[k]}</span>`).join("") + "</li>").join("");
    }
    box.querySelector("[data-novo]").addEventListener("click", function () {
      if (novas >= NOVOS.length) return;
      const n = NOVOS[novas++];
      const colsAntes = new Set();
      pessoas.forEach(p => Object.keys(p).forEach(k => colsAntes.add(k)));
      pessoas.push(n);
      const novasCols = Object.keys(n).filter(k => !colsAntes.has(k));
      desenha(novasCols);
      const vazios = tabela.querySelectorAll("td.vazio").length;
      const semCols = [...colsAntes].filter(k => !(k in n));
      fala.innerHTML = `➕ <strong>${n.nome}</strong> chegou com <strong>${novasCols.join(" e ")}</strong>${semCols.length ? " e sem <strong>" + semCols.join(" e ") + "</strong>" : ""}. Na tabela, a coluna nova vale para todo mundo: já são <strong>${vazios} buracos vazios</strong>. Nas fichas, só a ficha de ${n.nome} mudou.`;
      if (novas >= NOVOS.length) box.querySelector("[data-novo]").disabled = true;
      else box.querySelector("[data-novo]").textContent = "➕ Cliente novo: Davi, com TikTok e sem e-mail";
    });
    box.querySelector("[data-recomeca]").addEventListener("click", function () {
      pessoas = BASE.map(p => Object.assign({}, p));
      novas = 0;
      const b = box.querySelector("[data-novo]");
      b.disabled = false;
      b.textContent = "➕ Cliente novo: Carla, com Instagram";
      desenha(null);
      fala.innerHTML = "Os dois guardam a Ana e o Bruno. Agora chega uma cliente nova.";
    });
    box.querySelector("[data-recomeca]").click();
  });

  // ===================== 28. o plantão do banco =====================
  document.querySelectorAll("[data-plantao-banco]").forEach(function (box) {
    const fala = box.querySelector(".casa-fala");
    const lento = box.querySelector(".pb-lento i");
    const lentoTxt = box.querySelector("[data-lento]");
    const pecas = {};
    box.querySelectorAll("[data-peca-banco]").forEach(el => (pecas[el.dataset.pecaBanco] = el));
    let evento = "normal";
    const liga = k => box.querySelector(`[data-chave-banco="${k}"]`).getAttribute("aria-pressed") === "true";
    function avalia() {
      const ma = liga("multiaz"), rr = liga("replica");
      pecas.reserva.hidden = !ma;
      pecas.replica.hidden = !rr;
      Object.values(pecas).forEach(p => p.classList.remove("caiu", "assumiu", "trabalhando", "pesado"));
      let txt, nivel;
      if (evento === "zona") {
        pecas.principal.classList.add("caiu");
        if (ma) { pecas.reserva.classList.add("assumiu"); nivel = 20; txt = "✅ <strong>A reserva na zona b assumiu sozinha</strong> (failover automático). As compras continuam."; }
        else if (rr) { nivel = 100; pecas.replica.classList.add("trabalhando"); txt = "💥 <strong>Banco fora do ar.</strong> A réplica de leitura não assume sozinha: ela é para desempenho. Para continuar no ar quando a zona cai, Multi-AZ."; }
        else { nivel = 100; txt = "💥 <strong>Banco fora do ar</strong> até alguém restaurar o backup. As compras pararam."; }
      } else if (evento === "relatorio") {
        if (rr) { pecas.replica.classList.add("trabalhando"); nivel = 25; txt = "✅ <strong>Os relatórios foram para a réplica de leitura.</strong> O banco principal continua rápido para as compras."; }
        else { pecas.principal.classList.add("pesado"); nivel = 90; txt = ma ? "🐢 <strong>Lento!</strong> A reserva do Multi-AZ fica esperando a falha; não divide as consultas. Para desempenho, réplica de leitura." :
          "🐢 <strong>Lento!</strong> Relatórios e compras disputando o mesmo banco."; }
      } else { nivel = 15; txt = "🛒 Tudo normal. Ligue as chaves e dispare um problema."; }
      lento.style.width = nivel + "%";
      lentoTxt.textContent = nivel >= 90 ? "parado ou muito lento" : nivel >= 50 ? "lento" : "rápido";
      fala.innerHTML = txt;
    }
    box.querySelectorAll("[data-chave-banco]").forEach(function (b) {
      b.addEventListener("click", function () {
        b.setAttribute("aria-pressed", String(b.getAttribute("aria-pressed") !== "true"));
        b.querySelector(".sn").textContent = b.getAttribute("aria-pressed") === "true" ? "ligado" : "desligado";
        avalia();
      });
    });
    box.querySelectorAll("[data-evento]").forEach(function (b) {
      b.addEventListener("click", function () {
        evento = b.dataset.evento;
        box.querySelectorAll("[data-evento]").forEach(x => x.setAttribute("aria-pressed", String(x === b && evento !== "normal")));
        avalia();
      });
    });
    avalia();
  });

  // ===================== 29. o post-it do cache =====================
  document.querySelectorAll("[data-cache]").forEach(function (box) {
    const pessoas = box.querySelectorAll(".cache-pessoas span");
    const banco = box.querySelector("[data-idas]");
    const postit = box.querySelector("[data-postit]");
    const nota = box.querySelector(".cache-nota");
    const fala = box.querySelector(".casa-fala");
    const vai = box.querySelector(".vai");
    const chave = box.querySelector("[data-com-cache]");
    let espera = [];
    chave.addEventListener("click", function () {
      chave.setAttribute("aria-pressed", String(chave.getAttribute("aria-pressed") !== "true"));
      chave.querySelector(".sn").textContent = chave.getAttribute("aria-pressed") === "true" ? "ligado" : "desligado";
      box.classList.toggle("com-cache", chave.getAttribute("aria-pressed") === "true");
    });
    vai.addEventListener("click", function () {
      espera.forEach(clearTimeout);
      espera = [];
      const com = chave.getAttribute("aria-pressed") === "true";
      let idas = 0, hits = 0;
      pessoas.forEach(p => (p.className = ""));
      nota.classList.remove("escrito");
      banco.textContent = "0";
      postit.textContent = "0";
      const uma = function (i) {
        const vaiAoBanco = !com || i === 0;
        if (vaiAoBanco) idas++; else hits++;
        pessoas[i].className = vaiAoBanco ? "banco" : "postit";
        if (com && i === 0) nota.classList.add("escrito");
        banco.textContent = idas;
        postit.textContent = hits;
        if (i === pessoas.length - 1) {
          fala.innerHTML = com ? "📝 <strong>Só a primeira pessoa foi ao banco</strong>; a resposta ficou anotada no post-it (o ElastiCache, na memória) e as outras nove leram de lá, muito mais rápido. O banco descansou." :
            "🗄️ <strong>Dez idas ao banco</strong> para a mesma página, que não mudou. Agora imagine 100 mil pessoas na abertura da venda. Ligue o cache e repita.";
          vai.disabled = false;
        }
      };
      if (pausado()) { pessoas.forEach((_, i) => uma(i)); return; }
      vai.disabled = true;
      pessoas.forEach((_, i) => espera.push(setTimeout(() => uma(i), 150 + i * 220)));
    });
  });

  // ===================== 30. o gaveteiro =====================
  document.querySelectorAll("[data-gaveteiro]").forEach(function (box) {
    const grade = box.querySelector(".gav-grade");
    const contador = box.querySelector("[data-abertas]");
    const fala = box.querySelector(".casa-fala");
    const ALVO = 73; // a gaveta do resistor de 220 Ω
    for (let i = 0; i < 100; i++) {
      const g = document.createElement("span");
      g.textContent = "";
      grade.appendChild(g);
    }
    const gavetas = grade.querySelectorAll("span");
    let laco = 0;
    function limpa() {
      clearInterval(laco);
      gavetas.forEach(g => { g.className = ""; g.textContent = ""; });
      contador.textContent = "0";
      box.querySelectorAll("[data-busca]").forEach(b => (b.disabled = false));
    }
    function achou(n, chave) {
      gavetas[ALVO].className = "achou";
      gavetas[ALVO].textContent = "Ω";
      contador.textContent = n;
      fala.innerHTML = chave ? "🏷️ <strong>1 gaveta aberta.</strong> Com a etiqueta (a chave), você vai direto ao resistor. Com 100 ou com 1 milhão de gavetas, continua sendo 1. É assim que o DynamoDB responde em milissegundos." :
        `🔍 <strong>${n} gavetas abertas</strong> até achar o resistor. Sem etiqueta, você procura uma por uma. Com 1 milhão de gavetas, seriam, em média, meio milhão de aberturas.`;
      box.querySelectorAll("[data-busca]").forEach(b => (b.disabled = false));
    }
    box.querySelector("[data-busca='procura']").addEventListener("click", function () {
      limpa();
      if (pausado()) { for (let i = 0; i < ALVO; i++) gavetas[i].className = "aberta"; return achou(ALVO + 1, false); }
      box.querySelectorAll("[data-busca]").forEach(b => (b.disabled = true));
      let i = 0;
      laco = setInterval(function () {
        if (i === ALVO) { clearInterval(laco); return achou(i + 1, false); }
        gavetas[i].className = "aberta";
        contador.textContent = i + 1;
        i++;
      }, 35);
    });
    box.querySelector("[data-busca='etiqueta']").addEventListener("click", function () {
      limpa();
      achou(1, true);
    });
    box.querySelector("[data-busca='limpa']").addEventListener("click", function () {
      limpa();
      fala.textContent = "Cem gavetas fechadas. O resistor de 220 Ω está numa delas.";
    });
  });

  // ===================== 31. o raio-x dos seis pilares =====================
  const PILARES = [
    { id: "ope", nome: "Excelência operacional", curto: "Excelência op.", pergunta: "você roda bem, enxerga o que acontece e melhora os processos?" },
    { id: "seg", nome: "Segurança", curto: "Segurança", pergunta: "os dados, os sistemas e os acessos estão protegidos?" },
    { id: "con", nome: "Confiabilidade", curto: "Confiabilidade", pergunta: "o sistema se recupera de falhas e continua no ar?" },
    { id: "des", nome: "Eficiência de desempenho", curto: "Desempenho", pergunta: "você usa os recursos certos quando a demanda muda?" },
    { id: "cus", nome: "Otimização de custos", curto: "Custos", pergunta: "você entrega o resultado pelo menor preço?" },
    { id: "sus", nome: "Sustentabilidade", curto: "Sustentabilidade", pergunta: "você reduz o consumo de energia e usa só o necessário?" }
  ];
  const CONSERTOS = {
    p1: { pilar: "con", fix: "🔧 Duas ou mais máquinas em zonas diferentes, atrás de um balanceador: uma falha não derruba o site." },
    p2: { pilar: "cus", fix: "🔧 Cost Explorer para achar o vilão, Budgets para avisar e máquinas do tamanho certo." },
    p3: { pilar: "ope", fix: "🔧 CloudTrail para saber quem mudou o quê, e mudanças pequenas, frequentes e automatizadas." },
    p4: { pilar: "des", fix: "🔧 CloudFront e cache na frente, e Auto Scaling quando muita gente entra." },
    p5: { pilar: "seg", fix: "🔧 Criptografia em repouso, com chaves do KMS, em todas as cópias do banco." },
    p6: { pilar: "sus", fix: "🔧 Desligar ou diminuir as máquinas à noite: menos energia, só o necessário." }
  };
  document.querySelectorAll("[data-pilares]").forEach(function (box) {
    const palco = box.querySelector(".radar");
    const fala = box.querySelector(".casa-fala");
    const nivel = {};
    PILARES.forEach(p => (nivel[p.id] = 0.3));
    const C = 170, R = 115;
    const cena = svg("svg", { viewBox: "0 0 340 340", role: "img", "aria-label": "Radar dos seis pilares do Well-Architected" }, palco);
    const ponto = (i, v) => { const a = (-90 + i * 60) * Math.PI / 180; return [C + Math.cos(a) * R * v, C + Math.sin(a) * R * v]; };
    [0.25, 0.5, 0.75, 1].forEach(v => svg("polygon", { points: PILARES.map((_, i) => ponto(i, v).join(",")).join(" "), class: "radar-grade" }, cena));
    PILARES.forEach(function (p, i) {
      const [x, y] = ponto(i, 1);
      svg("line", { x1: C, y1: C, x2: x, y2: y, class: "radar-grade" }, cena);
      const [lx, ly] = ponto(i, 1.22);
      const el = svg("text", { x: lx, y: ly + 4, class: "radar-rotulo", "text-anchor": "middle" }, cena);
      el.textContent = p.curto;
    });
    const forma = svg("polygon", { class: "radar-forma" }, cena);
    const bolas = PILARES.map(() => svg("circle", { r: 5, class: "radar-ponto" }, cena));
    function desenha() {
      const pts = PILARES.map((p, i) => ponto(i, nivel[p.id]));
      forma.setAttribute("points", pts.map(q => q.join(",")).join(" "));
      bolas.forEach((b, i) => { b.setAttribute("cx", pts[i][0]); b.setAttribute("cy", pts[i][1]); b.classList.toggle("cheio", nivel[PILARES[i].id] >= 1); });
      const feitos = PILARES.filter(p => nivel[p.id] >= 1).length;
      box.classList.toggle("completo", feitos === 6);
      if (feitos === 6) fala.innerHTML = "🏆 <strong>Hexágono cheio: pronta para o investidor!</strong> Seis problemas, seis pilares, seis consertos.";
    }
    box.querySelectorAll("[data-problema]").forEach(function (linha) {
      const c = CONSERTOS[linha.dataset.problema];
      linha.querySelectorAll("[data-pilar]").forEach(function (b) {
        b.addEventListener("click", function () {
          const saida = linha.querySelector(".central-saida");
          const escolhido = PILARES.find(p => p.id === b.dataset.pilar);
          linha.classList.remove("falha");
          if (b.dataset.pilar === c.pilar) {
            linha.className = "central-linha rodando certo";
            linha.querySelectorAll("[data-pilar]").forEach(x => x.setAttribute("aria-pressed", String(x === b)));
            saida.textContent = "✅ " + escolhido.nome + ". " + c.fix;
            nivel[c.pilar] = 1;
            desenha();
            if (!box.classList.contains("completo")) fala.innerHTML = `O pilar <strong>${escolhido.nome}</strong> encheu. Faltam ${PILARES.filter(p => nivel[p.id] < 1).length}.`;
          } else {
            void linha.offsetWidth;
            linha.classList.add("falha");
            saida.textContent = `Não é bem esse. ${escolhido.nome} pergunta: ${escolhido.pergunta}`;
          }
        });
      });
    });
    box.querySelector(".de-novo").addEventListener("click", function () {
      PILARES.forEach(p => (nivel[p.id] = 0.3));
      box.querySelectorAll("[data-problema]").forEach(function (l) {
        l.className = "central-linha";
        l.querySelector(".central-saida").textContent = "";
        l.querySelectorAll("[data-pilar]").forEach(x => x.setAttribute("aria-pressed", "false"));
      });
      fala.innerHTML = "Os seis pilares estão murchos. Escolha o pilar de cada problema.";
      desenha();
    });
    desenha();
  });

  // ===================== 32. o fiscal da conta =====================
  document.querySelectorAll("[data-fiscal]").forEach(function (box) {
    const itens = box.querySelectorAll(".fiscal-lista li");
    const fala = box.querySelector(".casa-fala");
    const vai = box.querySelector(".vai");
    let espera = [];
    vai.addEventListener("click", function () {
      espera.forEach(clearTimeout);
      espera = [];
      itens.forEach(li => li.classList.remove("visto"));
      const fim = function () {
        fala.innerHTML = "🔎 <strong>Seis categorias conferidas.</strong> O Trusted Advisor <strong>aponta e recomenda</strong>; quem decide e conserta é a equipe. Comece pelo vermelho.";
        vai.disabled = false;
      };
      if (pausado()) { itens.forEach(li => li.classList.add("visto")); return fim(); }
      vai.disabled = true;
      fala.textContent = "Conferindo a conta…";
      itens.forEach((li, i) => espera.push(setTimeout(() => li.classList.add("visto"), 300 + i * 450)));
      espera.push(setTimeout(fim, 300 + itens.length * 450));
    });
  });

  // ===================== 33. a sala de controle da venda =====================
  // O dia vai das 9h (minuto 0) ao meio-dia (minuto 180). A venda abre às 10h (minuto 60); uma máquina trava às 10h20 (minuto 80).
  // A procura e as máquinas são contadas em "máquinas necessárias" (números de exemplo).
  const hora = m => { const h = 9 + Math.floor(m / 60); const mm = m % 60; return h + "h" + String(mm).padStart(2, "0"); };
  const procuraVenda = m => (m < 55 ? 0.8 : m < 60 ? 0.8 + (m - 55) * 0.5 : 0.8 + 6.7 * Math.exp(-(m - 60) / 55));
  function rodaVenda(c) {
    const serie = [], feed = [];
    let cap = 2, espera = 0, desce = 0, travou = false, avisou = false, lentoDesde = -1, lentos = 0, primeiraLenta = false, desceuAvisou = false, paradas = false;
    for (let m = 0; m <= 180; m++) {
      const d = procuraVenda(m);
      if (c.programada && m === 30) { cap = Math.max(cap, 8); feed.push([m, "⏰ Escala programada: o grupo passou para 8 máquinas antes da venda."]); }
      if (c.dinamico) {
        const alvo = Math.min(10, Math.max(c.programada && m >= 30 && m < 120 ? 8 : 2, Math.ceil(d * 1.25)));
        if (alvo > cap) { if (++espera >= 3) { const antes = cap; cap = Math.min(alvo, cap + 2); espera = 0; feed.push([m, `📈 O Auto Scaling ligou mais ${cap - antes} máquina${cap - antes > 1 ? "s" : ""} (agora ${cap}).`]); } }
        else { espera = 0; if (alvo < cap && ++desce >= 10) { cap--; desce = 0; if (!desceuAvisou) { desceuAvisou = true; feed.push([m, "📉 A procura caiu, e o Auto Scaling começou a desligar máquinas."]); } } }
      }
      if (m === 60) feed.push([m, "🎟️ Abriu a venda do Festival do Cerrado!"]);
      // a máquina que trava às 10h20
      let quebradas = 0;
      if (m >= 80) {
        if (m === 80) {
          travou = true;
          feed.push([m, c.balanceador ? "🩺 Uma máquina travou. O balanceador viu na verificação de integridade e tirou ela da fila." :
            "💥 A máquina que recebia todos os clientes travou. Sem balanceador, ninguém desviou o tráfego: site fora do ar."]);
        }
        if (c.balanceador) quebradas = c.dinamico && m >= 84 ? 0 : 1;
        if (c.balanceador && c.dinamico && m === 84) feed.push([m, "🔁 O Auto Scaling trocou a máquina travada por uma nova."]);
      }
      let efetiva = c.balanceador ? Math.max(0, cap - quebradas) : (m >= 80 ? 0 : 1);
      if (!c.balanceador && cap > 1 && !paradas) { paradas = true; feed.push([m, "🤷 Há máquinas ligadas, mas paradas: sem balanceador, os clientes vão todos para o endereço de uma só."]); }
      if (c.alarme && !avisou && d > efetiva * 0.8) { avisou = true; feed.push([m, "📱 Alarme do CloudWatch: processador acima de 80%. A equipe recebeu o aviso pelo SNS."]); }
      const lento = d > efetiva;
      if (lento) { lentos++; if (!primeiraLenta) { primeiraLenta = true; feed.push([m, efetiva === 0 ? "🔴 Ninguém consegue comprar." : "🐢 As máquinas não dão conta: o site ficou lento."]); } }
      serie.push({ m: m, d: d, cap: efetiva });
    }
    feed.sort((a, b) => a[0] - b[0]);
    return { serie: serie, feed: feed, lentos: lentos, pico: Math.max.apply(null, serie.map(p => p.cap)), avisou: avisou };
  }
  document.querySelectorAll("[data-controle]").forEach(function (box) {
    const relogio = box.querySelector("[data-relogio]");
    const feedEl = box.querySelector(".controle-feed");
    const grafico = box.querySelector(".controle-grafico");
    const vai = box.querySelector(".vai");
    const veredito = box.querySelector(".sim-veredito");
    const campos = {};
    box.querySelectorAll("[data-n]").forEach(el => (campos[el.dataset.n] = el));
    const liga = k => box.querySelector(`[data-chave-venda="${k}"]`).getAttribute("aria-pressed") === "true";
    const G = { x0: 34, x1: 630, y0: 150, y1: 10 };
    const gx = m => G.x0 + (m / 180) * (G.x1 - G.x0);
    const gy = v => G.y0 - (v / 10) * (G.y0 - G.y1);
    const graf = svg("svg", { viewBox: "0 0 640 176", role: "img", "aria-label": "Procura e máquinas atendendo, das 9h ao meio-dia" }, grafico);
    [0, 5, 10].forEach(v => { svg("line", { x1: G.x0, x2: G.x1, y1: gy(v), y2: gy(v), class: "gr-eixo", opacity: v ? 0.35 : 1 }, graf); svg("text", { x: G.x0 - 6, y: gy(v) + 4, class: "gr-rotulo", "text-anchor": "end" }, graf).textContent = v; });
    [0, 60, 120, 180].forEach(m => (svg("text", { x: gx(m), y: G.y0 + 18, class: "gr-rotulo", "text-anchor": "middle" }, graf).textContent = hora(m)));
    const linhaD = svg("path", { class: "gr-procura" }, graf);
    const linhaC = svg("path", { class: "gr-capacidade" }, graf);
    const cursor = svg("line", { y1: G.y1, y2: G.y0, class: "gr-cursor", opacity: 0 }, graf);
    let res, quadro = 0, rodando = false;
    function desenha(ate) {
      let dD = "", dC = "";
      for (let i = 0; i <= ate; i++) {
        const p = res.serie[i];
        dD += (i ? "L" : "M") + gx(p.m).toFixed(1) + " " + gy(p.d).toFixed(1);
        dC += (i ? "L" : "M") + gx(p.m).toFixed(1) + " " + gy(p.cap).toFixed(1);
      }
      linhaD.setAttribute("d", dD);
      linhaC.setAttribute("d", dC);
      cursor.setAttribute("x1", gx(ate));
      cursor.setAttribute("x2", gx(ate));
      relogio.textContent = hora(ate);
      feedEl.innerHTML = res.feed.filter(f => f[0] <= ate).map(f => `<li><time>${hora(f[0])}</time> ${f[1]}</li>`).join("");
      feedEl.scrollTop = feedEl.scrollHeight;
    }
    function termina() {
      rodando = false;
      cancelAnimationFrame(quadro);
      desenha(180);
      cursor.setAttribute("opacity", 0);
      campos.lentos.textContent = res.lentos + " min";
      campos.pico.textContent = res.pico;
      campos.alarme.textContent = res.avisou ? "sim" : "não";
      const tudo = liga("balanceador") && liga("dinamico") && liga("programada") && liga("alarme");
      veredito.style.setProperty("--c", res.lentos === 0 ? "var(--vivo-ok)" : "var(--vivo-ruim)");
      veredito.innerHTML = "<p>" + (tudo && res.lentos === 0 ? "🏆 <strong>Venda perfeita!</strong> Nenhum minuto lento: o balanceador repartiu, a escala programada adiantou, o Auto Scaling acompanhou e o alarme avisou. A aula 1 ficou para trás." :
        res.lentos === 0 ? `✅ <strong>Nenhum minuto lento.</strong> ${!liga("alarme") ? "Mas sem o alarme, a equipe ficou sabendo só pelos clientes." : ""}` :
        `😬 <strong>${res.lentos} minutos lentos ou fora do ar.</strong> Leia o feed para ver o que faltou, ligue a peça e rode de novo.`) + "</p>";
      vai.disabled = false;
      vai.textContent = "▶ Rodar a venda de novo";
    }
    const ritmo = m => (m >= 55 && m < 95 ? 6 : 24); // minutos por segundo: devagar na abertura da venda
    function roda() {
      res = rodaVenda({ balanceador: liga("balanceador"), dinamico: liga("dinamico"), programada: liga("programada"), alarme: liga("alarme") });
      veredito.innerHTML = "";
      ["lentos", "pico", "alarme"].forEach(k => (campos[k].textContent = "—"));
      if (pausado()) return termina();
      rodando = true;
      vai.disabled = true;
      vai.textContent = "A venda está rolando…";
      cursor.setAttribute("opacity", 1);
      let m = 0, antes = performance.now();
      function quadroDaVenda(agora) {
        if (!rodando) return;
        if (pausado()) return termina();
        m = Math.min(180, m + ritmo(m) * Math.min(0.1, (agora - antes) / 1000));
        antes = agora;
        desenha(Math.floor(m));
        if (m >= 180) return termina();
        quadro = requestAnimationFrame(quadroDaVenda);
      }
      quadro = requestAnimationFrame(quadroDaVenda);
    }
    box.querySelectorAll("[data-chave-venda]").forEach(function (b) {
      b.addEventListener("click", function () {
        b.setAttribute("aria-pressed", String(b.getAttribute("aria-pressed") !== "true"));
        b.querySelector(".sn").textContent = b.getAttribute("aria-pressed") === "true" ? "ligado" : "desligado";
      });
    });
    vai.addEventListener("click", roda);
    document.addEventListener("placa:movimento", e => { if (e.detail.pausado && rodando) termina(); });
    res = rodaVenda({ balanceador: false, dinamico: false, programada: false, alarme: false });
    desenha(0);
    feedEl.innerHTML = "<li>Ligue as peças que a equipe montou e aperte <strong>Rodar a venda</strong>.</li>";
  });

  // ===================== 34. a fila do supermercado =====================
  document.querySelectorAll("[data-fila]").forEach(function (box) {
    const caixasEl = box.querySelector(".fila-caixas");
    const filaEl = box.querySelector(".fila-clientes");
    const fala = box.querySelector(".casa-fala");
    const tempo = box.querySelector("[data-tempo]");
    const CLIENTES = 30;
    let caixas = 1, vel = 1, laco = 0;
    function desenhaCaixas(parado) {
      caixasEl.innerHTML = Array.from({ length: caixas }, (_, i) => `<span class="${parado && i === 0 ? "parado" : ""}">🧑‍💼<small>${vel}×</small></span>`).join("");
      const t = Math.ceil(CLIENTES / (caixas * vel));
      tempo.textContent = t + " rodadas";
    }
    function fila(n) { filaEl.textContent = "🙂".repeat(n) || "✨ fila vazia"; }
    box.querySelector("[data-horizontal]").addEventListener("click", function () {
      if (caixas >= 6) { fala.innerHTML = "Seis caixas já é o supermercado inteiro. Na nuvem, o limite seria o máximo do grupo do Auto Scaling."; return; }
      caixas++;
      desenhaCaixas(false);
      fala.innerHTML = `➕ <strong>Escalar na horizontal:</strong> mais um caixa (agora ${caixas}), sem parar os que já atendem. É o Auto Scaling ligando mais máquinas.`;
    });
    box.querySelector("[data-vertical]").addEventListener("click", function () {
      if (vel >= 3) { fala.innerHTML = "🧱 <strong>Chegou no teto:</strong> não existe caixa mais rápido que isso. Na vertical, a máquina maior também tem limite."; return; }
      vel++;
      desenhaCaixas(true);
      fala.innerHTML = `⚡ <strong>Escalar na vertical:</strong> um caixa mais rápido (${vel}×). Mas, para trocar, o caixa <strong>parou</strong> por um tempo. É trocar a máquina por uma maior.`;
      if (!pausado()) setTimeout(() => desenhaCaixas(false), 1200); else desenhaCaixas(false);
    });
    box.querySelector("[data-atender]").addEventListener("click", function () {
      clearInterval(laco);
      let resta = CLIENTES;
      fila(resta);
      const porRodada = caixas * vel;
      const fim = () => (fala.innerHTML = `🛒 Fila atendida em <strong>${Math.ceil(CLIENTES / porRodada)} rodadas</strong>, com ${caixas} caixa${caixas > 1 ? "s" : ""} a ${vel}×.`);
      if (pausado()) { fila(0); return fim(); }
      laco = setInterval(function () {
        resta = Math.max(0, resta - porRodada);
        fila(resta);
        if (!resta) { clearInterval(laco); fim(); }
      }, 350);
    });
    box.querySelector("[data-recomeca-fila]").addEventListener("click", function () {
      clearInterval(laco);
      caixas = 1; vel = 1;
      desenhaCaixas(false);
      fila(CLIENTES);
      fala.textContent = "Trinta clientes, um caixa. Abra mais caixas ou deixe o caixa mais rápido.";
    });
    box.querySelector("[data-recomeca-fila]").click();
  });
})();
