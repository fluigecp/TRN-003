function beforeTaskSave(colleagueId,nextSequenceId,userList){
    var atividade = getValue('WKNumState');
	
    if ( atividade == 0 || atividade == 4 ) {
        var year = hAPI.getCardValue("anoVigencia");
        checkOrcamentoThisYear(year);
    }
    
    if( getValue("WKCompletTask") == "true" ){
		atualizaHistorico("obsHistorico");
        log.info("HISTÓRICO ATUALIZADO");
	} else {
        log.info("HISTÓRICO NÃO ATUALIZADO");
    }
    
    function atualizaHistorico(name) {
        if( name == "" ){
            return;
        }
        var mensagem = hAPI.getCardValue(name);

        if(mensagem == null || mensagem == ""){
            return;
        }

        var ultimaAtualizacao = hAPI.getCardValue("ultimaAtualizacao") == "" ? " " : hAPI.getCardValue("ultimaAtualizacao");
        var historico = hAPI.getCardValue("historico")== "" ? " " : hAPI.getCardValue("historico");
        
        var usuarioLogado = "";
        try {
            usuarioLogado = usuario();
        } catch(err){
            usuarioLogado = "Erro ao buscar usuário";
        }

        var htmlHistoricoNovo = dataHoraAtual()+" - "+usuarioLogado+"  \r\n" + mensagem +"\r\n \r\n";
        
        hAPI.setCardValue("ultimaAtualizacao", htmlHistoricoNovo );
                    
        hAPI.setCardValue("historico", ultimaAtualizacao + historico );
        hAPI.setCardValue(name, "" );
    }


    function dataHoraAtual() {
        var dt = new Date();
        var txtData = (dt.getDate() < 10 ? "0" + dt.getDate() : dt.getDate()) + "/" + ((dt.getMonth() + 1) < 10 ? "0" + (dt.getMonth() + 1) : (dt.getMonth() + 1)) + "/" + dt.getFullYear() + " - " + (dt.getHours() < 10 ? "0" + dt.getHours() : dt.getHours()) + ":" + (dt.getMinutes() < 10 ? "0" + dt.getMinutes() : dt.getMinutes());
        return txtData;
    }


    function usuario(){
        var c1 = DatasetFactory.createConstraint("colleaguePK.colleagueId",getValue("WKUser"),getValue("WKUser"),ConstraintType.MUST);
        var dsUser = DatasetFactory.getDataset("colleague",["colleagueName"],[c1],null);
        return dsUser.getValue(0,"colleagueName");
    }
    /**
     * @param {int} year - ano vigente da solicitação
     * @description - Caso já exista um orçamento para o ano informado, 
     * é exibido um mensagem ao usuário.
     */
    function checkOrcamentoThisYear(year) {
		var c1 = DatasetFactory.createConstraint("metadata#active", true, true,ConstraintType.MUST);
		var c2 = DatasetFactory.createConstraint("anoVigencia", year,year,ConstraintType.SHOULD); 
		var c3 = DatasetFactory.createConstraint("processState", "CANCELADO", "CANCELADO",ConstraintType.MUST_NOT);
		var orcamentos = DatasetFactory.getDataset('cadastro_orcamentos',null,[c1,c2,c3],null);
		if ( orcamentos.values.length > 0 ) {
			throw ("Já existe um planejamento de orçamentos anuais para este ano.");
		}
	}

}
