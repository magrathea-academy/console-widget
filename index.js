// Generated by CoffeeScript 1.6.3
(function() {
  var ConsoleWidget, EventEmitter, MAX_LINES, consoleWidget, i, vkey, _i,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  EventEmitter = (require('events')).EventEmitter;

  vkey = require('vkey');

  MAX_LINES = 999;

  ConsoleWidget = (function(_super) {
    __extends(ConsoleWidget, _super);

    function ConsoleWidget(opts) {
      var _base, _base1, _base2, _base3;
      this.opts = opts;
      if (this.opts == null) {
        this.opts = {};
      }
      if ((_base = this.opts).widthPx == null) {
        _base.widthPx = 500;
      }
      if ((_base1 = this.opts).rows == null) {
        _base1.rows = 10;
      }
      if ((_base2 = this.opts).lineHeightPx == null) {
        _base2.lineHeightPx = 20;
      }
      if ((_base3 = this.opts).font == null) {
        _base3.font = '12pt Menlo, Courier, \'Courier New\', monospace';
      }
      this.history = [];
      this.historyCursor = this.history.length;
      this.createNodes();
    }

    ConsoleWidget.prototype.show = function() {
      return this.containerNode.style.visibility = '';
    };

    ConsoleWidget.prototype.hide = function() {
      return this.containerNode.style.visibility = 'hidden';
    };

    ConsoleWidget.prototype.open = function(text) {
      if (text == null) {
        text = void 0;
      }
      this.show();
      if (text != null) {
        this.setInput(text);
      }
      this.registerEvents();
      return this.focusInput();
    };

    ConsoleWidget.prototype.close = function() {
      this.unregisterEvents();
      return this.hide();
    };

    ConsoleWidget.prototype.isOpen = function() {
      return this.containerNode.style.visibility !== 'hidden';
    };

    ConsoleWidget.prototype.log = function(text) {
      return this.logNode(document.createTextNode(text));
    };

    ConsoleWidget.prototype.logNode = function(node) {
      this.outputNode.appendChild(node);
      this.outputNode.appendChild(document.createElement('br'));
      return this.scrollOutput();
    };

    ConsoleWidget.prototype.focusInput = function() {
      return this.inputNode.focus();
    };

    ConsoleWidget.prototype.setInput = function(text) {
      return this.inputNode.value = text;
    };

    ConsoleWidget.prototype.scrollOutput = function() {
      return this.outputNode.scrollByLines(MAX_LINES + 1);
    };

    ConsoleWidget.prototype.createNodes = function() {
      this.containerNode = document.createElement('div');
      this.containerNode.setAttribute('style', "    width: " + this.opts.widthPx + "px;    height: " + (this.opts.lineHeightPx * this.opts.rows) + "px;    border: 1px solid white;    color: white;    visibility: hidden;    bottom: 0px;    position: absolute;    font: " + this.opts.font + ";    background-image: linear-gradient(rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.4) 100%);    ");
      this.outputNode = document.createElement('div');
      this.outputNode.setAttribute('style', "    overflow-y: scroll;     width: 100%;    height: " + (this.opts.lineHeightPx * (this.opts.rows - 1)) + "px;    ");
      this.inputNode = document.createElement('input');
      this.inputNode.setAttribute('style', "    width: 100%;    height: " + this.opts.lineHeightPx + "px;    padding: 0px;    border: 1px dashed white;    background-color: transparent;    color: white;    font: " + this.opts.font + ";    ");
      this.containerNode.appendChild(this.outputNode);
      this.containerNode.appendChild(this.inputNode);
      return document.body.appendChild(this.containerNode);
    };

    ConsoleWidget.prototype.registerEvents = function() {
      var _this = this;
      return document.body.addEventListener('keydown', this.onKeydown = function(ev) {
        var key;
        key = vkey[ev.keyCode];
        if (key === '<enter>') {
          if (_this.inputNode.value.length === 0) {
            return;
          }
          _this.history.push(_this.inputNode.value);
          _this.historyCursor = _this.history.length - 1;
          _this.emit('input', _this.inputNode.value);
          return _this.inputNode.value = '';
        } else if (key === '<up>') {
          if (_this.history[_this.historyCursor] != null) {
            _this.inputNode.value = _this.history[_this.historyCursor];
          }
          _this.historyCursor -= 1;
          if (_this.historyCursor < 0) {
            _this.historyCursor = 0;
          }
          return ev.preventDefault();
        } else if (key === '<down>') {
          if (_this.history[_this.historyCursor] != null) {
            _this.inputNode.value = _this.history[_this.historyCursor];
          }
          _this.historyCursor += 1;
          if (_this.historyCursor > _this.history.length - 1) {
            _this.historyCursor = _this.history.length - 1;
          }
          return ev.preventDefault();
        } else if (key === '<page-up>') {
          if (ev.shiftKey) {
            return _this.outputNode.scrollByLines(-1);
          } else if (ev.ctrlKey || ev.metaKey) {
            return _this.outputNode.scrollByLines(-MAX_LINES);
          } else {
            return _this.outputNode.scrollByPages(-1);
          }
        } else if (key === '<page-down>') {
          if (ev.shiftKey) {
            return _this.outputNode.scrollByLines(1);
          } else if (ev.ctrlKey || ev.metaKey) {
            return _this.outputNode.scrollByLines(MAX_LINES);
          } else {
            return _this.outputNode.scrollByPages(1);
          }
        } else if (key === '<escape>') {
          return _this.close();
        }
      });
    };

    ConsoleWidget.prototype.unregisterEvents = function() {
      return document.body.removeEventListener('keydown', this.onKeydown);
    };

    return ConsoleWidget;

  })(EventEmitter);

  consoleWidget = new ConsoleWidget();

  for (i = _i = 0; _i <= 100; i = ++_i) {
    consoleWidget.log("hello " + i);
  }

  consoleWidget.open('/');

  consoleWidget.on('input', function(text) {
    return consoleWidget.log(text);
  });

  document.body.addEventListener('keydown', function(ev) {
    var key;
    if (consoleWidget.isOpen()) {
      return;
    }
    key = vkey[ev.keyCode];
    if (key === '/') {
      ev.preventDefault();
      return consoleWidget.open('/');
    } else if (key === '.') {
      ev.preventDefault();
      return consoleWidget.open('.');
    } else if (key === 'T') {
      ev.preventDefault();
      return consoleWidget.open();
    }
  });

  document.body.style.background = 'url(http://i.imgur.com/bmm7HK4.png)';

  document.body.style.backgroundSize = '100% auto';

}).call(this);
