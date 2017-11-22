function startconditional34() {
    var today = new Date();
    var yyyy = today.getFullYear();
    var year = parseInt(yyyy) + 1;
    log.info("GET COUNT DEPARTAMENTOS");
    var countDepartamentos = getCountDepartamentos();
    log.info("GET COUNT PROCESSOS OK NO ANO VIGENTE");
    var countProcessOk = getCountDepartamentoPlanejamentoThisYear(year);
    log.info("COUNT DEPARTAMENTOS: " + countDepartamentos);
    log.info("COUNT PROCESSOS OK: " + countProcessOk);

    var hasOrcamento = hasOrcamentoThisYear(year);
    if (countDepartamentos == countProcessOk && hasOrcamento != "Sim") {
        log.info("COUNT PROCESSOS QUE AGUARDAM ORÇAMENTOS == COUNT DEPARTAMENTOS");
        return true;
    } else {
        if (hasOrcamento == "Sim") {
            log.info("EXISTE ORÇAMENTO PRO ANO DE: " + year);
        } else {
            log.info("COUNT PROCESSOS QUE AGUARDAM ORÇAMENTOS !== COUNT DEPARTAMENTOS");
        }
        return false;
    }
}
/**
 * @param {int} ano - Ano que será objeto da pesquisa.
 * @returns {int} - Quantidade de departamentos com planejamento com status OK no ano especificado
 * @description Retorna quantidade de departamentos que possuem um planejamento de treinamentos
 * em um ano específico.
 */
function getCountDepartamentoPlanejamentoThisYear(ano) {
    var c1 = DatasetFactory.createConstraint("metadata#active", true, true, ConstraintType.MUST);
    var c2 = DatasetFactory.createConstraint("anoVigencia", ano.toString(), ano.toString(), ConstraintType.MUST);
    var c3 = DatasetFactory.createConstraint("processState", "OK", "OK", ConstraintType.MUST);
    var dataset = DatasetFactory.getDataset('propor_treinamentos_anuais', null, [c1, c2, c3], ['documentid']);
    if (dataset.rowsCount > 0) {
        return dataset.rowsCount;
    }
    return 0;
}
/**
 * @returns {int} - Quantidade de departamentos no dataset.
 * @description - Retorna a quantidade de departamentos cadastrados no dataset.
 */
function getCountDepartamentos() {
    var c1 = DatasetFactory.createConstraint("metadata#active", true, true, ConstraintType.MUST);
    var data = DatasetFactory.getDataset("cadastro_areas_orcamento", null, [c1], ["documentid"]);
    if (data.rowsCount > 0) {
        return data.rowsCount;
    } else {
        return 0;
    }

}
/**
 * @param {int} year - Ano que será objeto da pesquisa.
 * @returns {string} - 'Sim' ou 'Não'
 * @description - Retorna 'Sim' caso já tenha um planejamento de orçamentos para o ano informado 
 * ou, do contrário, retorna 'Não'.
 */
function hasOrcamentoThisYear(year) {
    var c1 = DatasetFactory.createConstraint("metadata#active", true, true, ConstraintType.MUST);
    var c2 = DatasetFactory.createConstraint("anoVigencia", year, year, ConstraintType.MUST);
    var c3 = DatasetFactory.createConstraint("hasOrcamentoThisYear", "Sim", "Sim", ConstraintType.MUST);
    var data = DatasetFactory.getDataset("cadastro_orcamentos", null, [c1, c2, c3], ["documentid"]);
    if (data.rowsCount > 0) {
        return "Sim";
    }
    return "Não";
}
