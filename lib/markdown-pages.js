var PagesFilter = require('./pages-filter'),
    splitDocument = require('./utils').splitDocument,
    parseDocumentParts = require('./utils').parseDocumentParts,
    compileHandlebarsTemplate = require('./utils').compileHandlebarsTemplate,
    renderTemplate = require('./utils').renderTemplate,
    merge = require('merge');

module.exports = MarkdownPages;

MarkdownPages.prototype = Object.create(PagesFilter.prototype);
MarkdownPages.prototype.constructor = MarkdownPages;

function MarkdownPages (inputTree, options) {
  if (!(this instanceof MarkdownPages)) return new MarkdownPages(inputTree, options);
  Filter.call(this, inputTree, options);
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

  var promise = splitDocument(string) // into { metadata: string, markdown: string }
    .then(parseDocumentParts(options)) // parse metadata YAML string into object and markdown into HTML
    .then(compileHandlebarsTemplate(options)) // compile template and add it to the document
    .then(renderTemplate(options))

  return promise;

};