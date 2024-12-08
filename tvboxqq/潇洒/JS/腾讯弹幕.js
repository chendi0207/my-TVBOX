var rule = {
    title: '腾云驾雾[官]',
    host: 'https://v.%71%71.com',
    homeUrl: 'https://v.qq.com/x/bu/pagesheet/list?_all=1&append=1&channel=cartoon&listpage=1&offset=0&pagesize=21&iarea=-1&sort=18',
    detailUrl: 'https://node.video.qq.com/x/api/float_vinfo2?cid=fyid',
    searchUrl: 'https://v.qq.com/x/search/?q=**&stag=fypage',
    searchable: 2,
    filterable: 1,
    multi: 1,
    url: 'https://v.qq.com/x/bu/pagesheet/list?_all=1&append=1&channel=fyclass&listpage=1&offset=((fypage-1)*21)&pagesize=21&iarea=-1',
    filter_url: 'sort={{fl.sort or 75}}&iyear={{fl.iyear}}&year={{fl.year}}&itype={{fl.type}}&ifeature={{fl.feature}}&iarea={{fl.area}}&itrailer={{fl.itrailer}}&gender={{fl.sex}}',
    filter: 'H4sIAAAAAAAAA+1Y3U8aWRT/X+ZZEwYEtI9207Rp0r40+9CNDxM7G8laaZCamsYEinyoDYp1sa1I/aJSK4ita3Eo9J+Ze2fmv9g7yOWc22u3xJX0RZ7gd+ee7/M7h3mujE+EQ+O6cuOP58pf+qxyQ5kOR6LKgDKlPWaoQrOrxFhmv2e0yafnj025cCFmJSouzH4E/crcQBen+VoHH/Z1cVJq2kfzHFeVuTH35FxhaFbXIqCRnJ2YjV1JI0mWnUS5I2FQ7Ur2erxDHbT9FeE+wH0Y9wLuxbgKuCDfA7gH4epIF2dfET4M+DDGg4AHMR4APIBxP+B+N2JjA0p0pi+ZCo5cnCnXHpSpP3Ut+jSig07ruEGKSz3nysoc00SSywaVy3v2LochI/TFoZXPdWBIoJNokvqLDgz5JtVTYnA/wU2SL5CF/Q4M0TW/bpFSmnsPKivvzdYWL1MQktqg69xACBXdTNi1Je4OlIaz+YHkmhxH7mdrpFrkOPJoc5W+LnEcXLJeZsFIFXyy9nPkrIFSxPGPRboY43gQ6Z1Hzw9fN98lm+9xeCb0S5kyOvvkfzTf4pHVPJD7ZvGYfFuXmk/oG9XDPqguExV7O4bOAurFTdu+B9kR2989+1FNsyMVEUF8hcby+MyDzC9ba8I9FOLMa9NYwPogwwJdtO9BVTDHRTtRpbKG/M5OkCmwR/sMcVw2RZY/YZlwZsfi1kIa34NysEvfIJsIrtZI82/xltsfqFiuG7vnxp7RIiE9OtuX1naDdM23l0rLuBaJhsNTv5JxtYiuoWwVauSl0XO2SCrJbkjrDl0v0cKhvO4c7lutrNTpJHlqNjj5DV3hOMBLAeJozMNQYCK1IetSq86bD5LRjHlpng8VlIGVonWYkwMSX2KjQVrGnMoamPKDLQfVqDh5gjjcpF6Xtyi6tU02uhMAyS+8Mw0DbUv8+WzZWknJW5rI7CiSjWWSrP93Pt0hd00OlyOHidDko/78GUJbAqaG7+brtP4M6Yvtk8zH3pmh9JlUeNugnlz7ArC3T0Tkw51xERGJFfqTAnVa87T6T8+WeAZ95FNccnxoMAAwWBIcHAEY7FY9DDUbJbO+KK+zybJg1TmjtCvmUXg83J+CEWk5FI1ooUkdxyltkFdxmj/rOU6jozelIJGNpru1FmpAQ+D37dH7PE4qsvPe7btyftuE5ezknPgriXTvPPidy/H7ELlmd6yTHeEO0wPqH/52C2DoHzvZsqtHdvqAZE5lBiYrGbNZoAWDFnmPBS6uQv/VzT1mjDV/KsWPjV5n9113mwZ8r2V+fSuVIJsQNJ+WjRZmAX5/YBpLUiLYrIVJBvxon+yw2SEPGpYDmLX4dUDzgG5npEyKbwPQnrGepDAP2/09NvcvaIIuCAgUAAA=',
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.54 Safari/537.36',
    },
    timeout: 5000,
    cate_exclude: '会员|游戏|全部|首页|留言|APP|下载|资讯|新闻|动态',
    class_name: '精选&电影&电视剧&综艺&动漫&少儿&纪录片',
    class_url: 'choice&movie&tv&variety&cartoon&child&doco',
    limit: 20,
    play_parse: true,
    lazy: $js.toString(() => {
        try {
            let api = "" + input.split("?")[0];
            console.log(api);
            let response = fetch(api, {
                method: 'get',
                headers: {
                    'User-Agent': 'okhttp/3.14.9',
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
            let bata = JSON.parse(response);
            if (bata.url.includes("qq")) {
                input = {
                    parse: 0,
                    url: bata.url,
                    jx: 0,
                    danmaku: "http://43.242.202.175:9595/njsdm.php?key=147258369&id=" + input.split("?")[0]
                };
            } else {
                input = {
                    parse: 0,
                    url: input.split("?")[0],
                    jx: 1,
                    danmaku: "http://43.242.202.175:9595/njsdm.php?key=147258369&id=" + input.split("?")[0]
                };
            }
        } catch {
            input = {
                parse: 0,
                url: input.split("?")[0],
                jx: 1,
                danmaku: "http://43.242.202.175:9595/njsdm.php?key=147258369&id=" + input.split("?")[0]
            };
        }
    }),
    推荐: '.list_item;img&&alt;img&&src;a&&Text;a&&data-float',
    一级: '.list_item;img&&alt;img&&src;a&&Text;a&&data-float',
    二级: 'js:\n        VOD = {};\n        let d = [];\n        let video_list = [];\n        let video_lists = [];\n        let list = [];\n        let QZOutputJson;\n        let html = fetch(input, fetch_params);\n        let sourceId = /get_playsource/.test(input) ? input.match(/id=(\\d*?)&/)[1] : input.split("cid=")[1];\n        let cid = sourceId;\n        let detailUrl = "https://v.%71%71.com/detail/m/" + cid + ".html";\n        log("详情页:" + detailUrl);\n        pdfh = jsp.pdfh;\n        pd = jsp.pd;\n        try {\n            let json = JSON.parse(html);\n            VOD = {\n                vod_url: input,\n                vod_name: json.c.title,\n                type_name: json.typ.join(","),\n                vod_actor: json.nam.join(","),\n                vod_year: json.c.year,\n                vod_content: json.c.description,\n                vod_remarks: json.rec,\n                vod_pic: urljoin2(input, json.c.pic)\n            }\n        } catch (e) {\n            log("解析片名海报等基础信息发生错误:" + e.message)\n        }\n        if (/get_playsource/.test(input)) {\n            eval(html);\n            let indexList = QZOutputJson.PlaylistItem.indexList;\n            indexList.forEach(function (it) {\n                let dataUrl = "https://s.video.qq.com/get_playsource?id=" + sourceId + "&plat=2&type=4&data_type=3&range=" + it + "&video_type=10&plname=qq&otype=json";\n                eval(fetch(dataUrl, fetch_params));\n                let vdata = QZOutputJson.PlaylistItem.videoPlayList;\n                vdata.forEach(function (item) {\n                    d.push({\n                        title: item.title,\n                        pic_url: item.pic,\n                        desc: item.episode_number + "\\t\\t\\t播放量：" + item.thirdLine,\n                        url: item.playUrl\n                    })\n                });\n                video_lists = video_lists.concat(vdata)\n            })\n        } else {\n            let json = JSON.parse(html);\n            video_lists = json.c.video_ids;\n            let url = "https://v.qq.com/x/cover/" + sourceId + ".html";\n            if (video_lists.length === 1) {\n                let vid = video_lists[0];\n                url = "https://v.qq.com/x/cover/" + cid + "/" + vid + ".html";\n                d.push({\n                    title: "在线播放",\n                    url: url\n                })\n            } else if (video_lists.length > 1) {\n                for (let i = 0; i < video_lists.length; i += 30) {\n                    video_list.push(video_lists.slice(i, i + 30))\n                }\n                video_list.forEach(function (it, idex) {\n                    let o_url = "https://union.video.qq.com/fcgi-bin/data?otype=json&tid=1804&appid=20001238&appkey=6c03bbe9658448a4&union_platform=1&idlist=" + it.join(",");\n                    let o_html = fetch(o_url, fetch_params);\n                    eval(o_html);\n                    QZOutputJson.results.forEach(function (it1) {\n                        it1 = it1.fields;\n                        let url = "https://v.qq.com/x/cover/" + cid + "/" + it1.vid + ".html";\n                        d.push({\n                            title: it1.title,\n                            pic_url: it1.pic160x90.replace("/160", ""),\n                            desc: it1.video_checkup_time,\n                            url: url,\n                            type: it1.category_map && it1.category_map.length > 1 ? it1.category_map[1] : ""\n                        })\n                    })\n                })\n            }\n        }\n        let yg = d.filter(function (it) {\n            return it.type && it.type !== "正片"\n        });\n        let zp = d.filter(function (it) {\n            return !(it.type && it.type !== "正片")\n        });\n        VOD.vod_play_from = yg.length < 1 ? "qq" : "qq$$$qq 预告及花絮";\n        VOD.vod_play_url = yg.length < 1 ? d.map(function (it) {\n            return it.title + "$" + it.url\n        }).join("#") : [zp, yg].map(function (it) {\n            return it.map(function (its) {\n                return its.title + "$" + its.url\n            }).join("#")\n        }).join("$$$");\n    ',
    搜索: 'js:\n        let d = [];\n        pdfa = jsp.pdfa;\n        pdfh = jsp.pdfh;\n        pd = jsp.pd;\n        let html = request(input);\n        let baseList = pdfa(html, "body&&.result_item_v");\n        log(baseList.length);\n        baseList.forEach(function (it) {\n            let longText = pdfh(it, ".result_title&&a&&Text");\n            let shortText = pdfh(it, ".type&&Text");\n            let fromTag = pdfh(it, ".result_source&&Text");\n            let score = pdfh(it, ".figure_info&&Text");\n            let content = pdfh(it, ".desc_text&&Text");\n            // let url = pdfh(it, ".result_title&&a&&href");\n            let url = pdfh(it, "div&&r-data");\n            // log(longText);\n            // log(shortText);\n            // log(\'url:\'+url);\n            let img = pd(it, ".figure_pic&&src");\n            url = "https://node.video.qq.com/x/api/float_vinfo2?cid=" + url.match(/.*\\/(.*?)\\.html/)[1];\n            log(shortText + "|" + url);\n            if (fromTag.match(/腾讯/)) {\n                d.push({\n                    title: longText.split(shortText)[0],\n                    img: img,\n                    url: url,\n                    content: content,\n                    desc: shortText + " " + score\n                })\n            }\n        });\n        setResult(d);\n    ',
    tab_exclude: '猜你|喜欢|下载|剧情|榜|评论',
    类型: '影视',
    double: false,
    二级访问前: '',
    encoding: 'utf-8',
    search_encoding: '',
    图片来源: '',
    图片替换: '',
    play_json: [],
    pagecount: {},
    proxy_rule: '',
    sniffer: false,
    isVideo: '',
    tab_remove: [],
    tab_order: [],
    tab_rename: {},
}