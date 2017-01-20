var parser = require('./langfile');
var Promise = require('lie');

var last_;
createReplFunc({});

module.exports = function() {
	return last_.apply(this, arguments);
};

module.exports.SyntaxError = parser.SyntaxError;

module.exports.load = function(loader, value) {
	try {
		return require('mountainlion-loader-'+loader)(value)
		.then(createReplFunc);
	} catch(e) {
		return Promise.reject("No such loader");
	}
};

function createReplFunc(obj) {
	var _ = function(x) {
		if(x in obj) {
			var tr = "";
			for(var i = 0; i < obj[x].length; i++) {
				var part = obj[x][i];
				if(part.type == "text") {
					tr += part.value;
				}
				else if(part.type == "ref") {
					tr += _(part.value);
				}
				else {
					throw "No such part type: "+part.type;
				}
			}
			return tr;
		}
		else {
			return x;
		}
	};
	last_ = _;
	return _;
}
