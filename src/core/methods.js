let Render = require('jsrender')
let Config = {
	route: 'main'
}

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
Methods.editAnimal = function(data){
	let db = this.db()
	let animal = data.animal
	let query = {
		_id: animal._id
	}
	let options = {
		returnUpdatedDocs: true
	}
	db.update(query,animal,options,(err, numAffected, affectedDocuments) => {
		Visuals.effects.feedback({
			msg: "Registro alterado com sucesso"
		})
		Routes.single(affectedDocuments)
	})
}
Methods.getMom = function(animal){
	let db = this.db()
	return new Promise(function(resolve,reject){
		let args = {
			_id: animal.mom
		}
		db.findOne(args,function(err,doc){
			console.log(doc)
			animal.mom = doc ? doc : null
			console.log(animal)
			resolve(animal)
		})
	})
}
Methods.getDad = function(animal){
	let db = this.db()
	return new Promise(function(resolve,reject){
		let args = {
			_id: animal.dad
		}
		db.findOne(args,function(err,doc){
			animal.dad = doc ? doc : null
			resolve(animal)
		})
	})
}
Methods.openAnimal = function(data){
	let db = this.db()
	let args = {
		_id: data._id
	}
	db.findOne(args,(err,doc) => {
		let animal = doc
		if(animal._id){
			animal = translate(animal)
			Methods.getMom(animal)
			.then(Methods.getDad(animal))
			.then(function(animal){
				console.log(animal)
			})
			/*
			if(animal.mom){
				let args = {
					_id: animal.mom
				}
				db.findOne(args,(err,doc) => {
					if(doc){
						animal.mom = doc
					}
					let args = {
						mom: animal._id
					}
					db.find(args,(err,docs) => {
						if(docs.length){
							animal.sons = docs
						}
						Visuals.page.single(animal)
					});
				});
			}else{
				let args = {
					mom: animal._id
				}
				db.find(args,(err,docs) => {
					if(docs.length){
						animal.sons = docs
					}
					Visuals.page.single(animal)
				});
			}*/
		}else{
			Errors.message('_id not found')
		}
	});
}
Methods.openBull = function(data){
	let db = this.db()
	let args = {
		_id: data._id
	}
	db.findOne(args,(err,doc) => {
		let bull = doc
		if(bull._id){
			bull = translate(bull)
			let args = {
				dad: bull._id
			}
			db.find(args,(err,docs) => {
				if(docs.length){
					bull.sons = docs
				}
				Visuals.page.singleBull(bull)
			});
		}else{
			Errors.message('_id not found')
		}
	});
}
Methods.listAnimal = function(args,list){
	let db = this.db()
	if(args == undefined)
		args = {}
	if(list == undefined)
		list = "list";
	db.find(args,(err,docs) => {
		let eachAnimal = (element, index, array) => {
		    element = translate(element)
		}
		docs.forEach(eachAnimal)
		Visuals.page[list](docs)
	});
}
Methods.removeAnimal = function(data){
	let db = this.db()
	let query = {_id: data._id}
	let options = {returnUpdatedDocs: true}
	let update = {$set:{"status":"trash"}}
	db.update(query,update,options,(err, numAffected, affectedDocuments) => {
		Visuals.effects.feedback({
			msg: "Registro enviado à lixeira"
		})
		if(data.stay != undefined)
			Visuals.effects.removeElement(query)
		else
			Routes.home()
	})
}
Methods.permanentRemoveAnimal = function(data){
	let db = this.db()
	let args = {_id: data._id}
	db.remove(args,(err,doc) => {
		doc && Visuals.effects.feedback({
			msg: "Registro removido com sucesso"
		})
		if(data.stay != undefined)
			Visuals.effects.removeElement(args)
		else
			Routes.home()
	})
}
Methods.listSons = function(args){
	let db = this.db()
	db.find(args,(err,docs) => {
		Visuals.page.list(docs)
	});
}
Methods.prepareRegister = function(){
	let db = this.db()
	let females,males
	db.find({sex: '0'},function(err,females){
		db.find({sex: '2'},function(err,males){
			Visuals.page.register({
				females: females,
				males: males
			})
		});
	});
}
Methods.prepareRegisterBull = function(){
	Visuals.page.registerBull()
}
Methods.prepareRegisterChild = function(data){
	let db = this.db()
	let args = {
		_id: data._id
	}
	db.findOne(args,(err,doc) => {
		doc = translate(doc)
		Visuals.page.registerChild(doc)
	});
}
Methods.prepareEdit = function(data){
	let db = this.db()
	let args = {
		_id: data._id
	}
	db.findOne(args,(err,doc) => {
		doc = translate(doc)
		Visuals.page.edit(doc)
	});
}
Methods.killAnimal = function(data){
	let db = this.db()
	let args = {
		_id: data._id
	}
	db.update(
		args,{$set: {status: 'kill'}},{},
		(err,doc) => {
			var args = {filter:{status:"kill"}};
			Routes.list(args)
			let _id = doc._id
			Visuals.effects.feedback({
				msg: "Registro marcado como abatido"
			})
		}
	)
}
Methods.sellAnimal = function(data){
	let db = this.db()
	let args = {
		_id: data._id
	}
	db.update(
		args,{$set: {status: 'sold'}},{},
		(err,doc) => {
			var args = {filter:{status:"sold"}};
			Routes.list(args)
			let _id = doc._id
			Visuals.effects.feedback({
				msg: "Registro marcado como vendido"
			})
		}
	)
}

export const Routes = new ((function(){
	function __constructor(){ let self = this }
	__constructor.prototype.home = function(){
		Visuals.page.home()
	}
	__constructor.prototype.single = function(data){
		let _id = data._id
		Methods.openAnimal(data)
	}
	__constructor.prototype.singleBull = function(data){
		let _id = data._id
		Methods.openBull(data)
	}
	__constructor.prototype.register = function(){
		Methods.prepareRegister()
	}
	__constructor.prototype.registerBull = function(){
		Methods.prepareRegisterBull()
	}
	__constructor.prototype.registerChild = function(data){
		Visuals.effects.feedback()
		Methods.prepareRegisterChild(data)
	}
	__constructor.prototype.list = function(data){
		Visuals.effects.feedback()
		Config.route = 'list'
		let args = data.filter
		let template = data.template
		Methods.listAnimal(args,template)
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
	__constructor.prototype.permanentRemove = function(data){
		let _id = data._id
		let stay = data.stay
		Methods.permanentRemoveAnimal({
			_id: _id,
			stay: stay
		})
	}
	__constructor.prototype.kill = function(data){
		let _id = data._id
		Methods.killAnimal({
			_id: _id,
		})
	}
	__constructor.prototype.sell = function(data){
		let _id = data._id
		Methods.sellAnimal({
			_id: _id,
		})
	}
	__constructor.prototype.edit = function(data){
		Methods.prepareEdit(data)
	}
	return __constructor
})())

export const Visuals = new ((function(){
	function __constructor(){ let self = this }
	// default page method
	__constructor.prototype.page = {}
	// page home
	__constructor.prototype.page.home = () => {
		console.log('aqui')
		let tmpl = Render.templates("./templates/home.html")
		let html = tmpl.render()
		renderString(html,'content')
		Visuals.effects.route("home")
	}
	// page each animal info
	__constructor.prototype.page.single = (doc) => {
		console.log('animal')
		let tmpl = Render.templates("./templates/single_animal.html")
		let html = tmpl.render(doc)
		renderString(html,'content')
		Visuals.effects.route("single")
	}
	// page each bull info
	__constructor.prototype.page.singleBull = (doc) => {
		let tmpl = Render.templates("./templates/single_bull.html")
		let html = tmpl.render(doc)
		renderString(html,'content')
		Visuals.effects.route("singleBull")
	}
	// page register confirmation
	__constructor.prototype.page.inserted = (doc) => {
		let html = 'inserido com sucesso'
		renderString(html,'content')
	}
	// page animal default list
	__constructor.prototype.page.list = (docs) => {
		let tmpl = Render.templates("./templates/animal_list.html")
		let html = tmpl.render({docs: docs})
		renderString(html,'content')
		Visuals.effects.route("list")
	}
	// page bull default list
	__constructor.prototype.page.listBull = (docs) => {
		let tmpl = Render.templates("./templates/list_bull.html")
		let html = tmpl.render({docs: docs})
		renderString(html,'content')
		Visuals.effects.route("listBull")
	}
	// page bull default list
	__constructor.prototype.page.listSell = (docs) => {
		let tmpl = Render.templates("./templates/list_sell.html")
		let html = tmpl.render({docs: docs})
		renderString(html,'content')
		Visuals.effects.route("listSell")
	}
	// page bull default list
	__constructor.prototype.page.listTrash = (docs) => {
		let tmpl = Render.templates("./templates/list_trash.html")
		let html = tmpl.render({docs: docs})
		renderString(html,'content')
		Visuals.effects.route("listTrash")
	}
	// page register animal default
	__constructor.prototype.page.register = (args) => {
		let tmpl = Render.templates("./templates/form_register.html")
		let html = tmpl.render({
			females: args.females,
			males: args.males
		})
		renderString(html,'content')
		Visuals.effects.route("register")
	}
	// page register bull
	__constructor.prototype.page.registerBull = () => {
		let tmpl = Render.templates("./templates/form_register_bull.html")
		let html = tmpl.render({})
		renderString(html,'content')
		Visuals.effects.route("registerBull")
	}
	// page register animal child direct from single
	__constructor.prototype.page.registerChild = (mom) => {
		let tmpl = Render.templates("./templates/form_register_child.html")
		let html = tmpl.render(mom)
		renderString(html,'content')
		Visuals.effects.route("registerChild")
	}
	// page edit single animal
	__constructor.prototype.page.edit = (animal) => {
		console.log('aqui',animal)
		let tmpl = Render.templates("./templates/form_edit.html")
		let html = tmpl.render(animal)
		renderString(html,'content')
		Visuals.effects.route("edit")
	}
	// default effects method
	__constructor.prototype.effects = {}
	// remove item from animal list
	__constructor.prototype.effects.removeElement = (args) => {
		let _id = args._id
		let element = document.getElementById('list-'+_id)
		element != undefined && element.classList.add("nodisplay")
	}
	// show message feedback page top
	__constructor.prototype.effects.feedback = (args) => {
		let html = ''
		if(args && args.msg){
			let msg = args.msg
			let tmpl = Render.templates("./templates/feedback.html")
			html = tmpl.render({
				msg: msg,
				color: 'success'
			})
		}
		renderString(html,'feedback')
	}
	// show breadcrumbs
	__constructor.prototype.effects.route = (route) => {
		let args = breadcrumb(route)
		let data = args.data || {}
		let label = args.label || null
		let tmpl = Render.templates("./templates/breadcrumb.html")
		let html = tmpl.render({
			label: label,
			data: JSON.stringify(data)
		})
		renderString(html,'breadcrumb')
	}
	return __constructor
})())

export const Forms = new ((function(){
	function __constructor(){ let self = this }
	// default method form based 
	__constructor.prototype.animal = {}
	// mount animal object based on form
	__constructor.prototype.animal.register = (form) => {
		let fields = ['status','reg','_id','ring','day','month','year','grade','race','mark','sex','mom','dad','color','name'] 
		let animal = {}
		let eachElement = (element, index, array) => {
		    if(form[element] != undefined){
		    	animal[element] = form[element].value
		    }
		}
		fields.forEach(eachElement)
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
	return (element[0] != undefined) ? element[0].value : null
}

const renderString = (contentHtmlAsString,targetElementId) => {
	var element = document.getElementById(targetElementId)
	element.innerHTML = contentHtmlAsString
}
 
const translate = (object) => {
	if(object != undefined)
		object.translated = {}
	else
		return {}
	let property
	for(property in object){
		let value = object[property]
		if(Translate[property] != undefined && Translate[property][value] != undefined)
			object.translated[property] = Translate[property][value]
		else
			object.translated[property] = value
	}
	return object
}
const breadcrumb = (target) => {
	if(target == undefined)
		return {}
	return Breadcrumb[target] != undefined ? Breadcrumb[target] : {}
}

const Translate = {
	all: {

	},
	sex: {
		0: 'F',
		1: 'M',
		2: 'M'
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
	},
	color: {
		branco: 'Branca',
		preto: 'Preta',
		vermelho: 'Vermelho'
	}
}

const Breadcrumb = {
	home: {},
	list: {"label": "Listar Animais"},
	listSell: {"label": "Listar Vendas"},
	listKill: {"label": "Listar Baixas"},
	listBull: {"label": "Listar Touros"},
	listTrash: {"label": "Lixeira"},
	single: {"label": "Animal"},
	singleBull: {"label": "Touro"},
	register: {"label": "Cadastrar Animal"},
	registerBull: {"label": "Cadastrar Touro"},
	registerChild: {"label": "Cadastrar Filho"},
	edit: {"label": "Editar Animal"},
	editBull: {"label": "Editar Touro"}
}