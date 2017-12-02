var COLS = 20, ROWS = 20;
var board = [];
var lose;
var interval; //ゲームを実行するタイマーを保持する変数
var current; //今操作しているブロックの形
var currentX, currentY; //今操作しているブロックの位置

var cl = console.log;

//ブロックの形を定義
var shapes = [
    //id=0
    [1, 1, 1, 1],
    //id=1
    [1, 1, 1, 0, 
     1],
    //id=2
    [1, 1, 1, 0, 
     0, 0, 1],
    //id=3
    [0, 1, 1, 0,
     0, 1, 1],
    //id=4
    [1, 1, 0, 0,
     0, 1, 1],
    //id=5
    [0, 1, 1, 0,
     1, 1],
    //id=6
    [0, 1, 0, 0, 
     1, 1, 1]
];

//ブロックの色を定義
var colors  = [
    'rgb(115,251,253)', 'rgb(239,131,50)', 'rgb(0,35,244)', 'rgb(255,253,85)', 'rgb(234,50,35)', 'rgb(117,249,76)', 'rgb(234,63,247)'
];

//ブロックを上段にセット
function newShape(){
    var id = Math.floor( Math.random() * shapes.length );
    var shape = shapes[ id ]; //id=0だったら[1, 1, 1, 1]
    current = [];
    for ( var y = 0; y < 4; ++y ){
        current[ y ] = [];
        for ( var x = 0; x < 4; ++x ){
            var i = 4 * y + x;
            if ( typeof shape[ i ] != 'undefined' && shape[ i ] ){
                current[ y ][ x ] = id + 1;
            }
            else {
                current[ y ][ x ] = 0;
            }
        }
    }
    currentX = 8;
    currentY = 0;
}

//盤面を空にする
function init(){
    for ( var y = 0; y < ROWS; ++y ){
        board[ y ] = [];
        for ( var x = 0; x < COLS; ++x){
            board[ y ][ x ] = 0;
        }
    }
}

//一定の時間ごとに呼び出される関数
function tick(){
    if ( valid( 0, 1 ) ) {
        ++currentY;
    }else{
        freeze();
        clearLines();
        line = 0;
        if ( lose ){
            $("#bgm").get(0).pause();
            $("#bgm").get(0).currentTime = 0;
            $("#freeze_sound").get(0).pause();
            $("#freeze_sound").get(0).currentTime = 0;
            $("#game_over_sound").get(0).volume = 0.2;
            $.when(
                $("#game_over_sound").get(0).play()
            )
            .done(function(){
                alert('game over')
            });
            clearInterval(interval);
            
            return false;
        }
        newShape();
    }
}

//ブロックをフリーズ
function freeze(){
    for ( var y = 0; y < 4; ++y){
        for ( var x = 0; x < 4; ++x ){
            if ( current[ y ][ x ] ){
                board [ y + currentY ][ x + currentX ] = current [ y ][ x ];
            }
        }
    }
    $("#freeze_sound").get(0).volume = 0.2;
    $("#freeze_sound").get(0).play();
}

//操作ブロックの右回転
function rotateRight( current ){
    var newCurrent = [];
    for ( var y = 0; y < 4; ++y ){
        newCurrent [ y ] = [];
        for ( var x = 0; x < 4; ++x ){
            newCurrent [ y ][ x ] = current[ 3 - x ][ y ];
        }
    }
    return newCurrent;
}

//操作ブロックの左回転
function rotateLeft( current ){
    var newCurrent = [];
    for ( var y = 0; y < 4; ++y ){
        newCurrent [ y ] = [];
        for ( var x = 0; x < 4; ++x ){
            newCurrent [ y ][ x ] = current[ x ][ 3 - y ];
        }
    }
    return newCurrent;
}

//揃ったラインのクリア
var line = 0;
var score = 0;
function clearLines(){
    for ( var y = ROWS - 1; y >= 0; --y ){
        var rowFilled = true;
        for ( var x = 0; x < COLS; ++x ){
            if ( board [ y ][ x ] == 0 ){
                rowFilled = false;
                break;
            }
        }
        if ( rowFilled ){
            
            for ( var yy = y; yy > 0; --yy ){
                for ( var x = 0; x < COLS; ++x ){
                    board[ yy ][ x ] = board[ yy - 1 ][ x ];
                }
            }
            if(line > 0){
                alert('good!');
            }
            ++y;
            ++line;
            
            score += 100; //1行消すと100点
            $('.score span').text(score);
            
            $("#clear_sound").get(0).volume = 0.2;
            $("#clear_sound").get(0).play();
        }
    }
}

//if(score > 99){
//    interval = setInterval(tick, 500);
//}

//キーボードが押した時の関数
var count = 0;
function keyPress( key ){
    switch( key ){
        case 'left': //e.keyCode = 37
            if( valid( -1 ) ){
                --currentX; 
            }
            $("#move_sound").get(0).volume = 0.2;
            $("#move_sound").get(0).play();

            break;

        case 'right': //e.keyCode = 39
            if( valid ( 1 ) ){
                ++currentX; 
            }
            $("#move_sound").get(0).volume = 0.2;
            $("#move_sound").get(0).play();
            
            break;

        case 'down': //e.keyCode = 40
            if( valid( 0, 1 ) ){
                ++currentY; 
            }
            
            break;
            
        case 'rotate_right': //e.keyCode = 40
            var rotated = rotateRight( current );
            if ( valid( 0, 0, rotated ) ){
                current = rotated; 
            }
            $("#rotate_sound").get(0).volume = 0.2;
            $("#rotate_sound").get(0).play();

            break;

        case 'rotate_left': //e.keyCode = 16
            var rotated = rotateLeft( current );
            if ( valid( 0, 0, rotated ) ){
                current = rotated;
            }
            $("#rotate_sound").get(0).volume = 0.2;
            $("#rotate_sound").get(0).play();
            
            break;

        case 'next': //e.keyCode = 88
            newShape();
            count++;
            if(count == 3){
            $('.wrapper_outer').animate({zIndex:1},{
                duration:8000,
                step:function(now){
                    $(this).css({transform:'rotate(' + (now * 1800) + 'deg)'});
                },
                complete:function(){
                    $('.wrapper_outer').css('zIndex', 0);
                }
            });
            count = 0;
            }
            
            break;
            return false;
    }
}

//ブロックが動くかのチェック
function valid ( offsetX, offsetY, newCurrent ){
    offsetX = offsetX || 0;
    offsetY = offsetY || 0;
    offsetX = currentX + offsetX;
    offsetY = currentY + offsetY;
    newCurrent = newCurrent || current;
    for ( var y = 0; y < 4; ++y ){
        for ( var x = 0; x < 4; ++x ){
            if ( newCurrent [ y ][ x ] ){
                if ( typeof board [ y + offsetY ] == 'undefined'
                   || typeof board[ y + offsetY ] [ x + offsetX ] == 'undefined'
                   || board [ y + offsetY ][ x + offsetX ]
                   || x + offsetX < 0
                   || y + offsetY >= ROWS
                   || x + offsetX >= COLS ){
                       if ( offsetY == 1 && offsetX - currentX == 0 && offsetY-currentY == 1){
                           lose = true;
                       }
                       return false;
                    }
            }
        }
    }
    return true;
}

//ゲームスタート関数
function newGame(){
    clearInterval(interval);
    init();
    newShape();
    lose = false; 
    if($('[name=level]').val() == '1') {
        interval = setInterval(tick, 500)
    }else if($('[name=level]').val() == '2') {
        interval = setInterval(tick, 300)
    }else if($('[name=level]').val() == '3'){
        interval = setInterval(tick, 100)
    }

    $("#bgm").get(0).volume = 0.2;
    $("#bgm").get(0).currentTime = 0;
    $("#bgm").get(0).play();
}

//プレイ一時停止•再開ボタン
$(".pause_button").on('click', function(){
    if($(this).hasClass("clicked")){
        clearInterval(interval);
        $(".pause_button").removeClass("clicked");
    }else{
        $(".pause_button").hasClass("");
        if($('[name=level]').val() == '1') {
            interval = setInterval(tick, 500)
        }else if($('[name=level]').val() == '2') {
            interval = setInterval(tick, 300)
        }else if($('[name=level]').val() == '3'){
            interval = setInterval(tick, 100)
        }
        $(".pause_button").addClass("clicked");
    }
});

//BGM停止•再生ボタン
$(".soundBtn").on('click', function(){
    if($(this).hasClass("clicked")){
        $("#bgm").get(0).pause();
        $("#rotate_sound").get(0).muted = true;
        $("#clear_sound").get(0).muted = true;
        $("#freeze_sound").get(0).muted = true;
        $("#move_sound").get(0).muted = true;
        $("#game_over_sound").get(0).muted = true;
        $(".soundBtn").removeClass("clicked");
    }else{
        $(".soundBtn").hasClass("");
        $("#bgm").get(0).play();
        $("#rotate_sound").get(0).muted = false;
        $("#clear_sound").get(0).muted = false;
        $("#freeze_sound").get(0).muted = false;
        $("#move_sound").get(0).muted = false;
        $("#game_over_sound").get(0).muted = false;
        $(".soundBtn").addClass("clicked");
    }
});

//ゲームスタートボタン
$('.new_game').on('click', function(){
    newGame();
});

//------------------------ゴミ箱-------------------------



