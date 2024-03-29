﻿function Tetris(){}
        Tetris.prototype={
            BlogsSetting:[//方块设置
                [
                    [1,1,1,1],
                    [0,0,0,0],
                    [0,0,0,0],
                    [0,0,0,0]                 
                ],
                [
                    [1,1,1,0],
                    [1,0,0,0],
                    [0,0,0,0], 
                    [0,0,0,0] 
                ],
                [
                    [1,1,1,0],
                    [0,1,0,0],
                    [0,0,0,0], 
                    [0,0,0,0] 
                ],
                [
                    [1,1,1,0],
                    [0,0,1,0],
                    [0,0,0,0], 
                    [0,0,0,0] 
                ],
                [
                    [1,1,0,0],
                    [0,1,1,0],
                    [0,0,0,0], 
                    [0,0,0,0] 
                ],
                [
                    [0,1,1,0],
                    [1,1,0,0],
                    [0,0,0,0], 
                    [0,0,0,0]
                ],
                [
                    [1,1,0,0],
                    [1,1,0,0],
                    [0,0,0,0], 
                    [0,0,0,0]
                ]
            ],
            GameMap:[],//游戏地图，对应table中的td值
            BlokWidth:28,//方块集的宽高，也就是images/tetris_grid.gif图片的宽高
            HorizontalNum:10,//水平td数量
            VerticalNum:18,//垂直td数量
            BlokSize:4,//设置方块占用位置4 * 4
            BlockWidth:0,//获取当前方块的非0的最大宽度
            BlockHeight:0,//获取当前方块的非0的最大高度
            CurrentIndex:0,//当前随机获得的索引
            NextCurrentIndex:0,//获取下一个方块的索引
            BlokCurrent:[],//当前方块
            InitPosition:{},//当前方块运动的x,y
            IsPlay:false,//是否开始游戏
            IsOver:false,//游戏是否结束
            IsOverIndex:0,//设置游戏结束的索引还有空几行
            Score:0,
            ScoreIndex:100,
            ColorEnum: [[0, 0], [-28, 0], [-56, 0], [-84, 0], [-112, 0], [-140, 0], [-168, 0], [0, 0]], //颜色的枚举，对应BlogsSetting
            CreateMap:function(){
                //加载地图，设置其宽高，根据HorizontalNum,VerticalNum的数量决定
                var map = document.getElementById("map");
                var w = this.BlokWidth*this.HorizontalNum;
                var h = this.BlokWidth*this.VerticalNum;
                map.style.width=w+"px";
                map.style.height=h+"px";
                //加载地图对应的数组，初始化为0，当被占据时为1
                for(var i=0;i<this.VerticalNum;i++){
                    this.GameMap.push([]);
                    for(var j=0;j<this.HorizontalNum;j++){
                        this.GameMap[i][j]=0;
                    }
                }
                //创建table td填充div根据HorizontalNum,VerticalNum的数量决定，创建HorizontalNum * VerticalNum的表格区域
                var table = document.createElement("table");
                table.id="area";
                var tbody = document.createElement("tbody");
                table.cellPadding=0;
                table.cellSpacing=0;
                table.appendChild(tbody);
                for(var i=0;i<this.VerticalNum;i++){
                    var tr = document.createElement("tr");
                    for(var j=0;j<this.HorizontalNum;j++){
                        var td = document.createElement("td");
                        tr.appendChild(td);
                    }
                    tbody.appendChild(tr);
                }
                map.appendChild(table);
                this.CreatePreViewMap();
                this.CreateNextBlock();
            },            
            CreatePreViewMap:function(){//加载一个4*4的表格到预览区域
                var preview = document.getElementById("previewArea");
                var table = document.createElement("table");
                table.id="perviewTable";
                var tbody = document.createElement("tbody");
                table.cellPadding=0;
                table.cellSpacing=0;
                table.appendChild(tbody);
                for(var i=0;i<this.BlokSize;i++){
                    var tr = document.createElement("tr");
                    for(var j=0;j<this.BlokSize;j++){
                        var td = document.createElement("td");
                        tr.appendChild(td);
                    }
                    tbody.appendChild(tr);
                }
                preview.appendChild(table);
            },
            LoadPreview:function(index){//加载到预览区域
                var previewTable = document.getElementById("perviewTable");
                for(var i=0;i<this.BlogsSetting[index].length;i++){
                    for(var j=0;j<this.BlogsSetting[index][i].length;j++){
                        previewTable.rows[i].cells[j].style.backgroundImage="";
                        if(this.BlogsSetting[index][i][j]==1){
                            previewTable.rows[i].cells[j].style.backgroundImage="url(images/tetris.gif)";
                            previewTable.rows[i].cells[j].style.backgroundPosition=this.ColorEnum[index][0]+"px"+" "+this.ColorEnum[index][1]+"px";
                        }
                    }
                }
            },
            SettingBlock:function(){//设置地图中方块的背景图片
                var tb = this.getTable();
                for(var i=0;i<=this.BlockHeight;i++){
                    for(var j=0;j<=this.BlockWidth;j++){
                        if(this.BlokCurrent[i][j]==1){
                            tb.rows[this.InitPosition.y+i].cells[this.InitPosition.x+j].style.backgroundImage="url(images/tetris.gif)";
                            tb.rows[this.InitPosition.y+i].cells[this.InitPosition.x+j].style.backgroundPosition=this.ColorEnum[this.CurrentIndex][0]+"px"+" "+this.ColorEnum[this.CurrentIndex][1]+"px";
                        }
                    }
                }
            },
            CanMove:function(x,y){//根据传过来的x,y，检测方块是否能左右下移动
                if(y+this.BlockHeight>=this.VerticalNum)//判断是否有到最底部，如果到底部的话停止向下移动
                    return false;
                for(var i=this.BlockHeight;i>=0;i--){//检测方块的最高坐标相对应的地图的坐标是否有都等于1，如果有等于1说明地图放不下该方块
                    for(var j=0;j<=this.BlockWidth;j++){
                        if(this.GameMap[i][x+j]==1&&this.BlokCurrent[i][j]==1){
                            this.IsOverIndex=i;
                            this.IsOver=true;
                        }
                    }
                }
                for(var i=this.BlockHeight;i>=0;i--){//检测方块的移动轨迹在地图中是否有被标记为1，如果有被标记为1就是下一步的轨迹不能运行。
                    for(var j=0;j<=this.BlockWidth;j++){
                        if(this.GameMap[y+i][x+j]==1&&this.BlokCurrent[i][j]==1){//判断方块的下一步轨迹是否是1并且判断下一步方块的轨迹在地图中是否有为1。
                            return false;   
                        }
                    }                         
                }
                return true;
            },
            ClearOldBlok:function(){//当this.InitPosition.y>=0 也就是显示在地图的时候，每次左右下移动时清除方块，使得重新绘制方块
                if(this.InitPosition.y>=0){
                    for(var i=0;i<=this.BlockHeight;i++){
                        for(var j=0;j<=this.BlockWidth;j++){
                            if(this.BlokCurrent[i][j]==1){
                                this.getTable().rows[this.InitPosition.y+i].cells[this.InitPosition.x+j].style.backgroundImage="";
                            }
                        }
                    }
                }
            },
            MoveLeft:function(){    //向左移动
                var x = this.InitPosition.x-1;
                if(x<0||this.InitPosition.y==-1)
                    return;
                if(this.CanMove(x,this.InitPosition.y)){
                    this.ClearOldBlok();
                    this.InitPosition.x=x;
                }
                this.SettingBlock();  
            },
            MoveRight:function(){//向右移动
                var x = this.InitPosition.x+1;
                if(x+this.BlockWidth>=this.HorizontalNum||this.InitPosition.y==-1)
                    return;
                if(this.CanMove(x,this.InitPosition.y)){
                    this.ClearOldBlok();
                    this.InitPosition.x=x;
                }
                this.SettingBlock();  
            },
            MoveDown:function(){//向下移动
                var y = this.InitPosition.y+1;
                if(this.CanMove(this.InitPosition.x,y)){//判断是否能向下移动，不能的话表示该方块停止运行，继续判断是否游戏结束，如果游戏还没结束重新创建个方块继续游戏
                    this.ClearOldBlok();
                    this.InitPosition.y=y;
                    this.SettingBlock();
                }
                else{
                    if(this.IsOver){
                        window.clearTimeout(OverTime);
                        this.GameOver();
                        return;
                    }
                    this.SettingBlock();
                    this.SettingGameMap();
                    this.CheckFull();
                    this.NewBlock();
                    this.CreateNextBlock();
                    return;
                }                  
            },
            ChangeBlock:function(){//向上方块变型
                if(this.InitPosition.y==-1)
                    return;
                var newBlock = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
                for(var i=0;i<=this.BlockHeight;i++){
                    for(var j=0;j<=this.BlockWidth;j++){
                        newBlock[this.BlockWidth-j][i] = this.BlokCurrent[i][j];
                    }
                }
                var temp = this.BlokCurrent;
                this.ClearOldBlok();
                this.BlokCurrent=newBlock;
                this.BlockWidth=this.GetWidth(this.BlokCurrent);
                this.BlockHeight=this.GetHeight(this.BlokCurrent);
                if(this.InitPosition.x+this.BlockWidth>=this.HorizontalNum||!this.CanMove(this.InitPosition.x,this.InitPosition.y)){//this.InitPosition.x+this.BlockWidth>=this.HorizontalNum判断变型后x+它的宽度是否有超过地图的宽度
                    this.BlokCurrent=temp;
                    this.BlockHeight=this.GetHeight(this.BlokCurrent)
                    this.BlockWidth=this.GetWidth(this.BlokCurrent);
                }
                this.SettingBlock();
            },
            CheckFull:function(){//检测是否有满行的
                var arr=[];
                for(var i=0;i<this.VerticalNum;i++){
                    var flag=true;
                    for(var j=0;j<this.HorizontalNum;j++){
                        if(this.GameMap[i][j]==0){
                            flag=false;
                            break;
                        }
                    }
                    if(flag){
                        this.ClearFull(i);
                    }
                }
                    
            },
            ClearFull:function(index){//清除满行的，使上一行的背景图等于该行，并使上一行的坐标值等于该行，如果是第一行的话坐标值清0，背景清空
                var tb = this.getTable();
                if(index==0){ 
                    for(var i=0;i<this.HorizontalNum;i++){
                        this.GameMap[0][j]=0;
                        tb.rows[i].cells[j].style.backgroundImage="";
                    }
                }
                else{
                    for(var i=index;i>0;i--){
                        for(var j=0;j<this.HorizontalNum;j++){
                            this.GameMap[i][j]=this.GameMap[i-1][j];
                            tb.rows[i].cells[j].style.backgroundImage=tb.rows[i-1].cells[j].style.backgroundImage;
                            tb.rows[i].cells[j].style.backgroundPosition=tb.rows[i-1].cells[j].style.backgroundPosition;
                        }
                    }
                }
                this.getScore().innerHTML=parseInt(this.getScore().innerHTML)+this.ScoreIndex;
            },
            NewBlock:function(){//创建方块，初始化数据
                this.CurrentIndex=this.NextCurrentIndex;//获取下一个方块的索引作为当前索引
                this.BlokCurrent=this.BlogsSetting[this.CurrentIndex];//根据获得的新索引重新获取方块
                this.BlockWidth=this.GetWidth(this.BlokCurrent);//重新获取方块的最大宽值
                this.BlockHeight=this.GetHeight(this.BlokCurrent);//重新获取方块的最大高值
                this.GetInitPosition();//初始化方块出现的坐标
            },
            GameOver:function(){//游戏结束后补齐获得当前方块，补齐地图空白地方
                var tb = this.getTable();
                for(var i=this.IsOverIndex-1;i>=0;i--){//循环空白的IsOverIndex-1行，给空白的行补上当前方块，从最高值递件。减1是因为IsOverIndex获取的是被占据的行，所以减1为空白行。
                    for(var j=0;j<=this.BlockWidth;j++){
                        if(this.BlokCurrent[this.BlockHeight-i][j]==1){
                            tb.rows[i].cells[this.InitPosition.x+j].style.backgroundImage="url(images/tetris.gif)";
                            tb.rows[i].cells[this.InitPosition.x+j].style.backgroundPosition=this.ColorEnum[this.CurrentIndex][0]+"px"+" "+this.ColorEnum[this.CurrentIndex][1]+"px";
                        }
                    }
                }
                this.IsPlay=false;
                alert("游戏结束");
            },
            SettingGameMap:function(){//设置游戏地图被占有的位置标记为1
                for(var i=0;i<=this.BlockHeight;i++)
                    for(var j=0;j<=this.BlockWidth;j++)
                        if(this.BlokCurrent[i][j]==1){
                            this.GameMap[this.InitPosition.y+i][this.InitPosition.x+j]=1;//减1是因为每次y加1，然后在去进行判断，所以当碰到方块或底部的时候要减去多加的1
                        }
            },
            Start:function(){//游戏开始
                this.IsPlay=true;
                this.CurrentIndex=this.NextCurrentIndex;
                this.BlokCurrent=this.BlogsSetting[this.CurrentIndex];
                this.BlockWidth=this.GetWidth(this.BlokCurrent);
                this.BlockHeight=this.GetHeight(this.BlokCurrent);
                this.GetInitPosition();
                this.MoveDown();
                this.CreateNextBlock();
            },
            CreateNextBlock:function(){//获取下一个方块的索引，并显示在预览区域中
                this.NextCurrentIndex=this.getRandom();
                this.LoadPreview(this.NextCurrentIndex);
            },
            GetHeight:function(blokArr){//获取当前方块不是0的最大高值
                for(var i=blokArr.length-1;i>=0;i--)
                    for(var j=0;j<blokArr[i].length;j++)
                        if(blokArr[i][j]==1)
                            return i;
            },
            GetWidth:function(blokArr){//获取当前方块不是0的最大宽值
                for(var i=blokArr.length-1;i>=0;i--)
                    for(var j=0;j<blokArr[i].length;j++)
                        if(blokArr[j][i]==1)
                            return i;
            },
            GetInitPosition:function(){//获取方块的初始位置
                this.InitPosition = {x:Math.floor((this.HorizontalNum-this.BlokSize)/2),y:-1};
            },
            getRandom:function(){//随机获得7种放块中的其中一种
                return Math.floor(Math.random()*7);
            },
            getTable:function(){
                return document.getElementById("area");
            },
            getScore:function(){
                return document.getElementById("score");
            },
            getRank:function(){
                return document.getElementById("rank");
            }
        }
        var t = new Tetris();
        var OverTime=null;
        var IsPause=false;
        var Speed=500;
        var btn_start;
        window.onload=InitGame;
        function InitGame(){
            t.CreateMap();
            btn_start = document.getElementById("start");
            btn_start.onclick=function(){
                t.Start();
                this.value="P 暂停游戏"
                OverTime=setInterval(MoveBoxDown,Speed);
                this.disabled="disabled";
            }
        }
        function MoveBoxDown(){
            t.MoveDown();
        }
        function KeyDown(e){
            if(!t.IsPlay||t.IsOver)return;
            e=e||window.event;
            var keyCode = e.keyCode||e.which||e.charCode;
            switch(keyCode){
                case 37://左
                    if(!IsPause)t.MoveLeft();
                    break;
                case 38://上
                    if(!IsPause)t.ChangeBlock();
                    break;
                case 39://右
                    if(!IsPause)t.MoveRight();
                    break;
                case 40://下
                    if(!IsPause)t.MoveDown();
                    break;
                case 80://p 暂停or开始
                    IsPause=!IsPause;
                    if(IsPause){
                        btn_start.value="P 开始游戏";
                        window.clearInterval(OverTime);
                    }
                    else{
                        btn_start.value="P 暂停游戏";
                        OverTime=setInterval(MoveBoxDown,Speed);
                    }
                    break;
            }
        }