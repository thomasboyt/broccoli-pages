var Filter = require('broccoli-filter'),
    RSVP = require('rsvp'),
    Handlebars = require('handlebars'),
    _ = require('lodash'),
    op = require('./operations');

var defaults = {
  // marked options
  // @see https://github.com/chjj/marked
  markdown: {

  },
  templates: './templates', // template directory where Handlebars template will be loaded from,
  // global values that will be included in context when rendering the template
  globals: {

  }
};

HTMLPages.prototype = Object.create(Filter.prototype);
HTMLPages.prototype.constructor = HTMLPages;

function HTMLPages (inputTree, options) {
  if (!(this instanceof HTMLPages)) return new HTMLPages(inputTree, options);
  Filter.call(this, inputTree, options);
  this.options = _.merge(defaults, options);
}

HTMLPages.prototype.extensions = ['htm', 'html'];
HTMLPages.prototype.targetExtension = 'html';

HTMLPages.prototype.processString = function(string) {

  var options = this.options;

  return op.splitDocument(string)
    .then(function(parts){
      var document = {
        metadata: '',
        html: string
      };
      if (parts && _.isArray(parts)) {
        document.metadata = parts[1];
        document.html = parts[2];
      }
      return document;
    })
    .then(function(document){
      return RSVP.hash({
        metadata: op.parseMetadata(document.metadata),
        html: document.html
      })
    })
    .then(op.optionalTemplate(options), console.log);

};

module.exports = HTMLPages;