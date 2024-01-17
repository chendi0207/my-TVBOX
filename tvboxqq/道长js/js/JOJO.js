
let root = 'https://jiohub.top';
let header = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36',
	'Referer': 'https://jiohub.top'
};

const wpurl = 'about:jojo';

const wpHtml = `
    <script src="https://gcore.jsdelivr.net/gh/msterzhang/cdn@1.0.35/jojo/dist/js/wasm_exec_tiny.js"></script>
    <script>
    	const go = new Go();
    	WebAssembly.instantiateStreaming(fetch('https:\/\/gcore.jsdelivr.net\/gh\/msterzhang\/cdn@1.0.35\/jojo\/dist/js/pid.wasm'), go.importObject).then((result) => {
    		go.run(result.instance);
    	});
    </script>
    <div style="display: none;" id="jojo">jojo</div>
`;

async function init(ext) {
    if (ext.indexOf('http') == 0) {
        root = ext;
    }
}

async function home(filter) {
    const purl = getAddress(true) + 'webparse/' + wpurl + '<<eval:"ok"?load=html&&init=1';
    console.log(purl);
    
    const res = await req(purl, {
        method: 'POST',
        data: wpHtml,
        postType: 'text'
    });
    console.log("loadWebHtml: " + res.content);
    
    
    const cate = "电影#国产#美剧#韩剧#日剧#动漫#纪录";
    const cateFilter = "动作#爱情#剧情#科幻#恐怖#动画#喜剧#犯罪";
    
    let classes = [];
    let filters = {};
    
    const value = [{n:"全部", v:""}];
    for (const v of cateFilter.split('#')) {
        value.push({n: v, v: v});
    }
    const f = {
        key: 'label',
        name: '标签',
        value: value
    };
    
    for (const item of cate.split('#')) {
        classes.push({
            'type_id': item,
            'type_name': item
        });
        filters[item] = f;
    }
    // console.log(JSON.stringify(classes));
    return JSON.stringify({
        'class': classes,
        'filters': filters ? filters : null
    });
}

async function homeVod(params) {
    let videos = [];
    const url = `${root}/video/国产?page=1&size=51`;
    let res = await req(url, {
        headers: header,
        method: 'GET'
    });
    const html = res.content;

    const data = html.match(/<a href="\/watch\/[\s\S]+?<\/a>/g);
    if (data) {
        for (const v of data) {
            const video = {
                'vod_id': v.match(/href="(.+?)"/)[1],
                'vod_name': v.match(/<p class="card-title">(.+?)<\/p>/)[1],
                'vod_pic': v.match(/src="(.+?)"/)[1],
                'vod_remarks': v.match(/<p class="item-speed">(.+?)<\/p>/)[1] + ' ' + v.match(/<p class="score">(.+?)<\/p>/)[1]
            };
            videos.push(video);
        }
    }
    
    return JSON.stringify({
        'list': videos,
        'type_des': ''
    });        
}

async function category(tid, page, filter, extend) {
    
    let videos = [];
    if (page < 1) page = 1;
    
    const label = (extend.label && extend.label!='' ? '/' + extend.label : '');

    const url = `${root}/video/${tid}${label}?page=${page}&size=18`;
    console.log(url);
    
    let res = await req(url, {
        headers: header,
        method: 'GET'
    });
    const html = res.content;

    const data = html.match(/<a href="\/watch\/[\s\S]+?<\/a>/g);
    if (data) {
        for (const v of data) {
            const video = {
                'vod_id': v.match(/href="(.+?)"/)[1],
                'vod_name': v.match(/<p class="card-title">(.+?)<\/p>/)[1],
                'vod_pic': v.match(/src="(.+?)"/)[1],
                'vod_remarks': v.match(/<p class="item-speed">(.+?)<\/p>/)[1] + ' ' + v.match(/<p class="score">(.+?)<\/p>/)[1]
            };
            videos.push(video);
        }
    }
    
    // console.log(JSON.stringify(videos));
    
    return JSON.stringify({
        'page': page,
        'pagecount': page + 1,
        'limit': videos.length,
        'total': videos.length * (page + 1),
        'list': videos,
        'type_des': ''
    });        
}

async function detail(tid) {
    const url = root + tid;
    console.log(url);
    let res = await req(url, {
        headers: header,
        method: 'GET'
    });

    let html = res.content;
    const div = html.match(/<div class="content-detail">([\s\S]+?)<\/div>/)[1];
    const vod = {
		"vod_id": tid,
		"vod_name": div.match(/<h3.*?>(.+?)<\/h3>/)[1],
		"vod_pic": '',
		"type_name": div.match(/<p class="data">类型：(.+?)<\/p>/)[1],
		"vod_year": div.match(/<p class="data">年份：(.+?)<\/p>/)[1],
		"vod_area": '',
		"vod_remarks": '',
		"vod_actor": div.match(/<p class="data">主演：(.+?)<\/p>/)[1],
		"vod_director": div.match(/<p class="data">导演：(.+?)<\/p>/)[1],
    	"vod_content": div.match(/class="detail-sketch hide">([\s\S]+?)<\/span>/)[1],
        "vod_play_from": 'JOJO',
    	"vod_play_url": ''
    };
    
    const urls = html.match(/let urls = "(.+?)"/)[1];
    // console.log(urls);
    
    const purl = getAddress(true) + 'webparse/' + wpurl + '<<eval:getData(tvbox.getPostBody())';
    console.log(purl);
    
    res = await req(purl, {
        headers: header,
        method: 'POST',
        data: urls,
        postType: 'text'
    });
    // console.log(res.content);
    
    vod.vod_play_url = res.content.replaceAll(/\n/g, "#");
    
    // console.log(JSON.stringify(vod));
    
    return JSON.stringify({
        'list': [vod]
    });    
}


async function play(flag, id, flags) {
    const purl = getAddress(true) + 'webparse/' + wpurl + '<<eval:getPid()';
    const res = await req(purl, {
        headers: header,
        method: 'GET'
    });
    return JSON.stringify({
        parse: 0,
        url: id + '?pid=' + res.content,
        header: {"User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1"}
    });
}

async function search(wd, quick) {
    const purl = getAddress(true) + 'webparse/' + wpurl + '<<eval:getPid()';
    const pres = await req(purl, {
        headers: header,
        method: 'GET'
    });
    const url = root + '/video/search?q=' + encodeURIComponent(wd) + '&pid=' + pres.content;
    console.log(url);
    
    let videos = [];
    let res = await req(url, {
        headers: header,
        method: 'GET'
    });
    const html = res.content;

    const data = html.match(/<a href="\/watch\/[\s\S]+?<\/a>/g);
    if (data) {
        for (const v of data) {
            const video = {
                'vod_id': v.match(/href="(.+?)"/)[1],
                'vod_name': v.match(/<p class="card-title">(.+?)<\/p>/)[1],
                'vod_pic': v.match(/src="(.+?)"/)[1],
                'vod_remarks': v.match(/<p class="item-speed">(.+?)<\/p>/)[1] + ' ' + v.match(/<p class="score">(.+?)<\/p>/)[1]
            };
            videos.push(video);
        }
    }
    
    return JSON.stringify({
        'list': videos,
        'type_des': ''
    });        
}

__JS_SPIDER__ = {
    init: init,
    home: home,
    homeVod: homeVod,
    category: category,
    detail: detail,
    play: play,
    search: search,
    extResult: null
};


    