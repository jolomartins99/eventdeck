var FormView = require('ampersand-form-view')
var InputView = require('ampersand-input-view')
var templates = require('../templates')
var ExtendedInput = InputView.extend({
  template: templates.includes.formInput()
})

var TextareaInput = InputView.extend({
  template: templates.includes.formTextarea()
})

module.exports = FormView.extend({
  fields: function () {
    return [
      new ExtendedInput({
        label: 'Name',
        name: 'name',
        value: this.model && this.model.name || '',
        required: false,
        placeholder: 'Name',
        parent: this
      }),
      new ExtendedInput({
        label: 'Image',
        name: 'img',
        value: this.model && this.model.img || '',
        required: false,
        placeholder: 'Image',
        parent: this
      }),
      new ExtendedInput({
        label: 'Area',
        name: 'area',
        value: this.model && this.model.area || '',
        required: false,
        placeholder: 'Area',
        parent: this
      }),
      new ExtendedInput({
        label: 'Site',
        name: 'site',
        value: this.model && this.model.site || '',
        required: false,
        placeholder: 'Site',
        parent: this
      }),
      new TextareaInput({
        label: 'Contacts',
        name: 'contacts',
        value: this.model && this.model.contacts || '',
        required: false,
        placeholder: 'Contacts',
        parent: this
      }),
      new TextareaInput({
        label: 'Description',
        name: 'description',
        value: this.model && this.model.description || '',
        required: false,
        placeholder: 'Description',
        parent: this
      }),
      new TextareaInput({
        label: 'History',
        name: 'history',
        value: this.model && this.model.history || '',
        required: false,
        placeholder: 'History',
        parent: this
      })
    ]
  }
})
