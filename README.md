# exbuvasa
EXpression BUilder VAlidator and SAnitizer for javascript

Expressions can be built using a set of predefined or user defined functions, operators and variables. This keeps yours expressions safe from containing dangerous or injected code. 

Exbuvasa can be used with or without jquery.

If used with jquery inside an input of type text, it shows available terms as jquery-ui autocomplete (if available) and colors the background of the input according to the result of validating the expression. It also restricts the special characters (other but numbers and letters) that the user can type inside the input field.

Whitout jquery, exbuvasa can be given and expression that would be validated and converted to a javascript expression. It can return the converted expressionand the result of evaluating it, or the error messages from the validation

## Demo https://ngeltman.github.io/exbuvasa/demo.html.

## Basic Usage with jQuery:
~~~
var ebvs=new exbuvasa({
  jqinputselector: "#expression", //required
  jqexpressionselector:"#resultingexpression", //optional
  jqresultselector: "#result" //optional
});
~~~

## Basic usage without jQuery
~~~
console.log(new exbuvasa().parse("2 in (1,2,3,4)").result);
~~~

Exbuvasa was inspired by filtrex (https://github.com/joewalnes/filtrex). But I needed to run it not only as a jquery plugin, but also inside a java scriptengine
