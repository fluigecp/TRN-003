# TRN-003 - Estipular Orçamentos Anuais #

## Descrição: ##

Este processo a finalidade definir a previsão orçamentária(P.O) para os planejamentos anuais
de treinamentos.

### FLUXO PRINCIPAL - fluxo automático: ###

Caso a solicitação de todos os departamentos chegarem na etapa de Aguardar P.O, esta solicitação é aberta 
de forma automática para que o gestor de planejamento possa atribuir os valores para cada departamento.

1 - O gestor de planejamento atribui valores para cada planejamento de treinamentos listado na tabela de previsão
orçamentária;

2 - A solicitação é encaminhada para gerencia geral para a aprovação:

    2.1 - Caso aprovado, a solicitação avança;
    2.2 - Caso reprovada, a solicitação retorna ao gestor de planejamento para atualização(passo 1).

3 - É disparado um serviço para atualização do orçamento de todas as solicitações de planejamentos anuais(TRN-002):
    
    FLUXO ALTERNATIVO:

    Em caso de erro, a solicitação é encaminhada a equipe de processos para tratamento de erro.

4 - Solicitação encerrada.

### FLUXO ALTERNATIVO - manual: ###

Caso haja a necessidade da solicitação ser aberta de forma manual, a solicitação pode ser aberta pelo setor de
RH para que o gestor de planejamento possa atribuir os valores para cada departamento.

1 - RH abre a solicitação;

2 - O gestor de planejamento atribui valores para cada planejamento de treinamentos listado na tabela de previsão
orçamentária;

3 - A solicitação é encaminhada para gerencia geral para a aprovação:

    3.1 - Caso aprovado, a solicitação avança;
    3.2 - Caso reprovada, a solicitação retorna ao gestor de planejamento para atualização(passo 2).

4 - É disparado um serviço para atualização do orçamento de todas as solicitações de planejamentos anuais(TRN-002):
    
    FLUXO ALTERNATIVO:

    Em caso de erro, a solicitação é encaminhada a equipe de processos para tratamento de erro.

5 - Solicitação encerrada.

