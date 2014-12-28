/*global app*/
var AmpState = require('ampersand-state');
var AmpModel = require('ampersand-model');
var AmpCollection = require('ampersand-collection');
var options = require('options');
var marked = require('client/js/helpers/marked');

var Speaker = AmpState.extend({
  props: {
    id: ['string'],
    name: ['string'],
    position: ['string']
  }
});

var SpeakerCollection = AmpCollection.extend({
  model: Speaker
});

module.exports = AmpModel.extend({
  props: {
    id: ['string'],
    name: ['string'],
    kind: ['string'],
    img: ['string'],
    place: ['string'],
    description: ['string'],
    date: ['date'],
    duration: ['date'],
    updated: ['date'],
    companies: ['array'],
  },
  collections: {
    speakers: SpeakerCollection
  },
  derived: {
    thread: {
      deps: ['id'],
      fn: function () {
        return 'session-' + this.id;
      }
    },
    editUrl: {
      deps: ['id'],
      fn: function () {
        return '/sessions/' + this.id + '/edit';
      }
    },
    viewUrl: {
      deps: ['id'],
      fn: function () {
        return '/sessions/' + this.id;
      }
    },
    background: {
      deps: ['img'],
      fn: function () {
        return 'background-image:url(' + this.img + ');';
      }
    }
  }
});