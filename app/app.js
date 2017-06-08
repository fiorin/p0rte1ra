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
Methods.openAnimal = function(data){
	let db = this.db();
	let args = {
		_id: data._id
	};
	db.findOne(args,(err,doc) => {
		doc.sons = [doc,doc];
		doc.mom = doc;
		if(doc._id){
			var translated = {
				sex:   translate(doc.sex,'sex'),
				race:  translate(doc.race,'race'),
				grade: translate(doc.grade,'grade')
			};
			doc.translate = translated;
			Visuals.page.single(doc);
		}else{
			Errors.message('_id not found');
		}
	});
};
Methods.listAnimal = function(args){
	let db = this.db();
	db.find(args,(err,docs) => {
		Visuals.page.list(docs);
	});
};
Methods.removeAnimal = function(data){
	let db = this.db();
	let args = {
		_id: data._id
	};
	if(data.stay){
		Visuals.effects.removeElement(args);
		db.remove(args,(err,doc) => {
			doc && Visuals.effects.feedback({
				msg: "Registro removido com sucesso"
			});
		});
	}else{
		db.remove(args,(err,doc) => {
			Routes.list();
		});
	}
};

const Routes = new ((function(){
	function __constructor(){ let self = this; }
	__constructor.prototype.single = function(data){
		let _id = data._id;
		Methods.openAnimal(data);
	};
	__constructor.prototype.register = function(){
		Visuals.page.register();
	};
	__constructor.prototype.list = function(){
		Methods.listAnimal();
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
	return __constructor
})());

const Visuals = new ((function(){
	function __constructor(){ let self = this; }
	__constructor.prototype.page = {};
	__constructor.prototype.page.single = (doc) => {
		let tmpl = Render.templates("./app/templates/animal_single.html");
		let html = tmpl.render(doc);
		renderString(html,'content');
	};
	__constructor.prototype.page.inserted = (doc) => {
		let html = 'inserido com sucesso';
		renderString(html,'content');
	};
	__constructor.prototype.page.list = (docs) => {
		let tmpl = Render.templates("./app/templates/animal_list.html");
		let html = tmpl.render({docs: docs});
		renderString(html,'content');
	};
	__constructor.prototype.effects = {};
	__constructor.prototype.effects.removeElement = (args) => {
		let _id = args._id;
		let element = document.getElementById('list-'+_id);
		element.classList.add("nodisplay");
	};
	__constructor.prototype.effects.feedback = (args) => {
		let html = '';
		if(args.msg){
			let msg = args.msg;
			let tmpl = Render.templates("./app/templates/feedback.html");
			html = tmpl.render({
				msg: msg,
				color: 'success'
			});
		}
		renderString(html,'feedback');
	};
	return __constructor
})());
Visuals.page.register = function(){
	let tmpl = Render.templates("./app/templates/form_register.html");
	let html = tmpl.render({});
	renderString(html,'content');
};
const Forms = new ((function(){
	function __constructor(){ let self = this; }
	__constructor.prototype.animal = {};
	__constructor.prototype.animal.register = () => {
		let animal,	id, ring, month, year, grade, race, mark, sex;
		ring  = getValueOrNullByName('ring');
		month = getValueOrNullByName('month');
		year  = getValueOrNullByName('year');
		grade = getValueOrNullByName('grade');
		race  = getValueOrNullByName('race');
		mark  = getValueOrNullByName('mark');
		sex   = getValueOrNullByName('sex');
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
		};
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

const getValueOrNullByName = (name) => {
	var element = document.getElementsByName(name);
	console.log(element);
	return (element[0] != undefined) ? element[0].value : null
};

const renderString = (contentHtmlAsString,targetElementId) => {
	var element = document.getElementById(targetElementId);
	element.innerHTML = contentHtmlAsString;
};

const translate = (value,section) => {
	if(!value || value == undefined) return false 
	if(!section) section = 'all';
	if(Translate[section] != undefined && Translate[section][value] != undefined)
		return Translate[section][value]
	else
		return value
};

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
		delegate.on('click','.link',(event) => {
			event.preventDefault();
			let target = event.target;
			let data = target.getAttribute('data-args') || null;
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
		delegate.on('submit','#form-animal',(event) => {
			event.preventDefault();
			var animal = Forms.animal.register();
			Methods.insertAnimal({
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
});

}());
//# sourceMappingURL=app.js.map