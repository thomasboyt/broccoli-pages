var MarkdownPages = require('./lib/index').MarkdownPages,
    HTMLPages = require('./lib/index').HTMLPages;

module.exports = function(broccoli) {

  var example = broccoli.makeTree('example/content'),
      options = {
        templates: './example/templates',
        helpers: './example/helpers',
        partials: './example/templates/partials',
        globals: {
          message: "Hello World!"
        }
      };

  example = HTMLPages(example, options);
  example = MarkdownPages(example, options);

  return example;

};