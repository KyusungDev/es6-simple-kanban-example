import './index.css';

const idGenerator = () => (new Date()).getTime().toString();
const mandatory = () => { throw new Error('Missing parameter') };

const baseUrl = `https://js-study.firebaseio.com`;
const urlCards = `/kanban/cards`;
const urlInventories = `/kanban/inventories`;

const createElt = (name, attributes, ...children) => {
	let node = document.createElement(name);
  
	if (typeof attributes === 'object' && attributes !== null) {
    for (let [key, value] of Object.entries(attributes)) {
			node.setAttribute(key, value);
  	}
	}
  
  children.forEach((child) => {
  	if (typeof child === 'string') {
    	child = document.createTextNode(child);
    }
    node.appendChild(child);
  });
 
  return node;
}

const toggleEditable = (target) => {
  let span = target;
  let textbox = span.querySelector('input');
  if (textbox) {
  	span.textContent = textbox.value;
  } else {
    let newTextbox = createElt('input', { type: 'text', value: span.textContent });
    span.textContent = '';
    span.appendChild(newTextbox);
  }
}

class Http {
  static request(method, url, data) {
    return new Promise(function(resolve, reject) {
      var xhr = new XMLHttpRequest();
      xhr.onload  = function() {	
      	 (xhr.status === 200) ? resolve(xhr.responseText) : reject(new Error(xhr.statusText));
      }
      xhr.onerror = function() { reject(new Error("Network Error")); };
      xhr.open(method, url);
      xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
      xhr.send(data);
    });
  }
}

class Firebase {
	static get(id) {
    return Http.request('GET', `${baseUrl}${id}.json`);
  }
  static delete(id) {
    return Http.request('DELETE', `${baseUrl}${id}.json`);
  }
  static put(id, data) {
    return Http.request('PUT', `${baseUrl}${id}/.json`, JSON.stringify(data));
  }
  static patch(id, data) {
    return Http.request('PATCH', `${baseUrl}${id}/.json`, JSON.stringify(data));
  }
}

class Node {
	constructor(parent = mandatory(), id = mandatory(), name = mandatory()) {
  	this._id = id;
    this._name = name;
  	this._html = '';
    this._parent = parent;
  	this._children = [];
    this._contents = '';
  }
  get id() {
  	return this._id;
  }
  set id(id) {
  	this._id = id;
  }
  get name() {
  	return this._name;
  }
  set name(name) {
  	this._name = name;
  }
  get html() {
  	return this._html;
  }
  set html(html) {
  	this._html = html;
  }
  get parent() {
  	return this._parent;
  }
  set parent(parent) {
  	this._parent = parent;
  }
  get children() {
  	return this._children;
  }
 	set children(children) {
  	this._children = children;
  }
  get contents() {
  	return this._contents;
  }
  set contents(contents) {
  	if (!(contents instanceof Element)) {
    	throw new Error('You must use DOM elements');
    }
  	this._contents = contents;
  }
  addChild(node = required()) {
  	if (node instanceof Node) {
    	this._children.push(node);
    }
  }
  removeChild(node = required()) {
  	if (node instanceof Node) {
    	this._children.splice(this._children.indexOf(node), 1);
    }
  }
  removeChildren() {
  	this._children = [];
  }
  findChild(id) {
  	return this._children.find(element => element.id === id);
  }
  render() {
    this.onRender();
    this._children.forEach(element => element.render());
  }
  onRender() {
  }
}

class Card extends Node {
	constructor(parent, id, name) {
  	super(parent, id.toString(), name);
    
    let btnEditTitle = createElt('button', null, 'Edit');
    let btnDelCard = createElt('button', null, 'Del');
    let contents = createElt('span', { class: 'card-name' }, this.name);
    let wrap = createElt('div', { class: 'card', id: this.id, draggable: true }, contents, btnEditTitle, btnDelCard);
    
    btnEditTitle.onclick = (event) => this.onClickEdit(event);
    btnDelCard.onclick = (event) => this.parent.removeCard(this);

    this.html = wrap;
    this.contents = contents;
  }
  onClickEdit(event) {
    let textbox = event.target.previousSibling;
    toggleEditable(textbox);
    
    if (textbox.querySelector('input') === null && this.name !== textbox.textContent) {
    	Firebase.patch(`${urlCards}/${this.parent.id}`, { [this.id]: textbox.textContent }) 
      	.then(res => {
          let data = JSON.parse(res) || {};
          this.name = data[this.id];
          this.render();
        });
    }
  }
  update() {
    Firebase.get(`${urlCards}/${this.parent.id}/${this.id}`)
    	.then(res => {
        let data = JSON.parse(res) || {};
        this.name = data[this.id];
        this.render();
      });
  }
  onRender() {
  	this.contents.textContent = this.name;
  }
}

class Inventory extends Node {
	constructor(parent, id, name) {
  	super(parent, id.toString(), name);
    
    let header = createElt('span', { class: 'inventory-header' }, this.name);
    let textbox = createElt('input', { type: 'text', class: 'input-card-name'});
    let contents = createElt('div', { class: 'card-contents-area'});
    let btnAddCard = createElt('button', null, 'Add');
    let btnEditTitle = createElt('button', null, 'Edit');
    let btnDelInven = createElt('button', null, 'Del');
    let input = createElt('div', null, textbox, btnAddCard);
    let wrap = createElt('div', { class: 'inventory', id: this.id }, header, btnEditTitle, btnDelInven, contents, input);
    
    btnAddCard.onclick = (event) => this.onClickAddCard(event);
    btnEditTitle.onclick = (event) => this.onClickEdit(event);
    btnDelInven.onclick = (event) => this.onClickDel(event);
 
    wrap.addEventListener('dragstart', (e) => {
      let card = this.findChild(e.target.id);
    	let obj = JSON.stringify( { id: card.id, parent: card.parent.id });
    	e.dataTransfer.setData('data', obj);
    });
    wrap.addEventListener('dragover', (e) => e.preventDefault());
    wrap.addEventListener('drop', (e) => this.onDropCard(e));
  
    this.html = wrap;
    this.contents = contents;
  }
  onDropCard(event) {
  	event.preventDefault();
    
    let data = JSON.parse(event.dataTransfer.getData('data'));
    if (data === null || data === undefined) return;
     
    let oldInventory = this.parent.findChild(data.parent);
    if (oldInventory === null || oldInventory === undefined) return;
   
   	let oldCard = oldInventory.findChild(data.id);
    if (oldCard === undefined) return;
		    
    let target = event.target;      
    let targetIndex = this.children.length;
    let targetCard = target;
 
   	if (target.className === 'card-name') {
    	targetCard = target.parentElement;
      targetIndex = this.children.findIndex(element => element.id === targetCard.id);
    }
    
    let newCard = new Card(this, idGenerator(), oldCard.name);
    this.children.splice(targetIndex, 0, newCard);
    
    if (this.id === oldInventory.id) {
      this.removeChild(oldCard);
    } else {
      oldInventory.removeCard(oldCard);
    }

    this.update();
  }
  onClickEdit(event) {
    let textbox = event.target.previousSibling;
    toggleEditable(textbox);
    
    if (textbox.querySelector('input') === null && this.name !== textbox.textContent) {
    	Firebase.patch(`${urlInventories}/${this.parent.id}`, { [this.id]: { name: textbox.textContent } })
      	.then(res => {
          let data = JSON.parse(res) || {};
          this.name = data.name;
        });
    }
  }
  onClickDel(event) {
   	this.parent.removeInventory(this);
  }
  onClickAddCard(event) {
  	let textbox = this.html.querySelector('.input-card-name');
    let text = textbox.value;
    if (text === '') return;
		textbox.value = '';
    
    this.addChild(new Card(this, this.children.length, text));
    this.update();
	}
  removeCard(card) {
  	this.removeChild(card);
  	this.update();
  }
  update() {
    let cards = this.children.map(element => element.name);
    Firebase.patch(`${urlCards}`, { [this.id]: cards })
    	.then(res => {
        let data = JSON.parse(res);
        let cards = data[this.id] || [];

        this.removeChildren();
        cards.forEach((element, index) => this.addChild(new Card(this, index, element)));
        this.render();
      });
  }
  onRender() {
  	this.contents.textContent = '';
  	this.children.forEach(element => this.contents.appendChild(element.html));
  }
}


class Board extends Node {	
	constructor(parent, id, name) {
  	super(parent, id.toString(), name);
    
    let btnAddInven = createElt('button', null, 'Add');
    let textbox = createElt('input', { type: 'text' });
    let contents = createElt('div', { class: 'inventory-contents-area'});
    let header = createElt('div', { class: 'board-header'}, textbox, btnAddInven);
    let wrap = createElt('div', { class: 'board' }, header, contents);
    
    btnAddInven.onclick = (event) => this.onClickAddInventory(event);
    
    this.html = wrap;
   	this.contents = contents;
  }
  onClickAddInventory(event) {
  	let textbox = this.html.querySelector('input');
    let text = textbox.value;

    if (text === '') return;
    textbox.value = '';
    
    let inventory = new Inventory(this, idGenerator(), text);
    this.addChild(inventory);
    
    Firebase.patch(`${urlInventories}/${this.id}`, { [inventory.id]: { name: inventory.name } })
    	.then(res => {
        this.render();
      });
  }
  removeInventory(inventory) {
  	Firebase.delete(`${urlInventories}/${inventory.parent.id}/${inventory.id}`)
      .then(res => {
        this.removeChild(inventory);
        this.render();

        return Firebase.delete(`${urlCards}/${inventory.id}`);
      })
      .then(res => {});
  }
  update() {
  	this.removeChildren();
    
    Firebase.get('/kanban')
      .then(res => {
        let kanban = JSON.parse(res) || {};
        console.log(kanban);
        let inventories = kanban.hasOwnProperty('inventories') ? kanban.inventories[this.id] : {};
        Object.keys(inventories).forEach((key) => this.addChild(new Inventory(this, key, inventories[key].name)));
				
        this.children.forEach((inventory) => {
          let cards = kanban.hasOwnProperty('cards') ? kanban.cards[inventory.id] : [];
          if (cards === undefined) return;
          cards.forEach((element, index) => inventory.addChild(new Card(inventory, index, element)));
        });
        
        this.render();
     		console.log(this.children);
      })
  }
  onRender() {
  	this.contents.textContent = ''
		this.children.forEach(element => this.contents.appendChild(element.html));
  }
}

let board = new Board(window, '111', 'board');
board.update();
document.getElementById('app').appendChild(board.html);
