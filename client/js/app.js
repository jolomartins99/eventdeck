/*global app*/
var _ = require('underscore');
var log = require('bows')('eventdeck');
var config = require('clientconfig');
var $ = require('jquery');
var Ink = require('./ink-all');

var Router = require('./router');
var MainView = require('./views/main');
var domReady = require('domready');
var IO = require('./sockets');

var Me = require('./models/me');
var Events = require('./models/events');
var Members = require('./models/members');
var Companies = require('./models/companies');
var Sessions = require('./models/sessions');
var Speakers = require('./models/speakers');
var Tags = require('./models/tags');
var Topics = require('./models/topics');
var Communications = require('./models/communications');
var PublicNotifications = require('./models/publicNotifications');
var PrivateNotifications = require('./models/privateNotifications');

module.exports = {
  // this is the the whole app initter
  blastoff: function () {
    var self = window.app = this;

    log('Blasting off!');

    this.me = new Me();
    this.events = new Events();
    this.members = new Members();
    this.companies = new Companies();
    this.sessions = new Sessions();
    this.speakers = new Speakers();
    this.tags = new Tags();
    this.topics = new Topics();
    this.fetchInitialData();

    this.socket = new IO(null, {setListeners: true});
    this.notifications = {};
    PublicNotifications = new PublicNotifications(this.socket);
    PrivateNotifications = new PrivateNotifications(this.socket);
    this.notifications.public = new PublicNotifications(null, {setListeners: true});
    this.notifications.private = new PrivateNotifications(null, {setListeners: true});

    // init our URL handlers and the history tracker
    this.router = new Router();

    // wait for document ready to render our main view
    // this ensures the document has a body, etc.
    domReady(function () {
      // init our main view
      var mainView = self.view = new MainView({
        el: document.body,
        model: self.me,
        collection: self.notifications.private
      });

      // ...and render it
      mainView.render();
      console.log(mainView);

      // we have what we need, we can now start our router and show the appropriate page
      self.router.history.start({pushState: true, root: '/'});
    });
  },

  fetchInitialData: function () {
    var self = this;

    self.me.fetch({
      success: function(model, response, options) {
        log('Hello ' + model.name + '!');
        model.authenticated = true;

        self.socket.init();
      },
      error: function(model, response, options) {
        log('Please log in first!');
        model.authenticated = false;

        self.router.history.navigate('/login', {trigger: true});
      }
    });

    self.events.fetch({
      success: function(collection, response, options) {
        app.me.selectedEvent = collection.toJSON()[0].id;
        log('Got '+collection.length+' events, '+app.me.selectedEvent+' is the default one. ', collection.toJSON());
      }
    });


    app.tags.fetch();

  },

  // This is how you navigate around the app.
  // this gets called by a global click handler that handles
  // all the <a> tags in the app.
  // it expects a url without a leading slash.
  // for example: "costello/settings".
  navigate: function (page) {
    if (app.me.authenticated) {
      var url = (page.charAt(0) === '/') ? page.slice(1) : page;
      this.router.history.navigate(url, {trigger: true});
    }
    else {
      this.router.history.navigate('/login', {trigger: true});
    }
  },

  login: function (id, code) {
    $.get('/api/auth/login/' + id + '/' + code, function () {
      app.fetchInitialData();
      app.me.authenticated = true;
      app.navigate('/');
    });
  },

  logout: function () {
    $.get('/api/auth/logout', function () {
      app.me.authenticated = false;
      app.navigate('/login');
    });
  },

  access: function (model) {
    var data ={
      memberId: app.me.id,
      thread: model.thread
    };
    model.unread = false;
    app.notifications.private.emit('access', data,{callback: function(err, result){
      if(err){
        log(err);
      }
    }});
  }
};

// run it
module.exports.blastoff();
