
var canvas; // キャンバス
var ctx;    // コンテキスト
var ctx2;
     
var canvas_magnification = 10;    // 表示倍率  
var canvas_width  = 28;           // キャンバス横幅   
var canvas_height = 40;           // キャンバス縦幅 
var canvas_mousedown_flg = false; // マウスダウンフラグ
     
///// 内部関数
function init_canvas(){
    canvas_mousedown_flg = false;
    ctx.fillStyle = "rgb(255, 255, 255)";  
    ctx.fillRect(0,0,canvas.width,canvas.height);                 
    drawRule();  
}
       
// 座標からブロック名を取得する   
function Point2BlockName(x,y){  
    var col = 'C' + (Math.floor(x / canvas_magnification)+1);
    var row = 'R' + (Math.floor(y / canvas_magnification)+1);
    document.getElementById('msg3').innerHTML = 'セル番号　' +row + ' x ' + col;
}  
     
// キャンバスに罫線を描画する
function drawRule(){
    // 線の色
    ctx.strokeStyle = "#1e90ff";
    // 線の太さ
    ctx.lineWidth = 2;
    // 破線
    if (ctx.setLineDash){
        ctx.setLineDash([1, 2]);
    }
      
    ctx.beginPath();

    // 縦線
    for (var i = 0; i < canvas_width+1; i++) {
        ctx.moveTo((i*canvas_magnification),0);
        ctx.lineTo((i*canvas_magnification),canvas.height);
    } 
    // 横線
    for (var i = 0; i < canvas_height+1; i++) {
        ctx.moveTo(0,(i*canvas_magnification));
        ctx.lineTo(canvas.height,(i*canvas_magnification));
    } 
    ctx.stroke();

      /*
    ctx.arc( 100, 100, 50, 0 * Math.PI / 180, 360 * Math.PI / 180, false ) ;
    // 塗りつぶしの色
    ctx.fillStyle = "rgba(255,0,0,0.8)" ;
    // 塗りつぶしを実行
    ctx.fill() ;
    // 線の色
    ctx.strokeStyle = "purple" ;
    // 線の太さ
    ctx.lineWidth = 8 ;
    */

    //既知点受信機
    ctx.fillStyle = "rgb(0, 0, 0)";  
    ctx.fillRect(0 * canvas_magnification, 14.5 * canvas_magnification,
                   canvas_magnification, canvas_magnification);
    //既知点(beacon1)
    ctx.fillStyle = "rgb(200, 0, 0)";  
    ctx.fillRect(0 * canvas_magnification, 0 * canvas_magnification,
                   canvas_magnification, canvas_magnification);
                
    //beacon1の理想電波範囲
    ctx.beginPath();
    ctx.strokeStyle = "red";  
    ctx.arc(0, 10, 140, 0, Math.PI, false);
    ctx.stroke();

    //既知点(beacon2)
    ctx.fillStyle = "rgb(200, 0, 200)";  
    ctx.fillRect(27 * canvas_magnification, 0 * canvas_magnification,
                   canvas_magnification, canvas_magnification);

    //beacon2の理想電波範囲
    ctx.beginPath();
    ctx.strokeStyle = "purple";  
    ctx.arc(270, 0, 305, 0, Math.PI, false);
    ctx.stroke();

    //既知点(beacon3)
    ctx.fillStyle = "rgb(200, 200, 0)";  
    ctx.fillRect(0 * canvas_magnification, 39 * canvas_magnification,
                   canvas_magnification, canvas_magnification);

    //beacon3の理想電波範囲
    ctx.beginPath();
    ctx.strokeStyle = "blue";  
    ctx.arc(0, 400, 250, 0, Math.PI, true);
    ctx.stroke();
}
     
///// イベント
window.onload = function (){
    // キャンバス
    canvas = document.getElementById("MyCanvas");
    canvas.width  = canvas_width * canvas_magnification;
    canvas.height = canvas_height * canvas_magnification;    
      
    ctx = canvas.getContext("2d");
    //ctx2 = canvas.getContext("2d");
      
    //canvas.addEventListener('mousedown', OnMousedown);
    canvas.addEventListener('mousemove', OnMousemove);
    canvas.addEventListener('mouseup', OnMouseup);
    window.addEventListener('mouseup', OnMouseup);
      
    init_canvas();              
}
     
    /*
    function OnMousedown(e) {
      var rect = e.target.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top; 
            
      // 塗りつぶし
      var col = Math.floor(mouseX / canvas_magnification);
      var row = Math.floor(mouseY / canvas_magnification);
      
      ctx.fillStyle = "rgb(200, 0, 0)";  
      ctx.fillRect(col * canvas_magnification, row * canvas_magnification,
                   canvas_magnification, canvas_magnification);
      
      // 罫線の描画
      drawRule();
      
      document.getElementById('msg2').innerHTML = 'マウスダウン　X:' +mouseX + ' Y' +mouseY;
      
      canvas_mousedown_flg = true;
    }
    */
     
function OnMousemove(e) {
    var rect = e.target.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top; 

    if (canvas_mousedown_flg){
        // 塗りつぶし
        var col = Math.floor(mouseX / canvas_magnification);
        var row = Math.floor(mouseY / canvas_magnification);
          
        ctx.fillStyle = "rgb(200, 0, 0)";  
        ctx.fillRect(col * canvas_magnification, row * canvas_magnification, 
                       canvas_magnification, canvas_magnification);
          
        drawRule();
    }  
     
    document.getElementById('msg1').innerHTML = '現在座標　X:' +mouseX + ' Y' +mouseY;
    Point2BlockName(mouseX,mouseY);
}
     
function OnMouseup(e) {
    canvas_mousedown_flg = false; 
}


//
var sum = function(arr, fn) {
    if (fn) {
        return sum(arr.map(fn));
    }
    else {
        //prev:累積数, current:要素
        return arr.reduce(function(prev, current) {
                return prev+current;
        });
    }
};
var average = function(arr, fn) {
    return sum(arr, fn)/arr.length;
};

let avg_d = {
    0: 0,
    1: 0,
    2: 0
};

function getAvgDis(i){
    console.log(`avg_d[i] : ${JSON.stringify(avg_d)} : ${i}`);
    return avg_d[i];
}


function getDatas(){
    fetch('/getStatus').then(res => res.json()).then(
        r => {
            console.log(`----------------fetch start`);
            document.getElementById('beacon-status').textContent = '';
            let target_div = document.getElementById('beacon-status');
            
            for(let i = 0; i < r.data.length; i++){
                let target_html =  `<ul class="child-status">`;
                target_html += `<li>ID: ${r.data[i][0].key}</li>`;
                let dist = [];
                for(let row of r.data[i]){
                    dist.push(Number(row.distance));
                }
                let avg_disc = average(dist);
                target_html += `<li class="newline">AVG Distance: ${avg_disc.toFixed(2)}</li>`;
                avg_d[i] = avg_disc.toFixed(2);
                
                for(let row of r.data[i]){
                    //avg_d.push(Number(row.distance).toFixed(2));
                    let avg = Number(row.distance).toFixed(2);
                    target_html += `<li>distance: ${avg}</li>`;
                }
                target_html += `</ul>`;
                target_div.insertAdjacentHTML('afterbegin', target_html);
            }
        });
}



setInterval(getDatas, 10000);
getDatas();