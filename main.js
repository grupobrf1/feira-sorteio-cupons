//Funcao para renderizar confetes
function dropConfetti(duration) {
  const confettiColors = ["red", "green", "blue", "yellow", "purple", "orange"];
  const canvas = document.createElement("canvas");
  canvas.style.position = "fixed";
  canvas.style.top = "0";
  canvas.style.left = "0";
  canvas.style.pointerEvents = "none";
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  const pieces = [];
  const numberOfPieces = 200;
  const gravity = 0.5;

  function Piece() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height - canvas.height;
    this.radius = (Math.random() * 8) + 5;
    this.color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
    this.speedY = (Math.random() * 6) + 1;
    this.speedX = (Math.random() * 4) - 2;
    this.opacity = Math.random();
  }

  function createPieces() {
    for (let i = 0; i < numberOfPieces; i++) {
      pieces.push(new Piece());
    }
  }

  function drawPieces() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach(function (piece) {
      ctx.beginPath();
      ctx.globalAlpha = piece.opacity;
      ctx.fillStyle = piece.color;
      ctx.arc(piece.x, piece.y, piece.radius, 0, Math.PI * 2, false);
      ctx.closePath();
      ctx.fill();

      piece.y += piece.speedY;
      piece.x += piece.speedX;

      if (piece.y >= canvas.height) {
        piece.y = -piece.radius;
      }

      if (piece.x >= canvas.width || piece.x <= 0) {
        piece.speedX = -piece.speedX;
      }
    });

    requestAnimationFrame(drawPieces);
  }

  createPieces();
  drawPieces();

  setTimeout(function () {
    document.body.removeChild(canvas);
  }, duration);
}


// Array de fornecedores
const fornecedores = [
  'Selecione o fornecedor',
  'BELFAR', 'BRASTERAPICA', 'CCM', 'EMS', 'ESSITY', 'EVERGREEN', 'GEOLAB', 'GERMED', 'GIOVANNA BABY', 'GLOBO', 'HERTZ', 'HYPERA', 'IF BRASIL', 'KIMBERLY', 'LOLLY', 'MERCUR', 'MULTI B', 'NATULAB', 'OUTLET', 'QUARIS', 'TEUTO', 'VITAFOR', 'VITAMEDIC'
];

// Ordena o array em ordem alfabética, mantendo 'Selecione o fornecedor' no início
const primeiroElemento = fornecedores.shift();
fornecedores.sort();
fornecedores.unshift(primeiroElemento);


// Variáveis para controlar intervalo, timeout e promessa
let contagemRegressivaInterval = null;
let esperaTimeout = null;
let resolveEspera = null;
let rejeitarEspera = null;
let pararSorteio = false;

// Função para preencher a lista de fornecedores nos elementos select
function preencherListaFornecedores() {
  const select = document.getElementById('fornecedor');
  const selectGanhadores = document.getElementById('fornecedor-ganhadores'); // Adicionado
  fornecedores.forEach(fornecedor => {
    const option = document.createElement('option');
    option.value = fornecedor;
    option.textContent = fornecedor;
    select.appendChild(option.cloneNode(true)); // Clonar o nó de opção
    selectGanhadores.appendChild(option); // Adicionado
  });
}

// Função para exibir contagem regressiva antes de revelar o resultado do sorteio
function exibirContagemRegressiva(elemento, tempo) {
  return new Promise((resolve) => {
    let contador = tempo;

    // Adiciona a classe contagem-regressiva ao elemento
    elemento.classList.add('contagem-regressiva');

    // Cria um novo span para a contagem regressiva e o adiciona ao elemento
    const spanContagem = document.createElement('span');
    elemento.appendChild(spanContagem);

    contagemRegressivaInterval = setInterval(() => {
      if (contador <= 0 || pararSorteio) {
        clearInterval(contagemRegressivaInterval);
        contagemRegressivaInterval = null;
        if (!pararSorteio) {
          dropConfetti(5000);
        }
        // Remove o span de contagem regressiva e a classe do elemento
        elemento.removeChild(spanContagem);
        elemento.classList.remove('contagem-regressiva');
        resolve();
        return;
      }
      spanContagem.textContent = `Resultado em... ${contador}`;
      contador--;
    }, 1000);
  });
}

// Função para buscar dados JSON de uma URL
async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Erro na resposta da rede: ' + response.status);
  }
  return response.json();
}

// Função para realizar o sorteio de grupo
async function sorteioGrupo() {
  const botaoSortear = document.querySelector("#sorteio-grupo-section button");
  const elementoResultado = document.getElementById('resultado');

  botaoSortear.disabled = true;
  elementoResultado.innerHTML = '';

  const contagemRegressivaPromise = exibirContagemRegressiva(elementoResultado, 10);

  try {
    const cupons = await fetchJson('https://cupons.grupobrf1.com/sorteiogrupo');
    if (!Array.isArray(cupons) || cupons.length === 0) {
      elementoResultado.textContent = 'Não há cupons cadastrados para o sorteio de grupo.';
      return;
    }

    await contagemRegressivaPromise;

    if (pararSorteio) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * cupons.length);
    const idSorteado = cupons[randomIndex];

    if (!idSorteado) {
      throw new Error('ID de cupom inválido.');
    }

    const ganhador = await fetchJson(`https://cupons.grupobrf1.com/api/cupom/${idSorteado}`);
    await fetch(`https://cupons.grupobrf1.com/AlterarSorteioGrupo/${idSorteado}`, { method: 'PATCH' });

    elementoResultado.innerHTML = formatarDadosGanhador(ganhador);

  } catch (error) {
    elementoResultado.textContent = 'Erro: ' + error.message;
  } finally {
    botaoSortear.disabled = false;
  }
}



// Função para realizar o sorteio de fornecedor
async function sorteioFornecedor() {
  const botaoSortear = document.querySelector("#sorteio-fornecedor-section button");
  const fornecedor = document.getElementById('fornecedor').value;
  const elementoResultado = document.getElementById('resultado');

  botaoSortear.disabled = true;
  elementoResultado.innerHTML = '';

  const contagemRegressivaPromise = exibirContagemRegressiva(elementoResultado, 10);

  try {
    if (fornecedor === 'Selecione o fornecedor') {
      throw new Error('Fornecedor não selecionado.');
    }

    const cupons = await fetchJson(`https://cupons.grupobrf1.com/sorteiofornec/${fornecedor}`);

    if (!Array.isArray(cupons) || cupons.length === 0) {
      elementoResultado.textContent = 'Não há cupons cadastrados para este fornecedor.';
      return;
    }

    await contagemRegressivaPromise;

    const randomIndex = Math.floor(Math.random() * cupons.length);
    const idSorteado = cupons[randomIndex];

    if (!idSorteado) {
      throw new Error('ID de cupom inválido.');
    }

    const ganhador = await fetchJson(`https://cupons.grupobrf1.com/api/cupom/${idSorteado}`);
    await fetch(`https://cupons.grupobrf1.com/AlterarSorteioFornec/${fornecedor}/${idSorteado}`, { method: 'PATCH' });

    elementoResultado.innerHTML = formatarDadosGanhador(ganhador);

  } catch (error) {
    elementoResultado.textContent = 'Erro: ' + error.message;
  } finally {
    botaoSortear.disabled = false;
  }
}



// Função para formatar o CNPJ
function formatarCNPJ(cnpj) {
  const cnpjString = cnpj.toString();
  if (cnpjString.length === 14) {
    return cnpjString.slice(0, 2) + "." + cnpjString.slice(2, 5) + "." + cnpjString.slice(5, 8) + "/" + cnpjString.slice(8, 12) + "-" + cnpjString.slice(12, 14);
  }
  return cnpj;
}



function formatarDadosGanhador(ganhador) {
  const cupom = ganhador.id;
  const cnpj = formatarCNPJ(ganhador.cnpj);
  const cliente = ganhador.cliente;
  const uf = ganhador.uf;
  const cidade = ganhador.cidade;
  const fornecedor = ganhador.fornecedor;
  const distribuidora = ganhador.distribuidora;
  const vendedor = ganhador.digitador;

  const resultado = `
      <div class="cupom-container">
        <div class="cupom-title">Cupom Sorteado</div>
        <div class="cupom-field">
          <span class="cupom-label">Cupom:</span>
          <span class="cupom-value">${cupom}</span>
        </div>
        <div class="cupom-field">
          <span class="cupom-label">CNPJ:</span>
          <span class="cupom-value">${cnpj}</span>
        </div>
        <div class="cupom-field">
          <span class="cupom-label">Cliente:</span>
          <span class="cupom-value">${cliente}</span>
        </div>
        <div class="cupom-field">
          <span class="cupom-label">UF:</span>
          <span class="cupom-value">${uf}</span>
        </div>
        <div class="cupom-field">
          <span class="cupom-label">Cidade:</span>
          <span class="cupom-value">${cidade}</span>
        </div>
        <div class="cupom-field">
          <span class="cupom-label">Fornecedor:</span>
          <span class="cupom-value">${fornecedor}</span>
        </div>
        <div class="cupom-field">
          <span class="cupom-label">Vendedor:</span>
          <span class="cupom-value">${vendedor}</span>
        </div>
        <div class="cupom-field">
          <span class="cupom-label">Distribuidora:</span>
          <span class="cupom-value">${distribuidora}</span>
        </div>
      </div>`;

  return resultado;
}




// Função para exibir o sorteio selecionado (grupo ou fornecedor)
function exibirSorteio(tipoSorteio) {
  const tipoSorteioSection = document.getElementById('tipo-sorteio-section');
  const sorteioGrupoSection = document.getElementById('sorteio-grupo-section');
  const sorteioFornecedorSection = document.getElementById('sorteio-fornecedor-section');
  const voltarButton = document.getElementById('voltar-button');
  const ganhadoresButton = document.getElementById('ganhadores-button');
  const ganhadoresFornecedorButton = document.getElementById('ganhadores-fornecedor-button');
  const fornecedorGanhadoresSelect = document.getElementById('fornecedor-ganhadores'); // Adicionado
  const elementoResultado = document.getElementById('resultado');

  ganhadoresButton.classList.add('hidden');
  ganhadoresFornecedorButton.classList.add('hidden');
  fornecedorGanhadoresSelect.classList.add('hidden'); // Adicionado

  tipoSorteioSection.classList.add('hidden');
  voltarButton.classList.remove('hidden');

  elementoResultado.innerHTML = '';

  if (tipoSorteio === 'grupo') {
    sorteioGrupoSection.classList.remove('hidden');
    sorteioFornecedorSection.classList.add('hidden');
  } else if (tipoSorteio === 'fornecedor') {
    sorteioGrupoSection.classList.add('hidden');
    sorteioFornecedorSection.classList.remove('hidden');
  }
}

// Função para voltar para o menu de seleção de tipo de sorteio
function voltar() {
  const elementoResultado = document.getElementById('resultado');
  const fornecedorGanhadoresSelect = document.getElementById('fornecedor-ganhadores'); // Adicionado

  document.getElementById('ganhadores-button').classList.remove('hidden');
  document.getElementById('ganhadores-fornecedor-button').classList.remove('hidden');
  fornecedorGanhadoresSelect.classList.remove('hidden');

  if (contagemRegressivaInterval !== null) {
    clearInterval(contagemRegressivaInterval);
    contagemRegressivaInterval = null;
  }

  if (esperaTimeout !== null) {
    clearTimeout(esperaTimeout);
    esperaTimeout = null;
  }

  if (rejeitarEspera !== null) {
    pararSorteio = true;
    rejeitarEspera();
    rejeitarEspera = null;
    resolveEspera = null;
  }

  elementoResultado.classList.remove('contagem-regressiva'); // Linha adicionada
  elementoResultado.innerHTML = '';

  const tipoSorteioSection = document.getElementById('tipo-sorteio-section');
  const sorteioGrupoSection = document.getElementById('sorteio-grupo-section');
  const sorteioFornecedorSection = document.getElementById('sorteio-fornecedor-section');
  const voltarButton = document.getElementById('voltar-button');


  document.getElementById('ganhadores-button').classList.remove('hidden');
  document.querySelector("#sorteio-grupo-section button").disabled = false;
  document.querySelector("#sorteio-fornecedor-section button").disabled = false;


  tipoSorteioSection.classList.remove('hidden');
  voltarButton.classList.add('hidden');
  sorteioGrupoSection.classList.add('hidden');
  sorteioFornecedorSection.classList.add('hidden');

  setTimeout(() => {
    pararSorteio = false;
  }, 0);
}

// Função para exibir os ganhadores do sorteio de grupo
async function exibirGanhadoresSorteioGrupo() {
  try {
    const elementoResultado = document.getElementById('resultado');
    elementoResultado.innerHTML = '';

    const ganhadores = await fetchJson('https://cupons.grupobrf1.com/GanhadoresSorteioGrupo');

    if (ganhadores && ganhadores.length > 0) {
      let tabela = document.createElement('table');
      tabela.className = 'ganhadores';

      let thead = document.createElement('thead');
      thead.innerHTML = `
              <tr>
                  <th>ID</th>
                  <th>Distribuidora</th>
                  <th>Cliente</th>
                  <th>CNPJ</th>
                  <th>Telefone</th>
                  <th>Cidade</th>
                  <th>UF</th>
                  <th>Valor</th> <!-- Renomeado de Quantidade para Valor -->
                  <th>Data de Cadastro</th>
                  <th>Fornecedor</th>
                  <th>Digitador</th>
              </tr>
          `;
      tabela.appendChild(thead);

      let tbody = document.createElement('tbody');
      ganhadores.forEach(ganhador => {
        let row = document.createElement('tr');

        // Aqui, ajustamos a data e hora antes de inserir na tabela
        let dtCadastro = adjustTime(ganhador.dtCadastro);

        row.innerHTML = `
                  <td>${ganhador.id}</td>
                  <td>${ganhador.distribuidora}</td>
                  <td>${ganhador.cliente}</td>
                  <td>${formatarCnpj(ganhador.cnpj)}</td> <!-- usar a função formatarCnpj -->
                  <td>${ganhador.telefone}</td>
                  <td>${ganhador.cidade}</td>
                  <td>${ganhador.uf}</td>
                  <td>${formatarMoedaReal(ganhador.qt)}</td> <!-- usar a função formatarMoedaReal -->
                  <td>${dtCadastro}</td>
                  <td>${ganhador.fornecedor}</td>
                  <td>${ganhador.digitador}</td>
              `;
        tbody.appendChild(row);
      });
      tabela.appendChild(tbody);

      elementoResultado.appendChild(tabela);
    } else {
      elementoResultado.innerHTML = '<p>Não há ganhadores cadastrados para o sorteio de grupo.</p>';
    }

  } catch (error) {
    document.getElementById('resultado').textContent = 'Erro ao carregar os ganhadores: ' + error.message;
  }
}

function formatarCnpj(cnpj) {
  cnpj = cnpj.toString().replace(/\D/g, ''); // Remove tudo o que não é dígito
  cnpj = cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
  return cnpj;
}

function formatarMoedaReal(valor) {
  const opcoes = { style: 'currency', currency: 'BRL' };
  return new Intl.NumberFormat('pt-BR', opcoes).format(valor);
}

// Função para exibir os ganhadores do sorteio de fornecedor
async function exibirGanhadoresSorteioFornecedor() {
  try {
    const fornecedor = document.getElementById('fornecedor-ganhadores').value;
    if (fornecedor === 'Selecione o fornecedor') {
      alert('Selecione um fornecedor');
      return;
    }

    const elementoResultado = document.getElementById('resultado');
    elementoResultado.innerHTML = '';

    const ganhadores = await fetchJson('https://cupons.grupobrf1.com/GanhadoresSorteioFornec/' + fornecedor);

    if (ganhadores && ganhadores.length > 0) {
      let tabela = document.createElement('table');
      tabela.className = 'ganhadores';

      let thead = document.createElement('thead');
      thead.innerHTML = `
              <tr>
                  <th>ID</th>
                  <th>Distribuidora</th>
                  <th>Cliente</th>
                  <th>CNPJ</th>
                  <th>Telefone</th>
                  <th>Cidade</th>
                  <th>UF</th>
                  <th>Valor</th> <!-- Renomeado de Quantidade para Valor -->
                  <th>Data de Cadastro</th>
                  <th>Fornecedor</th>
                  <th>Digitador</th>
              </tr>
          `;
      tabela.appendChild(thead);

      let tbody = document.createElement('tbody');
      ganhadores.forEach(ganhador => {
        let row = document.createElement('tr');

        // Aqui, ajustamos a data e hora antes de inserir na tabela
        let dtCadastro = adjustTime(ganhador.dtCadastro);

        row.innerHTML = `
                  <td>${ganhador.id}</td>
                  <td>${ganhador.distribuidora}</td>
                  <td>${ganhador.cliente}</td>
                  <td>${formatarCnpj(ganhador.cnpj)}</td> <!-- usar a função formatarCnpj -->
                  <td>${ganhador.telefone}</td>
                  <td>${ganhador.cidade}</td>
                  <td>${ganhador.uf}</td>
                  <td>${formatarMoedaReal(ganhador.qt)}</td> <!-- usar a função formatarMoedaReal -->
                  <td>${dtCadastro}</td>
                  <td>${ganhador.fornecedor}</td>
                  <td>${ganhador.digitador}</td>
              `;
        tbody.appendChild(row);
      });
      tabela.appendChild(tbody);

      elementoResultado.appendChild(tabela);
    } else {
      elementoResultado.innerHTML = '<p>Não há ganhadores cadastrados para o fornecedor selecionado.</p>';
    }

  } catch (error) {
    document.getElementById('resultado').textContent = 'Erro ao carregar os ganhadores: ' + error.message;
  }
}

// Função principal para preencher a lista de fornecedores ao carregar a página
function main() {
  preencherListaFornecedores();
}

// Escutador de evento para chamar a função principal quando o documento estiver carregado
document.addEventListener('DOMContentLoaded', main);


function adjustTime(dateString) {
  // Divide a string de data e hora em partes
  let [datePart, timePart] = dateString.split(' ');
  let [day, month, year] = datePart.split('/');
  let [hours, minutes, seconds] = timePart.split(':');

  // Cria um objeto Date
  let date = new Date(year, month - 1, day, hours - 3, minutes, seconds);

  // Formata o objeto Date de volta para uma string
  day = String(date.getDate()).padStart(2, '0');
  month = String(date.getMonth() + 1).padStart(2, '0'); // Os meses são indexados a partir de 0 em JavaScript
  year = date.getFullYear();
  hours = String(date.getHours()).padStart(2, '0');
  minutes = String(date.getMinutes()).padStart(2, '0');
  seconds = String(date.getSeconds()).padStart(2, '0');

  return day + '/' + month + '/' + year + ' ' + hours + ':' + minutes + ':' + seconds;
}
