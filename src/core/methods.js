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
			db.insert(animal,function(err,doc){
				// callback err
				// doc new reg
			});
		},
		openAnimal: (db,args) => {
			//args._id || return; 
			db.findOne(args,function(err,doc){
				if(doc._id)
					routes.single(doc)
				else
					errors.message('_id not found');
			});
		}
	}
})();

export const forms = (() => {
	return {
		animal: {
			register: () => {
				var animal,	id, ring, month, year, grade, race, mark;
				id    = getValueOrNullByName('id')
				ring  = getValueOrNullByName('ring');
				month = getValueOrNullByName('month');
				year  = getValueOrNullByName('year');
				grade = getValueOrNullByName('grade');
				race  = getValueOrNullByName('race');
				mark  = getValueOrNullByName('mark');
				animal = {
					id: id,
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
		single: (doc) => {
			console.log('single');
			visuals.page.single(doc)
		},
		register: () => {
			visuals.page.register();
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
				console.log('page single',doc._id);
			},
			register: () => {
				var html = '<div id="register"><form action="/" id="form-animal"><input type="text" name="ring" value="999"><input type="text" name="month" value="9"><input type="text" name="year" value="2015"><input type="text" name="grade" value="1"><input type="text" name="race" value="2"><input type="text" name="mark" value="3"><input type="submit" value="enviar"></form></div>';
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