#coding=utf-8
#!/usr/bin/python
import sys
sys.path.append('..') 
from base.spider import Spider
import json
import re
import time
import html
import base64
import hashlib
import urllib.parse

class Spider(Spider):
	def getName(self):
		return "虎牙"
	def init(self,extend=""):
		pass
	def isVideoFormat(self,url):
		pass
	def manualVideoCheck(self):
		pass
	def homeContent(self,filter):
		result = {}
		cateManual = {
"音乐":"音乐",
"星秀":"星秀",
"颜值":"颜值",
"交友":"交友",
"户外":"户外",
"美食":"美食",
"一起看":"一起看", 
"王者荣耀":"王者荣耀", 
"和平精英":"和平精英",
"英雄联盟":"英雄联盟",
"天天吃鸡":"天天吃鸡",
"穿越火线":"穿越火线",
"二次元":"二次元",
"体育":"体育",
"原神":"原神",
"三国杀":"三国杀", 
"暗黑破坏神：不朽":"暗黑破坏神：不朽",  
"迷你世界":"迷你世界",
"暗区突围":"暗区突围",  
"生死狙击2":"生死狙击2",     
"金铲铲之战":"金铲铲之战",     
"英雄联盟手游":"英雄联盟手游",   
"lol云顶之弈":"lol云顶之弈", 
"剑侠世界3":"剑侠世界3",
"不良人3":"不良人3",
"二次元":"二次元", 
 "主机游戏":"主机游戏"
		}
		classes = []
		for k in cateManual:
			classes.append({
				'type_name': k,
				'type_id': cateManual[k]
			})

		result['class'] = classes
		if (filter):
			result['filters'] = self.config['filter']
		return result
	def homeVideoContent(self):
		result = {}
		return result
	def categoryContent(self,tid,pg,filter,extend):
		result = {}
		url = 'http://live.yj1211.work/api/live/getRecommendByPlatformArea?platform=huya&size=20&area={0}&page={1}'.format(tid, pg)
		rsp = self.fetch(url)
		content = rsp.text
		jo = json.loads(content)
		videos = []
		vodList = jo['data']
		for vod in vodList:
			aid = (vod['roomId']).strip()
			title = vod['roomName'].strip()
			img = vod['roomPic'].strip()
			remark = (vod['ownerName']).strip()
			videos.append({
				"vod_id": aid,
				"vod_name": title,
				"vod_pic": img,
				"vod_remarks": remark
			})
		result['list'] = videos
		result['page'] = pg
		result['pagecount'] = 9999
		result['limit'] = 90
		result['total'] = 999999
		return result
	def detailContent(self,array):
		aid = array[0]
		url = 'https://www.huya.com/' + aid
		header = {
			'Content-Type': 'application/x-www-form-urlencoded',
			'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.77 Safari/537.36'
		}
		rsp = self.fetch(url, headers=header)
		streamInfo = re.findall(r'stream: ([\s\S]*?)\n', rsp.text)
		if (len(streamInfo) > 0):
			liveData = json.loads(streamInfo[0])
		else:
			streamInfo = re.findall(r'"stream": "([\s\S]*?)"', rsp.text)
			if (len(streamInfo) > 0):
				liveDataBase64 = streamInfo[0]
				liveData = json.loads(str(base64.b64decode(liveDataBase64), 'utf-8'))
		streamInfoList = liveData['data'][0]['gameStreamInfoList']
		vod = {
			"vod_id": aid,
			"vod_name": liveData['data'][0]['gameLiveInfo']['roomName'],
			"vod_pic": liveData['data'][0]['gameLiveInfo']['screenshot'],
			"type_name": liveData['data'][0]['gameLiveInfo']['gameFullName'],
			"vod_year": "",
			"vod_area": "",
			"vod_remarks": "",
			"vod_actor": "",
			"vod_director": "",
			"vod_content": ""
		}
		playUrl = ''
		for streamInfo in streamInfoList:
			hls_url = streamInfo['sHlsUrl'] + '/' + streamInfo['sStreamName'] + '.' + streamInfo['sHlsUrlSuffix']
			srcAntiCode = html.unescape(streamInfo['sHlsAntiCode'])
			c = srcAntiCode.split('&')
			c = [i for i in c if i != '']
			n = {i.split('=')[0]: i.split('=')[1] for i in c}
			fm = urllib.parse.unquote(n['fm'])
			u = base64.b64decode(fm).decode('utf-8')
			hash_prefix = u.split('_')[0]
			ctype = n.get('ctype', '')
			txyp = n.get('txyp', '')
			fs = n.get('fs', '')
			t = n.get('t', '')
			seqid = str(int(time.time() * 1e3 + 1463993859134))
			wsTime = hex(int(time.time()) + 3600).replace('0x', '')
			hash = hashlib.md5('_'.join([hash_prefix, '1463993859134', streamInfo['sStreamName'], hashlib.md5((seqid + '|' + ctype + '|' + t).encode('utf-8')).hexdigest(), wsTime]).encode('utf-8')).hexdigest()
			ratio = ''
			purl = "{}?wsSecret={}&wsTime={}&seqid={}&ctype={}&ver=1&txyp={}&fs={}&ratio={}&u={}&t={}&sv=2107230339".format( hls_url, hash, wsTime, seqid, ctype, txyp, fs, ratio, '1463993859134', t)
			playUrl = playUrl + '{}${}#'.format(streamInfo['sCdnType'], purl)
		vod['vod_play_from'] = '虎牙直播'
		vod['vod_play_url'] = playUrl

		result = {
			'list': [
				vod
			]
		}
		return result
	def searchContent(self,key,quick):
		result = {}
		return result
	def playerContent(self,flag,id,vipFlags):
		result = {}
		url = id
		result["parse"] = 0
		result["playUrl"] = ''
		result["url"] = url
		result["header"] = {
			"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36"
		}
		result["contentType"] = ''
		return result

	config = {
		"player": {},
		"filter": {}
	}
	header = {}

	config = {
		"player": {},
		"filter": {}
	}
	header = {}
	def localProxy(self,param):
		action = {
			'url':'',
			'header':'',
			'param':'',
			'type':'string',
			'after':''
		}
		return [200, "video/MP2T", action, ""]