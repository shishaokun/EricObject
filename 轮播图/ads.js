document.getElementById('carousellistcopy').innerHTML = document.getElementById('carousellist').innerHTML;

//设置图片大小
var adsbox = document.getElementById('carouselview');
var adsboxh = adsbox.offsetHeight;
var adsboxw = adsbox.offsetWidth;
//console.log(adsboxh + " " + adsboxw);
var adslist = adsbox.getElementsByTagName('img');
for(var i = 0,adslistlen = adslist.length; i < adslistlen; i++){
	var imgh = adslist[i].scrollHeight;
	var imgw = adslist[i].scrollWidth;
	if(adsboxh/adsboxw < imgh/imgw){
		adslist[i].className = 'imgheight';
	}else{
		adslist[i].className = 'imgwidth';
	}
	//console.log(imgh + " " + imgw);
}


var keep = 3000;//间隔时间
var speed = 20;//每次移动的间隔时间
var Space = 20;//每次移动的距离
var lockMove = false;//移动是否被锁住
var com = 0;//移动过的距离
var adsview = document.getElementById('carouselview');//获取移动对象
var firstlistwid = document.getElementById('carousellist').offsetWidth;//获取第一个list的宽度
var size = adsview.offsetWidth;//box宽度
var autoMoveObj;//自动移动obj

Automove();

//自动移动
function Automove (){
	console.log('automove');
	clearInterval(autoMoveObj);
	autoMoveObj = setInterval('GoDown()',keep);
}

//向右移动
function GoUp(){
	console.log('up');
	if(!lockMove){
		clearInterval(autoMoveObj);
		lockMove = true;
		MoveFlag('r');
	}
	moveOrNot('r');
}

//向左移动
function GoDown(){
	console.log('Down');
	if(!lockMove){
		clearInterval(autoMoveObj);
		lockMove = true;
		MoveFlag('l');
	}
	moveOrNot('l');
}

//是否变换初始位置
function MoveFlag(flag){
	if(flag == 'r'){
		console.log('moveFlagRight');
		if(adsview.scrollLeft <= 0){
			adsview.scrollLeft = adsview.scrollLeft + firstlistwid;
		}
	}else{
		console.log('moveFlagLeft' + " " + adsview.scrollLeft + " " + firstlistwid);
		if(adsview.scrollLeft >= firstlistwid){
			console.log('changeleft');
			adsview.scrollLeft = adsview.scrollLeft - firstlistwid;
		}
	}
}

//是否移动
function moveOrNot(flag){
	if(lockMove){
		com = adsview.offsetLeft%size;
		com = (flag == 'r') ? (-com) : (size - com);
		moveAction();
	}else{
		lockMove = false;
	}
	Automove();
}

//移动
function moveAction(){
	console.log('in');
	var comdis;//移动距离
	if(com == 0){
		lockMove = false;
		return;
	}
	if(com < 0){ //右移动
		if(com < -Space){
			com += Space;
			comdis = Space;
		}else{
			comdis = -com;
			com = 0;
		}
		adsview.scrollLeft -= comdis;
		setTimeout('moveAction()',speed);
	}else{//左移动
		if(com > Space){
			com -= Space;
			comdis = Space;
		}else{
			comdis = com;
			com = 0;
		}
		adsview.scrollLeft += comdis;
		setTimeout('moveAction()',speed);
	}
}


//点击不自动移动
function stopAutomove(){
	clearInterval(autoMoveObj);
}