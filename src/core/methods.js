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
		Routes.register()
		let _id = doc._id
		Visuals.effects.feedback({
			msg: "Registro adicionado com sucesso"
		})
	})
}
Methods.openAnimal = function(data){
	let db = this.db()
	let args = {
		_id: data._id
	}
	db.findOne(args,(err,doc) => {
		doc.sons = [doc,doc]
		doc.mom = doc
		if(doc._id){
			var translated = {
				sex:   translate(doc.sex,'sex'),
				race:  translate(doc.race,'race'),
				grade: translate(doc.grade,'grade')
			}
			doc.translate = translated
			Visuals.page.single(doc)
		}else{
			Errors.message('_id not found')
		}
	});
}
Methods.listAnimal = function(args){
	let db = this.db()
	db.find(args,(err,docs) => {
		Visuals.page.list(docs)
	});
}
Methods.removeAnimal = function(data){
	let db = this.db()
	let args = {
		_id: data._id
	}
	if(data.stay){
		Visuals.effects.removeElement(args)
		db.remove(args,(err,doc) => {
			doc && Visuals.effects.feedback({
				msg: "Registro removido com sucesso"
			})
		})
	}else{
		db.remove(args,(err,doc) => {
			Routes.list()
		})
	}
}

export const Routes = new ((function(){
	function __constructor(){ let self = this }
	__constructor.prototype.single = function(data){
		let _id = data._id
		Methods.openAnimal(data)
	}
	__constructor.prototype.register = function(){
		Visuals.page.register()
	}
	__constructor.prototype.list = function(){
		Methods.listAnimal()
	}
	__constructor.prototype.inserted = function(doc){
		Visuals.page.inserted(doc)
	}
	__constructor.prototype.remove = function(data){
		let _id = data._id
		let stay = data.stay
		Methods.removeAnimal({
			_id: _id,
			stay: stay
		})
	}
	return __constructor
})())

export const Visuals = new ((function(){
	function __constructor(){ let self = this }
	__constructor.prototype.page = {}
	__constructor.prototype.page.single = (doc) => {
		let tmpl = Render.templates("./app/templates/animal_single.html")
		let html = tmpl.render(doc)
		renderString(html,'content')
	}
	__constructor.prototype.page.inserted = (doc) => {
		let html = 'inserido com sucesso'
		renderString(html,'content')
	}
	__constructor.prototype.page.list = (docs) => {
		let tmpl = Render.templates("./app/templates/animal_list.html")
		let html = tmpl.render({docs: docs})
		renderString(html,'content')
	}
	__constructor.prototype.effects = {}
	__constructor.prototype.effects.removeElement = (args) => {
		let _id = args._id
		let element = document.getElementById('list-'+_id)
		element.classList.add("nodisplay")
	}
	__constructor.prototype.effects.feedback = (args) => {
		let html = ''
		if(args.msg){
			let msg = args.msg
			let tmpl = Render.templates("./app/templates/feedback.html")
			html = tmpl.render({
				msg: msg,
				color: 'success'
			})
		}
		renderString(html,'feedback')
	}
	return __constructor
})())
Visuals.page.register = function(){
	let tmpl = Render.templates("./app/templates/form_register.html")
	let html = tmpl.render({})
	renderString(html,'content')
}
export const Forms = new ((function(){
	function __constructor(){ let self = this }
	__constructor.prototype.animal = {}
	__constructor.prototype.animal.register = () => {
		let animal,	id, ring, month, year, grade, race, mark, sex
		ring  = getValueOrNullByName('ring')
		month = getValueOrNullByName('month')
		year  = getValueOrNullByName('year')
		grade = getValueOrNullByName('grade')
		race  = getValueOrNullByName('race')
		mark  = getValueOrNullByName('mark')
		sex   = getValueOrNullByName('sex')
		animal = {
			ring: ring,
			born: {
				month: month,
				year: year
			},
			grade: grade,
			race: race,
			mark: mark,
			sex: sex
		}
		return animal
	}
	return __constructor
})())

export const Errors = new ((function(){
	function __constructor(){ let self = this }
	__constructor.prototype.message = (message) => {
		console.log(message)
	}
	return __constructor
})())

const getValueOrNullByName = (name) => {
	var element = document.getElementsByName(name)
	console.log(element)
	return (element[0] != undefined) ? element[0].value : null
}

const renderString = (contentHtmlAsString,targetElementId) => {
	var element = document.getElementById(targetElementId)
	element.innerHTML = contentHtmlAsString
}

const translate = (value,section) => {
	if(!value || value == undefined) return false 
	if(!section) section = 'all'
	if(Translate[section] != undefined && Translate[section][value] != undefined)
		return Translate[section][value]
	else
		return value
}

const Translate = {
	all: {

	},
	sex: {
		0: 'F',
		1: 'M'
	},
	race: {
		cruzado:  'Cruzado',
		brangus:  'Brangus',
		nelore:   'Nelore',
		angus:    'Angus',
		limousin: 'Limousin',
		gir:      'Gir',
		simmental:'Simmental',
		holandesa:'Holandês',
		hereford: 'Hereford',
		brahman:  'Brahman',
		outros:   'Outros'
	},
	grade: {
		 1: 'Puro',
		38: '3/8',
		18: '1/8',
		34: '3/4',
		14: '1/4',
		12: '1/2'
	},
	month: {
		 1: 'Janeiro',
		 2: 'Fevereiro',
		 3: 'Março',
		 4: 'Abril',
		 5: 'Maio',
		 6: 'Junho',
		 7: 'Julho',
		 8: 'Agosto',
		 9: 'Setembro',
		10: 'Outubro',
		11: 'Novembro',
		12: 'Dezembro'
	}
}