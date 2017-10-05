function afterProcessCreate(processId){
    	var today = new Date();
		var yyyy = today.getFullYear();
        var year = parseInt(yyyy) + 1;
        // Seta o ano de vigência seguindo as regras de negócio(ano de abertura do processo + 1)
        hAPI.setCardValue("anoVigencia", year);
        // Trava a abertura de novas solicitações para o ano. 
        hAPI.setCardValue("hasOrcamentoThisYear", "Sim");
        // Grava o número de processos no registro
        hAPI.setCardValue("numProcess", processId);
        // Seta o estado do processo como vazio
        hAPI.setCardValue("processState", "");
}