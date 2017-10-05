var activity = 0,
    modo = '',
    data = new Date(),
	currentLocation = document.location.origin;

	$(document).ready(function(){
			activity = getAtividade();
			modo = getFormMode();

			console.log("Activity: ", activity);
			console.log("Modo: ", modo);
			/**
			 * Funções de validações
			 */

			$('.expand').on('click ', function(event) {
				event.preventDefault();
				var type = $(this).prop('tagName');
				var classe = ($(this).attr('class')).indexOf('expand');
				$(this).css('resize', 'none');
				if (classe > -1) {
					$(this).show('slow', function() {
						$(this).css({
							'display': 'block',
							'overflow-y': 'hidden'
						});
						expandTextarea(this.id);
					});
				}
			});



			/** Início - Life Cycle */
			if ( activity == 0 || activity == 4 ) {
				$("#anoVigencia").val( parseInt( getToday().year ) + 1 );
				//var departamentos = getDepartamentosService();
				var year = $("#anoVigencia").val();
				$("#hasOrcamentoThisYear").val( hasOrcamentoThisYear(year) ? "Sim" : "Não");
				/*$(departamentos).each(function (i, obj) {
					var row = wdkAddChild('orcamentos');
					$("#departamentoTbOrcamentos___"+row).val(obj.dpto);
				})*/;
				
				//getTreinamentos( $("#anoVigencia").val() );
				addStylesAndActions();
				$(".orcamentoTbOrcamentos").on('change', function() {
					atualizarSomatoriaOrcamento();
				});
				$("#anoVigencia").on("change", function(){
					$(".numeroSolicitacaoTbOrcamentos").each(function(){
						$(this).val("");
					});
					$(".estimativaTbOrcamentos").each(function(){
						$(this).val("");
					});
					$("#hasOrcamentoThisYear").val( hasOrcamentoThisYear($(this).val()) ? "Sim" : "Não");
					//getTreinamentos( $(this).val() );
					atualizarSomatoriaEstimativa();
				});
				atualizarSomatoriaEstimativa();
			} else 
			
			if ( activity == 5 ) {
				//getTreinamentos( $("#anoVigencia").val() );
				atualizarSomatoriaEstimativa();
				addStylesAndActions();
				$(".orcamentoTbOrcamentos").on('change', function() {
					atualizarSomatoriaOrcamento();
				});
			}

			if ( activity == 7 || activity == 11 ) {
				addStylesAndActions();
			}

			if ( modo == 'VIEW' ) {
				addStylesAndActions();
			}

			//habilitar popovers
			var htmlPopover = 	'<span style="font-weight: bold;">Status da solicitação</span><br><br>' +
								'<span class="label label-success">&nbsp; </span>&nbsp; Aguardando P.O <br><br>'+
								'<span class="label label-warning">&nbsp; </span>&nbsp; Em andamento <br><br>'+
								'<span class="label label-danger">&nbsp; </span>&nbsp; Cancelado <br><br>';
			FLUIGC.popover('.bs-docs-popover-hover', {
				trigger: 'hover',
				placement: 'auto',
				content: htmlPopover,
				html: true
			});
		
			
			/** Fim - Life Cycle */
	});
	


	/* Funções utilizadas durante o ciclo de vida do form */

	function expandTextarea(id) {
		var element = document.getElementById(id);
		if (element.scrollHeight != null) {
			var altura = element.scrollHeight + 'px';
			$(element).animate({
			overflow: 'hidden',
			height: 0,
			height: altura
		});
		}
	}

	function loadCalendar (obj, data) {
		var pkDate = false,
			pkTime = false,
			pkMinutes = false;

		if (data == 'date') {
			pkDate = true;

			FLUIGC.calendar('#'+obj.id, {
				pickDate: pkDate, 
				pickTime: pkTime, 
				useMinutes: pkMinutes, 
				useSeconds: false, 
				useCurrent: true,
				minuteStepping: 1,
				minDate: '1/1/2010',
				maxDate: '1/1/2215',
				showToday: true,
				language: 'pt-br',
				defaultDate: "",
				disabledDates: arrayDates(),
				useStrict: false,
				sideBySide: false,
				daysOfWeekDisabled: [0]
			});
		}else if (data == 'hour') {
			pkTime = true;
			pkMinutes = true;
			FLUIGC.calendar('#'+obj.id, {
				pickDate: pkDate, 
				pickTime: pkTime,
			});
		}
	}
	function arrayDates() {
		var date = new Date();
		var day = date.getDate()-1;
		var month = date.getMonth()+1;
		var ano = date.getFullYear();
		var arrayDate = [];

		for (var i = ano; i > 2009; i--) {
			var months = (i > ano - 1) ? month : 12;
			for (var j = months; j > 0; j--) {
				var days = (i > ano - 1) && month == j ? day : 31;
				for (var k = days; k > 0; k--) {
					var dayFinish = k < 10 ? '0'+k : k;
					var monthFinish = j < 10 ? '0'+j : j;
					arrayDate.push(dayFinish+'/'+monthFinish+'/'+i);
			}
				}
		}
		return arrayDate;
	}
	
	function converteParaFloat(variavel) {
		if (variavel == "") {return parseFloat(0);}
		if (variavel.indexOf("R$") > -1) {variavel = variavel.replace("R$ ", "");}
		while (variavel.indexOf(".") != -1) {variavel = variavel.replace(".", "");}

		return parseFloat(variavel.replace(",", "."));
	}

	//Detalhe dos parametros
	//n = numero a converter
	//c = numero de casas decimais
	//d = separador decimal
	//t = separador milhar
	function numeroParaMoeda(n, c, d, t) {
		//no final de cada linha é virgula mesmo, pois todas as variaveis sao do mesmo tipo
		c = isNaN(c = Math.abs(c)) ? 2 : c, d = d == undefined ? "," : d, t = t == undefined ? "." : t, s = n < 0 ? "-" : "", i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", j = (j = i.length) > 3 ? j % 3 : 0;
		return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
	}

	// Retorna a data do dia 
	function getToday () {
		var today = new Date();
		var dd = today.getDate();
		var mm = today.getMonth()+1; //January is 0!
		var yyyy = today.getFullYear();
		if(dd<10) {
			dd='0'+dd
		} 
		if(mm<10) {
			mm='0'+mm
		} 
		return {
			"date": dd+'/'+mm+'/'+yyyy,
			"day": dd,
			"month": mm,
			"year" : yyyy
		};
	}

	/**
	 * @description -  Calcula e atualiza a somatória dos orçamentos dos planejamentos dos treinamentos
	 */
	function atualizarSomatoriaOrcamento() {
		var current = 0;
		var somatoria = 0;
		$('.orcamentoTbOrcamentos').each(function () {
			current = converteParaFloat($(this).val());
			somatoria += current;
		});
		$('#totalOrcamento').val(numeroParaMoeda(somatoria));
	}
	
	/**
	 * @description -  Calcula e atualiza a somatória das estimativas dos planejamentos dos treinamentos
	 */
	function atualizarSomatoriaEstimativa() {
		var current = 0;
		var somatoria = 0;
		$('.estimativaTbOrcamentos').each(function () {
			current = converteParaFloat($(this).val());
			var status = $(this).closest(".tableBodyRow").find('input[name^="situacao___"]').val();
			somatoria += status != "CANCELADO" ? current : 0;
		});
		$('#totalEstimativa').val(numeroParaMoeda(somatoria));
	}

	/**
	 * @description - Adiciona estilos e ação ao botão conforme o estado de cada planejamento.
	 */

	function addStylesAndActions() {
		$("#orcamentos .table-orcamentos tbody tr:not(:first-child)").each(function (){
			var numSolicitacao = $(this).closest(".tableBodyRow").find('input[name^="numeroSolicitacaoTbOrcamentos___"]').val();
			var status = $(this).closest(".tableBodyRow").find('input[name^="situacao___"]').val();
			$(this).closest(".tableBodyRow").find('button[name^="btnSolicitacao___"],button[name="btnSolicitacao"] ')
				.html( numSolicitacao )
				.addClass( getButtonClass( status ) )
				.addClass("bs-docs-popover-hover")
				.off("click")
				.on("click", function(e){
					e.preventDefault();
					window.open(currentLocation+"/portal/p/1/pageworkflowview?app_ecm_workflowview_detailsProcessInstanceID="
								+numSolicitacao ,"_blank");
				});
			if ( status == "CANCELADO" ) {
				$(this).closest(".tableBodyRow").find('input[name^="orcamentoTbOrcamentos___"]').attr("readonly", true);
				//$(this).closest(".tableBodyRow").find('input[name^="orcamentoTbOrcamentos___"]').val("0,00");
			}
		});
	}
	
	//Histórico

	function expandTextarea(id) {
		var objTextArea = document.getElementById(id);

		if(objTextArea.scrollHeight > objTextArea.offsetHeight){
			objTextArea.rows += 1;
			
		}
	}

	function mostraHistorico() {
		var historico = 'historico';
		document.getElementById(historico).style.display = 'inline';
		expandTextarea(historico);
	}
	/**
	 * 
	 * @param {string} state - Estado do processo
	 * @returns {string} - Classe CSS.
	 * @description - Retorna a classe CSS conforme o estado da aplicação. 
	 */
	function getButtonClass(state) {
		var classeButton = '';
		switch(state) {
			case "ANDAMENTO": 
				classeButton = "btn-warning";
				break;
			case "CANCELADO": 
				classeButton = "btn-danger";
				break;
			case "OK":
				classeButton = "btn-success";
				break;
			case "EXECUCAO":
				classeButton = "btn-success";
				break;
		}
		return classeButton;
	}

	//Fim do histórico


	/** SERVICES */

	/**
	 * @deprecated - Este método não é mais utilizado desde que foi implementado o serviço para criação
	 * da tabela automaticamente.
	 * @returns {object[]} - Array de departamentos.
	 * @description - Retorna objeto com todos os departamentos do dataset.
	 * 
	 */
	function getDepartamentosService() { 
		var c1 = DatasetFactory.createConstraint("metadata#active", true, true,ConstraintType.MUST);	
		var data = DatasetFactory.getDataset("cadastro_departamento", ["CodDepartamento", "departamento",
											 "matResponsavelDpto", "responsavelDpto"], [c1], ["departamento"]);
		var departamentos = [];
		var objValor = {};
		for (var i = 0 ; i < data.values.length; i++) {
			objValor = 
			{
				cod_dpto: data.values[i]["CodDepartamento"],
				dpto: data.values[i]["departamento"],
				mat_responsavel_dpto: data.values[i]["matResponsavelDpto"],
				responsavel_dpto: data.values[i]["responsavelDpto"]
			};
			departamentos.push(objValor);
		}
		return departamentos;
	}

	/**
	 * @param {int} year - ano de vigência do processo a ser pesquisado
	 * @description - Obtem as informações dos treinamentos propostos e popula a tabela pai-filho.
	 */
	function getTreinamentos(year) {
		var c1 = DatasetFactory.createConstraint("metadata#active", true, true,ConstraintType.MUST);
		var c2 = DatasetFactory.createConstraint("processState", "FINALIZADO", "FINALIZADO",ConstraintType.MUST_NOT);
		var c3 = DatasetFactory.createConstraint("anoVigencia", year, year,ConstraintType.SHOULD);
		var dataset = DatasetFactory.getDataset("propor_treinamentos_anuais",null,[c1,c2,c3],['documentid']);
		var index = dataset.values.length;
		if (index > 0) {
			$(dataset.values).each(function (i, obj) {
				var row = wdkAddChild('orcamentos');
				$("#numeroSolicitacaoTbOrcamentos___"+row).val(obj.numProcess);
				$("#situacao___"+row).val(obj.processState);
				$("#departamentoTbOrcamentos___"+row).val(obj.departamento);
				$("#estimativaTbOrcamentos___"+row).val(obj.totalEstimativa == "" ? "0,00" : obj.totalEstimativa);
			});
		}
	}
	/**
	 * 
	 * @param {int} year - ano de vigência do processo a ser pesquisado
	 * @returns {boolean} - 'true' caso haja um planejamento de orçamentos no ano vigênte informado, 
	 * retorna 'false' caso contrário.
	 * @description - Verifica se existe um planejamento de orçamentos no ano vigente informado.
	 */
	function hasOrcamentoThisYear(year) {
		console.log("year ",year);
		var c1 = DatasetFactory.createConstraint("metadata#active", true, true,ConstraintType.MUST);
		var c2 = DatasetFactory.createConstraint("anoVigencia", year,year,ConstraintType.MUST); 
		var c3 = DatasetFactory.createConstraint("processState", "CANCELADO", "CANCELADO", ConstraintType.MUST_NOT);
		var orcamentos = DatasetFactory.getDataset('cadastro_orcamentos',null,[c1,c2,c3],null);
		console.log(orcamentos);
		if ( orcamentos.values.length > 0 ) {
			return true;
		} else {
			return false;
		}
	}
