var Filter = require('broccoli-filter');

module.exports = PagesFilter;

PagesFilter.prototype = Object.create(Filter.prototype);
PagesFilter.prototype.constructor = PagesFilter;

function PagesFilter(inputTree, options) {
  if (!(this instanceof PagesFilter)) return new PagesFilter(inputTree, options);
  Filter.call(this, inputTree, options);
  options = options || {}
}