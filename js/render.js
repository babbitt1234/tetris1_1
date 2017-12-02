var canvas = document.getElementsByClassName( 'canvas' )[ 0 ];
var ctx = canvas.getContext( '2d' );
var W = 600, H = 600;
var BLOCK_W = W / COLS, BLOCK_H = H / ROWS;

function drawBlock( x, y ){
    ctx.fillRect( BLOCK_W * x, BLOCK_H * y, BLOCK_W - 1, BLOCK_H - 1);
    ctx.strokeRect( BLOCK_W * x, BLOCK_H * y, BLOCK_W - 1, BLOCK_H - 1);
}

//盤面と操作ブロックを描写する
function render(){
    ctx.clearRect( 0, 0, W, H );
    ctx.strokeStyle = 'black';


//盤面を一つずつ描写する
    for ( var y = 0; y < ROWS; ++y ){
        for ( var x = 0; x < COLS; ++x ){
            if ( board[ y ][ x ] ){
                ctx.fillStyle = colors[ board[ y ][ x ] - 1 ];
                drawBlock( x, y );
            }
        }
    }
    
//操作ブロックを一つずつ描画する
    for ( var y = 0; y < 4; ++y ){
        for ( var x = 0; x < 4; ++x ){
            if ( current[ y ][ x ] ){
                ctx.fillStyle = colors[ current [ y ][ x ] - 1];
                drawBlock( currentX + x, currentY + y ); 
            }
        }
    }
}

//30ミリ秒(0.03秒)ごとにrenderを呼び出す
setInterval( render, 30 );
