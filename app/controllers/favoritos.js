var nomeBanco = 'dbSoccerMoball.sqlite';

function abrirFavoritos(){
	//alert('Favoritos');
	var db = Ti.Database.open(nomeBanco);
	
	var rowsFavorito = [];
	var espacoEsquerdaFoto = 30;
	
	var sql = db.execute('SELECT id, des_nome, des_sigla, des_caminho FROM tb_favorito');	
			
	while(sql.isValidRow()){
		var idTime = sql.fieldByName('id');
		var nomeTime = sql.fieldByName('des_nome');
		var siglaTime = sql.fieldByName('des_sigla');
		var caminhoImg = sql.fieldByName('des_caminho');
		
		var time = {
			id    : idTime,
			nome  : nomeTime,
			sigla : siglaTime,
			escudo: caminhoImg
		};
		
		//criando linha no tableView
		var row = Ti.UI.createTableViewRow({
			height: 105
		});
		//criado uma view PAI
		var viewFavorito = Ti.UI.createView({
			height: Ti.UI.SIZE,
			width: Ti.UI.FILL,
			layout: 'horizontal'			
		});
		//criando o escudo do time
		var imgTime = Ti.UI.createImageView({
			height : 96,
			widht : 72,
			left : 5,
			top : 5,
			bottom : 5,
			image : caminhoImg
		});
		//adicionando a imagem na viewFavorito
		viewFavorito.add(imgTime);
		
		//criando view do MEIO
		var viewMeio = Ti.UI.createView({
			height: Ti.UI.SIZE,
			width: Ti.UI.SIZE,
			layout: 'vertical'
		});
		//criando label com o nome do time
		var labelNome = Ti.UI.createLabel({
			text: nomeTime,
			left: espacoEsquerdaFoto
		});
		//criando label com a sigla do time
		var labelSigla = Ti.UI.createLabel({
			text: siglaTime,
			left: espacoEsquerdaFoto
		});
		//adicionando na viewMeio a label nome e sigla
		viewMeio.add(labelSigla);
		viewMeio.add(labelNome);
		
		//criando view da direita
		var viewDireita = Ti.UI.createView({
			width: Ti.UI.FILL,
			height: Ti.UI.SIZE,
			layout: 'vertical'
		});
		//criando botao icon de info
		var botaoIconInfo = Ti.UI.createButton({				
				 backgroundImage: '/img/icon-info.png',
				 width:30,
				 height:30,
				 top: 15,
				 right:20				 
		});
		//criando botao icon de apagar
		var botaoIconApagar = Ti.UI.createButton({				
				 backgroundImage: '/img/icon-trash.png',
				 width:30,
				 height:30,
				 top: 15,
				 right:20,
				 _time: time				 
		});		

		//adicionando na viewDireita os botões 
		viewDireita.add(botaoIconInfo);
		viewDireita.add(botaoIconApagar);
		
		botaoIconApagar.addEventListener('click', function(e){
			var nomeTime = e.source._time.nome;
			var idTime = e.source._time.id;
		  	var dialog = Ti.UI.createAlertDialog({
			    cancel: 1,
			    buttonNames: [L('sim'), L('nao')],
			    message: L('deseja_excluir_favoritos'),
			    title: L('excluir_time') + nomeTime
			  });
			  dialog.addEventListener('click', function(e){
			
				if (e.index != 1) {
					Ti.API.info('Apagando time ' + nomeTime + ' dos favoritos.');
					var db = Ti.Database.open(nomeBanco);
					var queryDel = 'DELETE FROM tb_favorito WHERE id = ' + idTime;
					db.execute(queryDel);
					db.close();
					abrirFavoritos();
				}

			  });
			  dialog.show();
			
			// var queryDel = 'DELETE FROM tb_favorito WHERE id = ' + e.source._time.id;
			// db.execute(queryDel);
			
		});
				
		viewFavorito.add(viewMeio);
		viewFavorito.add(viewDireita);
		row.add(viewFavorito);
		rowsFavorito.push(row);
		sql.next();
	}				
	sql.close();
	db.close();
	
	$.myTableViewFavorito.data = rowsFavorito;
}

