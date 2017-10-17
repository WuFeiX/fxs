var http=require("http")
var url=require("url")
var fs=require("fs")
var mime=require("./mime.js")
var path=require("path")
var qs=require("querystring")

http.createServer(function(req,res){
	//判断是get和post哪个请求
	if(req.method=="GET"){
	//GET请求参数，包含在url中，可直接解析
		var q=url.parse(req.url,true).query
		console.log(q)
	}else if(req.method=="POST"){
	//POST参数没有url解析，所以使用事件接收参数
	var str=""
	req.on("data",function(){
		var postdata=qs.parse(str)
		console.log(postdata)
	})
		
	}
	//请求文件     判断路径
	var pathn=url.parse(req.url).pathname
	if(pathn=="/"){
		resdata("./data/data.json",res)
	}else{
		resdata("."+pathn,res)
	}
}).listen(8124)
console.log("启动服务成功")

//声明一个函数，读取文件返回
function resdata(path1,res){
	//读文件
	fs.readFile(path1,function(err,data){
		if(err){
			console.error(err)
		}else{
			console.log("读取文件成功")
			//取文件路径拓展名
			var extn=path.extname(path1).slice(1)
			//取媒体类型Content-Type
			var ctype=mime.types[extn]
			//设置响应头，Content—Type，跨域请求
			res.writeHead(200,{"Content-Type":ctype+";charset=utf-8","Access-Control-Allow-Origin":"*"})
			res.write(data)
			res.end()
		}
	})
}
