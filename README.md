# exbuvasa
EXpression BUilder VAlidator and SAnitizer for javascript

Exbuvasa can be used as with or without jquery.
If used with jquery it shows available terms as jquery-ui autocomplete (if available).

Demo

Basic Usage with jQuery:

var ebvs=new exbuvasa({
  jqinputselector: "#expression", //required
  jqexpressionselector:"#resultingexpression", //optional
  jqresultselector: "#result" //optional
});




Exbuvasa was inspired by filtrex (https://github.com/joewalnes/filtrex). But I needed to run it not only as a jquery plugin, but also inside a java scriptengine
