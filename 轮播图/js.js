//want: 对象
//speed：时间间隔，默认：2000ms
function ads(want,speed){
	speed = speed || 2000;
	var adsbox = document.getElementById(want);
	picmove(adsbox,speed);
	if(document.addEventListener){
		console.log('not ie');
		adsbox.addEventListener("mouseover",stopscroll,false);
		adsbox.addEventListener("mouseout",startscroll,false);
	}else if(document.attachEvent){
		console.log('ie');
		adsbox.attachEvent("onmouseover",stopscroll);
		adsbox.attachEvent("onmouseout",startscroll);
	}	
}

function picmove(adsbox,speed){
	var list = adsbox.getElementsByTagName('li');
	var ease = Math.sqrt;
	var movetime = 500;//滑过时间
	var start = (new Date()).getTime();//start time
	animate();
	function animate(){
		var last = (new Date()).getTime() - start;//last time
		var fraction = last/movetime;//总时间的几分之几
		if(fraction < 1){//未完成动画
			var leftdis = "";
			console.log('a');
			setTimeout(animate,
				Math.min(25,(movetime - last)));
		}
		else {
			console.log(document.getElementById('box').style.width);
		}

	}
}

function stopscroll(e){
	e = e || window.event;

	var side = this.className.slice(-1);
	clickonarrow(side);
}

function clickonarrow(){

}

function startscroll(){}