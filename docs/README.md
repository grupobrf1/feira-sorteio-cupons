# feira-sorteio-cupons

## Identificação
- Tipo: Frontend (Vite + JS vanilla)
- Status: Inativo (uso pontual em edição da feira; mantido para reuso)

## Área e setor
- Área responsável: TI
- Setor atendido: Comercial

## Objetivo
Frontend do **sorteio de cupons** da feira interna do Grupo BRF1, dedicado à mecânica de prêmios via cupons da campanha (diferente do `feira-sorteio`, que conduz o sorteio em palco). Lê os cupons elegíveis a partir do backend da campanha (`Auth-BRF1`) e exibe a operação de sorteio + lista de ganhadores.

## Necessidade que originou
A campanha incluía sorteio de prêmios entre cupons gerados pelas compras da feira. Era necessário um frontend dedicado, separado do sorteio principal, para tratar a especificidade dos cupons (cada cupom tem um cliente associado e um valor).

## Como acessar / executar
- Modo: SPA estática servida por Nginx durante a feira
- Caminho de execução: `C:\Projetos\feira-sorteio-cupons`
- Build local: `npm run build`
- Serviço Windows / NSSM: Não se aplica (frontend estático)
- Logs: logs do Nginx do host

## Stack e integrações
- Build: Vite
- Linguagem: JavaScript vanilla
- Estilo: HTML/CSS
- Sistemas integrados: API da campanha BRF1 (`Auth-BRF1`) — rotas de cupons e sorteio

## Inovação e avanço técnico
- Reaproveitamento da identidade visual da feira
- Separação clara entre sorteio palco (`feira-sorteio`) e sorteio de cupons (`feira-sorteio-cupons`)
- Repositório preservado para reuso em próximas edições

## Incertezas / desafios técnicos
- Garantir que cada cupom só pode ser sorteado uma vez
- Tratamento de cupons cancelados após emissão
- Sazonalidade: usado só na feira

## Resultados / ganhos
- Sorteio de cupons da campanha operado por interface dedicada
- Reuso planejado em edições futuras
- Não mensurado formalmente

## Equipe
- Responsável técnico: TI
