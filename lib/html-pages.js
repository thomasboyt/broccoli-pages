var PagesFilter = require('./pages-filter');

module.exports = HTMLPages;

HTMLPages.prototype = Object.create(PagesFilter.prototype);
HTMLPages.prototype.constructor = HTMLPages;

function HTMLPages (inputTree, options) {
  if (!(this instanceof HTMLPages)) return new HTMLPages(inputTree, options);
  Filter.call(this, inputTree, options)
  options = options || {};
  // TODO: add HTML page options here
}

HTMLPages.prototype.extensions = ['htm', 'html'];
HTMLPages.prototype.targetExtension = 'html';

HTMLPages.prototype.processString = function(string) {

  // TODO: extract metadata
  // TODO: use metadata to determine handlebars template to render
  // TODO: convert markdown to HTML and add to metadata
  // TODO: read and compile Handlebars template
  // TODO: use metadata as context for Handlebars template

};