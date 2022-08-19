exports.getDate = function(){

  var today = new Date();
  var options = {
    weekday : "long",
    day : "numeric",
    month : "long",
    year : "numeric"
  };
  return today.toLocaleString("en-US",options);

}

exports.getDay = function(){
  var today = new Date();
  var options = {
    weekday : "long",
  };
  return today.toLocaleString("en-US",options);
}
