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

const getValueOrNullByName = (name) => {
	var element = document.getElementsByName(name);
	return (element[0] != undefined) ? element[0].value : null;
}

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
			}
		}
	}
})();