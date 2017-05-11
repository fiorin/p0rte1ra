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

const methods = (() => {
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
			db.insert(animal,(err,doc) => {
				// callback err
				// doc new reg
			});
		},
		openAnimal: (db,args) => {
			//args._id || return; 
			db.findOne(args,(err,doc) => {
				if(doc._id)
					routes.single(doc);
				else
					errors.message('_id not found');
			});
		},
		listAnimal: (bd,args) => {
			db.find(args,(err,docs) => {
				routes.list(docs);
			});
		}
	}
})();

const forms = (() => {
	return {
		animal: {
			register: () => {
				var animal,	id, ring, month, year, grade, race, mark;
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
				};
				return animal;
			}
		}
	}
})();

const routes = (() => {
	return {
		single: (data) => {
			//methods.
			//var _id = data._id;
			//var doc = null;
			visuals.page.single(doc);
		},
		register: () => {
			visuals.page.register();
		},
		list: (docs) => {
			visuals.page.list(docs);
		}
	}
})();

const errors = (() => {
	return {
		message: (message) => {
			console.log(message);
		}
	}
})();

const visuals = (() => {
	return {
		page: {
			single: (doc) => {
				var html = '<div id="single"><table><tbody><tr><td>id</td><td>xx</td></tr><tr><td>ring</td><td>xx</td></tr><tr><td>month</td><td>xx</td></tr><tr><td>year</td><td>xx</td></tr><tr><td>grade</td><td>xx</td></tr><tr><td>race</td><td>xx</td></tr><tr><td>mark</td><td>xx</td></tr></tbody></table></div>';
				renderString(html,'main');
			},
			register: () => {
				var html = '<div id="register"><form action="/" id="form-animal"><input type="text" name="ring" value="999"><input type="text" name="month" value="9"><input type="text" name="year" value="2015"><input type="text" name="grade" value="1"><input type="text" name="race" value="2"><input type="text" name="mark" value="3"><input type="submit" value="enviar"></form></div>';
				renderString(html,'main');
			},
			list: (docs) => {
				var list = '';
				if(docs && docs.length > 0){
					for(eachDoc in docs){
						list += '<li class="col-2">xx</li><li class="col-2">xx</li><li class="col-2">xx</li><li class="col-2">xx</li><li class="col-2"><a href="#">Visualizar</a></li>';
					}
				}else{
					list = '<li class="col-10">Nenhum cadastro até o momento</li>';
				}
				var html = '<div id="list"><ul class="animals"><li><ul class="each-animal-head"><li class="col-2">Brinco</li><li class="col-2">Marca</li><li class="col-2">Raça</li><li class="col-2">Nascimento</li><li class="col-2">Ações</li></ul></li><li><ul class="each-animal"'+list+'</ul></li></ul></div>';
				renderString(html,'main');
			}
		}
	}
})();

const getValueOrNullByName = (name) => {
	var element = document.getElementsByName(name);
	return (element[0] != undefined) ? element[0].value : null;
};

const renderString = (contentHtmlAsString,targetElementId) => {
	var element = document.getElementById(targetElementId);
	element.innerHTML = contentHtmlAsString;
};

// Here is the starting point for your application code.

// Small helpers you might want to keep
// using dom-delegate for event delegate
var Delegate = require('dom-delegate');
// using nedb for database storage
var Datastore = require('nedb');
var db$1 = new Datastore({
		filename: 'database/main.db'
	});
	db$1.loadDatabase(function(){
	
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
				methods.insertAnimal(db$1,{
					animal: animal
				});
				return false;
			});
		}
	}
};
document.addEventListener('DOMContentLoaded', () => {
	events().forms();
	events().links();
});

}());
//# sourceMappingURL=app.js.map