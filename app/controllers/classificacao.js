var caminhoBanco = '/db/dbSoccerMoball.sqlite';
var nomeBanco = 'dbSoccerMoball.sqlite';

var db1 = Ti.Database.install(caminhoBanco, nomeBanco);

var xhr = Ti.Network.createHTTPClient();

xhr.onerror = function(e) {
	if(e.error != "Socket is closed")
		alert('ERROR: SEM CONEXÃO COM A INTERNET. VERIFIQUE SUA REDE.');
	//alert(e.error);
};

xhr.onload = function() {

	var rows = [];
	
	var times = JSON.parse(this.responseText);
	var arrayNumTimes = [];
	arrayNumTimes = Object.keys(times);
	var arrayTimesOrdenado = [];
	
	var espacoEsquerdaFoto = 30;	
	
	//Ordenação dos times por posição
	for(var cont=1; cont<=20; cont++){
		for(var i=0; i<arrayNumTimes.length; i++){
			var numeroTime = arrayNumTimes[i];
			if(cont == times[numeroTime].posicao){
				arrayTimesOrdenado.push(times[numeroTime]);
			}
		}					
	}
	console.log(arrayTimesOrdenado);
	// var arrayNumTimesNovo = [];
	// arrayNumTimesNovo = Object.keys(arrayTimesOrdenado);
	console.log(arrayTimesOrdenado.length);
	for(var i=0; i<arrayTimesOrdenado.length; i++){
		//console.log(times[arrayNumTimes[i]].nome);		
		var time = arrayTimesOrdenado[i];
		var escudo = time.escudos["60x60"];
		
		var caminhoImgStar = '/img/star-empty.png';

		if (escudo != "") {
			
			var row = Ti.UI.createTableViewRow({
				height: 105
			});
			
			//VIEW POSICAO
			var labelPosicao = Ti.UI.createLabel({
				text: time.posicao + "º",
				left: espacoEsquerdaFoto,
				top: 10				
			});
			
			var labelDesClassificacao = Ti.UI.createLabel({
				text: L('lugar'),
				left: 5,
				top: 10				
			});

			var viewPosicao = Ti.UI.createView({
				width : Ti.UI.SIZE,
				height : Ti.UI.SIZE,
				layout : 'horizontal'
			});
			//FIM VIEW POSICAO		
			
			//VIEW DADOS
			var labelAbrev = Ti.UI.createLabel({
				text: time.abreviacao,
				left: espacoEsquerdaFoto
			});
			
			var labelNomeTime = Ti.UI.createLabel({
				text: time.nome,
				left: espacoEsquerdaFoto
			});
			
			var viewDados = Ti.UI.createView({
				width : Ti.UI.SIZE,
				height: Ti.UI.SIZE,
				layout: 'vertical'
			}); 
			
			viewDados.add(viewPosicao);			
			viewDados.add(labelAbrev);
			viewDados.add(labelNomeTime);
			//FIM VIEW DADOS
			
			var view = Ti.UI.createView({
				width : Ti.UI.FILL,
				height : Ti.UI.SIZE,
				layout : 'horizontal'
			});

			var image = Ti.UI.createImageView({
				height : 93,
				widht : 69,
				left : 5,
				top : 5,
				bottom : 5,
				image : escudo
			});
			
			//VIEW DIREITA
			var viewDireita = Ti.UI.createView({
				width: Ti.UI.FILL,
				height: Ti.UI.SIZE,
				layout: 'vertical'
			});
			
			//verificando se existe o time já salvo em favoritos
			var sql = 'SELECT des_nome FROM tb_favorito WHERE des_nome = "' + time.nome + '"';
			Ti.API.info(sql);
			var rs = db1.execute('SELECT des_nome FROM tb_favorito WHERE des_nome = "' + time.nome + '"');								
			while(rs.isValidRow()){
				var nome = rs.fieldByName('des_nome');
				if(nome == time.nome){
					caminhoImgStar = '/img/star-full.png';
				}
				rs.next();				
			}
			rs.close();
			
			var botaoSalvar = Ti.UI.createButton({
				 //title: 'Salvar Time',
				 backgroundImage: caminhoImgStar,
				 width:30,
				 height:30,
				 top: 35,
				 right:20,
				 _time: time				 
			});
			
						
			botaoSalvar.addEventListener('click', function(e)
			{
				var abreviacao = e.source._time.abreviacao;
				var nome       = e.source._time.nome;
				var caminhoImg = e.source._time.escudos["60x60"];
				
				//validacao se está cadastrando
				var sql = db1.execute('SELECT des_nome FROM tb_favorito');	
				var time = '';	
				var naoCadastrado = true;			
				while(sql.isValidRow()){
					var nomeTimeBanco = sql.fieldByName('des_nome');
					if(nomeTimeBanco == nome){
						naoCadastrado = false;
						// alert(nomeTimeBanco +' já está em favoritos');
						var dialog = Ti.UI.createAlertDialog({						    
						    buttonNames: ['OK'],
						    message: nomeTimeBanco + L('ja_esta_em_favoritos'),
						    title: L('aviso')
						  });
						  
						  dialog.show();												
					}
					
					time = time + ' \n ' + sql.fieldByName('des_nome');
					sql.next();
				}	
							
				if(naoCadastrado){
					db1.execute("INSERT INTO tb_favorito (des_nome, des_sigla, des_caminho) VALUES ('"+ nome +"', '"+ abreviacao +"', '"+ caminhoImg +"')");
					Ti.API.info(nome + ' salvo em favoritos.');
				}
								
				sql.close();
				Ti.API.info(time);
				//FIM validacao
				// var msg = nome +' salvo em favoritos.';		
				//alert(msg);
			});
			
			viewDireita.add(botaoSalvar);
			//FIM VIEW DIREITA
			
			viewPosicao.add(labelPosicao);
			viewPosicao.add(labelDesClassificacao);			
			view.add(image);
			view.add(viewDados);
			view.add(viewDireita);			
			row.add(view);
			rows.push(row);
		}
	};
	
	$.myTableView.data = rows;
	
};

xhr.open('GET', 'https://api.cartolafc.globo.com/clubes');
xhr.send();

function callClassificacao(){	
	// var ctrl = Alloy.createController('index');
	// ctrl.getView().open();	
	xhr.send();
}
