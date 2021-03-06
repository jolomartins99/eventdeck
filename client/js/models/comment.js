
var AmpModel = require('ampersand-model')
var timeSince = require('../helpers/timeSince')
var Member = require('./member')
var marked = require('../helpers/marked')

module.exports = AmpModel.extend({
  props: {
    id: ['string'],
    thread: ['string'],
    subthread: ['string'],
    member: ['string'],
    text: ['string'],
    posted: ['string'],
    updated: ['string']
  },
  session: {
    memberDetails: Member,
    editing: ['boolean']
  },
  derived: {
    postedTimeSpan: {
      deps: ['posted'],
      fn: function () {
        return timeSince(this.posted)
      },
      cache: false
    },
    textHtml: {
      deps: ['text'],
      fn: function () {
        return this.text && marked(this.text) || ''
      }
    }
  }
})
