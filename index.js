const http=require('http')
const fs=require('fs')
const requests=require('requests')

const homeFile=fs.readFileSync("home.html",'utf-8')

const replaceVal=(tempVal,orgVal)=>{
  
   let temperature=tempVal.replace('{%temp%}',orgVal.main.temp);
   temperature=temperature.replace('{%tempmin%}',orgVal.main.temp_min);
   temperature=temperature.replace('{%tempmax%}',orgVal.main.temp_max);
   temperature=temperature.replace('{%location%}',orgVal.name);
   temperature=temperature.replace('{%country%}',orgVal.sys.country);
   //console.log(temperature)
   return temperature;
}

const server=http.createServer((req,res)=>{
     
    if(req.url='/'){
      requests("https://api.openweathermap.org/data/2.5/weather?q=patna&appid=772fd5127fab23e6297b43dc79f3c396")
      .on('data', (chunk)=> {
       const objdata=JSON.parse(chunk)
       const arr=[objdata]
       const realTimedata=arr.map((val)=>replaceVal(homeFile,val)).join("");
       res.write(realTimedata);
      })
      .on('end', (err)=> {
        if (err) return console.log('connection closed due to errors', err);
           res.end();
      });
    }
});

server.listen(8000,"127.0.0.1");