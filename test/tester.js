var unittest = function(title, result, expected) {
    var logger = document.getElementById("logger");
    var body = document.getElementById("body");
    var log = "";
    if(result === expected) {
        log = '<div class="log success"> <div class="title">' + title + '</div>';
    } else {
        body.className = "error";
        log = '<div class="log failed"><h2 class="title">' + title + ' failed!!!</h2><div class="expected"><h3>Expected:</h3>' + expected + '<br><br></div><div class="result"><h3>got:</h3>' + result + '<br><br></div></div>';
    }
    //console.log(title, "\n   Result:" , result, "\n   Expected:" , expected);
    logger.innerHTML = logger.innerHTML + log;

};

if(typeof $ == "undefined") {
    alert("you are runing the unittest without jQuery!");
}