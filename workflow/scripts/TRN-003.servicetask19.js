function servicetask19(attempt, message) {
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
   
		   /** Form Data */
		   // YEAR
		   var today = new Date();
		   var yyyy = today.getFullYear();
		   var year = parseInt(yyyy) + 1;
		   log.warn('%%%%%% ANO VIGÊNCIA: ' + year);
		   //get DATASET
		   var datasetPlanejamentos = getAllPlanejamentos();
   
		   if ( datasetPlanejamentos.rowsCount > 0 ) {
			   hAPI.setCardValue("anoVigencia", year.toString());
			   for ( var i = 0; datasetPlanejamentos.rowsCount > i ; i++ ) {
				   // obter número da solicitação
				   var numSolic = datasetPlanejamentos.getValue(i, "workflowProcessPK.processInstanceId");	
				   // obtendo um objeto com os valores de cada solicitação de planejamento
				   var solicObj = hAPI.getCardData(numSolic);
				   var anoVigenciaObj = solicObj.get("anoVigencia");
				   if ( anoVigenciaObj == year ) {
					   var situacao = solicObj.get("processState");
					   if ( situacao != "EXECUCAO1" && situacao != "EXECUCAO_OK" && situacao != "CANCELADO" && situacao != "FINALIZADO") {
						   var departamento = solicObj.get("departamento");
						   var estimativa = solicObj.get("totalEstimativa");
						   var documentId = parseInt( solicObj.get("documentid") );
						   //Criando uma row na tabela pai-filho de orcamentos
						   var childData = new java.util.HashMap();
						   childData.put("numeroSolicitacaoTbOrcamentos", numSolic);
						   childData.put("numeroDocIdTbOrcamentos", parseInt(documentId));
						   childData.put("departamentoTbOrcamentos", departamento);
						   childData.put("estimativaTbOrcamentos", estimativa);
						   childData.put("situacao", situacao);
						   log.warn("%%%%% childData: "+childData);
						   hAPI.addCardChild("orcamentos", childData);
   
						   //  update state planejamento
						   var cardDocArray = servico.instantiate("com.totvs.technology.ecm.dm.ws.CardFieldDtoArray");
						   log.warn('%%%%%% cardDocArray: ' + cardDocArray);
						   var planejamentoStateField = servico.instantiate("com.totvs.technology.ecm.dm.ws.CardFieldDto");
						   log.warn("%%%%% planejamentoField: "+planejamentoStateField);
						   planejamentoStateField.setField('processState');
						   planejamentoStateField.setValue("EXECUCAO1");
						   var numProcess = servico.instantiate("com.totvs.technology.ecm.dm.ws.CardFieldDto");
						   numProcess.setField('numProcess');
						   numProcess.setValue(numSolic);
						   cardDocArray.getItem().add(numProcess); 
						   cardDocArray.getItem().add(planejamentoStateField);
						   portServico.updateCardData(empresa, user, password, documentId, cardDocArray);
					   } else {
						   log.warn("%%%%% JÁ FOI ABERTA SOLICITAÇÃO!");			
					   }
				   } else {
					   log.warn("%%%%% NÃO É DO ANO VIGENTE!");			
				   }
			   }
			   
			   log.warn("%%%%% CARD DATA UPDATED!");
			   hAPI.setCardValue("hasOrcamentoThisYear", "Sim");
		   }
		   
   
   
	} catch(error) { 
	   log.error('%%%%%% O ERRO ACONTECEU POR: '+error);
	   throw error;
	}
   }
   
   function getAllPlanejamentos() {
   
	   var c1 = DatasetFactory.createConstraint("processId", "TRN-002", "TRN-002", ConstraintType.MUST);
	   var dataset = DatasetFactory.getDataset('workflowProcess',null,[c1],['workflowProcessPK.processInstanceId']);
	   return dataset;
   }
   