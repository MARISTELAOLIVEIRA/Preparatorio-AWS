/*
  vivo.js: as peças interativas das aulas "vivas" do Preparatório AWS. Só deste site.
  versão 4 · 2026-11-10 · aulas 1 (conceitos), 2 (cobrança), 3 (infraestrutura global) e 4 (segurança e IAM)

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
})();
