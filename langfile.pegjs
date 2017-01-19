start = section *

ws = [ \t\n\r]*

keychar = [^=]
	/ "\\=" { return "=" }

key = text: keychar * { return text.join(""); }

section = ws key:key ws "=" ws value:value ("\n" / !.) { return {name: key, value: value}; }

value = text:[^\n]* { return text.join(""); }
