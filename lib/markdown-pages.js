var PagesFilter = require('./pages-filter'),
    RSVP = require('rsvp'),
    marked = require('marked'),
    splitDocument = require('./utils').splitDocument,
    parseMetadata = require('./utils').parseMetadata,
    parseMarkdown = RSVP.denodeify(marked),
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

MarkdownPages.prototype = Object.create(PagesFilter.prototype);
MarkdownPages.prototype.constructor = MarkdownPages;

function MarkdownPages (inputTree, options) {
  if (!(this instanceof MarkdownPages)) return new MarkdownPages(inputTree, options);
  PagesFilter.call(this, inputTree, options);

  this.options = _.merge(defaults, options);
  marked.setOptions(options.markdown);
}

MarkdownPages.prototype.extensions = ['md', 'markdown'];
MarkdownPages.prototype.targetExtension = 'html';

MarkdownPages.prototype.processString = function(string) {

  var options = this.options;

  return splitDocument(string) // into { metadata: string, markdown: string }
    .then(function(parts){
      var document = {
        metadata: '',
        markdown: string
      };
      if (parts && _.isArray(parts)) {
        document.metadata = parts[1];
        document.markdown = parts[2];
      }
      return document;
    })
    .then(function(document){
      return RSVP.hash({
        metadata: parseMetadata(document.metadata),
        html: parseMarkdown(document.markdown),
        markdown: document.markdown
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

module.exports = MarkdownPages;