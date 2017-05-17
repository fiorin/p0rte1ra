export const Methods = new ((function(){
	let database = null
	// Private method
	// return database
	function setDb(db){
		database = db
	}
	// Private method
	// set database
	function getDb(){
		return database
	}
	// Constructor
	function __constructor(){
		let self = this
	}
	// Privileged method
	// set or return database
	__constructor.prototype.db = function(db){
		if(db==undefined)
			return getDb()
		setDb(db)
	}
	return __constructor
})())
// Public method
// args {} info animal
Methods.insertAnimal = function(args){
	let db = this.db()
	let animal = args.animal
	db.insert(animal,(err,doc) => {
		Routes.inserted(doc)
	})
}
Methods.openAnimal = function(args){
	let db = this.db()
	db.findOne(args,(err,doc) => {
		if(doc._id)
			Visuals.page.single(doc);
		else
			Errors.message('_id not found');
	});
}
Methods.listAnimal = function(args){
	let db = this.db()
	db.find(args,(err,docs) => {
		Routes.list(docs);
	});
}

export const Routes = new ((function(){
	// Constructor
	function __constructor(){
		let self = this
	}
	__constructor.prototype.single = function(data){
		let _id = data._id;
		//openAnimal(null,_id);
	}
	__constructor.prototype.register = function(data){
		Visuals.page.register();
	}
	__constructor.prototype.list = function(docs){
		Visuals.page.list(docs);
	}
	__constructor.prototype.inserted = function(doc){
		Visuals.page.inserted(doc);
	}
	return __constructor
})())

export const Visuals = new ((function(){
	function __constructor(){
		let self = this
	}
	__constructor.prototype.page = {}
	__constructor.prototype.page.single = (doc) => {
		let html = '<div id="single"><table><tbody><tr><td>id</td><td>xx</td></tr><tr><td>ring</td><td>xx</td></tr><tr><td>month</td><td>xx</td></tr><tr><td>year</td><td>xx</td></tr><tr><td>grade</td><td>xx</td></tr><tr><td>race</td><td>xx</td></tr><tr><td>mark</td><td>xx</td></tr></tbody></table></div>';
		renderString(html,'main');
	}
	__constructor.prototype.page.inserted = (doc) => {
		let html = 'inserido com sucesso'
		renderString(html,'main')
	}
	__constructor.prototype.page.register = (doc) => {
		let html = '<div id="register"><form action="/" id="form-animal"><input type="text" name="ring" value="999"><input type="text" name="month" value="9"><input type="text" name="year" value="2015"><input type="text" name="grade" value="1"><input type="text" name="race" value="2"><input type="text" name="mark" value="3"><input type="submit" value="enviar"></form></div>';
		renderString(html,'main');
	}
	__constructor.prototype.page.list = (docs) => {
		let list = '';
		if(docs && docs.length > 0){
			for(eachDoc in docs){
				list += '<li class="col-2">xx</li><li class="col-2">xx</li><li class="col-2">xx</li><li class="col-2">xx</li><li class="col-2"><a href="#">Visualizar</a></li>';
			}
		}else{
			list = '<li class="col-10">Nenhum cadastro até o momento</li>';
		}
		let html = '<div id="list"><ul class="animals"><li><ul class="each-animal-head"><li class="col-2">Brinco</li><li class="col-2">Marca</li><li class="col-2">Raça</li><li class="col-2">Nascimento</li><li class="col-2">Ações</li></ul></li><li><ul class="each-animal"'+list+'</ul></li></ul></div>';
		renderString(html,'main');
	}
	return __constructor
})())

export const Forms = new ((function(){
	function __constructor(){
		let self = this
	}
	__constructor.prototype.animal = {}
	__constructor.prototype.animal.register = () => {
		let animal,	id, ring, month, year, grade, race, mark;
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
	return __constructor
})())

export const Errors = new ((function(){
	function __constructor(){
		let self = this
	}
	__constructor.prototype.message = (message) => {
		console.log(message);
	}
	return __constructor
})())

const getValueOrNullByName = (name) => {
	var element = document.getElementsByName(name);
	return (element[0] != undefined) ? element[0].value : null;
}

const renderString = (contentHtmlAsString,targetElementId) => {
	var element = document.getElementById(targetElementId);
	element.innerHTML = contentHtmlAsString;
}