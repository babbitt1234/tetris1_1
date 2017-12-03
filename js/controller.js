//キーボードを押すとイベント発生
document.body.onkeydown = function( e ){
    var keys = {
        37: 'left',
        39: 'right',
        40: 'down',
        32: 'rotate_right', //spaceキー
        18: 'rotate_left', //altキー
        88: 'next'
    };
    
//keysに存在する数字：typeof keys [ e.keyCode ] = string
    if ( typeof keys [ e.keyCode ] != 'undefined' ) {
        keyPress( keys[ e.keyCode ] );
        render();
    }
}