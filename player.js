
// console.log(JSON.parse(window.localStorage.a242078437))
var theAudio=document.getElementsByTagName('audio')[0];//获取音频
var listUl=document.getElementById("list_wrap").getElementsByTagName('ul')[0];
var lisLi=listUl.getElementsByTagName('li');
var theLrc=document.getElementById('lrc').getElementsByTagName('ul')[0];
var lrcLis=theLrc.getElementsByTagName('li');
// ----播放控件----------------------------------------------------------
var playBtn=document.getElementById("play_btn");
var preBtn=document.getElementById("pre_btn");
var nextBtn=document.getElementById("next_btn");
// *******************************************************************
// 默认数据
var datas={
	loopType:2,
	preUrl:"./最初的梦想.mp3",
	thisUrl:"./我相信.mp3",
	nextUrl:"./我相信.mp3",
	thisLrc:[],
	list:[
		{
			bitrate:{
				file_duration:261,
				file_link:"http://yinyueshiting.baidu.com/data2/music/212c4d88eb5e673bfbc295a6ff6cd9a4/242078579/242078579.mp3?xcode=a426c9cc1753d2fb6b73a0f684021956",
				show_link:"http://yinyueshiting.baidu.com/data2/music/212c4d88eb5e673bfbc295a6ff6cd9a4/242078579/242078579.mp3?xcode=a426c9cc1753d2fb6b73a0f684021956"
			},
			songinfo:{
				title:"演员",
				author:"薛之谦",
				album_title:"初学者",
				song_id:"242078437",
				pic_radio:"http://musicdata.baidu.com/data2/pic/fcb5730792b918523ee7c6c32feae2ab/267709256/267709256.jpg"
			}
		},
		{
			bitrate:{
				file_duration:253,
				file_link:"http://yinyueshiting.baidu.com/data2/music/41600103/41600103.mp3?xcode=5d2cf2b3f7e6d426bdfb5657fcf2438e",
				show_link:"http://yinyueshiting.baidu.com/data2/music/41600103/41600103.mp3?xcode=5d2cf2b3f7e6d426bdfb5657fcf2438e"
			},
			songinfo:{
				title:"给我一首歌的时间",
				author:"周杰伦",
				album_title:"魔杰座",
				song_id:"1392586",
				pic_radio:"http://musicdata.baidu.com/data2/pic/a3f2d669045dce34e3c788575ed6bf4f/274049119/274049119.jpg"
			}
		}
	],
	thisOne:"111"
};
datas.thisOne=datas.list[0];
// try{
// 	if(JSON.parse(window.localStorage.getItem("musicList"))[0]);
// }catch(error){
// 	getSongs([73987454,7282146,266322598,275350656,267473025,271832017]);
// }
getSongs([73987454,7282146,266322598,275350656,267473025,271832017,354877]);

// *******************************************************************
// ------信息获取------

// 获取排行榜信息
// billboard(2)
function billboard(bType){
	jsonp({
		url:"http://tingapi.ting.baidu.com/v1/restserver/ting",
		data:{
			method:"baidu.ting.billboard.billList",
			type:bType,
			size:100,
			offset:0
		},
		succ:function(json){
			console.log(json)
		}
	})
};
// 搜索歌曲
// serSong("最长的电影");
function serSong(name){
	jsonp({
		url:"http://tingapi.ting.baidu.com/v1/restserver/ting",
		data:{
			method:"baidu.ting.search.catalogSug",
			query:name
		},
		succ:function(json){
			console.log(json);
		}
	});
};
//获取单首歌曲信息 
// getInfo(354877);
function getInfo(id){
	jsonp({
		url:"http://tingapi.ting.baidu.com/v1/restserver/ting",
		data:{
			method:"baidu.ting.song.play",
			songid:id
		},
		succ:function(json){
			if (json.bitrate&&json.songinfo) {
				var obj={};
				obj.type="music_info";
				obj.bitrate=json.bitrate;
				if (!json.songinfo.pic_radio) {
					json.songinfo.pic_radio=json.songinfo.pic_big||json.songinfo.pic_huge||json.songinfo.pic_small||"http://musicugc.cdn.qianqian.com/ugcdiy/pic/09e2b914d6b468ddd1f5109160583a1a.jpg";
				}
				obj.songinfo=json.songinfo;
				for (var i = 0; i < datas.list.length; i++) {
					if(datas.list[i].songinfo.song_id!=obj.songinfo.song_id){
						datas.list.push(obj);
						var addLi=document.createElement("li");
						addLi.className="list_item";
						addLi.id=obj.songinfo.song_id;
						addLi.innerHTML=
							"<span class=check></span>"+
							"<span class=order>"+(datas.list.length)+"</span>"+
							"<span class=name>"+obj.songinfo.title+"</span>"+
							"<span class=play sid="+obj.songinfo.song_id+"></span>"+
							"<span class=delete></span>"+
							"<span class=singer>"+obj.songinfo.author+"</span>"+
							"<span class=time>"+formNum(Math.round(obj.bitrate.file_duration/60))+":"+formNum(Math.round(obj.bitrate.file_duration%60))+"</span>";
						listUl.appendChild(addLi);
						renderListScroll();
						break;
					}
				}
				obj=JSON.stringify(obj);
				try{
					window.localStorage.setItem("a"+id,obj);
				}catch(error){}	
			}else{
				alert("无效的歌曲ID："+id);
			};	
		}
	});
}
// 获取一组歌曲信息
function getSongs(idArr){
	for (var i = 0; i < idArr.length; i++) {
		getInfo(idArr[i]);
	}
}
//获取歌词 getLrc(242078437)
function getLrc(id){
	jsonp({
		url:"http://tingapi.ting.baidu.com/v1/restserver/ting",
		data:{
			method:"baidu.ting.song.lry",
			songid:id
		},
		succ:function(json){
			if (!json.lrcContent) {
				json.lrcContent="[99:99.99]---没有歌词---"
			}
			var lrc=[];
			var t=json.lrcContent.match(/\d\d:\d\d.\d\d/g);
			var c=json.lrcContent.replace(/\n/g,"").split(/\[\d\d:\d\d.\d\d\]/g);
			for (var i = 0; i < t.length; i++) {
				lrc[i]={};
				lrc[i].s=(Number(t[i].split(":")[0])*60+Number(t[i].split(":")[1].split(".")[0])+Number(t[i].split(":")[1].split(".")[1])/1000);
				lrc[i].w=c[i+1];
			}
			datas.thisLrc=[];
			for (var i = 0; i < lrc.length; i++) {
				if(lrc[i].w){
					datas.thisLrc.push(lrc[i]);
				}
			}
			datas.thisLrc[datas.thisLrc.length]={
				s:datas.thisLrc[datas.thisLrc.length-1].s+200,
				w:"---完---"
			}
			var ulInner="";
			for (var i = 0; i < datas.thisLrc.length; i++) {
				ulInner+="<li>"+datas.thisLrc[i].w+"</li>";
			}
			theLrc.innerHTML=ulInner;
		}
	});
}


// *******************************************************************
// 渲染默认列表
(function(){
	var listUl=document.getElementById("list_wrap").getElementsByTagName('ul')[0];
	var inner="";
	for (var i = 0; i < datas.list.length; i++) {
		inner+=
		"<li class='list_item' id="+datas.list[i].songinfo.song_id+">"+
			"<span class=check></span>"+
			"<span class=order>"+(i+1)+"</span>"+
			"<span class=name>"+datas.list[i].songinfo.title+"</span>"+
			"<span class=play sid="+datas.list[i].songinfo.song_id+"></span>"+
			"<span class=delete></span>"+
			"<span class=singer>"+datas.list[i].songinfo.author+"</span>"+
			"<span class=time>"+formNum(Math.round(datas.list[i].bitrate.file_duration/60))+":"+formNum(Math.round(datas.list[i].bitrate.file_duration%60))+"</span>"+
		"</li>"
	}
	listUl.innerHTML=
		"<li class=list_title>"+
			"<span class=check></span>"+
			"<span class=name>歌曲</span>"+
			"<span class=singer>歌手</span>"+
			"<span class=time>时长</span>"+
		"</li>"+inner;
})()


// *******************************************************************
// 列表事件
listUl.onclick=function(ev){
	var cName=ev.target.className;
	var pName=ev.target.parentNode.className;
	if (cName=="check") {									// 勾选
		if (pName.search(/list_title/)!=-1){
			if (pName.search(/checked/)!=-1) {
				for (var i = 0; i < lisLi.length; i++) {
					lisLi[i].className=lisLi[i].className.replace(/checked/g,"");
				}
			}
			else{
				for (var i = 0; i < lisLi.length; i++) {
					lisLi[i].className=lisLi[i].className+" checked";
				}
			}
		}
		else{
			if (pName.search(/checked/)!=-1){
				ev.target.parentNode.className=pName.replace(/checked/g,"");
				lisLi[0].className=lisLi[0].className.replace(/checked/g,"");
			}
			else{
				ev.target.parentNode.className=pName+" checked";
				lisLi[0].className=lisLi[0].className+" checked";
				for (var i = 1; i < lisLi.length; i++) {
					if (lisLi[i].className.search(/checked/)==-1) {
						lisLi[0].className=lisLi[0].className.replace(/checked/g,"");
						break;
					} 
				}
			}
		}
	}
	else if (cName=="play") {
		if(pName.search(/playing/)!=-1){														// 列表播放
			ev.target.parentNode.className=pName.replace(/playing/g,"");
			clearInterval(theAudio.showTimer);
			theAudio.pause();
			picPause();
			playBtn.className="play";
		}else if (pName.search(/playing/)==-1) {

			for (var i = 0; i < lisLi.length; i++) {
				lisLi[i].className=lisLi[i].className.replace(/playing/g,"");
			}
			ev.target.parentNode.className=pName+" playing";
			var theId=ev.target.getAttribute("sid");
			if (datas.thisOne.songinfo.song_id==theId) {
				theAudio.play();
				playShow();
				playBtn.className="paused"
			}else{
				for (var i = 0; i < datas.list.length; i++) {
					if(datas.list[i].songinfo.song_id==theId){
						datas.thisOne=datas.list[i];
						innitPlay();
						playBtn.className="paused";
						break;
					}
				}
			}
		}
	}else if (cName=="delete") {																//删除
		// alert(ev.target.parentNode.id)
		deleteData([ev.target.parentNode.id]);
		listUl.removeChild(ev.target.parentNode);
		renderListScroll();
		reOrder();
		if (ev.target.parentNode.id==datas.thisOne.songinfo.song_id) {
			theAudio.load();
			theAudio.pause();
			backback();
			if (datas.list[0]) {
				datas.thisOne=datas.list[0];
				innitPlay();
			}
		}
	}

}

//清空
document.getElementById('del_all').onclick=function(){
	datas.list=[];
	listUl.innerHTML=
		"<li class=list_title>"+
			"<span class=check></span>"+
			"<span class=name>歌曲</span>"+
			"<span class=singer>歌手</span>"+
			"<span class=time>时长</span>"+
		"</li>";
	renderListScroll();
	theAudio.load();
	theAudio.pause();
	backback();
}
// 删除键
document.getElementById('del').onclick=function(){
	var delArr=[];
	var thisOneHasDel=false;
	for (var i = lisLi.length-1; i > 0; i--) {
		if(lisLi[i].className.search(/checked/)!=-1){
			if (lisLi[i].id==datas.thisOne.songinfo.song_id) {
				thisOneHasDel=true;
			}
			delArr.push(lisLi[i].id);//收集要删除数据的ID
			listUl.removeChild(lisLi[i]);
		}
	};
	renderListScroll();
	reOrder();
	deleteData(delArr);//删除数据
	if (thisOneHasDel) {
		theAudio.load();
		theAudio.pause();
		backback();
		if (datas.list[0]) {
			datas.thisOne=datas.list[0];
			innitPlay();
		}
	}
}
// 搜索
document.getElementById('ser').onclick=function(){

}
function wave(theId){
	for (var i = 0; i < datas.list.length; i++) {
		if(datas.list[i].songinfo.song_id==theId){
			lisLi[i+1].className=lisLi[i+1].className+" playing"
		}else{
			lisLi[i+1].className=lisLi[i+1].className.replace(/playing/g,"");
		}
	}
}
// 重新排序号
function reOrder(){
	if (lisLi.length>1) {
		for (var i = 1; i < lisLi.length; i++) {
			lisLi[i].getElementsByTagName('span')[1].innerHTML=i;
		}
	}

}
// deleteData([242078437]);删除数据
function deleteData(idArr){
	for (var i = 0; i < idArr.length; i++) {
		for(var j=0; j<datas.list.length; j++){
			if (idArr[i]==datas.list[j].songinfo.song_id) {
				datas.list[j].del=true;
			} 
		}	
	}
	var dList=[];
	for (var i = 0; i < datas.list.length; i++) {
		if(!datas.list[i].del){
			dList.push(datas.list[i]);
		}
	}
	dList=JSON.stringify(dList);
	datas.list=JSON.parse(dList);
	// console.log(datas.list)
}
// 还原视图
function backback(){
	document.title="音乐播放器";
	document.getElementById('run').getElementsByTagName('span')[0].innerHTML="-- - --";
	document.getElementById('pic').style.backgroundImage="";
	theLrc.innerHTML="";
	document.getElementById('msg').innerHTML="<span>歌曲名：---</span><span>歌手名：---</span><span>专辑名：---</span>";
	theAudio.load();
	theAudio.pause();
}
// *******************************************************************
// 生成自定义滚动条
renderListScroll();
function renderListScroll(){
	var listWrap=document.getElementById('list_wrap');									//包裹容器
	var listUl=listWrap.getElementsByTagName('ul')[0];
	var scrollT=document.getElementById('my_scroll').getElementsByTagName('span')[0];	//滑块上距离盒子
	var scrollH=document.getElementById('my_scroll').getElementsByTagName('i')[0];		//滑块
	var scrollHeight=listWrap.clientHeight/listUl.offsetHeight*360;						//滑块高
	var scrollTop=0;																	//滑块上距离
	var ulTop=0;																		//ul上距离
	if (listWrap.clientHeight<listUl.offsetHeight) {
		scrollH.style.display="block";
		scrollH.style.height=scrollHeight+"px";
		//拖动滑块
		scrollH.onmousedown=function(ev){
			var startY=ev.clientY;
			
			document.onmousemove=function(ev){
				scrollTop=ev.clientY-startY;
				if (scrollTop>360-scrollH.offsetHeight) {
					scrollTop=360-scrollH.offsetHeight;
				}else if (scrollTop<0) {
					scrollTop=0;
				}
				scrollT.style.height=scrollTop+"px";
				ulTop=-scrollTop/360*listUl.offsetHeight;
				listUl.style.top=ulTop+"px";
			}
			document.onmouseup=function(){
				document.onmousemove=document.onmouseup=null;
			}
			return false;
		}
		//滚轮事件
		mScroll(listUl,function(){
			ulTop+=30;
			if (ulTop>0) {
				ulTop=0;
			}
			listUl.style.top=ulTop+"px";
			scrollTop=-ulTop/listUl.offsetHeight*360;
			scrollT.style.height=scrollTop+"px";
		},function(){
			ulTop-=30;
			if (-ulTop>listUl.offsetHeight-360) {
				ulTop=360-listUl.offsetHeight
			}
			listUl.style.top=ulTop+"px";
			scrollTop=-ulTop/listUl.offsetHeight*360;
			scrollT.style.height=scrollTop+"px";
		})

	}else{
		scrollH.style.display="none";
	}
	// 滚轮封装
	function mScroll(obj,callBackUp,callBackDown){
		obj.onmousewheel=fn;
		obj.addEventListener('DOMMouseScroll',fn);
		
		function fn(ev){
			if(ev.wheelDelta>0 || ev.detail<0){
				callBackUp.call(obj);	//改变this指向
			}else{
				callBackDown.call(obj);
			}
			
			ev.preventDefault();
		};
	};
}

// *******************************************************************
// 初始默认播放
// var theAudio=document.getElementsByTagName('audio')[0];//获取音频



innitPlay();
wave(datas.thisOne.songinfo.song_id);
function innitPlay(){
	if (datas.list[0]) {
		theAudio.src=datas.thisOne.bitrate.file_link;
		theAudio.autoplay=true;
		if (datas.list[0]) {
			document.title=datas.thisOne.songinfo.title+" - "+datas.thisOne.songinfo.author;
			document.getElementById('pic').style.backgroundImage="url("+datas.thisOne.songinfo.pic_radio+")";
			document.getElementById('bg').style.backgroundImage="url("+datas.thisOne.songinfo.pic_radio+")";
			document.getElementById('run').getElementsByTagName('span')[0].innerHTML=datas.thisOne.songinfo.title+" - "+datas.thisOne.songinfo.author;
			document.getElementById('msg').innerHTML="<span>歌曲名："+datas.thisOne.songinfo.title+"</span><span>歌手名："+datas.thisOne.songinfo.author+"</span><span>专辑名："+(datas.thisOne.songinfo.album_title?datas.thisOne.songinfo.album_title:("无专辑信息"))+"</span>";
		}
		getLrc(datas.thisOne.songinfo.song_id);
		playShow();
	}
}


// *******************************************************************
// 播放控件
// var playBtn=document.getElementById("play_btn");
// var preBtn=document.getElementById("pre_btn");
// var nextBtn=document.getElementById("next_btn");
var loopBtn=document.getElementById('loop');
var volumeBox=document.getElementById('the_volume')			//音量条
var mutedBtn=document.getElementById('muted');				//静音按钮
var volumeWrap=document.getElementById('volume_wrap');		//音量条底色
var volumeVal=document.getElementById('the_volume');

playBtn.onclick=function(){			// 播放/暂停
	// console.log("11"+theAudio.src)
	if (theAudio.duration) {
		if (theAudio.paused) {
			if (datas.list[0]) {
				theAudio.play();
				wave(datas.thisOne.songinfo.song_id);
				playShow();
				this.className="paused"
			}
		
		}else{
			clearInterval(theAudio.showTimer);
			theAudio.pause();
			picPause();
			// for (var i = 0; i < lisLi.length; i++) {
			// 	lisLi[i].className=lisLi.className.replace(//)
			// }
			this.className="play";
		}
	}else{
		innitPlay();
	}
}
preBtn.onclick=function(){			//上一首
	if (theAudio.duration) {
		datas.thisOne=datas.list[4];
		innitPlay();
		wave(datas.thisOne.songinfo.song_id);
		playBtn.className="paused";
	}
}
nextBtn.onclick=function(){			//下一首
	if (theAudio.duration) {
		datas.thisOne=datas.list[datas.list.length-1];
		innitPlay();
		wave(datas.thisOne.songinfo.song_id);
		playBtn.className="paused";
	}
};
(function(){						//进度条
	var progressWrap=document.getElementById('progress_wrap');
	var theProgress=document.getElementById('the_progress');
	progressEvent(progressWrap,theProgress,"currentTime");
})();
loopBtn.onclick=function(){			//循环
	datas.loopType++;
	if (datas.loopType==5) {
		datas.loopType=1;
	}
	this.className="loop"+datas.loopType;
}
mutedBtn.onclick=function(){		//静音开关
	if (theAudio.muted) {
		theAudio.muted=false;
		this.className="muted1";
	}else{
		theAudio.muted=true;
		this.className="muted2";
	}
}
progressEvent(volumeWrap,volumeVal,"volume");	//音量条
theAudio.volume=0.4;							//设置默认音量
volumeBox.style.width=theAudio.volume*100+"px";	//默认音量条显示
function picRun(){
	var pic=document.getElementById('pic');
	pic.style.animationPlayState="running";
	pic.style.webkitAnimationPlayState="running";
	pic.style.mozAnimationPlayState="running";
	pic.style.oAnimationPlayState="running";
}
picPause();//默认不旋转
function picPause(){
	var pic=document.getElementById('pic');
	pic.style.animationPlayState="paused";
	pic.style.webkitAnimationPlayState="paused";
	pic.style.mozAnimationPlayState="paused";
	pic.style.oAnimationPlayState="paused";
}

// *******************************************************************
// 进度同步
function playShow(){
	var pic=document.getElementById('pic');			//旋转图片
	var theProgress=document.getElementById('the_progress');//播放进度条
	var timeBox=document.getElementById('play_time');		//时间显示
	var s=0;												//格式化的总时长

	theAudio.addEventListener('durationchange', function(e) {//监听，获取到总时长。
		//格式化的总时长
		s=formNum(Math.round(theAudio.duration/60))+":"+formNum(Math.round(theAudio.duration%60));
		clearInterval(theAudio.showTimer);
		show();
		picRun();//旋转图片
		playBtn.className="paused";
	})
	if (theAudio.duration) {
		s=formNum(Math.round(theAudio.duration/60))+":"+formNum(Math.round(theAudio.duration%60));
		clearInterval(theAudio.showTimer);
		show()
		picRun();//旋转图片
		playBtn.className="paused";
	}
	function show(){
		theAudio.showTimer=setInterval(function() {
			//进度条显示
			theProgress.style.width=theAudio.currentTime/theAudio.duration*500+"px";
			//播放时间显示
			timeBox.innerHTML=formNum(Math.round(theAudio.currentTime/60))+":"+formNum(Math.round(theAudio.currentTime%60)) +"/"+s;
			
			//歌词同步
			if (datas.thisLrc&&listUl.innerHTML) {
				for (var i = 0; i < datas.thisLrc.length; i++) {
					if (!lrcLis[i]) {
						break;
					}
					lrcLis[i].className="";
					if(datas.thisLrc[i+1]&&theAudio.currentTime<datas.thisLrc[i+1].s){

						theLrc.style.transform="translateY("+(50-25*i)+"px)";//滚动
						if (!lrcLis[i].className){							//绿字
							lrcLis[i].className="green";
						}
						// if (datas.thisLrc[i-1]) {
						// 	lrcLis[i-1].className="";
						// }		
						break;
					}
				}
			}
		
			//播放完清除定时器
			if (theAudio.currentTime==theAudio.duration) {
				clearInterval(theAudio.showTimer);
				playBtn.className="play";
				listUl.style.transform="translateY(0deg)";
				picPause();
			}
		},800)
	}
}


// *******************************************************************
// 进度条事件封装
function progressEvent(obj,obj2,type){
	obj.onmousedown=function(ev){
		// var startX=ev.clientX;
		var l=getPos(obj).left;
		var w=ev.clientX-l;
		if (type=="currentTime"&&theAudio.duration) {
			obj2.style.width=w+"px";
			theAudio.pause();
			clearInterval(theAudio.showTimer);
			playShow();
			theAudio.currentTime=theAudio.duration*w/obj.offsetWidth;
		}else if (type=="volume") {
			obj2.style.width=w+"px";
			theAudio.volume=w/obj.offsetWidth;
		}
		document.onmousemove=function(ev){
			w=ev.clientX-l;
			if (w<0) {
				w=0;
			}else if (w>obj.offsetWidth) {
				w=obj.offsetWidth
			}
			w=Math.abs(w);
			if (type=="currentTime"&&theAudio.duration) {
				obj2.style.width=w+"px";
				theAudio.currentTime=w/obj.offsetWidth*theAudio.duration;
			}else if (type=="volume") {
				obj2.style.width=w+"px";
				var vol=Math.round(w/obj.offsetWidth*100);
				if (vol>100) {
					vol=100;
				}
				theAudio.volume=vol/100;
			}
		}
		document.onmouseup=function(ev){
			if (type=="currentTime"&&theAudio.duration){
				theAudio.play();
			}
			document.onmousemove=document.onmouseup=null;
		}
		return false;
	}
	function getPos(obj) {	
		var pos = {left:0, top:0,right:0,bottom:0};
		var width0=obj.offsetWidth;
		var height0=obj.offsetHeight;
		while (obj) {
			pos.left += obj.offsetLeft;
			pos.top += obj.offsetTop;
			obj = obj.offsetParent;
		}
			pos.right = pos.left+width0;
			pos.bottom = pos.top+height0;
		return pos;
	}
}


// *******************************************************************
// jsonp封装
function jsonp(json){
	var sd;
	var settings = {
		url:json.url || '',
		data:json.data || {},
		succ:json.succ || '',
		cbName:json.cbName || 'callback',
		callback:json.callback || 'jQuery'+new Date().getTime(),
		fail:json.fail || ''
	}
	var timer = null;
	var head = document.getElementsByTagName('head')[0];
	var oS = document.createElement('script');
	oS.className = 'saodong';
	settings.data[settings.cbName] = settings.callback;	
	var arr = [];
	for(var attr in settings.data){
		arr.push(attr+'='+settings.data[attr]);
	}
	settings.data = arr.join('&');
	oS.src = settings.url + '?' + settings.data;
	head.appendChild(oS);	
	window[settings.callback] = function(json){
		clearTimeout(timer);
		sd = head.getElementsByClassName('saodong');			
		for(var i=0,len=sd.length;i<len;i++){
			head.removeChild(sd[0]);
		}			
		if(settings.succ && typeof settings.succ === 'function'){
			settings.succ(json);
		}
		// if(sd.length&&sd[0].src){
		// 	head.removeChild(sd);
		// }
	}	
	clearTimeout(timer);
	timer = setTimeout(function(){
		sd = head.getElementsByClassName('saodong');
		if(sd.length){
			if(settings.fail && typeof settings.fail === 'function'){
				settings.fail();
			}
		}
	},3000);	
}


// *******************************************************************
// 清浏览器默认
// document.addEventListener("mousedown",function(ev){
// 	ev.preventDefault()
// })

// 格式化时间数字
function formNum(num){
	if (num<10) {
		num=0+""+num;
	}
	return num;
}