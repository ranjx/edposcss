var handle;
$(document).ready(function () {
    second = 10;
    handle = setInterval("timer()",1000);

});
function timer(){
    $("#timer").text(second);
    second--;
    if(second < 0){
        clearInterval(handle);
        window.location.href = forwardUrl;
    }
}