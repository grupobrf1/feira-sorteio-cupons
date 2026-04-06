# feira-sorteio-cupons

## Objetivo

Disponibilizar uma interface web para sorteio e consulta de cupons da campanha Experiência 360.

## Problema que resolve

Padroniza a execução dos sorteios e evita controles manuais dispersos para escolha e conferência dos ganhadores.

## Áreas ou setores atendidos

- Marketing
- Comercial
- Operação da campanha

## Público principal

Usuários internos responsáveis por realizar sorteios e consultar ganhadores.

## Escopo resumido

Frontend web em Vite com sorteios por grupo, por fornecedor e de carro, além de telas para consulta dos ganhadores.

## Funcionamento lógico resumido

- Origem dos dados: API da campanha em `https://api.grupobrf1.com:10000`.
- Entrada: seleção do tipo de sorteio e, quando aplicável, do fornecedor.
- Processamento principal: exibe contagem regressiva, chama a rota correspondente de sorteio e formata os dados do cupom ganhador ou da lista de ganhadores.
- Saída: exibição do cupom sorteado ou da lista de ganhadores na tela.
- Integrações: rotas de sorteio e consulta de ganhadores da API da campanha.
- Regra principal de negócio: o tipo de sorteio selecionado define a chamada de API e o contexto do resultado exibido.
- Fluxo resumido: operador escolhe o tipo de sorteio -> frontend executa contagem -> consulta API -> mostra ganhador ou histórico.

## Tecnologias principais

- Vite
- JavaScript
- HTML/CSS
- Bootstrap

## Como executar ou acessar

```bash
cd /Users/lucas/Projetos/feira-sorteio-cupons
npm install
npm run dev
```

Build:

```bash
npm run build
```

## Integrações

- API `https://api.grupobrf1.com:10000`

## Publicação web

### Nginx

```nginx
server {
    listen 80;
    server_name <subdominio>;

    root /var/www/feira-sorteio-cupons/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### Cloudflare

- criar registro DNS do subdomínio
- apontar para o servidor da aplicação
- ajustar proxy e SSL conforme o padrão do ambiente

## Status de produção

Há indício de uso como frontend operacional da campanha. Solicitante original, URL final e período de uso ainda precisam de confirmação retroativa.

## Pendências para registro retroativo

- Confirmar solicitante original
- Confirmar URL ou subdomínio final
- Confirmar período de uso em produção
