var COLS = 20, ROWS = 20;
var board = [];
//一番上まで行ったかどうか（lose=trueでゲームオーバー）
var lose;
//ゲームを実行するタイマーを保持する変数
var interval;
//今操作しているブロックの形
var current;
//今操作しているブロックの位置
var currentX, currentY;

var cl = console.log;

//--------------ブロックの形（パターン）を定義----------------
//0はマスなし、1はマスありと定義する
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
    [1, 1, 0, 0,
     1, 1],
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

//-------------------ブロックの色を定義--------------------
var colors  = [
    'rgb(115,251,253)', 'rgb(239,131,50)', 'rgb(0,35,244)', 'rgb(255,253,85)', 'rgb(234,50,35)', 'rgb(117,249,76)', 'rgb(234,63,247)'
];

//-------------------ブロックを上段にセット--------------------
//定義したブロックの形にidの番号を割り当てる(id=0~6)
function newShape(){
    //var idにはshapes内の0~6のランダムな値が入る。
    var id = Math.floor( Math.random() * shapes.length );
    //idを基にshapesからブロックをとりだす（id=0だったら[1, 1, 1, 1]の配列を取り出す）
    var shape = shapes[ id ]; 
    //操作ブロックを作成する
    //操作ブロックのための空の盤面（配列）をセットする
    current = [];
    //y列を0~3の4行と設定
    for ( var y = 0; y < 4; ++y ){
        //y列に空の配列をセットする
        current[ y ] = [];
        //x行を0~3の4列と設定（ここで4 * 4のブロックと決めている）
        for ( var x = 0; x < 4; ++x ){
            //i = 0~15(4 * 4のブロック)
            //4マス * y列数 + x
            var i = 4 * y + x;
            //shape[i]=4 * 4のブロックのいずれか(i=0~15)
            //typeof shape[i] = number
            //1.typeof shape[i] != 'undefined'は、値が入っていない時じゃない時（値(number)が入っている時）
            //2.また、shape[i]が0じゃない時(shape[i]が1の時)
            //※shape[i] = 0はfalseを返すので実行されずに次に行く
            if ( typeof shape[ i ] != 'undefined' && shape[ i ] ){
                //塗りつぶすマス
                //もしid=0だと、current[ y ][ x ]=0となりfalseとなるので、（マスを塗らないことになってしまうので）1をたす
                //よって配列にはid+1の数字が入る
                //また、色については、
                current[ y ][ x ] = id + 1;
            }
            else {
                //塗りつぶさないマス（0が入る）
                current[ y ][ x ] = 0;
            }
        }
    }
    //ブロックを盤面の一番上にセットする
    currentX = 8;
    currentY = 0;
}

//-------------------盤面を空にする------------------------
function init(){
    for ( var y = 0; y < ROWS; ++y ){
        //y列に空の配列をセットする
        board[ y ] = [];
        for ( var x = 0; x < COLS; ++x){
            //全てを0(false)にする
            board[ y ][ x ] = 0;
        }
    }
}

//-----------一定の時間ごとに呼び出される関数------------------
function tick(){
    //1つ下へ移動する
    //valid(offsetX=0, offasetY=1)
    if ( valid( 0, 1 ) ) {
        ++currentY;
    }
    //1つ下にブロックがあったら
     else{
         //ブロックを盤面に固定
         freeze();
         //ライン消去処理
         clearLines(); 
         //もしlose（ゲームオーバー）になったら（valid で lose = trueだったら）
         if ( lose ){
            //bgmを止める
            $("#bgm").get(0).pause();
            $("#bgm").currentTime = 0;
            setTimeout(function(){
                $("#freeze_sound").get(0).pause();
            },500);
            $("#game_over_sound").get(0).play()
            setTimeout(function(){
                $("#game_over_sound").get(0).pause();
            },2000);
             
            return false;
          }
         //新しいブロックをセットする
         newShape();
     }
}

//-------------------ブロックをフリーズ----------------------
function freeze(){
    for ( var y = 0; y < 4; ++y){
        //空の配列にセットしていくわけではないのでcurrent[ y ] = [];は不要
        for ( var x = 0; x < 4; ++x ){
            //もしcurrent=trueならば(1以上の数値が入るならば)
            if ( current[ y ][ x ] ){
                //curentY,currentXは固定した時の4*4ブロックまでの距離
                //board（全体）にcurrent（今のブロック）をセットする
                board [ y + currentY ][ x + currentX ] = current [ y ][ x ];
            }
        }
    }
    //ブロックフリーズ音
    $("#freeze_sound").get(0).play();
}

//-------------------ブロックの回転-------------------------
//操作ブロックの右回転処理
//rotate()で4*4のcanvasごと時計回りに回転させるイメージ
function rotateRight( current ){
    //回転後の操作ブロックの空の盤面をセット
    var newCurrent = [];
    for ( var y = 0; y < 4; ++y ){
        //y列に空の配列をセットする
        newCurrent [ y ] = [];
        for ( var x = 0; x < 4; ++x ){
            newCurrent [ y ][ x ] = current[ 3 - x ][ y ];
        }
    }
    //newCurrent（回転後のブロックの配列）を外に出す
    return newCurrent;
}

//操作ブロックの左回転処理
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

//------------------揃ったラインのクリアー--------------------
//score = 0からスタート
var score = 0;
//一行が揃っているか調べ、揃っていたらそれを消す
function clearLines(){
    //盤面の一番下（19番目の行）から上へと調べる
    for ( var y = ROWS - 1; y >= 0; --y ){
        //始めはブロックが入っているものとして(true)期待する
        var rowFilled = true;
        //y行のマスを左から順(x=0~9)に１つずつチェック
        for ( var x = 0; x < COLS; ++x ){
            if ( board [ y ][ x ] == 0 ){
                //そのy行に何もないマス(0)があったら
                rowFilled = false;
                //break直近のfor文の処理を終わらせ、その行のチェックを止めて一つ上の行のチェックに移る
                break;
            }
        }
        //もし一行揃ってたら、それらを消す
        //rowFilled=trueのままだったら
        if ( rowFilled ){
            //その上の行にあったブロックを一つずつ落としていく（yyは一列そろったy列）
            for ( var yy = y; yy > 0; --yy ){
                for ( var x = 0; x < COLS; ++x ){
                    board[ yy ][ x ] = board[ yy - 1 ][ x ];
                }
            }
            //一行落としたのでチェック処理を一つ下へ送る
            //もし仮に19行目がクリアになった場合、つぎは新たな19行目が揃っているかのチェックが必要なため
            ++y;
            
            //1行消すと100点
            score += 100;  
            $('.score span').text(score);
            
            //ブロック消える音
            $("#clear_sound").get(0).play();
            
        }
    }
}

//--------------キーボードが押した時の関数---------------------
//key = keys[ e.keyCode ](leftとかrightとか)
function keyPress( key ){
    switch( key ){
    case 'left':
        //e.keyCode = 37
        //varid(offsetX=-1)
        if( valid( -1 ) ){
            //左に一つずらす
            --currentX; 
        }
        //ブロック移動音
        $("#move_sound").get(0).play();
            
        break;
            
    case 'right':
        //e.keyCode = 39
        //varid(offsetX=1)
        if( valid ( 1 ) ){
            //右に一つずらす
            ++currentX; 
        }
        //ブロック移動音
        $("#move_sound").get(0).play();
            
        break;
            
    case 'down':
        //e.keyCode = 40
        //varid(offsetX=0, offsetY=1)
        if( valid( 0, 1 ) ){
            //下に一つずらす
            ++currentY; 
        }
        break;
    //操作ブロックを右回転
    case 'rotate_right':
        //e.keyCode = 40
        //操作ブロックを右回転
        var rotated = rotateRight( current );
        //offsetX、offasetYはともに0
        //newCurrentはrotated
        if ( valid( 0, 0, rotated ) ){
            //回転後のブロックの状態を、現在のブロックの状態と置き換える（配列を置き換える）
            current = rotated; 
        }
        //ブロック回転音
        $("#rotate_sound").get(0).play();
        break;
        
    //操作ブロックを左回転
    case 'rotate_left':
        var rotated = rotateLeft( current );
        if ( valid( 0, 0, rotated ) ){
            current = rotated; 
        }
        $("#rotate_sound").get(0).play();
        break;
            
     //パスして次のブロックを出す
     case 'next':
        newShape();
        break;
        
    }
}

//---------------ブロックが動くかのチェック--------------------
function valid ( offsetX, offsetY, newCurrent ){
    //この左のoffsetXは横の移動の距離(-1,0,1のいずれか)
    //offsetXが0だとfalseになってしまうので、||0としている。
    offsetX = offsetX || 0;
    //この左のoffsetYは縦の移動の距離(0,1のいずれか（上にはいかないので-1はなし）)
    //offsetYが0だとfalseになってしまうので、||0としている。
    offsetY = offsetY || 0;
    //この左のoffsetXは次の移動先
    offsetX = currentX + offsetX;
    //この左のoffsetYは次の移動先
    offsetY = currentY + offsetY;
    //回転後のブロック(newCurrent)に配列があるか（回転したか）。false（回転しなかったら）だったら、そのままのブロック（current)の配列が入る。
    newCurrent = newCurrent || current;
    for ( var y = 0; y < 4; ++y ){
        for ( var x = 0; x < 4; ++x ){
            //newCurrent[0][0]が１以上だったら(falseじゃなかったら)
            if ( newCurrent [ y ][ x ] ){
                //縦方向のブロックの長さ[y]+縦方向へのブロックの次の移動先[offsetY]が盤面の範囲外（20番目以降の行)だったら（配列の外だったら）
                //typeof board [ y + offsetY ] = object
                //board [ y + offsetY ] = (10) [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                if ( typeof board [ y + offsetY ] == 'undefined'
                    //横方向へのブロックの移動先が盤面外（左端を超えるor右端を超える）だったら（配列の外だったら）
                    //typeof board [ y + offsetY ][ x + offsetX ]=number
                    //board[ y + offsetY ] [ x + offsetX ] = 0
                   || typeof board[ y + offsetY ] [ x + offsetX ] == 'undefined'
                    //移動先のマス内が0でなく1だったら（色のマスがあったら）、
                   || board [ y + offsetY ][ x + offsetX ]
                    //横方向の移動先が盤面の左端を越えたら
                   || x + offsetX < 0
                    //縦方向の移動先が盤面の下端を超えるか、色付きブロックが１９番目の行に到達すれば
                   || y + offsetY >= ROWS
                    //横方向の移動先が盤面の右端を越えるか、色付きブロックがy+offsetY行目の９番目の列に到着すれば
                   || x + offsetX >= COLS ){
                       //上のif文のいずれか1つがtrueで、縦方向への移動量が1、かつ横方向への移動ができなくなった、かつ縦方向への移動が1しかできない
                       if ( offsetY == 1 && offsetX - currentX == 0 && offsetY-currentY == 1){
                           //ブロックが盤面の上に行ったらloseフラッグをtrueにする
                           lose = true;
                       }
                       //終了
                       return false;
                    }
            }
        }
    }
    //続ける
    return true;
}

//--------------------ゲームスタート関数----------------------
function newGame(){
    //タイマーリセット
    //setInterval( tick, 500 )をリセット
    clearInterval(interval);
    //盤面をまっさらに
    init();
    //操作ブロックをセット
    newShape();
    //負けフラッグ(falseにすることで、まだ負けてないよの状態)
    lose = false; 
    if($('[name=level]').val() == '1') {
        interval = setInterval(tick, 500)
    }else if($('[name=level]').val() == '2') {
        interval = setInterval(tick, 300)
    }else{
        interval = setInterval(tick, 100)
    }
    
    //BGMスタート
    $("#bgm").currentTime = 0;
    $("#bgm").get(0).play();
}

//-----------------------ボタン関係----------------------
//プレイ一時停止•再開ボタン
$(".pause_button").on('click', function(){
    if($(this).hasClass("clicked")){
        clearInterval(interval);
        $(this).attr('disabled', 'disabled');
        $('.pause_button').removeAttr('disabled');
        $(".pause_button").removeClass("clicked");
    }else{
        $(".pause_button").hasClass("");
        if($('[name=level]').val() == '1') {
            interval = setInterval(tick, 500)
        }else if($('[name=level]').val() == '2') {
            interval = setInterval(tick, 300)
        }else{
            interval = setInterval(tick, 100)
        }
        $(this).attr('disabled', 'disabled');
        $(".pause_button").addClass("clicked");
        $('.pause_button').removeAttr('disabled');
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
        $("#bgm").currentTime = 0;
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

//$('#re_start').on('click', function(){
//    newGame();
//});

//------------------------ゴミ箱-------------------------
////scoreテンプレート
//var score = 0;
//$('#button').on('click',function(){
//    score += 100;
//    $('.score span').text(score);
//});

////一時停止ボタン
//$('#pause_button').on('click',function(){
//    clearInterval(interval);
//    $(this).attr('disabled', 'disabled');
//    $('#restart_button').removeAttr('disabled');
//});

////再開ボタン
//$('#restart_button').on('click',function(){
//    interval = setInterval(tick, 500);
//    $(this).attr('disabled', 'disabled');
//    $('#pause_button').removeAttr('disabled');
//});


