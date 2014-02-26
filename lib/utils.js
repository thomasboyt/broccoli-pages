var fs = require('fs'),
    path = require('path'),
    RSVP = require('rsvp'),
    yaml = require('js-yaml'),
    readFile = RSVP.denodeify(fs.readFile),
    _ = require('lodash');

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
    var result;
    if (string.slice(0, 3) === '---') {
      result = string.match(/^-{3,}\s([\s\S]*?)-{3,}(\s[\s\S]*|\s?)$/);
      if ((result != null ? result.length : void 0) !== 3) {
        reject('Could not parse metadata. Metadata block --- closing line could not be found.');
      }
    }
    resolve(result);
  });
}

function parseMetadata(string) {
  return new RSVP.Promise(function(resolve, reject){
    var parsed;
    try {
      parsed = yaml.load(string);
    } catch (error) {
      reject(error);
    }
    resolve(parsed);
  });
}

function readTemplate(options, template) {
  var templatesDirectory = options.templates;
  return readFile(path.join(templatesDirectory, template));
}

function renderTemplate(options) {

  var globals = options.globals || {};

  return function(document) {
    return new RSVP.Promise(function(resolve, reject){
      var html;
      if (typeof document.template === 'function') {
        var context = _.merge(globals, document.metadata || {}, { html: document.html }), html;
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
  parseMetadata: parseMetadata,
  readTemplate: readTemplate,
  renderTemplate: renderTemplate
};