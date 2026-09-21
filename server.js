const http = require('http');
const { WebSocketServer } = require('ws');
const crypto = require('crypto');
const PORT = Number(process.env.PORT || 10000);
const rooms = new Map();
function code(){ return crypto.randomBytes(3).toString('hex').toUpperCase(); }
function send(ws,msg){ if(ws.readyState===1) ws.send(JSON.stringify(msg)); }
function clean(ws){
  if(!ws.room) return;
  const room=rooms.get(ws.room); if(!room) return;
  room.players=room.players.filter(p=>p.ws!==ws);
  for(const p of room.players) send(p.ws,{type:'peerLeft'});
  if(room.players.length===0) rooms.delete(ws.room);
  ws.room=null;
}
const server=http.createServer((req,res)=>{
  res.writeHead(200,{'content-type':'application/json; charset=utf-8','access-control-allow-origin':'*'});
  res.end(JSON.stringify({ok:true,service:'Bleach Pixel PvP WebSocket',rooms:rooms.size}));
});
const wss=new WebSocketServer({server});
wss.on('connection',(ws)=>{
  ws.on('message',(raw)=>{
    let m; try{m=JSON.parse(raw.toString())}catch{return}
    if(m.type==='hello'){ws.name=String(m.name||'Player').slice(0,18);ws.character=String(m.character||'ichigo');return;}
    if(m.type==='createRoom'){
      clean(ws); let c; do{c=code()}while(rooms.has(c));
      rooms.set(c,{players:[{ws,name:String(m.name||ws.name||'Player').slice(0,18),character:String(m.character||ws.character||'ichigo'),role:'p1'}]});
      ws.room=c;ws.role='p1';
      send(ws,{type:'roomCreated',room:c,role:'p1',peerCharacter:'ichigo'}); return;
    }
    if(m.type==='joinRoom'){
      const c=String(m.room||'').trim().toUpperCase(), room=rooms.get(c);
      if(!room){send(ws,{type:'error',message:'Sala não encontrada.'});return;}
      if(room.players.length>=2){send(ws,{type:'error',message:'Sala cheia.'});return;}
      clean(ws);
      const first=room.players[0]; const second={ws,name:String(m.name||'Player').slice(0,18),character:String(m.character||'ichigo'),role:'p2'};
      room.players.push(second); ws.room=c;ws.role='p2';
      send(first.ws,{type:'roomJoined',room:c,role:'p1',peerCharacter:second.character});
      send(ws,{type:'roomJoined',room:c,role:'p2',peerCharacter:first.character});
      for(const p of room.players) send(p.ws,{type:'startOnline',room:c,role:p.role,yourCharacter:p.character,peerCharacter:p.role==='p1'?second.character:first.character});
      return;
    }
    if(m.type==='input' && ws.room){
      const room=rooms.get(ws.room); if(!room)return;
      for(const p of room.players) if(p.ws!==ws) send(p.ws,{type:'input',input:m.input||{}});
    }
  });
  ws.on('close',()=>clean(ws));
  ws.on('error',()=>clean(ws));
});
server.listen(PORT,'0.0.0.0',()=>console.log(`Bleach Pixel PvP server listening on ${PORT}`));
