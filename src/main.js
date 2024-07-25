const BASE_URL = "https://api.grupobrf1.com:10000";

function preencherListaFornecedores() {
  const fornecedores = [
    "Selecione o fornecedor",
    "BELFAR",
    "BRASTERAPICA",
    "CCM",
    "EMS",
    "ESSITY",
    "EVERGREEN",
    "GEOLAB",
    "GERMED",
    "GIOVANNA BABY",
    "GLOBO",
    "HERTZ",
    "HYPERA",
    "IFBRASIL",
    "KIMBERLY",
    "LOLLY",
    "MERCUR",
    "MULTI B",
    "NATULAB",
    "OUTLET",
    "QUARIS",
    "TEUTO",
    "VITAFOR",
    "VITAMEDIC",
  ];

  const selectFornecedor = document.getElementById("fornecedor");
  const selectGanhadoresFornecedor = document.getElementById(
    "fornecedor-ganhadores"
  );

  if (selectFornecedor) {
    fornecedores.forEach((fornecedor) => {
      const option = document.createElement("option");
      option.value = fornecedor;
      option.textContent = fornecedor;
      selectFornecedor.appendChild(option);
    });
  } else {
    console.error("Elemento 'fornecedor' não encontrado.");
  }

  if (selectGanhadoresFornecedor) {
    fornecedores.forEach((fornecedor) => {
      const option = document.createElement("option");
      option.value = fornecedor;
      option.textContent = fornecedor;
      selectGanhadoresFornecedor.appendChild(option);
    });
    selectGanhadoresFornecedor.classList.add("hidden"); // Mantendo-o oculto inicialmente
  } else {
    console.error("Elemento 'fornecedor-ganhadores' não encontrado.");
  }
}

function exibirContagemRegressiva(elemento, tempo) {
  return new Promise((resolve) => {
    let contador = tempo;
    const spanContagem = document.createElement("span");
    elemento.appendChild(spanContagem);
    const intervalo = setInterval(() => {
      if (contador <= 0) {
        clearInterval(intervalo);
        if (spanContagem.parentNode === elemento) {
          elemento.removeChild(spanContagem);
        }
        resolve();
      } else {
        spanContagem.textContent = `Resultado em... ${contador}`;
        contador--;
      }
    }, 1000);
  });
}

async function sortear(fetchFunction) {
  const elementoResultado = document.getElementById("resultado");
  elementoResultado.innerHTML = "";
  await exibirContagemRegressiva(elementoResultado, 10);
  const { cupom } = await fetchFunction();
  elementoResultado.innerHTML = formatarDadosGanhador(cupom);
}

async function sorteioGrupo() {
  await sortear(fetchSorteioGrupo);
}

async function sorteioFornecedor() {
  const fornecedor = document.getElementById("fornecedor").value;
  await sortear(() => fetchSorteioFornecedor(fornecedor));
}

async function sorteioCarro() {
  await sortear(fetchSorteioCarro);
}

function formatarCNPJ(cnpj) {
  const cnpjString = cnpj.toString();
  return (
    cnpjString.slice(0, 2) +
    "." +
    cnpjString.slice(2, 5) +
    "." +
    cnpjString.slice(5, 8) +
    "/" +
    cnpjString.slice(8, 12) +
    "-" +
    cnpjString.slice(12, 14)
  );
}

function formatarDadosGanhador(ganhador) {
  return `
        <div class="cupom-container">
            <div class="cupom-title">Cupom Sorteado</div>
            <div class="cupom-field">
                <span class="cupom-label">ID do Cupom:</span>
                <span class="cupom-value">${ganhador.idcupom}</span>
            </div>
            <div class="cupom-field">
                <span class="cupom-label">Transação:</span>
                <span class="cupom-value">${ganhador.transacao}</span>
            </div>
            <div class="cupom-field">
                <span class="cupom-label">Cliente:</span>
                <span class="cupom-value">${ganhador.cliente}</span>
            </div>
            <div class="cupom-field">
                <span class="cupom-label">CNPJ:</span>
                <span class="cupom-value">${formatarCNPJ(ganhador.cnpj)}</span>
            </div>
            <div class="cupom-field">
                <span class="cupom-label">UF:</span>
                <span class="cupom-value">${ganhador.uf}</span>
            </div>
            <div class="cupom-field">
                <span class="cupom-label">Cidade:</span>
                <span class="cupom-value">${ganhador.cidade}</span>
            </div>
            <div class="cupom-field">
                <span class="cupom-label">Fornecedor:</span>
                <span class="cupom-value">${ganhador.fornecedor}</span>
            </div>
            <div class="cupom-field">
                <span class="cupom-label">Valor do Pedido:</span>
                <span class="cupom-value">${ganhador.valorped}</span>
            </div>
            <div class="cupom-field">
                <span class="cupom-label">Quantidade de Moedas:</span>
                <span class="cupom-value">${ganhador.qtmoedas}</span>
            </div>
            <div class="cupom-field">
                <span class="cupom-label">Usuário Func:</span>
                <span class="cupom-value">${ganhador.usuariofunc}</span>
            </div>
            <div class="cupom-field">
                <span class="cupom-label">Data de Lançamento:</span>
                <span class="cupom-value">${new Date(
                  ganhador.dtlanc
                ).toLocaleString()}</span>
            </div>
            <div class="cupom-field">
                <span class="cupom-label">Filial:</span>
                <span class="cupom-value">${ganhador.filial}</span>
            </div>
        </div>`;
}

function exibirSorteio(tipo) {
  document
    .querySelectorAll(".sorteio-section")
    .forEach((section) => section.classList.add("hidden"));
  document.getElementById(`sorteio-${tipo}-section`).classList.remove("hidden");
  document.getElementById("voltar-button").classList.remove("hidden");
}

function voltar() {
  document
    .querySelectorAll(".sorteio-section")
    .forEach((section) => section.classList.add("hidden"));
  document.getElementById("voltar-button").classList.add("hidden");
}

async function exibirGanhadores(fetchFunction) {
  const elementoResultado = document.getElementById("resultado");
  elementoResultado.innerHTML = "";
  const ganhadores = await fetchFunction();
  if (ganhadores.length > 0) {
    elementoResultado.innerHTML = `
            <table class="table table-bordered">
                <thead>
                    <tr>
                        <th>ID do Cupom</th>
                        <th>Transação</th>
                        <th>Cliente</th>
                        <th>CNPJ</th>
                        <th>UF</th>
                        <th>Cidade</th>
                        <th>Fornecedor</th>
                        <th>Valor do Pedido</th>
                        <th>Quantidade de Moedas</th>
                        <th>Usuário Func</th>
                        <th>Data de Lançamento</th>
                        <th>Filial</th>
                    </tr>
                </thead>
                <tbody>
                    ${ganhadores
                      .map(
                        (ganhador) => `
                        <tr>
                            <td>${ganhador.idcupom}</td>
                            <td>${ganhador.transacao}</td>
                            <td>${ganhador.cliente}</td>
                            <td>${formatarCNPJ(ganhador.cnpj)}</td>
                            <td>${ganhador.uf}</td>
                            <td>${ganhador.cidade}</td>
                            <td>${ganhador.fornecedor}</td>
                            <td>${ganhador.valorped}</td>
                            <td>${ganhador.qtmoedas}</td>
                            <td>${ganhador.usuariofunc}</td>
                            <td>${new Date(
                              ganhador.dtlanc
                            ).toLocaleString()}</td>
                            <td>${ganhador.filial}</td>
                        </tr>`
                      )
                      .join("")}
                </tbody>
            </table>`;
  } else {
    elementoResultado.innerHTML = "<p>Não há ganhadores cadastrados.</p>";
  }
}

async function exibirGanhadoresSorteioGrupo() {
  await exibirGanhadores(fetchGanhadoresGrupo);
}

async function exibirGanhadoresSorteioFornecedor() {
  const fornecedor = document.getElementById("fornecedor-ganhadores");
  fornecedor.classList.remove("hidden"); // Mostrando a seleção de fornecedores
  await exibirGanhadores(() => fetchGanhadoresFornecedor(fornecedor.value));
}

async function exibirGanhadoresSorteioCarro() {
  await exibirGanhadores(fetchGanhadoresCarro);
}

async function fetchJson(url) {
  const accessToken = localStorage.getItem("accessToken");
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (!response.ok) {
    throw new Error(`Erro na resposta da rede: ${response.status}`);
  }
  return response.json();
}

async function fetchSorteioGrupo() {
  return fetchJson(`${BASE_URL}/sorteiogrupo`);
}

async function fetchSorteioFornecedor(fornecedor) {
  return fetchJson(`${BASE_URL}/sorteiofornecedor?fornecedor=${fornecedor}`);
}

async function fetchSorteioCarro() {
  return fetchJson(`${BASE_URL}/sorteiocarro`);
}

async function fetchGanhadoresGrupo() {
  return fetchJson(`${BASE_URL}/exibirGanhadoresGrupo`);
}

async function fetchGanhadoresFornecedor(fornecedor) {
  return fetchJson(
    `${BASE_URL}/exibirGanhadoresFornecedor?fornecedor=${fornecedor}`
  );
}

async function fetchGanhadoresCarro() {
  return fetchJson(`${BASE_URL}/exibirGanhadoresCarro`);
}

function logout() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("userName");
  window.location.href = "index.html";
}
