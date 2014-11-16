var View = require('ampersand-view');
var templates = require('client/js/templates');


module.exports = View.extend({
  template: templates.cards.communication,
  bindings: {
    'model.kind': '[data-hook~=kind]',
    'model.status': '[data-hook~=status]',
    'model.posted': '[data-hook~=posted]',
    'model.text': {
      type: 'text',
      hook: 'text'
    },
  },
  events: {
    'click [data-hook~=action-delete]': 'handleRemoveClick'
  },
  handleRemoveClick: function () {
    this.model.destroy();
    return false;
  }
});
