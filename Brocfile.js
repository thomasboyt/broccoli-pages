var MarkdownPages = require('./index').MarkdownPages;

module.exports = function(broccoli) {

  var _this = this;

  var example = broccoli.makeTree('example');

  example = MarkdownPages(example, {
    templates: './example/templates',
    globals: {
      message: "Hello World!"
    }
  });

  return example;

};