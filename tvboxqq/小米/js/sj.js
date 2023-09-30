    var rule = {
        title: '4k世界', // csp_AppYsV2
        host: 'http://yycms.77ev.cn',
        hostJs: 'print(HOST);let html=request(HOST,{headers:{"User-Agent":"Dart/3.0 (dart:io)"}});let src = JSON.parse(html).domain;print(src);HOST=src',
        url: '/api.php/app/video?tid=fyclassfyfilter&limit=20&pg=fypage',
        //     http://ym.dytt996.com:3/api.php/app/video?tid=20&class=&area=&lang=&year=&limit=18&pg=1
        filter_url: '&class={{fl.class}}&area={{fl.area}}&lang={{fl.lang}}&year={{fl.year}}',

        detailUrl: '/api.php/app/video_detail?id=fyid',
        searchUrl: '/api.php/app/search?text=**&pg=fypage',
        searchable: 2,
        quickSearch: 0,
        filterable: 1, //是否启用分类筛选,
        headers: {
            'User-Agent': 'Dart/2.14 (dart:io)'
        },
        timeout: 5000,
        class_name: '电影&国产剧&电视剧&欧美剧&日韩剧&动漫&综艺', // 分类筛选 /api.php/app/nav
        class_url: '1&21&2&23&24&3&4',
        play_parse: true,
        lazy:'js:if(/m3u8|mp4/.test(input)){input}else{let purl=request("http://175.178.183.192:84/api/?key=f3913eb3f85a8298b3e6e427b8712b2e&url="+input);input={jx:0,url:JSON.parse(purl).url,parse:0}}',
        limit: 6,
        推荐: 'json:list[0].vlist;*;*;*;*',
        一级: 'json:list;vod_name;vod_pic;vod_remarks||vod_score;vod_id',
        二级: 'js:try{let html=request(input);print(html);html=JSON.parse(html);let node=html.data;VOD={vod_id:node["vod_id"],vod_name:node["vod_name"],vod_pic:node["vod_pic"],type_name:node["vod_class"],vod_year:node["vod_year"],vod_area:node["vod_area"],vod_remarks:node["vod_remarks"],vod_actor:node["vod_actor"],vod_director:node["vod_director"],vod_content:node["vod_content"].strip()};let episodes=node.vod_url_with_player;let playMap={};if(typeof play_url==="undefined"){var play_url=""}episodes.forEach(function(ep){let source=ep["name"];if(!playMap.hasOwnProperty(source)){playMap[source]=[]}playMap[source].append(ep["url"])});let playFrom=[];let playList=[];Object.keys(playMap).forEach(function(key){playFrom.append(key);playList.append(playMap[key])});let vod_play_from = playFrom.join("$$$");let vod_play_url=playList.join("$$$");VOD["vod_play_from"]=vod_play_from;VOD["vod_play_url"]=vod_play_url}catch(e){log("获取二级详情页发生错误:"+e.message)}',
        搜索: '*',
    }