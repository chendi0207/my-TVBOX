var 二级=`js:
try {
	let html = request(input);
	html = JSON.parse(html);
	let node = html.data;
	VOD = {
		vod_id: node["vod_id"],
		vod_name: node["vod_name"],
		vod_pic: node["vod_pic"],
		type_name: node["vod_class"],
		vod_year: node["vod_year"],
		vod_area: node["vod_area"],
		vod_remarks: node["vod_remarks"],
		vod_actor: node["vod_actor"],
		vod_director: node["vod_director"],
		vod_content: node["vod_content"].strip(),
	};
	// let episodes = node.vod_url_with_player;
	// let playMap = {};
	// if (typeof play_url === "undefined") {
	// 	var play_url = ""
	// }
	// episodes.forEach(function(ep) {
	// 	let source = ep["name"];
	// 	if (!playMap.hasOwnProperty(source)) {
	// 		playMap[source] = []
	// 	}
	// 	// playMap[source].append(ep["url"])
	// 	playMap[source].append(ep["url"].replace(/影探lfytv.cn(.*).mp4#/,''))
	// });
	// let playFrom = [];
	// let playList = [];
	// Object.keys(playMap).forEach(function(key) {
	// 	playFrom.append(key);
	// 	playList.append(playMap[key])
	// });
	// let vod_play_from = playFrom.join("$$$");
	// let vod_play_url = playList.join("$$$");
	// VOD["vod_play_from"] = vod_play_from;    
   
	VOD["vod_play_from"] = node["vod_play_from"];
	// VOD["vod_play_url"] = vod_play_url
	VOD["vod_play_url"] = node["vod_play_url"].replace(/影探lfytv(.*?)mp4#/g,'')
} catch (e) {
	log("获取二级详情页发生错误:" + e.message)
}
`;

var rule = {
	title: '影探[V2]', // csp_AppYsV2
	//host: 'http://ytcms.lfytyl.com',
	
    // hostJs:'print(HOST);let html=JSON.parse(request(HOST,{headers:{"User-Agent":PC_UA}}));let src = html.sites[0].ext.replace("/api.php/app/","");print(src);HOST=src',//网页域名根动态抓取js代码。通过HOST=赋值
    host: 'https://download.kstore.space/download/3313/mao/0.json',
	//host: 'http://ytcms.lfytyl.com',
  hostJs:'print(HOST);let html=request(HOST,{headers:{"User-Agent":"Dart/3.0 (dart:io)"}});let src = JSON.parse(html).domain;print(src);HOST=src',
	homeUrl:'/api.php/app/index_video',
	url: '/api.php/app/video?tid=fyclassfyfilter&limit=18&pg=fypage',
	detailUrl:'/api.php/app/video_detail?id=fyid',
	searchUrl: '/api.php/app/search?text=**&pg=fypage',
	searchable: 2,
	quickSearch: 0,
	filterable:1,
	headers:{'User-Agent':'Dart/2.14 (dart:io)'},
	timeout:5000,
	class_name:'新电影4K&新剧4K&好莱坞4K&豆瓣Top250电影4K&豆瓣Top100影视剧4K&港台经典4k&少儿动画4K&邵氏老电影4K&明星专辑4K&六公主4K&电影综合&电视剧综合&动漫&综艺&体育赛事', // 分类筛选 /api.php/app/nav
	class_url:'20&21&47&49&46&48&50&5&45&44&1&2&4&3&32',
	play_parse:true,
		lazy:'js:if(/m3u8|mp4/.test(input)){input}else if(/XY/.test(input)){let purl=request("http://lfty.lyyytv.cn/json.php?url="+input);input={jx:0,url:JSON.parse(purl).url,parse:0}}',
	limit:6,
	推荐:'json:list;vlist;*;*;*;*',
	double: true,
	一级:'json:list;vod_name;vod_pic;vod_remarks||vod_score;vod_id',
	二级:二级,
	搜索:'*',
}