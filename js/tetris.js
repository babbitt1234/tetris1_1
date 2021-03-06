var COLS = 35, ROWS = 20;
var board = [];
var lose;
var interval; //ゲームを実行するタイマーを保持する変数
var current = [];
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
    'rgb(115,251,253)',
    'rgb(239,131,50)',
    'rgb(0,35,244)',
    'rgb(255,253,85)',
    'rgb(234,50,35)',
    'rgb(117,249,76)',
    'rgb(234,63,247)'
];

//次のブロック
var imgs  = [
    'img/waterblue.png',
    'img/orange.png',
    'img/blue.png',
    'img/yellow.png',
    'img/red.png',
    'img/green.png',
    'img/purple.png',
];

//ブロックをセット
var id2;
var number = 0;
function newShapeOuter(){
    if(number == 0){
        function newShape(){
            var id = Math.floor(Math.random() * shapes.length );
            var shape = shapes[ id ];
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
            currentX = 16;
            currentY = 0;
        }
        newShape();
    }else if(number > 0){
        function newShape2(){
            var shape2 = shapes[ id2 ];
            for ( var y = 0; y < 4; ++y ){
                current[ y ] = [];
                for ( var x = 0; x < 4; ++x ){
                    var i = 4 * y + x;
                    if ( typeof shape2[ i ] != 'undefined' && shape2[ i ] ){
                        current[ y ][ x ] = id2 + 1;
                    }
                    else {
                        current[ y ][ x ] = 0;
                    }
                }
            }
            currentX = 16;
            currentY = 0;
        }
        newShape2();
    }
    number++;
    
    function next(){
        id2 = Math.floor(Math.random() * imgs.length);
        var randImg = imgs[ id2 ];
        $('.next_pic').attr('src', randImg);
    }
    next();
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

//ブロックを空にする
function initBlock(){
    for ( var y = 0; y < 4; ++y ){
            current[ y ] = [];
        for ( var x = 0; x < 4; ++x){
            current[ y ][ x ] = 0;
        }
    }
}

//一定の時間ごとに呼び出される関数
var speed_up_score = 500;
var timer = 450;
function tick(){
    if ( valid( 0, 1 ) ) {
        ++currentY; 
    }else{
        freeze();
        clearLinesOuter();
        
//得点を重ねるとスピードアップ
        if( score >= speed_up_score ){
            point(timer);
            speed_up_score = speed_up_score + 500;
            timer = timer - 25;
        }
        
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
        newShapeOuter();
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
var score = 0;
var line = 0;
var lines = 0;
function clearLinesOuter(){
    
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
                ++y;
                ++line;
                ++lines;
                $('.clear_line').text(lines);
            }
        }
    }
    
    clearLines();
    
    if(line == 1){
        $("#clear_sound").get(0).volume = 0.2;
        $("#clear_sound").get(0).play();
        score += 100;
        $('.score').text(score);
    }else if(line == 2){
        $("#clear_sound").get(0).volume = 0.2;
        $("#clear_sound").get(0).play();
        cl('good!');
        score += 300;
        $('.score').text(score);
    }else if(line == 3){
        $("#clear_sound").get(0).volume = 0.2;
        $("#clear_sound").get(0).play();
        cl('very good!');
        score += 600;
        $('.score').text(score);
    }else if(line == 4){
        $("#perfect_sound").get(0).volume = 0.2;
        $("#perfect_sound").get(0).play();
        cl('perfect!');
        score += 1000;
        $('.score').text(score);
    }
    line = 0;
}

//スピードアップの関数
function point(speed){
    clearInterval(interval);
    if($('[name=level]').val() == '1') {
        interval = setInterval(tick, speed)
    }else if($('[name=level]').val() == '2') {
        interval = setInterval(tick, speed - 30)
    }else if($('[name=level]').val() == '3'){
        interval = setInterval(tick, speed - 30)
    }
}
    
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
           

        case 'rotate_left': //e.keyCode = 18
            var rotated = rotateLeft( current );
            if ( valid( 0, 0, rotated ) ){
                current = rotated;
            }
            $("#rotate_sound").get(0).volume = 0.2;
            $("#rotate_sound").get(0).play();
            break;

        case 'next': //e.keyCode = 88
            newShapeOuter();
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

//ゲームスタート関数
function newGame(speed){
    clearInterval(interval);
    init();
    newShapeOuter();
    lose = false;
    if($('[name=level]').val() == '1') {
        interval = setInterval(tick, speed)
    }else if($('[name=level]').val() == '2') {
        interval = setInterval(tick, speed - 200)
    }else if($('[name=level]').val() == '3'){
        interval = setInterval(tick, speed - 400)
    }

    $("#bgm").get(0).volume = 0.2;
    $("#bgm").get(0).currentTime = 0;
    $("#bgm").get(0).play();
}

//ゲームスタートボタン
$('.new_game').on('click', function(){
    newGame(500);
});

init();
initBlock();

//--------------------------ゴミ箱------------------------------
 



