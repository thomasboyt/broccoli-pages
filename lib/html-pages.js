var PagesFilter = require('./pages-filter'),
  RSVP = require('rsvp'),
  splitDocument = require('./utils').splitDocument,
  parseMetadata = require('./utils').parseMetadata,
  readTemplate = require('./utils').readTemplate,
  renderTemplate = require('./utils').renderTemplate,
  Handlebars = require('handlebars'),
  _ = require('lodash');

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

HTMLPages.prototype = Object.create(PagesFilter.prototype);
HTMLPages.prototype.constructor = HTMLPages;

function HTMLPages (inputTree, options) {
  if (!(this instanceof HTMLPages)) return new HTMLPages(inputTree, options);
  PagesFilter.call(this, inputTree, options);
  this.options = _.merge(defaults, options);
}

HTMLPages.prototype.extensions = ['htm', 'html'];
HTMLPages.prototype.targetExtension = 'html';

HTMLPages.prototype.processString = function(string) {

  // TODO: make it DRY
  var options = this.options;

  return splitDocument(string)
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
        metadata: parseMetadata(document.metadata),
        html: document.html
      })
    })
    .then(function(document){
      // check if markdown has metadata
      if (document.metadata && document.metadata.template) {
        // render markdown as html variable of the template
        return readTemplate(options, document.metadata.template)
          .then(function(data){
            document.template = Handlebars.compile(data.toString());
            return document;
          })
          .then(renderTemplate(options));
      }
      // otherwise, just return the parsed markdown
      return document.html;
    }, console.log);

};

module.exports = HTMLPages;