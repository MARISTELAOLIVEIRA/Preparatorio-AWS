/* dicionario.js: o dicionário de pistas da aula 11 (versão 1 · 2026-11-04).
   Filtra as linhas de uma tabela pelo que a pessoa digita, sem diferença de acento nem de maiúscula.
   Uso:
     <div class="dicionario">
       <input type="search" placeholder="...">
       <p class="dicionario-contagem" aria-live="polite"></p>
       <table> ... <tbody><tr>...</tr></tbody></table>
     </div>
*/
(function () {

  // "Áudio" e "audio" viram a mesma coisa
  const limpar = (texto) => texto.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

  document.querySelectorAll(".dicionario").forEach(function (bloco) {
    const campo = bloco.querySelector("input");
    const contagem = bloco.querySelector(".dicionario-contagem");
    const linhas = Array.from(bloco.querySelectorAll("tbody tr"));
    const textos = linhas.map((linha) => limpar(linha.textContent));

    function filtrar() {
      const busca = limpar(campo.value.trim());
      let visiveis = 0;
      linhas.forEach(function (linha, i) {
        const mostra = !busca || textos[i].includes(busca);
        linha.hidden = !mostra;
        if (mostra) visiveis += 1;
      });
      if (!busca) {
        contagem.textContent = linhas.length + " serviços. Digite uma pista, como voz, fila ou SQL.";
      } else if (visiveis === 0) {
        contagem.textContent = "Curto-circuito: nenhum serviço com essa pista. Tente outra palavra.";
      } else {
        contagem.textContent = visiveis + (visiveis === 1 ? " serviço combina" : " serviços combinam") + " com “" + campo.value.trim() + "”.";
      }
    }

    campo.addEventListener("input", filtrar);
    filtrar();
  });
})();
