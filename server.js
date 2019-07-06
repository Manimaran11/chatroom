var http=require("http");
var fs=require("fs");
var path=require("path");
var mime=require("mime");
var cache={};
var chatServer=require('./lib/chat_server');
chatServer.listen(server);
var server = http.createServer((req, res) => {
    var filePath = false;
    if (req.url == '/') {
        filePath = 'public/index.html';
    }
    else {
        filePath = 'public' + req.url;
    }
    var absPath='./'+filePath;
    serverStatic(res,cache,absPath);
});
server.listen(3000,()=>{
    console.log("LIstening");
});

function send404(res)
{
    res.writeHead(404,{'content-type':'text-plain'});
    res.write('Error 404:resource not found');
    res.end();
}

function sendFile(res,filePath,fileContents)
{
    res.writeHead(
        200,
        {'content-type' : mime.getType(path.basename(filePath))}
        );
    res.end(fileContents);
}

function serverStatic(res,cache,absPath)
{
    if(cache[absPath]){
        sendFile(res,filePath,cache[absPath]);
    }
    else
    {
        fs.exists(absPath,function(exists){
            if(exists){
                fs.readFile(absPath,function(err,data){
                    if(err)
                    {
                        send404(err);
                    } else {
                        cache[absPath]=data;
                        sendFile(res,absPath,data);
                    }
                });
            }
            else {
                send404(res);
            }
        });
    }
}
