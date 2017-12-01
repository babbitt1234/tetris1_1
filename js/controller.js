//キーボードを押すとイベント発生
document.body.onkeydown = function( e ){
    var keys = {
        37: 'left',
        39: 'right',
        40: 'down',
        32: 'rotate_right', //spaceキー
        16: 'rotate_left', //shiftキー
        88: 'next'
    };
    
    //keys[ e.keyCode ] = leftやundefinedなどの文字が入る
    //keysに存在する数字：typeof keys [ e.keyCode ] = string
    //keysに存在しない数字：typeof keys [ e.keyCode ] = undefined
    if ( typeof keys [ e.keyCode ] != 'undefined' ) {
        //存在しているkeyの場合はtetris.jsに記述された処理を呼び起こす
        keyPress( keys[ e.keyCode ] );
        //描画処理を行う
        render();
    }
}