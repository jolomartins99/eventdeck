/* global app */
var View = require('ampersand-view')
var templates = require('../templates')
var SubCollection = require('ampersand-subcollection')

var CompanyView = View.extend({
  template: templates.cards.company,
  bindings: {
    'model.name': '[data-hook~=name]',
    'model.storedImg': {
      type: 'attribute',
      hook: 'img',
      name: 'src'
    },
    'model.background': {
      type: 'attribute',
      hook: 'background',
      name: 'style'
    },
    'model.editUrl': {
      type: 'attribute',
      hook: 'action-edit',
      name: 'href'
    },
    'model.viewUrl': {
      type: 'attribute',
      hook: 'name',
      name: 'href'
    }
  },
  events: {
    'click [data-hook~=action-delete]': 'handleRemoveClick'
  },
  handleRemoveClick: function () {
    this.model.destroy()
    return false
  }
})

module.exports = View.extend({
  template: templates.cards.session,
  initialize: function () {
    var self = this
    if (app.companies.length) {
      return self.filterCompanies()
    }

    app.companies.fetch({ success: function () {
      self.filterCompanies()
    }})
  },
  filterCompanies: function () {
    var self = this
    if (!self.model.companiesDetails.length) {
      self.model.companiesDetails = new SubCollection(app.companies, {
        filter: function (company) {
          return self.model.companies.indexOf(company.id) !== -1
        }
      })
    }
    this.render()
  },
  render: function () {
    var self = this
    this.renderWithTemplate()
    this.renderCollection(self.model.companiesDetails, CompanyView, this.queryByHook('company-speaker-view'))
  }
})
