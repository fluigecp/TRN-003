function inputFields(form) {
    var activity = getValue('WKNumState');
    
    form.setValue('campoDescritor', form.getValue('anoVigencia'));
    if (getValue('WKCompletTask') == 'true') {
        if ( activity == 19 || activity == 5 ) {
            var tableCount = form.getChildrenIndexes("orcamentos");
            form.setValue("tableOrcamentosCount", tableCount.length);
        }
    }

    if ( activity == 5 || activity == 7 ) {
        var totalEstimado = form.getValue('totalEstimativa');
        var totalAprovadoPO = form.getValue('totalOrcamento');
        if (totalEstimado != "") {
            form.setValue('fato_0', converteParaFloat(totalEstimado));
            form.setValue('fato_1', converteParaFloat(totalAprovadoPO));
        }
    }
}

function converteParaFloat(variavel) {
	if (variavel == "") {
		return parseFloat(0);
	}
	if (variavel.indexOf("R$") > -1) {
		variavel = variavel.replace("R$ ", "");
	}
	while (variavel.indexOf(".") != -1) {
		variavel = variavel.replace(".", "");
	}

	return parseFloat(variavel.replace(",", "."));
}