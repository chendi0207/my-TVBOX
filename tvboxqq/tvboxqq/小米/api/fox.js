/*小心儿悠悠
配置说明：
{
  "host": "https://xxx",  // 必填，站点地址
  "ver": 1,               // 可选，API版本：1或2，默认1
  "cms": "",             // 可选，CMS地址
  "from": "",            // 可选，搜索来源
  "category": 1,       // 可选，分类模式：0-无分类 1-普通 2-搜索
  "timeout": 5,         // 可选，超时时间(秒)，默认5
  "custom_first": 0,   // 可选，自定义解析优先：0-否 1-是
  "source_order": ["线路A", "线路B"], // 可选，线路排序
  
  // UA配置//可选,特殊站点需要自定义
  "ua": {
    "host": "UA字符串",            // 主机检测UA
    "config": "UA字符串",          // 配置获取UA
    "home": "UA字符串",            // 首页UA
    "category": "UA字符串",        // 分类页UA
    "search": "UA字符串",          // 搜索页UA
    "parse": "UA字符串",           // 解析UA
    "player": "UA字符串"           // 播放UA
  },
  
  // 解析配置
  "parse": {
    "线路名": "解析地址或parse:前缀"
  }
}

使用示例：
{
  "host": "https://xxx",
  "ver": 1,
  "source_order": ["超清", "高清", "标清"],
  "ua": {
    "home": "Mozilla/5.0...",
    "player": "Mozilla/5.0..."
  },
  "parse": {
    "超清": "https://jx.xxx/?url=",
    "高清": "parse:https://parse.xxx.com/"
  }
}
*/

import { Crypto, _ } from 'assets://js/lib/cat.js';

const MOBILE_UA = "Mozilla/5.0 (Linux; Android 11; Pixel 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.91 Mobile Safari/537.36";
const TV_UA = "Dalvik/2.1.0 (Linux; U; Android 9; Pixel Build/PI)";
var def_header = {'User-Agent': TV_UA};
var cachedPlayUrls = {};
var HOST;

var foxConfig = {
    host: '',
    headers: {'User-Agent': TV_UA},
    timeout: 5000,
    ver: 1,
    uas: {},
    parses: {},
    custom_parses: {},
    froms: '',
    detail: [],
    custom_first: 0,
    category: 1,
    cms: '',
    sourceOrder: []
};

var recommendCache = {
    data: [],
    timestamp: 0,
    cacheTime: 30 * 60 * 1000
};

function decodeBase64(str) {
    try {
        return Crypto.enc.Utf8.stringify(Crypto.enc.Base64.parse(str));
    } catch (e) {
        return str;
    }
}

function request(reqUrl, header, data, method) {
    try {
        let optObj = {
            headers: header || foxConfig.headers,
            method: method || 'get',
            timeout: foxConfig.timeout,
        };    
        if (method === 'post') {
            optObj.data = data || {};
            optObj.postType = 'form';
        }
        let res = req(reqUrl, optObj);
        return res.content;
    } catch (e) {
        throw new Error('请求失败: ' + reqUrl);
    }
}

function getdata(url, data, method) {
    try {
        url = /^http/.test(url) ? url : `${HOST}${url}`;
        let res = request(url, foxConfig.headers, data, method);
        return JSON.parse(res);
    } catch (e) {
        return {};
    }
}

function sortSources(play_from, play_urls) {
    if (!foxConfig.sourceOrder || foxConfig.sourceOrder.length === 0) {
        return { play_from, play_urls };
    }
    
    let sourceMap = new Map();
    for (let i = 0; i < play_from.length; i++) {
        if (i < play_urls.length) {
            sourceMap.set(play_from[i], {
                originalName: play_from[i],
                url: play_urls[i],
                index: i
            });
        }
    }
    
    let sorted_play_from = [];
    let sorted_play_urls = [];
    
    for (let sourceName of foxConfig.sourceOrder) {
        for (let [key, source] of sourceMap) {
            if (key.includes(sourceName)) {
                sorted_play_from.push(source.originalName);
                sorted_play_urls.push(source.url);
                sourceMap.delete(key);
                break;
            }
        }
    }
    
    for (let [key, source] of sourceMap) {
        sorted_play_from.push(source.originalName);
        sorted_play_urls.push(source.url);
    }
    
    return {
        play_from: sorted_play_from,
        play_urls: sorted_play_urls
    };
}

async function getRecommendVideos() {
    try {
        const now = Date.now();
        if (recommendCache.data.length > 0 && now - recommendCache.timestamp < recommendCache.cacheTime) {
            return recommendCache.data;
        }
        
        let headers = Object.assign({}, foxConfig.headers);
        let recommend_ua = foxConfig.uas.home || foxConfig.uas.homeVideo;
        if (recommend_ua) headers['User-Agent'] = recommend_ua;
        
        let videos = [];
        let res = request(HOST + '/api.php/Appfox/vodList?sort=热门&page=1&limit=12', headers);
        let response = JSON.parse(res);
        
        if (response.data && response.data.list) {
            videos = response.data.list.slice(0, 12);
        } else if (response.data && response.data.recommend_list) {
            videos = response.data.recommend_list.slice(0, 12);
        } else if (Array.isArray(response.data)) {
            videos = response.data.slice(0, 12);
        }
        
        if (videos.length > 0) {
            recommendCache.data = videos;
            recommendCache.timestamp = now;
        }
        
        return videos;
    } catch (e) {
        return [];
    }
}

async function init(cfg) {
    try {
        if (!cfg.ext) throw new Error('配置参数为空');
        
        let extValue = cfg.ext;
        
        if (typeof extValue === 'string') {
            try {
                extValue = decodeBase64(extValue);
            } catch (e) {}
            
            try {
                extValue = JSON.parse(extValue);
            } catch (e) {
                if (extValue.startsWith('http')) {
                    extValue = {host: extValue};
                } else {
                    throw new Error('配置格式错误');
                }
            }
        }
        
        let host = extValue.host || '';
        if (!host) throw new Error('主机地址为空');
        
        if (!host.match(/^https?:\/\/[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(:\d+)?(\/)?$/)) {
            let headers = Object.assign({}, foxConfig.headers);
            let custom_ua = foxConfig.uas.host;
            if (custom_ua) headers['User-Agent'] = custom_ua;
            
            let res = request(host, headers);
            let result = JSON.parse(res);
            host = result.apiDomain;
        }
        
        foxConfig.host = host.replace(/\/+$/, '');
        HOST = foxConfig.host;
        
        foxConfig.ver = extValue.ver === 2 ? 2 : 1;
        foxConfig.cms = extValue.cms || '';
        foxConfig.froms = extValue.from || '';
        foxConfig.custom_parses = extValue.parse || {};
        foxConfig.custom_first = extValue.custom_first || 0;
        foxConfig.category = extValue.category || 1;
        foxConfig.timeout = (extValue.timeout || 5) * 1000;
        foxConfig.sourceOrder = extValue.source_order || [];
        
        let ua = extValue.ua;
        if (ua) {
            if (typeof ua === 'string') {
                foxConfig.headers['User-Agent'] = ua;
            } else if (typeof ua === 'object') {
                foxConfig.uas = {
                    host: ua.host,
                    config: ua.config,
                    home: ua.home,
                    category: ua.category,
                    search: ua.search,
                    parse: ua.parse,
                    player: ua.player || 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1'
                };
            }
        }
        
        if (foxConfig.cms) {
            let cms = foxConfig.cms.replace(/\/+$/, '');
            if (cms.match(/^https?:\/\/.*\/vod/)) {
                cms += cms.includes('?') ? '&' : '?';
                foxConfig.cms = cms;
            }
        }
        
    } catch (e) {
        throw new Error('初始化失败: ' + e.message);
    }
}

async function home(filter) {
    try {
        if (!HOST || foxConfig.category === 0) return '{"class":[]}';
        
        let headers = Object.assign({}, foxConfig.headers);
        let custom_ua = foxConfig.uas.home;
        if (custom_ua) headers['User-Agent'] = custom_ua;
        
        if (foxConfig.cms && foxConfig.category !== 2) {
            let class_url = foxConfig.cms.replace(/&ac=videolist|ac=videolist&|ac=videolist|ac=detail/g, '');
            if (!class_url.includes('ac=')) class_url += 'ac=list';
            
            let classRes = request(class_url, headers);
            let classes = JSON.parse(classRes).class;
            
            let recommendVideos = await getRecommendVideos();
            let dataRes = request(foxConfig.cms.replace(/&$/, ''), headers);
            let data = JSON.parse(dataRes);
            data.class = classes;
            
            if (recommendVideos.length > 0) {
                data.recommend = recommendVideos;
            }
            
            return JSON.stringify(data);
        } else {
            let res = request(HOST + '/api.php/Appfox/init', headers);
            let response = JSON.parse(res);
            let classes = [];
            for (let i of response.data.type_list) {
                classes.push({type_id: i.type_id, type_name: i.type_name});
            }
            
            let recommendVideos = await getRecommendVideos();
            let result = {class: classes};
            
            if (recommendVideos.length > 0) {
                result.recommend = recommendVideos;
            }
            
            return JSON.stringify(result);
        }
    } catch (e) {
        return '{"class":[]}';
    }
}

async function homeVod() {
    try {
        if (!HOST || foxConfig.category === 0) return '{"list":[]}';
        
        if (foxConfig.cms && foxConfig.category !== 2) {
            let headers = Object.assign({}, foxConfig.headers);
            let custom_ua = foxConfig.uas.homeVideo || foxConfig.uas.home;
            if (custom_ua) headers['User-Agent'] = custom_ua;
            
            let res = request(foxConfig.cms.replace(/&$/, ''), headers);
            let data = JSON.parse(res);
            
            if (!data.list || data.list.length === 0) {
                let recommendVideos = await getRecommendVideos();
                if (recommendVideos.length > 0) {
                    data.list = recommendVideos;
                }
            }
            
            if (foxConfig.category === 2 && data.list) {
                for (let i of data.list) {
                    i.vod_id = 'msearch:' + i.vod_id;
                }
            }
            return JSON.stringify(data);
        }
        
        let headers = Object.assign({}, foxConfig.headers);
        let custom_ua = foxConfig.uas.homeVideo || foxConfig.uas.home;
        if (custom_ua) headers['User-Agent'] = custom_ua;
        
        let path = foxConfig.ver === 2 ? 'nav' : 'index';
        let res = request(HOST + '/api.php/Appfox/' + path, headers);
        let response = JSON.parse(res);
        let videos = [];
        
        if (foxConfig.ver === 2) {
            let navigationId = '';
            for (let i of response.data) {
                if (i.navigationId) {
                    navigationId = i.navigationId;
                    break;
                }
            }
            if (navigationId) {
                let navRes = request(HOST + '/api.php/Appfox/nav_video?id=' + navigationId, headers);
                let navData = JSON.parse(navRes);
                for (let item of navData.data) {
                    if (item.videos) {
                        videos = videos.concat(item.videos);
                    }
                }
            }
        } else {
            for (let item of response.data) {
                if (item.banner) videos = videos.concat(item.banner);
                if (item.categories) {
                    for (let cat of item.categories) {
                        if (cat.videos) videos = videos.concat(cat.videos);
                    }
                }
            }
        }
        
        if (videos.length === 0) {
            videos = await getRecommendVideos();
        }
        
        if (foxConfig.category === 2) {
            for (let i of videos) {
                i.vod_id = 'msearch:' + i.vod_id;
            }
        }
        return JSON.stringify({list: videos.slice(0, 20)});
    } catch (e) {
        try {
            let recommendVideos = await getRecommendVideos();
            return JSON.stringify({list: recommendVideos});
        } catch (e2) {
            return '{"list":[]}';
        }
    }
}

async function category(tid, pg, filter, extend) {
    try {
        if (!HOST) return '{"list":[]}';
        
        pg = parseInt(pg) || 1;
        let headers = Object.assign({}, foxConfig.headers);
        let category_ua = foxConfig.uas.category;
        if (category_ua) headers['User-Agent'] = category_ua;
        
        if (foxConfig.cms && foxConfig.category !== 2) {
            let res = request(foxConfig.cms + 'pg=' + pg + '&t=' + tid, headers);
            let data = JSON.parse(res);
            if (foxConfig.category === 2 && data.list) {
                for (let i of data.list) {
                    i.vod_id = 'msearch:' + i.vod_id;
                }
            }
            return JSON.stringify(data);
        } else {
            let res = request(HOST + '/api.php/Appfox/vodList?type_id=' + tid + '&page=' + pg, headers);
            let response = JSON.parse(res);
            let videos = response.data?.list || response.data?.recommend_list || [];
            let data = {list: videos};
            if (foxConfig.category === 2) {
                for (let i of data.list) {
                    i.vod_id = 'msearch:' + i.vod_id;
                }
            }
            return JSON.stringify(data);
        }
    } catch (e) {
        return '{"list":[]}';
    }
}

async function search(wd, quick, pg) {
    try {
        if (!HOST) return '{"list":[]}';
        
        pg = parseInt(pg) || 1;
        let headers = Object.assign({}, foxConfig.headers);
        let search_ua = foxConfig.uas.search;
        if (search_ua) headers['User-Agent'] = search_ua;
        
        if (foxConfig.cms) {
            let cms = foxConfig.cms.split('?')[0] + '?';
            let res = request(cms + 'ac=detail&wd=' + encodeURIComponent(wd), headers);
            let response = JSON.parse(res);
            foxConfig.detail = response.list || [];
            return JSON.stringify(response);
        } else {
            let path = HOST + '/api.php/Appfox/vod?ac=detail&wd=' + encodeURIComponent(wd);
            if (foxConfig.froms) path += '&from=' + foxConfig.froms;
            let res = request(path, headers);
            let response = JSON.parse(res);
            foxConfig.detail = response.list || [];
            return JSON.stringify(response);
        }
    } catch (e) {
        return '{"list":[]}';
    }
}

async function detail(id) {
    try {
        let headers = Object.assign({}, foxConfig.headers);
        let detail_ua = foxConfig.uas.detail || foxConfig.uas.search;
        if (detail_ua) headers['User-Agent'] = detail_ua;
        
        let video = null;
        for (let i of foxConfig.detail) {
            if (String(i.vod_id) === String(id)) {
                video = Object.assign({}, i);
                break;
            }
        }
        
        if (!video) {
            if (foxConfig.cms) {
                let cms = foxConfig.cms.split('?')[0] + '?';
                let res = request(cms + 'ac=detail&ids=' + id, headers);
                let response = JSON.parse(res);
                video = response.list?.[0] || null;
            } else {
                let res = request(HOST + '/api.php/Appfox/vod?ac=detail&ids=' + id, headers);
                let response = JSON.parse(res);
                video = response.list?.[0] || null;
            }
        }
        
        if (!video) return '{"list":[]}';
        
        let play_from = video.vod_play_from ? video.vod_play_from.split('$$$') : [];
        let play_urls = video.vod_play_url ? video.vod_play_url.split('$$$') : [];
        
        let sortedSources = sortSources(play_from, play_urls);
        play_from = sortedSources.play_from;
        play_urls = sortedSources.play_urls;
        
        try {
            let config_headers = Object.assign({}, foxConfig.headers);
            let custom_ua = foxConfig.uas.config;
            if (custom_ua) config_headers['User-Agent'] = custom_ua;
            
            let res = request(HOST + '/api.php/Appfox/config', config_headers);
            let config_response = JSON.parse(res);
            let player_list = config_response.data?.playerList || [];
            let jiexi_data_list = config_response.data?.jiexiDataList || [];
            
            let player_map = {};
            for (let player of player_list) {
                player_map[player.playerCode] = player;
            }
            
            let processed_play_urls = [];
            for (let idx = 0; idx < play_from.length; idx++) {
                let play_code = play_from[idx];
                if (player_map[play_code]) {
                    let player_info = player_map[play_code];
                    if (player_info.playerCode !== player_info.playerName) {
                        play_from[idx] = player_info.playerName + '\u2005(' + play_code + ')';
                    }
                }
                if (idx < play_urls.length) {
                    let urls = play_urls[idx].split('#');
                    let processed_urls = [];
                    for (let url of urls) {
                        let parts = url.split('$');
                        if (parts.length >= 2) {
                            parts[1] = play_code + '@' + parts[1];
                            processed_urls.push(parts.join('$'));
                        } else {
                            processed_urls.push(url);
                        }
                    }
                    processed_play_urls.push(processed_urls.join('#'));
                }
            }
            
            video.vod_play_from = play_from.join('$$$');
            video.vod_play_url = processed_play_urls.join('$$$');
            
            foxConfig.parses = {};
            for (let p of jiexi_data_list) {
                if (p.url && p.url.startsWith('http')) {
                    foxConfig.parses[p.playerCode] = p.url;
                }
            }
        } catch (e) {
        }
        
        return JSON.stringify({list: [video]});
    } catch (e) {
        return '{"list":[]}';
    }
}

async function play(flag, id, flags) {
    try {
        let parts = id.split('@', 2);
        if (parts.length < 2) {
            throw new Error('ID格式错误');
        }
        let play_from = parts[0];
        let raw_url = parts[1];
        
        let jx = 0, parse = 0, parsed = 0;
        let headers = Object.assign({}, foxConfig.headers);
        let parse_ua = foxConfig.uas.parse;
        if (parse_ua) headers['User-Agent'] = parse_ua;
        
        let player_ua = foxConfig.uas.player || MOBILE_UA;
        let url = raw_url;
        
        let parses_main = [];
        if (foxConfig.custom_first === 1) {
            parses_main.push(foxConfig.custom_parses);
            parses_main.push(foxConfig.parses);
        } else {
            parses_main.push(foxConfig.parses);
            parses_main.push(foxConfig.custom_parses);
        }
        
        outer: for (let parses2 of parses_main) {
            if (!parsed && !url.match(/https?:\/\/.*\.(m3u8|mp4|flv|mkv)/)) {
                for (let key in parses2) {
                    if (!play_from.includes(key)) continue;
                    
                    let parsers = parses2[key];
                    if (Array.isArray(parsers)) {
                        for (let parser of parsers) {
                            if (parser && parser.startsWith('parse:')) {
                                url = parser.split('parse:')[1] + raw_url;
                                jx = 0;
                                parse = 1;
                                break outer;
                            }
                            if (parser && parser.startsWith('http')) {
                                try {
                                    let res = request(parser + raw_url, headers);
                                    let response = JSON.parse(res);
                                    if (response.url && response.url.startsWith('http')) {
                                        url = response.url;
                                        parsed = 1;
                                        break outer;
                                    }
                                } catch (e) {
                                    continue;
                                }
                            }
                        }
                    } else {
                        if (parsers && parsers.startsWith('parse:')) {
                            url = parsers.split('parse:')[1] + raw_url;
                            jx = 0;
                            parse = 1;
                            break outer;
                        }
                        if (parsers && parsers.startsWith('http')) {
                            try {
                                let res = request(parsers + raw_url, headers);
                                let response = JSON.parse(res);
                                if (response.url && response.url.startsWith('http')) {
                                    url = response.url;
                                    parsed = 1;
                                    break outer;
                                }
                            } catch (e) {
                                continue;
                            }
                        }
                    }
                    if (parsed || parse) break;
                }
            }
            if (parsed || parse) break;
        }
        
        if (!(url.match(/https?:\/\/.*\.(m3u8|mp4|flv|mkv)/) || parsed === 1)) {
            jx = 1;
        }
        
        return JSON.stringify({
            jx: jx,
            parse: parse,
            url: url,
            header: {'User-Agent': player_ua}
        });
    } catch (e) {
        return JSON.stringify({
            jx: 0,
            parse: 0,
            url: id,
            header: {}
        });
    }
}

export function __jsEvalReturn() {
    return {
        init: init,
        home: home,
        homeVod: homeVod,
        category: category,
        search: search,
        detail: detail,
        play: play
    };
}