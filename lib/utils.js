var fs = require('fs'),
    path = require('path'),
    RSVP = require('rsvp'),
    yaml = require('js-yaml'),
    parseYAML = RSVP.denodeify(yaml.load),
    marked = require('marked'),
    parseMarkdown = RSVP.denodeify(marked),
    readFile = RSVP.denodeify(fs.readFile),
    merge = require('merge');

/**
 * Split document string into metadata and markdown and return a promise that resolves to
 *
 * {
 *    metadata: string,
 *    markdown: string
 * }
 *
 * @param string
 * @returns {RSVP.Promise}
 */
function splitDocument(string) {
  return new RSVP.Promise(function(resolve, reject){
    if (string.slice(0, 3) === '---') {
      var result = string.match(/^-{3,}\s([\s\S]*?)-{3,}(\s[\s\S]*|\s?)$/);
      if ((result != null ? result.length : void 0) === 3) {
        resolve({
          metadata: result[1],
          markdown: result[2]
        });
      } else {
        reject('Could not parse metadata. Metadata block --- closing line could not be found.');
      }
    } else {
      resolve({
        metadata: '',
        markdown: string
      })
    }
  });
}

/**
 * Return promise that will resolve to a document with parsed metadata and markdown
 *
 * @param options object
 * @returns {function}
 */
function parseDocumentParts(options) {

  marked.setOptions(options.markdown || {});

  /**
   * Return promise that will resolve to a document with parsed metadata and markdown
   * @params document object
   * @return {RSVP.Promise}
   */
  return function(document) {
    return new RSVP.Promise(function(resolve, reject){
      RSVP.hash({
        metadata: parseYAML(document.metadata || ''),
        html: parseMarkdown(document.markdown || '')
      }).then(function(parsed){
        document.metadata = parsed.metadata;
        document.html = parsed.markdown;
        resolve(document);
      }, reject);
    });


  };
}

function compileHandlebarsTemplate(options) {
  var templatesDirectory = options.templates;

  return function(document) {
    return readFile(path.join(templatesDirectory, document.metadata.template))
      .then(function(data){
        document.template = Handlebars.compile(data.toString());
        return document;
      });
  }
}

function renderTemplate(options) {

  var globals = options.globals || {};

  return function(document) {
    return new RSVP.Promise(function(resolve, reject){
      if (typeof document.template !== 'function') {
        var context = merge(globals, document.metadata || {}, { html: document.html }), html;
        try {
          html = document.template(context);
        } catch (e) {
          reject(e);
        }
        resolve(html);
      } else {
        reject("Can not render template because document doesn't have a template.");
      }
    });
  }
}

module.exports = {
  splitDocument: splitDocument,
  parseDocumentParts: parseDocumentParts,
  compileHandlebarsTemplate: compileHandlebarsTemplate,
  renderTemplate: renderTemplate
};