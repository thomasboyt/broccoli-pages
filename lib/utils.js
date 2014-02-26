var RSVP = require('rsvp'),
    yaml = require('js-yaml'),
    parseYAML = RSVP.denodeify(yaml.load),
    marked = require('marked'),
    parseMarkdown = RSPV.denodeify(marked);

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
    return RSVP.hash({
      metadata: parseYAML(document.metadata || ''),
      markdown: parseMarkdown(document.markdown || '')
    });
  };
}

function compileHandlebarsTemplate(document) {

}

module.exports = {
  splitDocument: splitDocument,
  parseDocumentParts: parseDocumentParts,
  compileHandlebarsTemplate: compileHandlebarsTemplate
};