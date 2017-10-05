function enableFields(form) {
	var activity = getValue('WKNumState');
    
    /** Life Cycle */
   if ( activity == 5 || activity == 7 ) {
        form.setEnabled('anoVigencia', false, true);
    }

    if (activity == 0 || activity == 4 || activity == 5) {
        form.setEnabled('orcamentoAprovadoGGR', false, true);
	}

    if ( activity == 7 ) {
        var list = form.getChildrenIndexes("orcamentos");
        for (var i = 0; i < list.length; i++) {
            form.setEnabled("orcamentoTbOrcamentos___"+list[i],false, true);
        }
    }

    

}