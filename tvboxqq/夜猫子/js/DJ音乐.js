var rule = {
    title:'DJ音乐',
    host:'http://www.djuu.com',
    homeUrl:'/exclusive/115_1.html',//网站的首页链接,可以是完整路径或者相对路径,用于分类获取和推荐获取 fyclass是分类标签 fypage是页数
    url:'/djlist/fyclass_fypage.html',
    searchUrl:'/search?musicname=**',
    searchable:2,
    quickSearch:0,
    class_parse:'#top_banner_bg div;a&&Text;a&&href;/djlist/(\\d+)_1.html',
    headers:{
        'User-Agent':'Mozilla/5.0 (Linux; Android 11; M2104K10AC Build/RP1A.200720.011; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/87.0.4280.141 Mobile Safari/537.36'
    },
    timeout:5000,
    play_parse:true,
    lazy:'',
    limit:6,
    double:false,
    推荐:'*',
    一级:'.list_musiclist tr:gt(0);a&&title;img&&src;.cor999:eq(1)&&Text;a&&href',
    二级:'*',
    搜索:'*;*;*;.sc_1&&Text;*',
}