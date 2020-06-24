/*
exbuvasa: EXpression BUilder VAlidator and SAnitizer
Provides a simple way to build logical or aritmetical expressions with functions, variables and operators
Validates expressions against predefined or user defined set of operators, variables and functions
Keeps expressions on a sandbox in order to prevent code injection
parse(expression)
returns an object:
"ok": boolean,
"msg": errors and mesages,
"terms": terms of the resulting expression as an array,
"expression": resulting javascript expression,
"result": result of evaluating the resulting expression
Written by Nicolas Geltman on 2020-05-25
 */
function exbuvasa(props) {
    var exbuvasa = this;
    props = props || {};

    this.operators = props.operators || {
        "and": "&&",
        "or": "||",
        "not": "!",
        "gt": ">",
        "ge": ">=",
        "lt": "<",
        "le": "<=",
        "eq": "==",
        "neq": "!=",
        "in": "isin",
        "contains": "contains"
    };
    this.variables = props.variables || {};
    this.functions = props.functions || {
        "left": "left",
        "right": "right",
        "substring": "substr",
        "date": "date"
    };
    this.tags = getTags();
    this.okcolor = props.okcolor || '#dfd';
    this.notokcolor = props.notokcolor || '#fdd';

    this.okfontcolor = props.okfontcolor || '#0a0';
    this.notokfontcolor = props.notokfontcolor || '#f55';
    this.text = props.text || {
        doubleQuotesNotAllowed: "Double quotes are not allowed. Always use single quotes",
        unclosedQuote: "Unclosed quote",
        invalidExpression: "Invalid expression",
        emptyExpression: "Empty expression",
        openParWasExpected: "( was expected",
        closeParWasExpected: ") was expected",
        charIsNotAllowed: "is not allowed",
        pastedText: "Pasted text",
        hasNotAllowedChars: "has not allowed characters",
        allowedCharsAre: "Allowed chars are letters, numbers and",
        help: "Write your expression or press space for autocomplete options"
    }
    this.showtitle = true;
	this.widget=widget;
    if (typeof props.showtitle != "undefined") {
        this.showtitle = props.showtitle;
    }

    this.allowedchars = props.allowedchars || "|!#%&/()=?',;.:-_+*@ ";
    if (this.allowedchars.indexOf('"') >= 0) {
        throw this.text.doubleQuotesNotAllowed;
    }

    this.jqexpressionselector = props.jqexpressionselector || null;
    this.jqresultselector = props.jqresultselector || null;

    function substr(str, from, to) {
        return str.substring(from, to);
    }
    function left(str, len) {
        return str.substring(0, len);
    }
    function right(str, len) {
        return str.substring(str.length - len);
    }
    function isin(val, arr) {
        if (arr.indexOf(val) >= 0) {
            return true;
        } else {
            return false;
        }
    }
    function date(str) {
        return new Date(str);
    }
    function contains(val, arr) {
        if (val.indexOf(arr[0]) >= 0) {
            return true;
        } else {
            return false;
        }
    }

    function getTags() {
        var ret = [];
        for (var o in exbuvasa.operators) {
            ret.push({
                label: o,
                category: "Operadores"
            });
        }
        for (var o in exbuvasa.variables) {
            ret.push({
                label: o,
                category: "Variables"
            });
        }
        for (var o in exbuvasa.functions) {
            ret.push({
                label: o,
                category: "Funciones"
            });
        }
        return ret;
    }

    this.parse = function (input) {
        var input = " " + input + " ";
        input = input.replace(/"/g, ''); //double quotes are not allowed
        var ok = true;
        var terms = [];
        var result = "";
        var tmp = "";
        var msg;

        var openQuote = false;
        for (var ii = 0; ii < input.length; ii++) {
            var ch = input[ii];

            if (ch == "'") { //open or close quotes
                openQuote = !openQuote;
                if (!openQuote) {
                    terms.push(tmp + ch);
                    tmp = "";
                    continue;
                }
            }
            if (!openQuote && ch.match("[^a-zA-Z0-9_.]")) { //everything else is a separator between terms
                try {
                    if (tmp != "") {
                        var op = exbuvasa.operators[tmp];
                        var va = exbuvasa.variables[tmp];
                        var fu = exbuvasa.functions[tmp];
                        if (op) {
                            var isFunction = false;
                            try {
                                isFunction = eval("typeof " + op + "==='function'");
                            } catch (e) {}
                            if (isFunction) {
                                var params = exbuvasa.getParams(input.substring(ii));
                                terms[terms.length - 2] = op + "(" + terms[terms.length - 2] + ",[" + params.params + "])";
                                ii = ii + params.shift;
                                tmp = "";
                            } else {
                                terms.push(op);
                            }

                        } else if (va) {
                            terms.push(va);
                        } else if (fu) {
                            var params = this.getParams(input.substring(ii));
                            terms.push(fu + "(" + params.params + ")");
                            ii = ii + params.shift;
                            tmp = "";
                            continue;
                        } else if (!isNaN(tmp)) {
                            terms.push(tmp);
                        } else {
                            ok = false;
                        }
                    }
                } catch (e) {
                    ok = false;
                    msg = e;
                    break;
                }
                terms.push(ch);
                tmp = "";
            } else {
                tmp = tmp + ch;
            }
        }
        if (openQuote) {
            msg = this.text.unclosedQuote + ": " + terms;
            ok = false;
        }
        var er = "";
        var r = msg || this.text.invalidExpression;
        for (i = 0; i < terms.length; i++) {
            er = er + terms[i];
        }

        if (ok) {
            if (er.trim() == "") {
                ok = false;
                msg = this.text.emptyExpression;
            }
            try {
                r = eval(er);
                msg = r;
            } catch (e) {
                r = e + " :" + er;
                ok = false;
            }
        }

        return {
            "ok": ok,
            "msg": msg,
            "terms": terms,
            "expression": er,
            "result": r
        }

    }
    this.getParams = function (str) {
        var ret = {
            params: "",
            shift: 0
        };
        str

        if (!str.trim()[0] == "(") {
            throw (this.text.openParWasExpected);
        }
        var hasClosingPar = false;
        var tmp = "";
        var openPars = 0;
        var openQuote = false;
        var coma = "";
        for (var ip = str.indexOf("("); ip < str.length; ip++) {
            var ch = str[ip];

            if (ch == "'") {
                openQuote = !openQuote;
                tmp = tmp + ch;
                continue;
            }

            if (openQuote) {
                tmp = tmp + ch;
            } else if (ch == "(") {
                openPars++;
                if (openPars > 1) {
                    tmp = tmp + ch;
                }
            } else if (ch == ")") {
                openPars--;
                if (openPars == 0) {
                    addParam(tmp);
                    ret.shift = ip;
                    return ret;
                } else {
                    tmp = tmp + ch;
                }
            } else if (openPars == 1 && ch == ",") { //if openpars > 1, its internal param's
                addParam(tmp);
                tmp = "";
                continue;
            } else {
                tmp = tmp + ch;
            }
        }

        throw this.text.closeParWasExpected;
        function addParam(tmp) {
            var ptmp = exbuvasa.parse(tmp);
            if (!ptmp.ok) {
                throw ptmp.msg;
            } else {
                ret.params = ret.params + coma + ptmp.expression;
                coma = ",";
            }
        }
    }
	if (props.jqinputselector){
		widget(props.jqinputselector);
	}
    function widget (jqinputselector) {
		try { //only if jquery ui
            function split(val) {
                return val.split(/ \s*/);
            }
            function extractLast(term) {
                return split(term).pop();
            }
			
			$(jqinputselector).wrap("<div class='exbuvasa-wrap'></div>");
			$(jqinputselector).before("<table class='exbuvasa-table'><tr>"
					+"<td colspan='2' class='exbuvasa-msg'>&nbsp;</td></tr>"
					+"<tr><td class='exbuvasa-input'></td><td class='exbuvasa-help' title='"+exbuvasa.text.help+"'><input type='button' value='?'></td></tr></table>");
			$.each($(jqinputselector),function (i,e){
				$(this).prev().find(".exbuvasa-input").append($(this));
			});
			

            $.widget("custom.catcomplete", $.ui.autocomplete, {
                _create: function () {
                    this._super();
                    this.widget().menu("option", "items", "> :not(.ui-autocomplete-category)");
                },
                _renderMenu: function (ul, items) {
                    var that = this,
                    currentCategory = "";
                    $.each(items, function (index, item) {
                        var li;
                        if (item.category != currentCategory) {
                            ul.append("<li class='ui-autocomplete-category'>" + item.category + "</li>");
                            currentCategory = item.category;
                        }
                        li = that._renderItemData(ul, item);
                        if (item.category) {
                            li.attr("aria-label", item.category + " : " + item.label);
                        }
                    });
                }
            });

            $(jqinputselector).catcomplete({
                minLength: 0,
                source: function (request, response) {
                    // delegate back to autocomplete, but extract the last term
                    response($.ui.autocomplete.filter(
                            exbuvasa.tags, extractLast(request.term)));
                },
                focus: function () {
                    // prevent value inserted on focus
                    return false;
                },
                select: function (event, ui) {
                    var terms = split(this.value);
                    // remove the current input
                    terms.pop();
                    // add the selected item
                    terms.push(ui.item.value);
                    // add placeholder to get the comma-and-space at the end
                    terms.push("");
                    this.value = terms.join(" ");
                    return false;
                }
            });

        } catch (e) {
            console.log(e);
        }
        $(jqinputselector).keyup(function (e) {
            var ret = exbuvasa.parse($(this).val());

            $(exbuvasa.jqexpressionselector).val(ret.expression);
            $(exbuvasa.jqresultselector).val(ret.result);
            if (exbuvasa.showtitle) {
				var m=$(this).closest(".exbuvasa-wrap").find(".exbuvasa-msg");
                if (!ret.ok) {
                    m.html(ret.result).css('color', exbuvasa.notokfontcolor);                    
                } else {
                    m.html(ret.msg).css('color', exbuvasa.okfontcolor);
                }
            }
            $(this).attr("exbuvasa-ok", ret.ok);
            $(this).attr("exbuvasa-result", ret.result);
            $(this).attr("exbuvasa-msg", ret.msg);
            $(this).attr("exbuvasa-expression", ret.expression);
            if (ret.ok) {
                $(this).css('background-color', exbuvasa.okcolor);
            } else {
                $(this).css('background-color', exbuvasa.notokcolor);
            }
        }).focus();

        $(jqinputselector).keydown(function (e) {
            if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110]) !== -1 || // Allow: backspace, delete, tab, escape and enter
                (e.keyCode == 65 && e.ctrlKey === true) || // Allow: Ctrl+A
                (e.keyCode >= 35 && e.keyCode <= 39) || // Allow: home, end, left, right
                (e.key.charCodeAt(0) >= 48 && e.key.charCodeAt(0) <= 57) || //numbers
                (e.key.charCodeAt(0) >= 65 && e.key.charCodeAt(0) <= 90) || //ucase letters
                (e.key.charCodeAt(0) >= 97 && e.key.charCodeAt(0) <= 122) || //lcase letters
                exbuvasa.allowedchars.indexOf(e.key) >= 0) {
                return;
            } else {
                console.log("'" + e.key + "' " + exbuvasa.text.charIsNotAllowed + "." + exbuvasa.text.allowedCharsAre + " " + exbuvasa.allowedchars);
                e.preventDefault();
            }
        });
        $(jqinputselector).bind("paste", function (e) {
            var pastedData = e.originalEvent.clipboardData.getData('text');
            var allowedchars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz" + exbuvasa.allowedchars.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
            for (var pd = 0; pd < pastedData.length; pd++) {
                var c = pastedData[pd];
                if (allowedchars.indexOf(c) < 0) {
                    console.log(exbuvasa.text.pastedText + " (" + pastedData + ") " + exbuvasa.text.hasNotAllowedChars + " (" + c + ") . " + exbuvasa.text.allowedCharsAre + " " + exbuvasa.allowedchars);
                    e.preventDefault();
                    break;
                }
            }
        });

    }
}
