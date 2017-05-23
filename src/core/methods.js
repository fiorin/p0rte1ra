let Render = require('jsrender')

export const Methods = new ((function(){
	let database = null
	function setDb(db){	database = db }
	function getDb(){ return database }
	function __constructor(){ let self = this }
	__constructor.prototype.db = function(db){
		if(db==undefined)
			return getDb()
		setDb(db)
	}
	return __constructor
})())
Methods.insertAnimal = function(data){
	let db = this.db()
	let animal = data.animal
	db.insert(animal,(err,doc) => {
		Routes.inserted(doc)
	})
}
Methods.openAnimal = function(data){
	let db = this.db()
	let args = {
		_id: data._id
	}
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
		Visuals.page.list(docs);
	});
}

export const Routes = new ((function(){
	// Constructor
	function __constructor(){ let self = this }
	__constructor.prototype.single = function(data){
		let _id = data._id;
		Methods.openAnimal(data);
	}
	__constructor.prototype.register = function(){
		Visuals.page.register();
	}
	__constructor.prototype.list = function(){
		Methods.listAnimal()
	}
	__constructor.prototype.inserted = function(doc){
		Visuals.page.inserted(doc);
	}
	return __constructor
})())

export const Visuals = new ((function(){
	function __constructor(){ let self = this }
	__constructor.prototype.page = {}
	__constructor.prototype.page.single = (doc) => {
		let tmpl = Render.templates("./app/templates/animal_single.html")
		let html = tmpl.render(doc)
		renderString(html,'content');
	}
	__constructor.prototype.page.inserted = (doc) => {
		let html = 'inserido com sucesso'
		renderString(html,'content')
	}
	__constructor.prototype.page.list = (docs) => {
		let tmpl = Render.templates("./app/templates/animal_list.html")
		let html = tmpl.render({docs: docs})
		renderString(html,'content');
	}
	return __constructor
})())
Visuals.page.register = function(){
	let tmpl = Render.templates("./app/templates/form_register.html")
	let html = tmpl.render({})
	renderString(html,'content');
}
export const Forms = new ((function(){
	function __constructor(){ let self = this }
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
	function __constructor(){ let self = this }
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