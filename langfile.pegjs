start = sections: section * {
	var tr = {};
	for(var i = 0; i < sections.length; i++) {
		tr[sections[i].key] = sections[i].value;
	}
	return tr;
}

ws = [ \t\n\r]*

keychar = [^= \t\n\r\\{}]
	/ "\\" seq:(
		'='
		/ "\\"
		/ ' '
		/ '{'
		/ '}'
	) { return seq; }

key = text: keychar * { return text.join(""); }

section = ws key:key ws "=" ws value:value ("\n" / !.) { return {key: key, value: value}; }

textbit = text:[^\n{}]+ { return {type: "text", value: text.join("")}; }

valuebit = textbit / include

innerinclude = (
	ref:(
		"_(" ref:key ")" {return ref;}
		/ key
	) { return {type: "ref", value: ref}; }
)

include = "{" ws rt:innerinclude ws "}" { return rt; }

value = valuebit *
