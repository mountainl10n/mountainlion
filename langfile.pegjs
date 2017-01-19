start = sections: section * {
	var tr = {};
	for(var i = 0; i < sections.length; i++) {
		tr[sections[i].key] = sections[i].value;
	}
	return tr;
}

ws = [ \t\n\r]*

keychar = [^= \t\n\r\\]
	/ "\\" seq:(
		'='
		/ "\\"
		/ ' '
	) { return seq; }

key = text: keychar * { return text.join(""); }

section = ws key:key ws "=" ws value:value ("\n" / !.) { return {key: key, value: value}; }

value = text:[^\n]* { return text.join(""); }
