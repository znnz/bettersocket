var http=require('http');
var url=require('url');
var fs=require('fs');
var io=require('socket.io')();
var server=http.createServer(function(request,response){
  console.log('Connection');
  var path=url.parse(request.url).pathname;
  console.log(path);
  switch(path){
    case '/':
      response.writeHead(200,{
        'Content-Type':'text/html',
        'Cache-Control':'public',
        'max-age':'31536000'
      });
      response.write('Hello from node');
      response.end();
      break;
    case '/socket.html':
      var content;
      fs.readFile('./socket.html',function(error,data){
        if(error){
          response.writeHead(505);
          content="opps this doesn't exist - 404";
          response.write(content);
          response.end();
          console.log(error);
        }else{
          response.writeHead(200,{'Content-Type':'text/html'});
          content=data;
          response.end(content,'utf-8');
        }
      });
      break;
    default:
      response.writeHead(404);
      response.write("opps this doesn't exist - 404");
      response.end();
      break;
  }

});
var port=process.env.PORT || 8080;
server.listen(port);
console.log("Current server is open @127.0.0.1:"+port);
io.listen(server);
io.on('connection',function(socket){
 setInterval(function(){
   socket.emit('date',{'date':new Date()});
 },1000);

 socket.on('client_data',function(data){
   process.stdout.write(data.letter);
 });
});