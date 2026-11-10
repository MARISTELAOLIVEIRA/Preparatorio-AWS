/*
  vivo.js: as peças interativas das aulas "vivas" do Preparatório AWS. Só deste site.
  versão 1 · 2026-11-10 · começou na aula 1 (conceitos de nuvem)

  1. [data-gancho]  a contagem para a abertura das vendas e a votação "o site aguenta?"
  2. [data-sim]     simulador "A noite da abertura das vendas": salinha com 2, salinha com 20 ou nuvem
  3. [data-casa]    quem cuida de quê: casa própria, apê vazio, apê mobiliado ou hotel (local, IaaS, PaaS, SaaS)
  4. [data-placa]   desmonte a nuvem: as peças de uma placa e o nome de cada uma na AWS

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
  const PECAS = {
    cpu: { nome: "Processador", aws: "vCPU", texto: "No Amazon EC2, você escolhe quantas vCPUs a máquina virtual tem. Mais vCPUs, mais contas por segundo, e mais cara a hora. Uma t3.micro tem 2 vCPUs." },
    ram: { nome: "Memória RAM", aws: "Memória (GiB)", texto: "Vem junto com o tipo de instância do EC2: a t3.micro tem 1 GiB. Precisa de mais? Troque o tipo, sem abrir gabinete nenhum." },
    disco: { nome: "Disco (SSD)", aws: "Amazon EBS", texto: "O disco da máquina virtual. Pegadinha: você paga pelos GB reservados todo mês, mesmo com a máquina desligada, até apagar o volume." },
    rede: { nome: "Placa de rede", aws: "Rede da AWS (VPC)", texto: "Liga a máquina à internet. Entrar dado na AWS é de graça; sair da AWS para a internet é cobrado por GB." },
    energia: { nome: "Fonte e cooler", aws: "Com a AWS", texto: "Energia, refrigeração, prédio e segurança física: na nuvem você nunca vê. Já estão no preço da hora. É a vantagem \"parar de gastar com data center\"." }
  };
  document.querySelectorAll("[data-placa]").forEach(function (placa) {
    const ficha = placa.querySelector(".placa-ficha");
    const vistas = new Set();
    placa.querySelectorAll("[data-peca]").forEach(function (b) {
      b.addEventListener("click", function () {
        const p = PECAS[b.dataset.peca];
        vistas.add(b.dataset.peca);
        placa.querySelectorAll("[data-peca]").forEach(x => x.setAttribute("aria-pressed", String(x === b)));
        const total = Object.keys(PECAS).length;
        const fim = vistas.size === total
          ? "<p><strong>🔧 Placa desmontada!</strong> Agora você sabe o que está alugando quando liga uma máquina na nuvem.</p>"
          : `<p class="placa-contagem">${vistas.size} de ${total} peças</p>`;
        ficha.innerHTML = `<span class="olho">${p.nome}</span><h4>Na AWS:</h4><span class="na-aws">${p.aws}</span><p>${p.texto}</p>${fim}`;
        ficha.classList.remove("troca");
        void ficha.offsetWidth;
        ficha.classList.add("troca");
      });
    });
  });
})();
