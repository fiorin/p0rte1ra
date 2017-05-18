// Here is the starting point for your application code.

// Small helpers you might want to keep
import './helpers/context_menu.js';
import './helpers/external_links.js';
//import { Methods } from './core/methods';
import { Routes }  from './core/methods';
import { Errors }  from './core/methods';
import { Visuals } from './core/methods';
import { Forms }   from './core/methods';
import { Methods } from './core/methods';


// using dom-delegate for event delegate
let Delegate = require('dom-delegate')
// using nedb for database storage
let Datastore = require('nedb'),
	db = new Datastore({
		filename: 'database/main.db'
	});
	db.loadDatabase(function(){
		Methods.db(db)
	});

const Events = new ((function(){
	function __constructor(){
		let self = this
	}
	__constructor.prototype.links = () => {
		let delegate = new Delegate(document);
		delegate.on('click','.link',(event) => {
			event.preventDefault();
			let target = event.target;
			let data = target.getAttribute('data-args') || null;
			if(Array.isArray(data)){
				data = data[0] && JSON.parse(data[0]);
			}else{
				data = JSON.parse(data);
			}
			Routes[data.route](data);
		});
	}
	__constructor.prototype.forms = () => {
		let main = document.getElementById('main');
		let delegate = new Delegate(main);
		delegate.on('click','input',(event) => {
			console.log('input');
		});
		delegate.on('submit','#form-animal',(event) => {
			event.preventDefault();
			var animal = forms.animal.register();
			Methods.insertAnimal(db,{
				animal: animal
			});
			return false;
		});
	}
	return __constructor
})())
document.addEventListener('DOMContentLoaded', () => {
	Events.forms();
	Events.links();
});