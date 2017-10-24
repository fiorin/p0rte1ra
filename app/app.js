(function () {'use strict';

var electron = require('electron');

// This gives you default context menu (cut, copy, paste)
// in all input fields and textareas across your app.

const Menu = electron.remote.Menu;
const MenuItem = electron.remote.MenuItem;

const isAnyTextSelected = () => {
  return window.getSelection().toString() !== '';
};

const cut = new MenuItem({
  label: 'Cut',
  click: () => {
    document.execCommand('cut');
  },
});

const copy = new MenuItem({
  label: 'Copy',
  click: () => {
    document.execCommand('copy');
  },
});

const paste = new MenuItem({
  label: 'Paste',
  click: () => {
    document.execCommand('paste');
  },
});

const normalMenu = new Menu();
normalMenu.append(copy);

const textEditingMenu = new Menu();
textEditingMenu.append(cut);
textEditingMenu.append(copy);
textEditingMenu.append(paste);

document.addEventListener('contextmenu', (event) => {
  switch (event.target.nodeName) {
    case 'TEXTAREA':
    case 'INPUT':
      event.preventDefault();
      textEditingMenu.popup(electron.remote.getCurrentWindow());
      break;
    default:
      if (isAnyTextSelected()) {
        event.preventDefault();
        normalMenu.popup(electron.remote.getCurrentWindow());
      }
  }
}, false);

// Convenient way for opening links in external browser, not in the app.
// Useful especially if you have a lot of links to deal with.
//
// Usage:
//
// Every link with class ".js-external-link" will be opened in external browser.
// <a class="js-external-link" href="http://google.com">google</a>
//
// The same behaviour for many links can be achieved by adding
// this class to any parent tag of an anchor tag.
// <p class="js-external-link">
//    <a href="http://google.com">google</a>
//    <a href="http://bing.com">bing</a>
// </p>

const supportExternalLinks = (event) => {
  let href;
  let isExternal = false;

  const checkDomElement = (element) => {
    if (element.nodeName === 'A') {
      href = element.getAttribute('href');
    }
    if (element.classList.contains('js-external-link')) {
      isExternal = true;
    }
    if (href && isExternal) {
      electron.shell.openExternal(href);
      event.preventDefault();
    } else if (element.parentElement) {
      checkDomElement(element.parentElement);
    }
  };

  checkDomElement(event.target);
};

document.addEventListener('click', supportExternalLinks, false);

let Render = require('jsrender');
let Config = {
	route: 'main'
};

const Methods = new ((function(){
	let database = null;
	function setDb(db){	database = db; }
	function getDb(){ return database }
	function __constructor(){ let self = this; }
	__constructor.prototype.db = function(db){
		if(db==undefined)
			return getDb()
		setDb(db);
	};
	return __constructor
})());
Methods.insertAnimal = function(data){
	let db = this.db();
	let animal = data.animal;
	db.insert(animal,(err,doc) => {
		Routes.register();
		let _id = doc._id;
		Visuals.effects.feedback({
			msg: "Registro adicionado com sucesso"
		});
	});
};
Methods.editAnimal = function(data){
	let db = this.db();
	let animal = data.animal;
	let query = {
		_id: animal._id
	};
	let options = {
		returnUpdatedDocs: true
	};
	db.update(query,animal,options,(err, numAffected, affectedDocuments) => {
		Visuals.effects.feedback({
			msg: "Registro alterado com sucesso"
		});
		Routes.single(affectedDocuments);
	});
};
Methods.openAnimal = function(data){
	let db = this.db();
	let args = {
		_id: data._id
	};
	db.findOne(args,(err,doc) => {
		let animal = doc;
		if(animal._id){
			animal = translate(animal);
			if(animal.mom){
				let args = {
					_id: animal.mom
				};
				db.findOne(args,(err,doc) => {
					if(doc){
						animal.mom = doc;
					}
					let args = {
						mom: animal._id
					};
					db.find(args,(err,docs) => {
						if(docs.length){
							animal.sons = docs;
						}
						Visuals.page.single(animal);
					});
				});
			}else{
				let args = {
					mom: animal._id
				};
				db.find(args,(err,docs) => {
					if(docs.length){
						animal.sons = docs;
					}
					Visuals.page.single(animal);
				});
			}
		}else{
			Errors.message('_id not found');
		}
	});
};
Methods.openBull = function(data){
	let db = this.db();
	let args = {
		_id: data._id
	};
	db.findOne(args,(err,doc) => {
		let bull = doc;
		if(bull._id){
			bull = translate(bull);
			let args = {
				dad: bull._id
			};
			db.find(args,(err,docs) => {
				if(docs.length){
					bull.sons = docs;
				}
				Visuals.page.singleBull(bull);
			});
		}else{
			Errors.message('_id not found');
		}
	});
};
Methods.listAnimal = function(args,list){
	let db = this.db();
	if(args == undefined)
		args = {};
	if(list == undefined)
		list = "list";
	db.find(args,(err,docs) => {
		let eachAnimal = (element, index, array) => {
		    element = translate(element);
		};
		docs.forEach(eachAnimal);
		Visuals.page[list](docs);
	});
};
Methods.removeAnimal = function(data){
	let db = this.db();
	let query = {
		_id: data._id
	};
	let options = {
		returnUpdatedDocs: true
	};
	let update = { 
		$set: { "status": "trash" }
	};
	if(data.stay){
		Visuals.effects.removeElement(args);
		//db.remove(args,(err,doc) => {
		//	doc && Visuals.effects.feedback({
		//		msg: "Registro removido com sucesso"
		//	})
		//})
		db.update(query,update,options,(err, numAffected, affectedDocuments) => {
			Visuals.effects.feedback({
				msg: "Registro enviado à lixeira"
			});
			Routes.home();
		});
	}else{
		db.update(query,update,options,(err, numAffected, affectedDocuments) => {
			Visuals.effects.feedback({
				msg: "Registro enviado à lixeira"
			});
			Routes.home();
		});
		//db.remove(args,(err,doc) => {
		//	Routes.home()
		//})
	}
};
Methods.listSons = function(args){
	let db = this.db();
	db.find(args,(err,docs) => {
		Visuals.page.list(docs);
	});
};
Methods.prepareRegister = function(){
	let db = this.db();
	let females,males;
	db.find({sex: '0'},function(err,females){
		db.find({sex: '2'},function(err,males){
			Visuals.page.register({
				females: females,
				males: males
			});
		});
	});
};
Methods.prepareRegisterBull = function(){
	Visuals.page.registerBull();
};
Methods.prepareRegisterChild = function(data){
	let db = this.db();
	let args = {
		_id: data._id
	};
	db.findOne(args,(err,doc) => {
		doc = translate(doc);
		Visuals.page.registerChild(doc);
	});
};
Methods.prepareEdit = function(data){
	let db = this.db();
	let args = {
		_id: data._id
	};
	db.findOne(args,(err,doc) => {
		doc = translate(doc);
		Visuals.page.edit(doc);
	});
};
Methods.killAnimal = function(data){
	let db = this.db();
	let args = {
		_id: data._id
	};
	db.update(
		args,{$set: {status: 'kill'}},{},
		(err,doc) => {
			var args = {filter:{status:"kill"}};
			Routes.list(args);
			let _id = doc._id;
			Visuals.effects.feedback({
				msg: "Registro marcado como abatido"
			});
		}
	);
};
Methods.sellAnimal = function(data){
	let db = this.db();
	let args = {
		_id: data._id
	};
	db.update(
		args,{$set: {status: 'sold'}},{},
		(err,doc) => {
			var args = {filter:{status:"sold"}};
			Routes.list(args);
			let _id = doc._id;
			Visuals.effects.feedback({
				msg: "Registro marcado como vendido"
			});
		}
	);
};

const Routes = new ((function(){
	function __constructor(){ let self = this; }
	__constructor.prototype.home = function(){
		Visuals.page.home();
	};
	__constructor.prototype.single = function(data){
		let _id = data._id;
		Methods.openAnimal(data);
	};
	__constructor.prototype.singleBull = function(data){
		let _id = data._id;
		Methods.openBull(data);
	};
	__constructor.prototype.register = function(){
		Methods.prepareRegister();
	};
	__constructor.prototype.registerBull = function(){
		Methods.prepareRegisterBull();
	};
	__constructor.prototype.registerChild = function(data){
		Visuals.effects.feedback();
		Methods.prepareRegisterChild(data);
	};
	__constructor.prototype.list = function(data){
		Visuals.effects.feedback();
		Config.route = 'list';
		let args = data.filter;
		let template = data.template;
		Methods.listAnimal(args,template);
	};
	__constructor.prototype.inserted = function(doc){
		Visuals.page.inserted(doc);
	};
	__constructor.prototype.remove = function(data){
		let _id = data._id;
		let stay = data.stay;
		Methods.removeAnimal({
			_id: _id,
			stay: stay
		});
	};
	__constructor.prototype.kill = function(data){
		let _id = data._id;
		Methods.killAnimal({
			_id: _id,
		});
	};
	__constructor.prototype.sell = function(data){
		let _id = data._id;
		Methods.sellAnimal({
			_id: _id,
		});
	};
	__constructor.prototype.edit = function(data){
		Methods.prepareEdit(data);
	};
	return __constructor
})());

const Visuals = new ((function(){
	function __constructor(){ let self = this; }
	// default page method
	__constructor.prototype.page = {};
	// page home
	__constructor.prototype.page.home = () => {
		console.log('aqui');
		let tmpl = Render.templates("./templates/home.html");
		let html = tmpl.render();
		renderString(html,'content');
		Visuals.effects.route("home");
	};
	// page each animal info
	__constructor.prototype.page.single = (doc) => {
		console.log('animal');
		let tmpl = Render.templates("./templates/single_animal.html");
		let html = tmpl.render(doc);
		renderString(html,'content');
		Visuals.effects.route("single");
	};
	// page each bull info
	__constructor.prototype.page.singleBull = (doc) => {
		let tmpl = Render.templates("./templates/single_bull.html");
		let html = tmpl.render(doc);
		renderString(html,'content');
		Visuals.effects.route("singleBull");
	};
	// page register confirmation
	__constructor.prototype.page.inserted = (doc) => {
		let html = 'inserido com sucesso';
		renderString(html,'content');
	};
	// page animal default list
	__constructor.prototype.page.list = (docs) => {
		let tmpl = Render.templates("./templates/animal_list.html");
		let html = tmpl.render({docs: docs});
		renderString(html,'content');
		Visuals.effects.route("list");
	};
	// page bull default list
	__constructor.prototype.page.listBull = (docs) => {
		let tmpl = Render.templates("./templates/list_bull.html");
		let html = tmpl.render({docs: docs});
		renderString(html,'content');
		Visuals.effects.route("listBull");
	};
	// page bull default list
	__constructor.prototype.page.listSell = (docs) => {
		let tmpl = Render.templates("./templates/list_sell.html");
		let html = tmpl.render({docs: docs});
		renderString(html,'content');
		Visuals.effects.route("listSell");
	};
	// page bull default list
	__constructor.prototype.page.listTrash = (docs) => {
		let tmpl = Render.templates("./templates/list_trash.html");
		let html = tmpl.render({docs: docs});
		renderString(html,'content');
		Visuals.effects.route("listTrash");
	};
	// page register animal default
	__constructor.prototype.page.register = (args) => {
		let tmpl = Render.templates("./templates/form_register.html");
		let html = tmpl.render({
			females: args.females,
			males: args.males
		});
		renderString(html,'content');
		Visuals.effects.route("register");
	};
	// page register bull
	__constructor.prototype.page.registerBull = () => {
		let tmpl = Render.templates("./templates/form_register_bull.html");
		let html = tmpl.render({});
		renderString(html,'content');
		Visuals.effects.route("registerBull");
	};
	// page register animal child direct from single
	__constructor.prototype.page.registerChild = (mom) => {
		let tmpl = Render.templates("./templates/form_register_child.html");
		let html = tmpl.render(mom);
		renderString(html,'content');
		Visuals.effects.route("registerChild");
	};
	// page edit single animal
	__constructor.prototype.page.edit = (animal) => {
		console.log('aqui',animal);
		let tmpl = Render.templates("./templates/form_edit.html");
		let html = tmpl.render(animal);
		renderString(html,'content');
		Visuals.effects.route("edit");
	};
	// default effects method
	__constructor.prototype.effects = {};
	// remove item from animal list
	__constructor.prototype.effects.removeElement = (args) => {
		let _id = args._id;
		let element = document.getElementById('list-'+_id);
		element.classList.add("nodisplay");
	};
	// show message feedback page top
	__constructor.prototype.effects.feedback = (args) => {
		let html = '';
		if(args && args.msg){
			let msg = args.msg;
			let tmpl = Render.templates("./templates/feedback.html");
			html = tmpl.render({
				msg: msg,
				color: 'success'
			});
		}
		renderString(html,'feedback');
	};
	// show breadcrumbs
	__constructor.prototype.effects.route = (route) => {
		let args = breadcrumb(route);
		let data = args.data || {};
		let label = args.label || null;
		let tmpl = Render.templates("./templates/breadcrumb.html");
		let html = tmpl.render({
			label: label,
			data: JSON.stringify(data)
		});
		renderString(html,'breadcrumb');
	};
	return __constructor
})());

const Forms = new ((function(){
	function __constructor(){ let self = this; }
	// default method form based 
	__constructor.prototype.animal = {};
	// mount animal object based on form
	__constructor.prototype.animal.register = (form) => {
		let fields = ['status','reg','_id','ring','day','month','year','grade','race','mark','sex','mom','dad','color','name']; 
		let animal = {};
		let eachElement = (element, index, array) => {
		    if(form[element] != undefined){
		    	animal[element] = form[element].value;
		    }
		};
		fields.forEach(eachElement);
		return animal
	};
	return __constructor
})());

const Errors = new ((function(){
	function __constructor(){ let self = this; }
	__constructor.prototype.message = (message) => {
		console.log(message);
	};
	return __constructor
})());

const renderString = (contentHtmlAsString,targetElementId) => {
	var element = document.getElementById(targetElementId);
	element.innerHTML = contentHtmlAsString;
};
 
const translate = (object) => {
	if(object != undefined)
		object.translated = {};
	else
		return {}
	let property;
	for(property in object){
		let value = object[property];
		if(Translate[property] != undefined && Translate[property][value] != undefined)
			object.translated[property] = Translate[property][value];
		else
			object.translated[property] = value;
	}
	return object
};
const breadcrumb = (target) => {
	if(target == undefined)
		return {}
	return Breadcrumb[target] != undefined ? Breadcrumb[target] : {}
};

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
};

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
};

// Here is the starting point for your application code.

// Small helpers you might want to keep
//import { Methods } from './core/methods';
// using dom-delegate for event delegate
let Delegate = require('dom-delegate');
// using nedb for database storage
let Datastore = require('nedb');
let db = new Datastore({
		filename: 'database/main.db'
	});
	db.loadDatabase(function(){
		Methods.db(db);
	});

const Events = new ((function(){
	function __constructor(){
		let self = this;
	}
	__constructor.prototype.links = () => {
		let delegate = new Delegate(document);
		delegate.on('click','.link',function(event){
			event.preventDefault();
			//let target = event.target
			let data = this.dataset.args || null;
			if(Array.isArray(data))
				data = data[0] && JSON.parse(data[0]);
			else
				data = JSON.parse(data);
			Routes[data.route](data);
		});
	};
	__constructor.prototype.forms = () => {
		let main = document.getElementById('main');
		let delegate = new Delegate(main);
		delegate.on('click','input',(event) => {

		});
		delegate.on('submit','#form-animal',function(event){
			event.preventDefault();
			var animal = Forms.animal.register(this);
			Methods.insertAnimal({
				animal: animal
			});
			return false
		});
		delegate.on('submit','#form-animal-edit',function(event){
			event.preventDefault();
			var animal = Forms.animal.register(this);
			Methods.editAnimal({
				animal: animal
			});
			return false
		});
	};
	return __constructor
})());
document.addEventListener('DOMContentLoaded', () => {
	Events.forms();
	Events.links();
	Visuals.page.home();
});

}());
//# sourceMappingURL=app.js.map