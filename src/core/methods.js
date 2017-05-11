export const methods = (() => {
	return {
		/*insert: (db,args) => {
				//var reg = [].shift.apply(args);
				var animal = args.animals,
					feedback = {type: 'success',message: 'inserted'};
				return;
				db.insert(animal,function(err,doc){
					// callback err
					// doc new reg
					feedback = {type: 'error',message: err}
				});
				return feedback;
			},
			remove: (db,args) => {

			},*/
		insertAnimal: (db,args) => {
			console.log('insertAnimal');
			var animal = args.animal;
			db.insert(animal,(err,doc) => {
				// callback err
				// doc new reg
			});
		},
		openAnimal: (db,args) => {
			//args._id || return; 
			db.findOne(args,(err,doc) => {
				if(doc._id)
					routes.single(doc);
				else
					errors.message('_id not found');
			});
		},
		listAnimal: (bd,args) => {
			db.find(args,(err,docs) => {
				routes.list(docs);
			});
		}
	}
})();

export const forms = (() => {
	return {
		animal: {
			register: () => {
				var animal,	id, ring, month, year, grade, race, mark;
				ring  = getValueOrNullByName('ring');
				month = getValueOrNullByName('month');
				year  = getValueOrNullByName('year');
				grade = getValueOrNullByName('grade');
				race  = getValueOrNullByName('race');
				mark  = getValueOrNullByName('mark');
				animal = {
					ring: ring,
					born: {
						month: month,
						year: year
					},
					grade: grade,
					race: race,
					mark: mark
				}
				return animal;
			}
		}
	}
})();

export const routes = (() => {
	return {
		single: (data) => {
			//methods.
			//var _id = data._id;
			//var doc = null;
			visuals.page.single(doc)
		},
		register: () => {
			visuals.page.register();
		},
		list: (docs) => {
			visuals.page.list(docs);
		}
	}
})();

export const errors = (() => {
	return {
		message: (message) => {
			console.log(message);
		}
	}
})();

export const visuals = (() => {
	return {
		page: {
			single: (doc) => {
				var html = '<div id="single"><table><tbody><tr><td>id</td><td>xx</td></tr><tr><td>ring</td><td>xx</td></tr><tr><td>month</td><td>xx</td></tr><tr><td>year</td><td>xx</td></tr><tr><td>grade</td><td>xx</td></tr><tr><td>race</td><td>xx</td></tr><tr><td>mark</td><td>xx</td></tr></tbody></table></div>';
				renderString(html,'main');
			},
			register: () => {
				var html = '<div id="register"><form action="/" id="form-animal"><input type="text" name="ring" value="999"><input type="text" name="month" value="9"><input type="text" name="year" value="2015"><input type="text" name="grade" value="1"><input type="text" name="race" value="2"><input type="text" name="mark" value="3"><input type="submit" value="enviar"></form></div>';
				renderString(html,'main');
			},
			list: (docs) => {
				var list = '';
				if(docs && docs.length > 0){
					for(eachDoc in docs){
						list += '<li class="col-2">xx</li><li class="col-2">xx</li><li class="col-2">xx</li><li class="col-2">xx</li><li class="col-2"><a href="#">Visualizar</a></li>';
					}
				}else{
					list = '<li class="col-10">Nenhum cadastro até o momento</li>';
				}
				var html = '<div id="list"><ul class="animals"><li><ul class="each-animal-head"><li class="col-2">Brinco</li><li class="col-2">Marca</li><li class="col-2">Raça</li><li class="col-2">Nascimento</li><li class="col-2">Ações</li></ul></li><li><ul class="each-animal"'+list+'</ul></li></ul></div>';
				renderString(html,'main');
			}
		}
	}
})();

const getValueOrNullByName = (name) => {
	var element = document.getElementsByName(name);
	return (element[0] != undefined) ? element[0].value : null;
}

const renderString = (contentHtmlAsString,targetElementId) => {
	var element = document.getElementById(targetElementId);
	element.innerHTML = contentHtmlAsString;
}