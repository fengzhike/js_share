
function foo() {
    console.log("first");
    setTimeout(( function(){
        console.log( 'second' );
    }),5);
}
 
for (var i = 0; i < 1000000; i++) {
    foo();
}
