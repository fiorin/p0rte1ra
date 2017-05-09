// Here is the starting point for your application code.

// Small helpers you might want to keep
import './helpers/context_menu.js';
import './helpers/external_links.js';
import { methods } from './core/methods';
import { routes } from './core/methods';
import { errors } from './core/methods';
import { visuals } from './core/methods';
import { forms } from './core/methods';

// using dom-delegate for event delegate
var Delegate = require('dom-delegate');
// using nedb for database storage
var Datastore = require('nedb'),
	db = new Datastore({
		filename: 'database/main.db'
	});
	db.loadDatabase(function(){
	
	});

const events = () => {
	return {
		links: () => {
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
				routes[data.route](data);
			});
		},
		forms: () => {
			let main = document.getElementById('main');
			let delegate = new Delegate(main);
			delegate.on('click','input',(event) => {
				console.log('input');
			});
			delegate.on('submit','#form-animal',(event) => {
				event.preventDefault();
				var animal = forms.animal.register();
				methods.insertAnimal(db,{
					animal: animal
				});
				return false;
			});
		}
	}
}
document.addEventListener('DOMContentLoaded', () => {
	events().forms();
	events().links();
});