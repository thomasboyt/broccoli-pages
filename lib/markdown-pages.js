var PagesFilter = require('./pages-filter'),
    splitDocument = require('./utils').splitDocument,
    parseDocumentParts = require('./utils').parseDocumentParts,
    compileHandlebarsTemplate = require('./utils').compileHandlebarsTemplate;

module.exports = MarkdownPages;

MarkdownPages.prototype = Object.create(PagesFilter.prototype);
MarkdownPages.prototype.constructor = MarkdownPages;

function MarkdownPages (inputTree, options) {
  if (!(this instanceof MarkdownPages)) return new MarkdownPages(inputTree, options);
  Filter.call(this, inputTree, options)
  options = options || {
    markdown: {

    }
  };
  // TODO: add markdown options here
  this.options = options;
}

MarkdownPages.prototype.extensions = ['md', 'markdown'];
MarkdownPages.prototype.targetExtension = 'html';

MarkdownPages.prototype.processString = function(string) {

  splitDocument(string) // into { metadata: string, markdown: string }
    .then(parseDocumentParts(options)) // parse metadata YAML string into object and markdown into HTML
    .then(compileHandlebarsTemplate)
  // TODO: use metadata to determine handlebars template to render
  // TODO: convert markdown to HTML and add to metadata
  // TODO: read and compile Handlebars template
  // TODO: use metadata as context for Handlebars template

};