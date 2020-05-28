# Exbuvasa
EXpression BUilder VAlidator and SAnitizer for javascript

Expressions can be built using a set of predefined or user defined functions, operators and variables. This keeps yours expressions safe from containing dangerous or injected code. 

Exbuvasa can be used with or without jquery.

If used with jquery inside an input of type text, it shows available terms as jquery-ui autocomplete (if available) and colors the background of the input according to the result of validating the expression. It also restricts the special characters (other but numbers and letters) that the user can type inside the input field.

Whitout jquery, exbuvasa can be given and expression that would be validated and converted to a javascript expression. It can return the converted expressionand the result of evaluating it, or the error messages from the validation

## Demo 
[Demo](https://ngeltman.github.io/exbuvasa/demo.html)

## Basics
Given an expression, exbuasa parses it and returns an obect containing:
~~~
"ok": true if the expression has succesfully parsed and evaluated
"msg": error messages,
"terms": array of terms that conform the resulting expression,
"expression": resulting javascript expression,
"result": result of evaluating the resulting expression
~~~

## Basic Usage with jQuery:
~~~
var props={
  jqinputselector: "#expression"
};
var ebvs=new exbuvasa(props);
~~~
jqinputselector has to be an input of type text or textarea

As the user types an expression, exbuvasa sets the following attributes on the element (ie #expression)
~~~
exbuvasa-ok
exbuvasa-result
exbuvasa-msg
exbuvasa-expression
~~~

## Basic usage without jQuery
~~~
console.log(new exbuvasa(props).parse("2 in (1,2,3,4)").result);
~~~

## Functions and operators

You can use the built in functions and operators or define your own.

Built in operators:

**and**

**or**

**not**

**gt** (>)

**ge** (>=)

**lt** (<)

**le** (<=)

**eq** (==)

**neq** (!=)

**in**  ie: 'a' in ('c','b','a') returns true

**contains** ie: 'javascript' contains('java') returns true


Built in functions:

**left** ie: left('javascript',4) returns 'java'

**right** ie: right('javascript',6) returns 'script'

**substring** ie: substring('javascript',2,4) returns 'va'

**date** converts a string to a Date object


## Properties
An object which can contain the following:

**okcolor**: default to '#dfd'

**notokcolor**: default to '#fdd'

**showtitle**: default to true. If true, the title attribute of the input field will show a status message, ie. an error. If false, then original title attribute for input field is kept.

**allowedchars**: defaults to "|!#%&/()=?',;.:-_+*@ ". String containing all special chars accepted as user input

**jqinputselector**: css selector used to find the input element/s to use with 

**jqexpressionselector**: element in which the resulting javascript expression will be showed

**jqresultselector**: element in which the result of evaluating te javascript expression will be showed

**text**:

**variables**: objecto containing names of variables mapped with its values. String values must be enclosed in single quotes. Example

~~~
~~~

**functions**: object containing names of the functions as string. The elements are the functions that the user types and the values are the names of the real functions as a string. The real functions has to be javascript native funcionts or exist elsewhere. Example:
~~~
functions:{
        "part_of_a_string": "substring",
        "date": "date",
        "make_upper_case": "ucase"
    }
~~~


Custom functions



Exbuvasa was inspired by filtrex (https://github.com/joewalnes/filtrex). But I needed to run it not only as a jquery plugin, but also inside a java scriptengine
