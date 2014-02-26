var PagesFilter = require('./pages-filter'),
    splitDocument = require('./utils').splitDocument,
    parseDocumentParts = require('./utils').parseDocumentParts,
    readTemplate = require('./utils').readTemplate,
    renderTemplate = require('./utils').renderTemplate,
    Handlebars = require('handlebars'),
    merge = require('merge');

module.exports = MarkdownPages;

MarkdownPages.prototype = Object.create(PagesFilter.prototype);
MarkdownPages.prototype.constructor = MarkdownPages;

function MarkdownPages (inputTree, options) {
  if (!(this instanceof MarkdownPages)) return new MarkdownPages(inputTree, options);
  PagesFilter.call(this, inputTree, options);
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
  // TODO: add markdown options here
  this.options = merge(defaults, options);
}

MarkdownPages.prototype.extensions = ['md', 'markdown'];
MarkdownPages.prototype.targetExtension = 'html';

MarkdownPages.prototype.processString = function(string) {

  var options = this.options;

  return splitDocument(string) // into { metadata: string, markdown: string }
    .then(parseDocumentParts(options)) // parse metadata YAML string into object and markdown into HTML
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