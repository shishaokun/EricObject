document.getElementById('adslistcopy').innerHTML = document.getElementById('adslist').innerHTML;

//设置图片大小
var adsbox = document.getElementById('adsview');
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
	console.log(imgh + " " + imgw);
}


var keep = 3000;//间隔时间
var speed = 10;//每次移动的间隔时间
var Space = 5;//每次移动的距离
var lockMove = false;//移动是否被锁住
var com = 0;//移动过的距离
var adsview = document.getElementById('adsview');//获取移动对象
var firstlistwid = document.getElementById('adslist').offsetWidth;//获取第一个list的宽度
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

//移动一点作为移动锁住的标志
function MoveFlag(flag){
	if(flag == 'r'){
		console.log('moveFlagRight');
		if(adsview.scrollLeft <= 0){
			adsview.scrollLeft = adsview.scrollLeft + firstlistwid;
		}
		adsview.scrollLeft -= Space;
		console.log('MoveRight');
	}else if(flag == 'l'){
		console.log('moveFlagLeft' + " " + adsview.scrollLeft + " " + firstlistwid);
		if(adsview.scrollLeft >= firstlistwid){
			console.log('changeleft');
			adsview.scrollLeft = adsview.scrollLeft - firstlistwid;
		}
		adsview.scrollLeft += Space;
		console.log('MoveLeft');
	}
}

//继续移动否
function moveOrNot(flag){
	if(adsview.scrollLeft%size != 0){
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
