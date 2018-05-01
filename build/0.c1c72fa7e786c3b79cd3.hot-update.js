webpackHotUpdate(0,{

/***/ 77:
/***/ (function(module, exports) {

	'use strict';

	var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

	var _get = function get(_x6, _x7, _x8) { var _again = true; _function: while (_again) { var object = _x6, property = _x7, receiver = _x8; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x6 = parent; _x7 = property; _x8 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var idGenerator = function idGenerator() {
	  return new Date().getTime().toString();
	};
	var mandatory = function mandatory() {
	  throw new Error('Missing parameter');
	};

	var baseUrl = 'https://js-study.firebaseio.com';
	var urlCards = '/kanban/cards';
	var urlInventories = '/kanban/inventories';

	var createElt = function createElt(name, attributes) {
	  for (var _len = arguments.length, children = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
	    children[_key - 2] = arguments[_key];
	  }

	  var node = document.createElement(name);

	  if (typeof attributes === 'object' && attributes !== null) {
	    var _iteratorNormalCompletion = true;
	    var _didIteratorError = false;
	    var _iteratorError = undefined;

	    try {
	      for (var _iterator = Object.entries(attributes)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	        var _step$value = _slicedToArray(_step.value, 2);

	        var key = _step$value[0];
	        var value = _step$value[1];

	        node.setAttribute(key, value);
	      }
	    } catch (err) {
	      _didIteratorError = true;
	      _iteratorError = err;
	    } finally {
	      try {
	        if (!_iteratorNormalCompletion && _iterator['return']) {
	          _iterator['return']();
	        }
	      } finally {
	        if (_didIteratorError) {
	          throw _iteratorError;
	        }
	      }
	    }
	  }

	  children.forEach(function (child) {
	    if (typeof child === 'string') {
	      child = document.createTextNode(child);
	    }
	    node.appendChild(child);
	  });

	  return node;
	};

	var toggleEditable = function toggleEditable(target) {
	  var span = target;
	  var textbox = span.querySelector('input');
	  if (textbox) {
	    span.textContent = textbox.value;
	  } else {
	    var newTextbox = createElt('input', { type: 'text', value: span.textContent });
	    span.textContent = '';
	    span.appendChild(newTextbox);
	  }
	};

	var Http = (function () {
	  function Http() {
	    _classCallCheck(this, Http);
	  }

	  _createClass(Http, null, [{
	    key: 'request',
	    value: function request(method, url, data) {
	      return new Promise(function (resolve, reject) {
	        var xhr = new XMLHttpRequest();
	        xhr.onload = function () {
	          xhr.status === 200 ? resolve(xhr.responseText) : reject(new Error(xhr.statusText));
	        };
	        xhr.onerror = function () {
	          reject(new Error("Network Error"));
	        };
	        xhr.open(method, url);
	        xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
	        xhr.send(data);
	      });
	    }
	  }]);

	  return Http;
	})();

	var Firebase = (function () {
	  function Firebase() {
	    _classCallCheck(this, Firebase);
	  }

	  _createClass(Firebase, null, [{
	    key: 'get',
	    value: function get(id) {
	      return Http.request('GET', '' + baseUrl + id + '.json');
	    }
	  }, {
	    key: 'delete',
	    value: function _delete(id) {
	      return Http.request('DELETE', '' + baseUrl + id + '.json');
	    }
	  }, {
	    key: 'put',
	    value: function put(id, data) {
	      return Http.request('PUT', '' + baseUrl + id + '/.json', JSON.stringify(data));
	    }
	  }, {
	    key: 'patch',
	    value: function patch(id, data) {
	      return Http.request('PATCH', '' + baseUrl + id + '/.json', JSON.stringify(data));
	    }
	  }]);

	  return Firebase;
	})();

	var Node = (function () {
	  function Node() {
	    var parent = arguments.length <= 0 || arguments[0] === undefined ? mandatory() : arguments[0];
	    var id = arguments.length <= 1 || arguments[1] === undefined ? mandatory() : arguments[1];
	    var name = arguments.length <= 2 || arguments[2] === undefined ? mandatory() : arguments[2];

	    _classCallCheck(this, Node);

	    this._id = id;
	    this._name = name;
	    this._html = '';
	    this._parent = parent;
	    this._children = [];
	    this._contents = '';
	  }

	  _createClass(Node, [{
	    key: 'addChild',
	    value: function addChild() {
	      var node = arguments.length <= 0 || arguments[0] === undefined ? required() : arguments[0];

	      if (node instanceof Node) {
	        this._children.push(node);
	      }
	    }
	  }, {
	    key: 'removeChild',
	    value: function removeChild() {
	      var node = arguments.length <= 0 || arguments[0] === undefined ? required() : arguments[0];

	      if (node instanceof Node) {
	        this._children.splice(this._children.indexOf(node), 1);
	      }
	    }
	  }, {
	    key: 'removeChildren',
	    value: function removeChildren() {
	      this._children = [];
	    }
	  }, {
	    key: 'findChild',
	    value: function findChild(id) {
	      return this._children.find(function (element) {
	        return element.id === id;
	      });
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      this.onRender();
	      this._children.forEach(function (element) {
	        return element.render();
	      });
	    }
	  }, {
	    key: 'onRender',
	    value: function onRender() {}
	  }, {
	    key: 'id',
	    get: function get() {
	      return this._id;
	    },
	    set: function set(id) {
	      this._id = id;
	    }
	  }, {
	    key: 'name',
	    get: function get() {
	      return this._name;
	    },
	    set: function set(name) {
	      this._name = name;
	    }
	  }, {
	    key: 'html',
	    get: function get() {
	      return this._html;
	    },
	    set: function set(html) {
	      this._html = html;
	    }
	  }, {
	    key: 'parent',
	    get: function get() {
	      return this._parent;
	    },
	    set: function set(parent) {
	      this._parent = parent;
	    }
	  }, {
	    key: 'children',
	    get: function get() {
	      return this._children;
	    },
	    set: function set(children) {
	      this._children = children;
	    }
	  }, {
	    key: 'contents',
	    get: function get() {
	      return this._contents;
	    },
	    set: function set(contents) {
	      if (!(contents instanceof Element)) {
	        throw new Error('You must use DOM elements');
	      }
	      this._contents = contents;
	    }
	  }]);

	  return Node;
	})();

	var Card = (function (_Node) {
	  _inherits(Card, _Node);

	  function Card(parent, id, name) {
	    var _this = this;

	    _classCallCheck(this, Card);

	    _get(Object.getPrototypeOf(Card.prototype), 'constructor', this).call(this, parent, id.toString(), name);

	    var btnEditTitle = createElt('button', null, 'Edit');
	    var btnDelCard = createElt('button', null, 'Del');
	    var contents = createElt('span', { 'class': 'card-name' }, this.name);
	    var wrap = createElt('div', { 'class': 'card', id: this.id, draggable: true }, contents, btnEditTitle, btnDelCard);

	    btnEditTitle.onclick = function (event) {
	      return _this.onClickEdit(event);
	    };
	    btnDelCard.onclick = function (event) {
	      return _this.parent.removeCard(_this);
	    };

	    this.html = wrap;
	    this.contents = contents;
	  }

	  _createClass(Card, [{
	    key: 'onClickEdit',
	    value: function onClickEdit(event) {
	      var _this2 = this;

	      var textbox = event.target.previousSibling;
	      toggleEditable(textbox);

	      if (textbox.querySelector('input') === null && this.name !== textbox.textContent) {
	        Firebase.patch(urlCards + '/' + this.parent.id, _defineProperty({}, this.id, textbox.textContent)).then(function (res) {
	          var data = JSON.parse(res) || {};
	          _this2.name = data[_this2.id];
	          _this2.render();
	        });
	      }
	    }
	  }, {
	    key: 'update',
	    value: function update() {
	      var _this3 = this;

	      Firebase.get(urlCards + '/' + this.parent.id + '/' + this.id).then(function (res) {
	        var data = JSON.parse(res) || {};
	        _this3.name = data[_this3.id];
	        _this3.render();
	      });
	    }
	  }, {
	    key: 'onRender',
	    value: function onRender() {
	      this.contents.textContent = this.name;
	    }
	  }]);

	  return Card;
	})(Node);

	var Inventory = (function (_Node2) {
	  _inherits(Inventory, _Node2);

	  function Inventory(parent, id, name) {
	    var _this4 = this;

	    _classCallCheck(this, Inventory);

	    _get(Object.getPrototypeOf(Inventory.prototype), 'constructor', this).call(this, parent, id.toString(), name);

	    var header = createElt('span', { 'class': 'inventory-header' }, this.name);
	    var textbox = createElt('input', { type: 'text', 'class': 'input-card-name' });
	    var contents = createElt('div', { 'class': 'card-contents-area' });
	    var btnAddCard = createElt('button', null, 'Add');
	    var btnEditTitle = createElt('button', null, 'Edit');
	    var btnDelInven = createElt('button', null, 'Del');
	    var input = createElt('div', null, textbox, btnAddCard);
	    var wrap = createElt('div', { 'class': 'inventory', id: this.id }, header, btnEditTitle, btnDelInven, contents, input);

	    btnAddCard.onclick = function (event) {
	      return _this4.onClickAddCard(event);
	    };
	    btnEditTitle.onclick = function (event) {
	      return _this4.onClickEdit(event);
	    };
	    btnDelInven.onclick = function (event) {
	      return _this4.onClickDel(event);
	    };

	    wrap.addEventListener('dragstart', function (e) {
	      var card = _this4.findChild(e.target.id);
	      var obj = JSON.stringify({ id: card.id, parent: card.parent.id });
	      e.dataTransfer.setData('data', obj);
	    });
	    wrap.addEventListener('dragover', function (e) {
	      return e.preventDefault();
	    });
	    wrap.addEventListener('drop', function (e) {
	      return _this4.onDropCard(e);
	    });

	    this.html = wrap;
	    this.contents = contents;
	  }

	  _createClass(Inventory, [{
	    key: 'onDropCard',
	    value: function onDropCard(event) {
	      event.preventDefault();

	      var data = JSON.parse(event.dataTransfer.getData('data'));
	      if (data === null || data === undefined) return;

	      var oldInventory = this.parent.findChild(data.parent);
	      if (oldInventory === null || oldInventory === undefined) return;

	      var oldCard = oldInventory.findChild(data.id);
	      if (oldCard === undefined) return;

	      var target = event.target;
	      var targetIndex = this.children.length;
	      var targetCard = target;

	      if (target.className === 'card-name') {
	        targetCard = target.parentElement;
	        targetIndex = this.children.findIndex(function (element) {
	          return element.id === targetCard.id;
	        });
	      }

	      var newCard = new Card(this, idGenerator(), oldCard.name);
	      this.children.splice(targetIndex, 0, newCard);

	      if (this.id === oldInventory.id) {
	        this.removeChild(oldCard);
	      } else {
	        oldInventory.removeCard(oldCard);
	      }

	      this.update();
	    }
	  }, {
	    key: 'onClickEdit',
	    value: function onClickEdit(event) {
	      var _this5 = this;

	      var textbox = event.target.previousSibling;
	      toggleEditable(textbox);

	      if (textbox.querySelector('input') === null && this.name !== textbox.textContent) {
	        Firebase.patch(urlInventories + '/' + this.parent.id, _defineProperty({}, this.id, { name: textbox.textContent })).then(function (res) {
	          var data = JSON.parse(res) || {};
	          _this5.name = data.name;
	        });
	      }
	    }
	  }, {
	    key: 'onClickDel',
	    value: function onClickDel(event) {
	      this.parent.removeInventory(this);
	    }
	  }, {
	    key: 'onClickAddCard',
	    value: function onClickAddCard(event) {
	      var textbox = this.html.querySelector('.input-card-name');
	      var text = textbox.value;
	      if (text === '') return;
	      textbox.value = '';

	      this.addChild(new Card(this, this.children.length, text));
	      this.update();
	    }
	  }, {
	    key: 'removeCard',
	    value: function removeCard(card) {
	      this.removeChild(card);
	      this.update();
	    }
	  }, {
	    key: 'update',
	    value: function update() {
	      var _this6 = this;

	      var cards = this.children.map(function (element) {
	        return element.name;
	      });
	      Firebase.patch('' + urlCards, _defineProperty({}, this.id, cards)).then(function (res) {
	        var data = JSON.parse(res);
	        var cards = data[_this6.id] || [];

	        _this6.removeChildren();
	        cards.forEach(function (element, index) {
	          return _this6.addChild(new Card(_this6, index, element));
	        });
	        _this6.render();
	      });
	    }
	  }, {
	    key: 'onRender',
	    value: function onRender() {
	      var _this7 = this;

	      this.contents.textContent = '';
	      this.children.forEach(function (element) {
	        return _this7.contents.appendChild(element.html);
	      });
	    }
	  }]);

	  return Inventory;
	})(Node);

	var Board = (function (_Node3) {
	  _inherits(Board, _Node3);

	  function Board(parent, id, name) {
	    var _this8 = this;

	    _classCallCheck(this, Board);

	    _get(Object.getPrototypeOf(Board.prototype), 'constructor', this).call(this, parent, id.toString(), name);

	    var btnAddInven = createElt('button', null, 'Add');
	    var textbox = createElt('input', { type: 'text' });
	    var contents = createElt('div', { 'class': 'inventory-contents-area' });
	    var header = createElt('div', { 'class': 'board-header' }, textbox, btnAddInven);
	    var wrap = createElt('div', { 'class': 'board' }, header, contents);

	    btnAddInven.onclick = function (event) {
	      return _this8.onClickAddInventory(event);
	    };

	    this.html = wrap;
	    this.contents = contents;
	  }

	  _createClass(Board, [{
	    key: 'onClickAddInventory',
	    value: function onClickAddInventory(event) {
	      var _this9 = this;

	      var textbox = this.html.querySelector('input');
	      var text = textbox.value;

	      if (text === '') return;
	      textbox.value = '';

	      var inventory = new Inventory(this, idGenerator(), text);
	      this.addChild(inventory);

	      Firebase.patch(urlInventories + '/' + this.id, _defineProperty({}, inventory.id, { name: inventory.name })).then(function (res) {
	        _this9.render();
	      });
	    }
	  }, {
	    key: 'removeInventory',
	    value: function removeInventory(inventory) {
	      var _this10 = this;

	      Firebase['delete'](urlInventories + '/' + inventory.parent.id + '/' + inventory.id).then(function (res) {
	        _this10.removeChild(inventory);
	        _this10.render();

	        return Firebase['delete'](urlCards + '/' + inventory.id);
	      }).then(function (res) {});
	    }
	  }, {
	    key: 'update',
	    value: function update() {
	      var _this11 = this;

	      this.removeChildren();

	      Firebase.get('/kanban').then(function (res) {
	        var kanban = JSON.parse(res) || {};
	        console.log(kanban);
	        var inventories = kanban.hasOwnProperty('inventories') ? kanban.inventories[_this11.id] : {};
	        Object.keys(inventories).forEach(function (key) {
	          return _this11.addChild(new Inventory(_this11, key, inventories[key].name));
	        });

	        _this11.children.forEach(function (inventory) {
	          var cards = kanban.hasOwnProperty('cards') ? kanban.cards[inventory.id] : [];
	          if (cards === undefined) return;
	          cards.forEach(function (element, index) {
	            return inventory.addChild(new Card(inventory, index, element));
	          });
	        });

	        _this11.render();
	        console.log(_this11.children);
	      });
	    }
	  }, {
	    key: 'onRender',
	    value: function onRender() {
	      var _this12 = this;

	      this.contents.textContent = '';
	      this.children.forEach(function (element) {
	        return _this12.contents.appendChild(element.html);
	      });
	    }
	  }]);

	  return Board;
	})(Node);

	var board = new Board(window, '111', 'board');
	board.update();
	document.getElementById('app').appendChild(board.html);

/***/ })

})