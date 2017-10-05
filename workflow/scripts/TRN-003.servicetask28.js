function servicetask28(attempt, message) {
 try {
	log.warn('%%%%%% INICIANDO ECMCardService');
	var servico = ServiceManager.getServiceInstance("ECMCardService");
	log.warn('%%%%%% servico: ' + servico);

	var locator = servico.instantiate("com.totvs.technology.ecm.dm.ws.ECMCardServiceService");
	log.warn('%%%%%% locator: ' + locator);

	var portServico = locator.getCardServicePort();
	log.warn('%%%%%% portServico: ' + portServico);

	var user = hAPI.getAdvancedProperty("loginUserWS");
	log.warn('%%%%%% user: ' + user);

	var password = hAPI.getAdvancedProperty("passwdUserWS");
	log.warn('%%%%%% password: ' + password);

	var empresa = parseInt(getValue("WKCompany"));
	log.warn('%%%%%% empresa: ' + empresa + ' TypeOf: ' + typeof empresa);

	// FORM DATA
	
	var orcamentoCount = parseInt(hAPI.getCardValue("tableOrcamentosCount"));
	for ( var i = 1; orcamentoCount >= i ; i++ ) {
		var numSolic = parseInt(hAPI.getCardValue("numeroSolicitacaoTbOrcamentos___"+ i));
		log.warn('%%%%%% NUMERO DA SOLICITACAO: '+ numSolic);
		var cardDocArray = servico.instantiate("com.totvs.technology.ecm.dm.ws.CardFieldDtoArray");
		log.warn('%%%%%% cardDocArray: ' + cardDocArray);
		var docID = parseInt(hAPI.getCardValue("numeroDocIdTbOrcamentos___"+ i));
		//  update state planejamento
		var orcamentoField = servico.instantiate("com.totvs.technology.ecm.dm.ws.CardFieldDto");
		orcamentoField.setField('orcamento');
		orcamentoField.setValue(hAPI.getCardValue("orcamentoTbOrcamentos___"+ i));
		var processState = servico.instantiate("com.totvs.technology.ecm.dm.ws.CardFieldDto");
		processState.setField('processState');
		processState.setValue("EXECUCAO_OK");
		var numProcess = servico.instantiate("com.totvs.technology.ecm.dm.ws.CardFieldDto");
		numProcess.setField('numProcess');
		numProcess.setValue(numSolic);
		cardDocArray.getItem().add(orcamentoField);
		cardDocArray.getItem().add(processState);
		cardDocArray.getItem().add(numProcess);
		log.warn('%%%%%% cardDocArray: ' + cardDocArray);
		portServico.updateCardData(empresa, user, password, docID, cardDocArray);
		log.warn("%%%%% CARD DATA UPDATED!");
	} 

 } catch(error) { 
	log.error('%%%%%% O ERRO ACONTECEU POR: '+error);
	throw error;
 }
}
