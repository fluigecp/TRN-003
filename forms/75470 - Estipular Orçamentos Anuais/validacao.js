function validaCampos(atividade, proximaAtividade) {
	if ( atividade == 0 || atividade == 4 ) {
		addHasFree('anoVigencia');
		var hasOrcamentoThisYear = $("#hasOrcamentoThisYear").val();
		var today = new Date();
		var yyyy = today.getFullYear();
		var currentYear = $("#anoVigencia").val();
		if ( parseInt(currentYear) < parseInt(yyyy) ) {
			throw ("Favor informar um ano válido.");
		}
		if (hasOrcamentoThisYear == "Sim") {
			throw ("Já existe um planejamento de orçamentos anuais para este ano.");
		}
	}

	if ( atividade == 5 ) {
		//addHasFreeTable('input', 'orcamentoTbOrcamentos', 1);
		$('.table-orcamentos tbody .tableBodyRow:not(:first-child)').each(function(){
			//closest(".tableBodyRow").find('input[name^="orcamentoTbOrcamentos___"]').attr("readonly", true);
			var field = $(this).closest(".tableBodyRow").find('input[name^="orcamentoTbOrcamentos___"]');
			var fieldName = field.attr("name");
			var isFieldReadOnly = field.is('[readonly]');
			if (!isFieldReadOnly) {
				if (field.val() == "") {
					field.css("border-color", "#d43f3a");
					throw("Favor preencher todos os campos obrigatórios");
				} else {
					field.css("border-color", "#ccc");
				}
			}
		});
	}

	if ( activity == 7 ) {
		addHasFree("orcamentoAprovadoGGR");
		if ( $("#orcamentoAprovadoGGR:checked").val() == "Não" ) {
			addHasFree("obsHistorico");
		}
	}
}

// SERVICES 

