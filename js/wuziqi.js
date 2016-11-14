	$(function(){
//		var audio=$('audio').get(0); 
		var canvas = $('#canvas').get(0);
		var canvasa = $('#canvas2').get(0);
		var canvasb = $('#canvas3').get(0);
		var ctx = canvas.getContext('2d');
		var ctxa = canvasa.getContext('2d');
		var ctxb = canvasb.getContext('2d');
		var sep = 40;
		var sR=4;
		var bR=20;
		var qizi={};
		var audio1=$('#audio1').get(0);
		var audio2=$('#audio2').get(0);
		var kongbai={};
		var flag=true;
		var AI=false;
		var gameState="pause";
//		画棋盘	
//		更精准
		function m(x,y){
			return x+"_"+y
		}
		function l(x) { 
			return (x + 0.5) * sep + 0.5;
		}
		
		function drawQipan(){
			ctx.clearRect(0,0,600,600)
			ctx.save();
			ctx.beginPath();
			for(var i=0;i<15;i++){
				ctx.moveTo(l(0),l(i));
			    ctx.lineTo(l(14),l(i))
			    
			    ctx.moveTo(l(i),l(0));
			    ctx.lineTo(l(i),l(14))			    
			}
			for(var i=0;i<15;i++){
				for(var j=0;j<15;j++){
					kongbai[m(i,j)]=true;
				}
			}			
			ctx.closePath();
			ctx.stroke()
			ctx.restore();
		}
		drawQipan()
		
		
		function qipan() {
			ctx.beginPath();
			for (var i = 0; i < 15; i++) {
				ctx.moveTo(l(0), l(i));
				ctx.lineTo(l(14), l(i));
				ctx.moveTo(l(i), l(0));
				ctx.lineTo(l(i), l(14));
			}
			ctx.closePath()
			ctx.stroke()
		}
		qipan();
		
//		小圆点
		function circle(x,y){
			ctx.save();
			ctx.beginPath();
			ctx.arc(sep*x+20.5,sep*y+20.5,sR,0,Math.PI*2);			
			ctx.closePath();
			ctx.fill();
			ctx.restore();
		}
		function circledy(){
			circle(3,3);
			circle(11,3);
			circle(3,11);
			circle(11,11);
			circle(7,7);
		}
		circledy();
		
		
	
//		落棋子
		var qizi={};
		function luozi(x,y,color){
			ctx.save();
			ctx.beginPath();
			ctx.translate(sep*x+20.5,sep*y+20.5);
			if(color==='black'){
				var g=ctx.createRadialGradient(-5, -5, 0.1, 0, 0, 15);
					g.addColorStop(0.1,'#eee');
					g.addColorStop(0.4,'#000');
					g.addColorStop(1,'#000');					
					ctx.fillStyle = g ;
			}else {
				var g=ctx.createRadialGradient(-5, -5, 0.1, 0, 0, 15);
					g.addColorStop(0.1,'#ccc');
					g.addColorStop(0.4,'#eee');
					g.addColorStop(1,'#fff');
					ctx.fillStyle = g ;
			}
       		ctx.shadowOffsetX=2;
        	ctx.shadowOffsetY=3;
        	ctx.shadowBlur=4;
        	ctx.shadowColor="rgba(0,0,0,0.5)"
        				
			
			
			ctx.arc(0,0,bR,0,Math.PI*2);
			ctx.fill();
			ctx.closePath();
			ctx.restore();
			qizi[m(x,y)]=color;
			delete kongbai[m(x,y)];
			gameState="play";
		}


		var pos={};
		function intel(x,y){
			var max=-Infinity;
			for(var k in kongbai){
				var sr=k.split("_");
				var x=parseInt(sr[0])
				var y=parseInt(sr[1])
				var m=cal(x,y,"black");				
			    if(m>max){
					max=m;
					pos.x=x;
					pos.y=y;
					 audio1.play();				 
			    }				
			}
			var max2=-Infinity;
			var pos2={};
			for(var k in kongbai){
				var x=parseInt(k.split("_")[0]);
				var y=parseInt(k.split("_")[1]);
				var m=cal(x,y,"white");
				if(m>max2){
					max2=m;
					pos2.x=x;
					pos2.y=y;
					audio2.play();
				}
			}
			
			if(max>max2){
				return pos;
			}else{
				return pos2;
			}
			
		}

		//点击落子				
		function handleClick(e){			
			var x=Math.floor(e.offsetX/sep)
			var y=Math.floor(e.offsetY/sep)			
			if(qizi[m(x,y)]){
				return;
			}
			if(AI){				
				luozi(x,y,"black");
			    if(cal(x,y,"black")>=5){
					$(canvas).off("click");
					$(".info").addClass("active");
					$("#text").text("黑棋赢");
			    };
				var p=intel();
				luozi(p.x,p.y,"white");
				if(cal(p.x,p.y,"white")>=5){
					$(canvas).off("click");
					$(".info").addClass("active");
					$("#text").text("白棋赢");
				}
				return false;
			}
			if(flag){
				luozi(x,y,"black")                
				 cal(x,y,"black")
				 if(cal(x,y,"black")>=5){
				 	$(".info").find("#text").html("黑棋赢").end().addClass("active")
				 	$(canvas).off("click")	

				 }
				  audio1.play();				 
			}else{				
				luozi(x,y,"write")
				cal(x,y,"write")
				if(cal(x,y,"write")>=5){
				 	$(".info").find("#text").html("白棋赢").end().addClass("active")
				 	$(canvas).off("click")				 	
				}
					 audio2.play();
			}
			flag=!flag;
		}
		$(canvas).on("click",handleClick)


		var kaiguan=true;
		$(canvas).on("click",function(e){
			var x=Math.floor(e.offsetX/sep);
			
			var y=Math.floor(e.offsetY/sep);
			if(qizi[m(x,y)]){
				return;
			}
			if(kaiguan){
				luozi(x,y,'black');
				if(cal(x,y,'black')>=5){
					alert('黑棋赢');
					$(canvas).off('click');
					chessManual();
				}
				audio1.play();


			}else{
				luozi(x,y,'white');
				if(cal(x,y,'white')>=5){
					alert('白棋赢')
					$(canvas).off('click');
					chessManual();
				}
				audio2.play();

			}
			kaiguan=!kaiguan;
			
		})
		function m(x,y){
			return x+"_"+y;
		}

//		
//	判断横竖斜的5颗	
		function cal(x,y,color){
			var r=1;
			var i;
			i=1;
			while(qizi[m(x+i,y)]===color){
				r++;
				i++
			}
			i=1;
			while(qizi[m(x-i,y)]===color){
				r++;
				i++
			}
			
			var lie=1;
			i=1;while(qizi[m(x,y-i)]===color){lie++;i++}
			i=1;while(qizi[m(x,y+i)]===color){lie++;i++}
			var zX=1;
			i=1;while(qizi[m(x+i,y+i)]===color){zX++;i++}
			i=1;while(qizi[m(x-i,y-i)]===color){zX++;i++}
			var yX=1;
			i=1;while(qizi[m(x+i,y-i)]===color){yX++;i++}
			i=1;while(qizi[m(x-i,y+i)]===color){yX++;i++}
			return Math.max(r,lie,zX,yX);
		}
		
		
//		function cal(x,y){
//			r=1;
//			var i=1;
//			while(qizi[m(x+i,y)]==='black'){
//				r++;
//				i++;
//			}
//			var i=1;
//			while(qizi[m(x-i,y)]==='black'){
//				r++;
//				i++;
//			}
//			return r ;
//		}
//		判断左
//		function panduan(x,y){
//			r=0;
//			if(qizi[m(x+1,y)]==='black'){
//				r+=1;
//				if(qizi[m(x+2,y)]==='black'){
//					r+=1;
//					if(qizi[m(x+3,y)]==='black'){
//						r+=1;
//						if(qizi[m(x+4,y)]==='black'){
//							r+=1;
//						}
//					}
//				}
//			}	
//		return r;
//		}
//		 弹框           下载
		chessManual=function(){			
			ctx.save();
			ctx.font="20px/1  微软雅黑";
            var i=1;
            ctx.textBaseline="middle";
            ctx.textAlign="center";            
            for(var k in qizi){ 
//          	console.dir(k)
//          	console.dir(qizi)
            	var arr=k.split("_");
            	if(qizi[k]==="write"){
	            	ctx.fillStyle="black";

	            }else{
	            	ctx.fillStyle="white";
	            }
            	ctx.fillText(i++,l(parseInt(arr[0])),l(parseInt(arr[1])));            	
            } 
            ctx.restore();			
//			$(".box").show();			
//			$("<img>").attr("src",canvas.toDataURL()).appendTo(".box")			
//			$("<a>").attr("href",canvas.toDataURL()).attr("download","qipu.png").appendTo(".box")
            if($(".box").find("img").length){
            	$(".box").find("img").attr("src",canvas.toDataURL())
            }else{
            	$("<img>").attr("src",canvas.toDataURL()).appendTo(".box")
            }
            
            if($(".box").find("a").length){
            	$(".box").find("a").attr("href",canvas.toDataURL())
            }else{
            	$("<img>").attr("href",canvas.toDataURL())
            	$("<a>").attr("href",canvas.toDataURL()).attr("download","qipu.png").appendTo(".box")
            }
		}
		
		$(".ai").on("click",function(){
			if(gameState==="play"){
				return
			}
			$(".chioce").children().removeClass("color");
			$(this).addClass("color");
			AI=true;
//			flag=false;
		})
		$(".normal").on("click",function(){
			if(gameState==="play"){
				return
			}
			$(".chioce").children().removeClass("color");
			$(this).addClass("color");
			AI=false;
			flag=true;
		})
		        //查看棋谱
	 function manual(){
        	chessManual()
        }
        $(".look").on("click",function(){
        	manual()
        	$(".box").addClass("activea")
        })
       
        //去除棋谱谱
        $(".delect").on("click",function(){
        	$(".box").removeClass("activea")
        	drawQipan()
        	for(var k in qizi){
        		console.log(k)
        		var x=parseInt(k.split("_")[0]);
        		var y=parseInt(k.split("_")[1]);
        		luozi(x,y,qizi[k])
        	}
        })        
        
        //再来一局
        function restart(){
        	drawQipan()
        	$(".info").removeClass("active");
        	$(canvas).on("click",handleClick)
        	qizi={};
        	flag=true;
        	gameState='pause';
        }        
        $(".again").on("click",restart) 
//重新开始
		function restart(){
        	drawQipan()
        	$(".info").removeClass("active");
        	$(canvas).on("click",handleClick)
        	qizi={};
        	flag=true;
        	gameState='pause';
        }        
        $(".cxks").on("click",restart) 
//  退出    
	function restart(){
        	drawQipan()
        	$(".info").removeClass("active");
        	$(canvas).on("click",handleClick)
        	qizi={};
        	flag=true;
        	gameState='pause';
        	
			circledy();

        }        
        $(".cancal").on("click",restart) 	
	
	
	
	
		function wz1(color){
			ctxa.save();
			ctxa.beginPath();
			ctxa.translate(150,150);
			ctxa.font='30px/1  微软雅黑';
			ctxa.fillStyle='#000';
			ctxa.textAlign='center';
			ctxa.textBaseline='middle';
			ctxa.fillText('计         时',0,0);			
			ctxa.closePath();
			ctxa.restore();		
		}
		wz1();
		
		function miaozhen1(){
			ctxa.save()		
			ctxa.beginPath();			

			ctxa.translate(150,150)
			
			ctxa.arc(0,0,20,0,Math.PI*2)
			ctxa.moveTo(0,20)
			ctxa.lineTo(0,40)
			ctxa.moveTo(0,-20)
			ctxa.lineTo(0,-120)
			ctxa.closePath();
			ctxa.stroke()
			ctxa.restore();
		}
	miaozhen1();
		
	
		
		
	})
	