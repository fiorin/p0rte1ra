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
	//console.log(dba);
	//console.log(dba.exec);
	/*animal.insert(db,{
			animals: {
				id: 100,
				ring: 1000,
				born: {
					month: 10,
					year: 2016
				},
				grade: 1,
				race: 1,
				mark: 1
			}
		}
	);
	
	methods.openAnimal(db,{
			_id: 'FHq9FWAc3vxExVxT'
		}
	);*/

const events = () => {
	return {
		links: () => {
			let delegate = new Delegate(document);
			delegate.on('click','.link',(event) => {
				event.preventDefault();
				console.log('link');
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

// ---------------------------------------------------------------------------
// All stuff below is just to show you how it works. You can delete all of it.
/*import { remote } from 'electron';
import jetpack from 'fs-jetpack';
import { greet } from './hello_world/hello_world';
import env from './env';

const app = remote.app;
const appDir = jetpack.cwd(app.getAppPath());

// Holy crap! This is browser window with HTML and stuff, but I can read
// here files form disk like it's node.js! Welcome to Electron world :)
const manifest = appDir.read('package.json', 'json');

const osMap = {
  win32: 'Windows',
  darwin: 'macOS',
  linux: 'Linux',
};

document.querySelector('#greet').innerHTML = greet();
document.querySelector('#os').innerHTML = osMap[process.platform];
document.querySelector('#author').innerHTML = manifest.author;
document.querySelector('#env').innerHTML = env.name;
document.querySelector('#electron-version').innerHTML = process.versions.electron;
*/