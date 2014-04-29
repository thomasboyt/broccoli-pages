var fs = require('fs'),
    path = require('path'),
    RSVP = require('rsvp'),
    yaml = require('js-yaml'),
    readFile = RSVP.denodeify(fs.readFile),
    _ = require('lodash'),
    Handlebars = require('handlebars');

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

function registerHelpersAndPartials(options) {
  fs.readdirSync(options.helpers).forEach(function(file){
    var ext = path.extname(file),
        helperName = path.basename(file, ext);
    if (ext === '.js') {
      Handlebars.registerHelper(helperName, require(path.resolve(path.join(options.helpers, file))));
    }
  });

  fs.readdirSync(options.partials).forEach(function(file){
    var ext = path.extname(file),
      partialName = path.basename(file, ext);
    if (ext === '.hbs' || ext === '.handlebars') {
      Handlebars.registerPartial(partialName, require(path.resolve(path.join(options.partials, file))));
    }
  });
}

function optionalTemplate(options) {

  registerHelpersAndPartials(options);

  return function(document){
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
    return RSVP.resolve(document.html);
  }

}

function readTemplate(options, template) {
  var templatesDirectory = options.templates;
  return readFile(path.join(templatesDirectory, template));
}

function renderTemplate(options) {

  var globals = options.globals || {};

  return function(document) {
    return new RSVP.Promise(function(resolve, reject){
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
  renderTemplate: renderTemplate,
  optionalTemplate: optionalTemplate,
  registerHelpersAndPartials: registerHelpersAndPartials
};
