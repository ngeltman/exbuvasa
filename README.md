# exbuvasa
EXpression BUilder VAlidator and SAnitizer for javascript

Exbuvasa can be used as with or without jquery.
If used with jquery it shows available terms as jquery-ui autocomplete (if available).

Demo

#Basic Usage with jQuery:

var ebvs=new exbuvasa({
  jqinputselector: "#expression", //required
  jqexpressionselector:"#resultingexpression", //optional
  jqresultselector: "#result" //optional
});

#Basic usage without jQuery

console.log(new exbuvasa().parse("2 in (1,2,3,4)").result);


Exbuvasa was inspired by filtrex (https://github.com/joewalnes/filtrex). But I needed to run it not only as a jquery plugin, but also inside a java scriptengine
