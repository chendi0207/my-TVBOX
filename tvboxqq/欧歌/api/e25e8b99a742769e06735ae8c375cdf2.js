/*
title: '荐片app', author: '小可乐/v5.12.1'
*/
var HOST;
const MOBILE_UA = "Mozilla/5.0 (Linux; Android 11; Pixel 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.91 Mobile Safari/537.36";
var DefHeader = {'User-Agent': MOBILE_UA};
var KParams = {
    headers: {'User-Agent': MOBILE_UA},
    timeout: 5000
};

async function init(cfg) {
    try {
        let host = cfg.ext?.host?.trim() || 'https://ev2089.zxbwv.com';
        HOST = host.replace(/\/$/, '');
        KParams.headers['Referer'] = HOST;
        let parseTimeout = parseInt(cfg.ext?.timeout?.trim(), 10);
        KParams.timeout = parseTimeout > 0 ? parseTimeout : 5000;
        const batchPathList = ['/api/appAuthConfig', '/api/term/home_fenlei', '/api/dyTag/hand_data?category_id=88']
        KParams.resObjList = await Promise.all(
            batchPathList.map(async (path) => {
                try {
                    return safeParseJSON(await request(`${HOST}${path}`));
                } catch (sErr) {return null;}
            })
        );
        let resObj = KParams.resObjList[0];
        let imgHost = resObj?.data?.imgDomain?.trim() || '';
        if (imgHost && !/^http/.test(imgHost)) {imgHost = `http://${imgHost}`;}
        KParams.imgHost = imgHost.replace(/\/$/, '');
        KParams.catesSet = cfg.ext?.catesSet?.trim() || '';
        KParams.tabsSet = cfg.ext?.tabsSet?.trim() || '';
    } catch(e) {
        console.error('初始化参数失败：', e.message);
    }
}

async function home(filter) {
    try {
        let resObj = KParams.resObjList[1];
        let typeObj = Array.isArray(resObj?.data) ? resObj.data : [];
        let classes = typeObj.map((item) => { return {type_name: item?.name ?? '分类名', type_id: item?.id?.toString() ?? '分类值'}; }).slice(1);
        if (KParams.catesSet) { classes = ctSet(classes, KParams.catesSet); }
        let filters = {};
        try {
            const nameObj = {category_id: 'cateId,分类', type: 'class,剧情', area: 'area,地区', year: 'year,年份', sort: 'by,排序' };
            let fclasses = classes.filter(it => it.type_id !== '99');
            let resObjList = await Promise.all(
                fclasses.map(async (it) => {
                    try {
                        return safeParseJSON(await request(`${HOST}/api/crumb/filterOptions?fcate_pid=${it.type_id}`));
                    } catch (sErr) {return null;}
                })
            );
            fclasses.forEach((it, idx) => {
                let resObj = resObjList[idx];
                let filterObj = Array.isArray(resObj?.data) ? resObj.data : [];
                filters[it.type_id] = filterObj.map(flt => {
                    let [kkey='', kname=''] = nameObj[flt.key]?.split(',');
                    let kval = flt.data ?? [];
                    let kvalue = kval.map(item => { return { n: item?.name || '未知', v: item?.id ?? '' }; });
                    return { key: kkey, name: kname, value: kvalue };
                }).filter(item => item.key && item.value.length > 0);
            });
        } catch (e) {}
        return JSON.stringify({
            class: classes,
            filters: filters
        });
    } catch (e) {
        console.error('获取分类失败：', e.message);
        return JSON.stringify({
            class: [], 
            filters: {}
        });
    }
}

async function homeVod() {
    try {
        let resObj = KParams.resObjList[2];
        let homeObj = Object.values(resObj?.data ?? {}).flat(1);
        let VODS = getVodList(homeObj);
        return JSON.stringify({list: VODS});
    } catch (e) {
        console.error('推荐页获取失败：', e.message);
        return JSON.stringify({list: []});
    }
}

async function category(tid, pg, filter, extend) {
    try {
        pg = parseInt(pg, 10);
        pg = pg > 0 ? pg : 1;
        let aPath = tid === '67' ? 'shortList' : 'list';
        let cateUrl = (tid === '99') ? `${HOST}/api/dyTag/list?category_id=${tid}` : `${HOST}/api/crumb/${aPath}?fcate_pid=${tid}&category_id=${extend?.cateId ?? ''}&type=${extend?.class ?? ''}&area=${extend?.area ?? ''}&year=${extend?.year ?? ''}&sort=${extend?.by ?? ''}&page=${pg}`;
        let resObj = safeParseJSON(await request(cateUrl));
        let cateObj = (tid === '99') ? (resObj?.data ?? []).map(it => it.dataList).flat(1) : resObj?.data ?? [];
        let VODS = getVodList(cateObj);
        let pagecount = (tid === '99') ? 1 : 999;
        return JSON.stringify({
            list: VODS,
            page: pg,
            pagecount: pagecount,
            limit: 30,
            total: 30*pagecount
        });
    } catch (e) {
        console.error('类别页获取失败：', e.message);
        return JSON.stringify({
            list: [],
            page: 1,
            pagecount: 0,
            limit: 30,
            total: 0
        });
    }
}

async function search(wd, quick, pg) {
    try {
        pg = parseInt(pg, 10);
        pg = pg > 0 ? pg : 1;
        let searchUrl = `${HOST}/api/v2/search/videoV2?key=${wd}&page=${pg}&pageSize=20`;
        let resObj = safeParseJSON(await request(searchUrl));
        let searchObj = resObj?.data ?? [];
        let VODS = getVodList(searchObj);
        return JSON.stringify({
            list: VODS,
            page: pg,
            pagecount: 10,
            limit: 30,
            total: 300
        });
    } catch (e) {
        console.error('搜索页获取失败：', e.message);
        return JSON.stringify({
            list: [],
            page: 1,
            pagecount: 0,
            limit: 30,
            total: 0
        });
    }
}

async function detail(id) {
    try {
        let [kid, kname, kpic, kremarks, kflag] = id.split('@');
        let aPath = kflag === '短剧' ? 'detail?vid=' : 'video/detailv2?id=';
        let detailUrl = `${HOST}/api/${aPath}${kid}`;
        let resObj = safeParseJSON(await request(detailUrl));
        let kvod = resObj?.data || null;
        if (!kvod) {throw new Error('kvod解析失败');}
        let ktype = '类型', kyear = '1000', karea = '地区', klang = '语言', kdirector = '导演', kactor = '主演', kcontent = '简介', ktabs = [], kurls = [];
        if (kflag === '短剧') {
            ktype = (kvod.categories_str ?? []).join('/') || '类型';
            kcontent = kvod.description || kname;
            let udArr = kvod.playlist ?? [];
            let tab = udArr[0]?.source_config_name || `线路1`;
            let kurl = udArr.map((it, i) => {
                let ename = it.title || `${i+1}集`;
                let eurl = it.url || 'noUrl';
                return `${ename}$${eurl}`;
            }).join('#');
            ktabs.push(tab);
            kurls.push(kurl);
        } else {
            const arrToStr = (arr, str) => { return (arr ?? []).map(it => (it.name || it.value)?.trim() || '').join('/') || str; };
            kyear = kvod.year?.trim() || '1000';
            karea = kvod.area?.trim() || '地区';
            kcontent = kvod.description?.trim() || '简介';
            ktype = arrToStr(kvod.types, '类型');
            klang = arrToStr(kvod.languages, '语言');
            kdirector = arrToStr(kvod.directors, '导演');
            kactor = arrToStr(kvod.actors, '主演');
            let udArr = kvod.source_list_source ?? [];
            udArr.forEach((it, i) => {
                let tab = it.name || `线路${i+1}`;
                let kurl = (it.source_list ?? []).map((item, j) => {
                    let ename = item.source_name || item.weight || `${j+1}集`;
                    let eurl = item.url || 'noUrl';
                    return `${ename}$${eurl}`;
                }).join('#');
                ktabs.push(tab);
                kurls.push(kurl);
            });
        }
        if (KParams.tabsSet) {
            let ktus = ktabs.map((it, idx) => { return {"type_name": it, "type_value": kurls[idx]} });
            ktus = ctSet(ktus, KParams.tabsSet);
            ktabs = ktus.map(it => it.type_name);
            kurls = ktus.map(it => it.type_value);
        }
        let VOD = {
            vod_id: kid,
            vod_name: kname,
            vod_pic: kpic,
            type_name: ktype,
            vod_remarks: kremarks,
            vod_year: kyear,
            vod_area: karea,
            vod_lang: klang,
            vod_director: kdirector,
            vod_actor: kactor,
            vod_content: kcontent,
            vod_play_from: ktabs.join('$$$'),
            vod_play_url: kurls.join('$$$')
        };
        return JSON.stringify({list: [VOD]});
    } catch (e) {
        console.error('详情页获取失败：', e.message);
        return JSON.stringify({list: []});
    }
}

async function play(flag, id, flags) {
    try {
        let kp = /\.(m3u8|mp4|mkv)/.test(id) ? 0 : 1;
        return JSON.stringify({
            jx: 0,
            parse: kp,
            url: id, 
            header: DefHeader 
        });
    } catch (e) {
        console.error('播放失败：', e.message);
        return JSON.stringify({
            jx: 0,
            parse: 0,
            url: '', 
            header: {} 
        });
    }
}

function getVodList(listArr) {
    try {
        let kvods = [];
        listArr.forEach(it =>{
            let isDj = Array.isArray(it.categories) && it.categories.includes(67) || Array.isArray(it.res_categories) && it.res_categories.some(item => item.name === '短剧' && item.id === 67);
            let vflag = isDj ? '短剧' : '其它';
            let vName = it.title || '名称';
            let vPic = `${KParams.imgHost}${it.path || it.cover_image || it.thumbnail || ''}`;
            let vRemarks = `${it.mask}|${it.score || '无评分'}`;
            kvods.push({
                vod_name: vName,
                vod_pic: vPic,
                vod_remarks: vRemarks,
                vod_id: `${it.id}@${vName}@${vPic}@${vRemarks}@${vflag}`,
            });      
        });
        return kvods;
    } catch(e) {
        console.error(`生成视频列表失败：`, e.message);
        return [];
    }
}

function safeParseJSON(jStr) {
    try {
        return JSON.parse(jStr);
    } catch(e) {
        return null;
    }
}

function ctSet(kArr, setStr) {
    if (!Array.isArray(kArr)) { return kArr; }
    try {
        let [set_arr, arrNames] = [[...kArr], setStr.split('&')];
        if (arrNames.length) {
            let filtered_arr = arrNames.map((item) => set_arr.find(it => it.type_name === item)).filter(Boolean);
            set_arr = filtered_arr.length? filtered_arr : [set_arr[0]];
        }
        return set_arr;
    } catch (e) {
        return kArr;
    }
}

async function request(reqUrl, options = {}) {
    if (typeof reqUrl !== 'string' || !reqUrl.trim()) { throw new Error('reqUrl需为字符串且非空'); }
    if (typeof options !== 'object' || Array.isArray(options) || !options) { throw new Error('options类型需为非null对象'); }
    try {
        options.method = options.method?.toLowerCase() || 'get';
        if (['get', 'head'].includes(options.method)) {
            delete options.data;
            delete options.postType;
        } else {
            options.data = options.data ?? '';
            options.postType = options.postType?.toLowerCase() || 'form';
        }        
        let {headers, timeout, charset, toBase64 = false, ...restOpts } = options;
        const optObj = {
            headers: (typeof headers === 'object' && !Array.isArray(headers) && headers) ? headers : KParams.headers,
            timeout: parseInt(timeout, 10) > 0 ? parseInt(timeout, 10) : KParams.timeout,
            charset: charset?.toLowerCase() || 'utf-8',
            buffer: toBase64 ? 2 : 0,
            ...restOpts
        };
        const res = await req(reqUrl, optObj);
        if (options.withHeaders) {
            const resHeaders = typeof res.headers === 'object' && !Array.isArray(res.headers) && res.headers ? res.headers : {};
            const resWithHeaders = { ...resHeaders, body: res?.content ?? '' };
            return JSON.stringify(resWithHeaders);
        }
        return res?.content ?? '';
    } catch (e) {
        console.error(`${reqUrl}→请求失败：`, e.message);
        return options?.withHeaders ? JSON.stringify({ body: '' }) : '';
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
        play: play,
        proxy: null
    };
}