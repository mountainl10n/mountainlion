var parser = require('./langfile');

var last_;
createReplFunc({});

module.exports = function() {
	return last_.apply(this, arguments);
};

module.exports.SyntaxError = parser.SyntaxError;

module.exports.load = function(loader, value, callback) {
	try {
		if(typeof loader == "string") {
			this.load(require('mountainlion-loader-'+loader), value, callback);
			return;
		}
		loader(value, function(err, content) {
			callback(null, createReplFunc(parser.parse(content)));
		});
	} catch(e) {
		callback(e);
	}
};

function createReplFunc(obj) {
	var _ = function(x, vars) {
		if(x in obj) {
			var tr = "";
			for(var i = 0; i < obj[x].length; i++) {
				var part = obj[x][i];
				if(part.type == "text") {
					tr += part.value;
				}
				else if(part.type == "ref") {
					tr += _(part.value, vars);
				}
				else if(part.type == "var") {
					if(typeof vars == "object") {
						if(part.value in vars) {
							tr += vars[part.value];
						}
						else {
							tr += "{"+part.value+"}";
						}
					}
					else {
						tr += vars;
					}
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
