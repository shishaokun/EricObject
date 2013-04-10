/*
 *author: eric
 *
 *deriction: 图像轮播插件
 *
 *title: carousel
 *
*/

function Carousel_factory(){};
Carousel_factory.prototype = {
	obj: null,//对象
	Keep: null,//图片等待移动时间(ms)
	Speed: null,//图片移动间隔时间(ms)
	Space: null,//图片移动距离(px)
	LockMove: false,//移动是否被锁住
	ObjOver: 0,//对象移过的距离(px)
	AutoMoveObj: null,//自动移动对象
	_flag: 'l',//移动方向(r/l)
	
	ResetImg: function(){//重设图片大小
		var obj = document.getElementById(this.obj);
		var objh = obj.offsetHeight;
		var objw = obj.offsetWidth;
		var objlist = obj.getElementsByTagName('img');
		for(var i = 0,objlistlen = objlist.length; i < objlistlen; i++){
			var imgh = objlist[i].scrollHeight;
			var imgw = objlist[i].scrollWidth;
			if(objh/objw < imgh/imgw){
				objlist[i].className = 'reset_h';
			}else{
				objlist[i].className = 'reset_w';
			}
		}
	},
	
	AutoMove: function(){//自动移动
		console.log('AutoMove');
		clearInterval(this.AutoMoveObj);
		this.AutoMoveObj = setInterval('this.GoDown',this.Keep);
	},
	
	GoDown: function(){//向左移动
		console.log('Down');
		if(!this.LockMove){
			clearInterval(this.AutoMoveObj);
			this.LockMove = true;
			this._flag = 'l'
			this.MoveFlag();
		}
		this.MoveOrNot();
	},
	
	GoUp: function(){//向右移动
		consle.log('Go');
		this._flag = 'r'
		if(!MoveLock){
			claerInterval(this.AutoMoveObj);
			this.LockMove = true;
			this.MoveFlag();
		}
		this.MoveOrNot();
	},
	
	MoveFlag: function(){//移动对象一次作为移动锁住标志
		var objlistwid = document.getElementById(this.objlist).offsetWidth;
		if(this._flag == 'r'){
			console.log('MoveRight');
			if(this.objViewScroLeft <= 0){
				console.log('changeright');
				this.objViewScroLeft += objlistwid;
			}
			this.objViewScroLeft -= this.Space;
		}else{
			console.log('MoveLeft');
			if(this.objViewScroLeft >= objlistwid){
				console.log('changeleft');
				this.objViewScroLeft -= objlistwid;
			}
			this.objViewScroLeft += this.Space;
		}
	},
	
	MoveOrNot: function(){//是否继续移动
		if(this.objViewScroLeft % this.ObjWid != 0){
			this.ObjOver = this.objViewScroLeft % this.ObjWid;
			this.ObjOver = (this._flag == 'r') ? (-this.ObjOver) : (this.ObjWid - this.ObjOver);
			this.MoveAction();
		}else {
			this.LockMove = false;
		}
		this.AutoMove();
	},
	
	MoveAction: function(){//
		var Movedis;//移动距离
		if(this.ObjWid == 0){
			this.lockMove = false;
			return;
			}
		if(this.ObjWid < 0){ //右移动
			if(this.ObjWid < -this.Space){
				this.ObjWid += this.Space;
				Movedis = this.Space;
			}else{
				Movedis = -this.ObjWid;
				this.ObjWid = 0;
			}
			this.objViewScrollLeft -= Movedis;
			setTimeout('this.moveAction()',this.speed);
		}else{//左移动
			if(this.ObjWid > this.Space){
				this.ObjWid -= this.Space;
				Movedis = this.Space;
			}else{
				Movedis = this.ObjWid;
				this.ObjWid = 0;
			}
			this.objViewScrollLeft += Movedis;
			setTimeout('this.MoveAction()',this.Speed);
		}
	},
	
	
	ObjWid: function(){//获取移动对象的宽度
		var objwidth = document.getElementById(this.objview).offsetWidth;
		return objwidth;
	},
	
	objViewScroLeft: function (){//获取对象移动宽度
		var objViewScrollLeft = document.getElementById(this.objview).scrollLeft;
		return objViewScrollLeft;
	},
	
	objview: function(){//获取对象视窗
		var _ObjView = this.obj + 'view';
		return _ObjView;
	},
	
	objlist: function(){//获取对象list
		var _ObjList = this.obj + 'list';
		return _ObjList;
	},
	
};


	

function carousel_img(obj){
	var carousel = new Carousel_factory();
	carousel.obj = obj;//传入对象
	carousel.Keep = 3000;//间隔时间
	carousel.Speed = 10;//每次移动的间隔时间
	carousel.Space = 5;//每次移动的距离
	carousel.AutoMove();//开始运行自动移动
}

carousel_img('ads');