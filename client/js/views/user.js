
var View = require('ampersand-view')
var templates = require('../templates')

module.exports = View.extend({
  template: templates.partials.sessions.user,
  bindings: {
    'model.name': {
      hook: 'name'
    }
  },
  render: function () {
    this.renderWithTemplate()
  }
})
