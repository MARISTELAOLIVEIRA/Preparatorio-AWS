/* escala.js: o simulador do Auto Scaling da aula 10 (versão 1 · 2026-11-04).
   Um modelo simplificado (números fictícios): cada instância aguenta POR_INSTANCIA acessos por minuto,
   e o grupo fica sempre entre o mínimo e o máximo. Mostra quantas instâncias o grupo manteria.
   Uso:
     <div class="escala" data-minimo="2" data-maximo="10" data-por-instancia="2000">
       <input type="range" min="0" max="24000" step="500" value="3000">
       <div class="escala-maquinas" aria-hidden="true"></div>
       <output class="escala-saida" aria-live="polite"></output>
     </div>
*/
(function () {

  const numero = (valor) => valor.toLocaleString("pt-BR");

  document.querySelectorAll(".escala").forEach(function (bloco) {
    const minimo = Number(bloco.dataset.minimo);
    const maximo = Number(bloco.dataset.maximo);
    const porInstancia = Number(bloco.dataset.porInstancia);
    const controle = bloco.querySelector("input");
    const maquinas = bloco.querySelector(".escala-maquinas");
    const saida = bloco.querySelector(".escala-saida");

    // uma "máquina" para cada vaga do grupo, do mínimo ao máximo
    for (let i = 0; i < maximo; i++) {
      const m = document.createElement("span");
      m.className = "escala-maquina";
      maquinas.appendChild(m);
    }

    function atualizar() {
      const acessos = Number(controle.value);
      const precisa = Math.ceil(acessos / porInstancia);
      const ligadas = Math.min(maximo, Math.max(minimo, precisa));
      maquinas.querySelectorAll(".escala-maquina").forEach(function (m, i) {
        m.classList.toggle("ligada", i < ligadas);
      });

      let texto = numero(acessos) + " acessos por minuto: o grupo mantém " + ligadas + " instâncias.";
      if (precisa < minimo) {
        texto += " Pouco acesso, mas o mínimo de " + minimo + " fica sempre ligado, uma em cada zona.";
      } else if (precisa > maximo) {
        texto += " Chegou ao máximo de " + maximo + ": o site fica lento. Hora de aumentar o máximo do grupo.";
      } else {
        texto += " Cada uma aguenta " + numero(porInstancia) + " acessos por minuto.";
      }
      saida.textContent = texto;
      controle.setAttribute("aria-valuetext", numero(acessos) + " acessos por minuto, " + ligadas + " instâncias");
    }

    controle.addEventListener("input", atualizar);
    atualizar();
  });
})();
