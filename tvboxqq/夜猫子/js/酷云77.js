// 注意事项:此源仅支持tvbox的js1以及c#版drpy的js0，暂不支持drpy官方py版的js0

// 注入全局方法,方便
globalThis.getTime = function(){
let ts= Math.round(new Date().getTime()/1000).toString();
log('获取时间戳:'+ts);
return ts
}

globalThis.getHeaders= function(input,ts){
let tkstr=input.split('?')[1].split('&').map(function(it){
    return it.split('=')[1]
}).join('');
tkstr=input.split('?')[0].replace('https://api.tyun77.cn','')+tkstr+ts+'XSpeUFjJ';
log('tk加密前:'+tkstr);
let TK=md5(tkstr);
log('tk加密后:'+TK);
let headers={
    "User-Agent":"okhttp/3.12.0",
    "TK":TK
};
return headers
}

var rule = {
    title:'酷云77',
    host:'https://api.tyun77.cn',
    homeUrl:'/api.php/provide/homeBlock?type_id=0',
    searchUrl:'/api.php/provide/searchVideo?searchName=**',
    searchable:2,
    quickSearch:0,
    filterable:1,
    multi:1,
    // 分类链接fypage参数支持1个()表达式
    // url:'/api.php/provide/searchFilter?type_id=fyclass&pagesize=24&pagenum=fypage', // 旧的写法注释掉
    url:'/api.php/provide/searchFilter?devid=453CA5D864457C7DB4D0EAA93DE96E66&package=com.sevenVideo.app.android&pagenum=fypage&pagesize=24&version=&sj=$ts&type_id=fyclass',
    // detailUrl:'/api.php/provide/videoDetail?devid=453CA5D864457C7DB4D0EAA93DE96E66&package=com.sevenVideo.app.android&version=&ids=fyid', //旧的写法注释掉
    detailUrl:'/api.php/provide/videoDetail?devid=453CA5D864457C7DB4D0EAA93DE96E66&ids=fyid&package=com.sevenVideo.app.android&version=',
    filter_url:'year={{fl.y}}&category={{fl.scat}}&area={{fl.a}}',
    filter:{"1":[{"key":"class","name":"剧情","value":[{"n":"全部","v":""},{"n":"喜剧","v":"喜剧"},{"n":"爱情","v":"爱情"},{"n":"恐怖","v":"恐怖"},{"n":"动作","v":"动作"},{"n":"科幻","v":"科幻"},{"n":"剧情","v":"剧情"},{"n":"战争","v":"战争"},{"n":"警匪","v":"警匪"},{"n":"犯罪","v":"犯罪"},{"n":"武侠","v":"武侠"},{"n":"冒险","v":"冒险"},{"n":"枪战","v":"枪战"},{"n":"恐怖","v":"恐怖"},{"n":"悬疑","v":"悬疑"},{"n":"惊悚","v":"惊悚"},{"n":"青春","v":"青春"},{"n":"文艺","v":"文艺"},{"n":"古装","v":"古装"},{"n":"历史","v":"历史"},{"n":"运动","v":"运动"},{"n":"农村","v":"农村"}]},{"key":"area","name":"地区","value":[{"n":"全部","v":""},{"n":"大陆","v":"大陆"},{"n":"香港","v":"香港"},{"n":"台湾","v":"台湾"},{"n":"美国","v":"美国"},{"n":"日本","v":"日本"},{"n":"韩国","v":"韩国"},{"n":"泰国","v":"泰国"},{"n":"印度","v":"印度"}]},{"key":"year","name":"年份","value":[{"n":"全部","v":""},{"n":"2023","v":"2023"},{"n":"2022","v":"2022"},{"n":"2021","v":"2021"},{"n":"2020","v":"2020"},{"n":"2019","v":"2019"},{"n":"2018","v":"2018"},{"n":"2017","v":"2017"},{"n":"2016","v":"2016"},{"n":"2015","v":"2015"},{"n":"2014","v":"2014"},{"n":"2013","v":"2013"},{"n":"2012","v":"2012"},{"n":"2011","v":"2011"},{"n":"2010","v":"2010"}]}],
		"2":[{"key":"class","name":"剧情","value":[{"n":"全部","v":""},{"n":"古装","v":"古装"},{"n":"战争","v":"战争"},{"n":"青春偶像","v":"青春偶像"},{"n":"喜剧","v":"喜剧"},{"n":"家庭","v":"家庭"},{"n":"犯罪","v":"犯罪"},{"n":"动作","v":"动作"},{"n":"奇幻","v":"奇幻"},{"n":"剧情","v":"剧情"},{"n":"历史","v":"历史"},{"n":"经典","v":"经典"},{"n":"乡村","v":"乡村"},{"n":"情景","v":"情景"},{"n":"商战","v":"商战"},{"n":"网剧","v":"网剧"},{"n":"其他","v":"其他"}]},{"key":"area","name":"地区","value":[{"n":"全部","v":""},{"n":"内地","v":"内地"},{"n":"韩国","v":"韩国"},{"n":"香港","v":"香港"},{"n":"台湾","v":"台湾"},{"n":"日本","v":"日本"},{"n":"美国","v":"美国"},{"n":"泰国","v":"泰国"},{"n":"英国","v":"英国"},{"n":"新加坡","v":"新加坡"},{"n":"其他","v":"其他"}]},{"key":"lang","name":"语言","value":[{"n":"全部","v":""},{"n":"国语","v":"国语"},{"n":"英语","v":"英语"},{"n":"粤语","v":"粤语"},{"n":"闽南语","v":"闽南语"},{"n":"韩语","v":"韩语"},{"n":"日语","v":"日语"},{"n":"其它","v":"其它"}]},{"key":"year","name":"年份","value":[{"n":"全部","v":""},{"n":"2023","v":"2023"},{"n":"2022","v":"2022"},{"n":"2021","v":"2021"},{"n":"2020","v":"2020"},{"n":"2019","v":"2019"},{"n":"2018","v":"2018"},{"n":"2017","v":"2017"},{"n":"2016","v":"2016"},{"n":"2015","v":"2015"},{"n":"2014","v":"2014"},{"n":"2013","v":"2013"},{"n":"2012","v":"2012"},{"n":"2011","v":"2011"},{"n":"2010","v":"2010"}]}],
		"4":[{"key":"class","name":"剧情","value":[{"n":"全部","v":""},{"n":"情感","v":"情感"},{"n":"科幻","v":"科幻"},{"n":"热血","v":"热血"},{"n":"推理","v":"推理"},{"n":"搞笑","v":"搞笑"},{"n":"冒险","v":"冒险"},{"n":"萝莉","v":"萝莉"},{"n":"校园","v":"校园"},{"n":"动作","v":"动作"},{"n":"机战","v":"机战"},{"n":"运动","v":"运动"},{"n":"战争","v":"战争"},{"n":"少年","v":"少年"},{"n":"少女","v":"少女"},{"n":"社会","v":"社会"},{"n":"原创","v":"原创"},{"n":"亲子","v":"亲子"},{"n":"益智","v":"益智"},{"n":"励志","v":"励志"},{"n":"其他","v":"其他"}]},{"key":"lang","name":"语言","value":[{"n":"全部","v":""},{"n":"国语","v":"国语"},{"n":"英语","v":"英语"},{"n":"粤语","v":"粤语"},{"n":"韩语","v":"韩语"},{"n":"日语","v":"日语"},{"n":"其它","v":"其它"}]},{"key":"year","name":"年份","value":[{"n":"全部","v":""},{"n":"2023","v":"2023"},{"n":"2022","v":"2022"},{"n":"2021","v":"2021"},{"n":"2020","v":"2020"},{"n":"2019","v":"2019"},{"n":"2018","v":"2018"},{"n":"2017","v":"2017"},{"n":"2016","v":"2016"},{"n":"2015","v":"2015"},{"n":"2014","v":"2014"},{"n":"2013","v":"2013"},{"n":"2012","v":"2012"},{"n":"2011","v":"2011"},{"n":"2010","v":"2010"}]}],
		"3":[{"key":"class","name":"剧情","value":[{"n":"全部","v":""},{"n":"选秀","v":"选秀"},{"n":"情感","v":"情感"},{"n":"访谈","v":"访谈"},{"n":"播报","v":"播报"},{"n":"旅游","v":"旅游"},{"n":"音乐","v":"音乐"},{"n":"美食","v":"美食"},{"n":"纪实","v":"纪实"},{"n":"曲艺","v":"曲艺"},{"n":"生活","v":"生活"},{"n":"游戏互动","v":"游戏互动"},{"n":"财经","v":"财经"},{"n":"求职","v":"求职"}]},{"key":"area","name":"地区","value":[{"n":"全部","v":""},{"n":"内地","v":"内地"},{"n":"港台","v":"港台"},{"n":"日韩","v":"日韩"},{"n":"欧美","v":"欧美"}]},{"key":"lang","name":"语言","value":[{"n":"全部","v":""},{"n":"国语","v":"国语"},{"n":"英语","v":"英语"},{"n":"粤语","v":"粤语"},{"n":"闽南语","v":"闽南语"},{"n":"韩语","v":"韩语"},{"n":"日语","v":"日语"},{"n":"其它","v":"其它"}]},{"key":"year","name":"年份","value":[{"n":"全部","v":""},{"n":"2023","v":"2023"},{"n":"2022","v":"2022"},{"n":"2021","v":"2021"},{"n":"2020","v":"2020"},{"n":"2019","v":"2019"},{"n":"2018","v":"2018"},{"n":"2017","v":"2017"},{"n":"2016","v":"2016"},{"n":"2015","v":"2015"},{"n":"2014","v":"2014"},{"n":"2013","v":"2013"},{"n":"2012","v":"2012"},{"n":"2011","v":"2011"},{"n":"2010","v":"2010"}]}]
	},
    headers:{
		"User-Agent":"okhttp/3.12.0"
	},
    timeout:5000,
    class_name:'动漫&电视剧&电影&综艺',
    class_url:'4&2&1&3',
    limit:20,
    play_parse:true,
    //play_json:0,
    // 手动调用解析请求json的url,此lazy不方便
    // lazy:'js:input={parse:1,url:input};',
    //lazy:'',
    lazy:'js:function GetPlayUrl(playUrl){let realPlay={parse:0,url:playUrl};if(/mgtv|sohu/.test(playUrl)){realPlay.headers={"User-Agent":"Mozilla/5.0"}}else if(/bili/.test(playUrl)){realPlay.headers={"User-Agent":"Mozilla/5.0",Referer:"https://www.bilibili.com"}}else if(/ixigua/.test(playUrl)){realPlay.headers={"User-Agent":"Mozilla/5.0",Referer:"https://www.ixigua.com"}}return realPlay}if(/\\.m3u8|\\.mp4/.test(input)){input={parse:0,url:input}}else{try{let jxUrl="http://api.tyun77.cn/api.php/provide/parserUrl?url=";var t=Math.floor((new Date).getTime()/1e3).toString();let jxExt="&retryNum=0&pcode=010110002&version=2.1&devid=453CA5D864457C7DB4D0EAA93DE96E66&package=com.sevenVideo.app.android&sys=android&sysver=12&brand=Xiaomi&model=Mi_10_Pro&sj="+t;let url=jxUrl+input+jxExt;let TK="/api.php/provide/parserUrl"+"Xiaomif9c9ce5bb5827a266829383718e6131aMi_10_Procom.sevenVideo.app.android010110002"+0+t+"android12"+encodeURIComponent(vipUrl)+"2.1"+t+"XSpeUFjJ";let html=request(url,{headers:{Referer:jxUrl,"User-Agent":"okhttp/3.12.0",TK:md5(TK)}});let urll=JSON.parse(html).data.url;let playhtml=request(urll);let playurl=JSON.parse(playhtml).url;input=GetPlayUrl(playurl)}catch(e){input={parse:1,jx:1,url:input}}}',
    推荐:'json:data.blocks;contents;title;videoCover;msg;id',
    double:true,
    // 一级:'json:data.result;title;videoCover;msg;id', 旧的写法注释掉
    一级:`js:
    var d=[];
    let ts= getTime();
    input=input.replace('$ts',ts);
	let html = request(input,{
	headers:getHeaders(input,ts)
	});
	//print(html);
	html = JSON.parse(html);
    html.data.result.forEach(function(it){
    d.push({
    title:it.title,
    img:it.videoCover,
    desc:it.msg,
    url:it.id
    })
    });
    setResult(d);
    `,
    二级:`js: var d = [];
    VOD = {
        vod_id: input
    };
    let ts= getTime();
try {
    input=input+'&sj='+ts;
	let html = request(input,{
	headers:getHeaders(input,ts)
	});
	//print(html);
	html = JSON.parse(html);
	let node = html.data;
	VOD = {
		vod_id: node["id"],
		vod_name: node["videoName"],
		vod_pic: node["videoCover"],
		type_name: node["subCategory"],
		vod_year: node["year"],
		vod_area: node["area"],
		vod_remarks: node["msg"],
		vod_actor: node["actor"],
		vod_director: node["director"],
		vod_content: node["brief"].strip()
	};
	let tid = input.split("ids=")[1].split('&')[0];
	let listUrl='https://api.tyun77.cn/api.php/provide/videoPlaylist?devid=453CA5D864457C7DB4D0EAA93DE96E66&ids='+tid+'&package=com.sevenVideo.app.android&version=&sj='+ts;
	html = request(listUrl,{
	headers:getHeaders(listUrl,ts)
	});
	html = JSON.parse(html);
	let episodes = html.data.episodes;
	let playMap = {};
	if (typeof play_url === "undefined") {
		var play_url = ""
	}
	play_url = play_url.replace("&play_url=", "&type=json&play_url=");
	episodes.forEach(function(ep) {
		let playurls = ep["playurls"];
		playurls.forEach(function(playurl) {
			let source = playurl["playfrom"];
			if (!playMap.hasOwnProperty(source)) {
				playMap[source] = []
			}
			playMap[source].append(playurl["title"].strip() + "$" + play_url + urlencode(playurl["playurl"]))
		})
	});
	let playFrom = [];
	let playList = [];
	Object.keys(playMap)
		.forEach(function(key) {
			playFrom.append(key);
			playList.append(playMap[key].join("#"))
		});
	let vod_play_from =  ("酷云极速$$$酷云官解");
	let vod_play_url = playList.join("$$$");
	VOD["vod_play_from"] = vod_play_from;
	VOD["vod_play_url"] = vod_play_url
} catch (e) {
	log("获取二级详情页发生错误:" + e.message)
}`,
    搜索:'',
    搜索:'json:data;videoName;videoCover;msg;id',
}