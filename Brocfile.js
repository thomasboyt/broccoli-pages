var MarkdownPages = require('./index').MarkdownPages,
    HTMLPages = require('./index').HTMLPages;

module.exports = function(broccoli) {

  var example = broccoli.makeTree('example/content'),
      options = {
        templates: './example/templates',
        globals: {
          message: "Hello World!"
        }
      };

  example = HTMLPages(example, options);
  example = MarkdownPages(example, options);

  return example;

};