var $overplayer = null;
var $data = [null];
var log = "Start"
var logger = 2;
$(document).ready(function(){
	console.log("Ping!");
	$('#save').on('click', function(){
		$.ajax({
			method: "POST",
			url: "http://127.0.0.1:3000/save",
			data: JSON.stringify({"stats":Game.player._stats, "gear":Game.player.inv, "loc":[Game.player._x,Game.player._y],"map":Game.map, "monsters":Game.monsters,"items":Game.items}),
			contentType: 'application/json',
			dataType: 'json',
			crossDomain: true,
			success:function(response){
				console.log(response)
				},
			error:function (response) {
				console.log(response.getAllResponseHeaders())
				console.log(response)
			}
		})
	})
	$('#register').on('click', function(){
		$('#form').empty()
		$('#form').append(`
<form action='/new' method='POST'>
	<input type="text" name="username" placeholder="New Name">
	<input type="text" name="password" placeholder="New Password">
	<input id="registerbutton" type="submit">
</form>
			`)
		$('#registerbutton').on('click', function(event){
			event.preventDefault();
			var $username = $("input[name='username']").val();
			var $password = $("input[name='password']").val();
			$.ajax({
				method: "POST",
				url: "http://127.0.0.1:3000/new",
				data: {'username':$username,'password':$password},
			})
		})
	})
})

display = new ROT.Display();
display.setOptions({width:50,height:10})
document.body.appendChild(display.getContainer());
$("canvas").hide();
$('#shower').on('click',function(){$("canvas").show();$('#shower').hide();})
display.drawText(2,2,"Welcome! Start New Game? y/n");
window.addEventListener("keydown", this);

handleEvent = function(e) {
   var key = e.keyCode ? e.keyCode : e.which;

	if (key == 89) {
	window.removeEventListener("keydown",this);
	display.clear()
	display.drawText(2,2,"What is your character's name?");
	$("#charname").show()
	$("#nextbutton").show()

	$('#nextbutton').on('click',function(event){
		display.drawText(2,2,"What are your characters stats?");
		event.preventDefault()
		//$("[type=number]").show();
		$("li").show()
		$("[type=submit]").show();
		$("#charname").hide()
		$("#nextbutton").hide()
	})
	$('#submitter').on('click',function(event){
		if (parseInt($("#strength").val())+parseInt($("#constitution").val())+parseInt($("#dexterity").val())>15) {return;}
		event.preventDefault();
		$("li").hide()
		$(".navbar").show()
		$("#submitter").hide()
		document.body.removeChild(display.getContainer());
		var $charname = $("#charname").val();
		var $stats = [50,parseInt($("#strength").val()),parseInt($("#constitution").val()),parseInt($("#dexterity").val()),[10,10],0];
		var $gear = [[new Item(1,2,"weapon",[true,1,3],"Fists")],[new Item(0,0,"consumable",[0,10],"Health Potion", (Math.floor(Math.random()*20))+25)]]
		$overplayer = new Player($charname,0,0,"#FF0000",$stats,$gear)
		//console.log($stats)
		$.ajax({
			method: "POST",
			url: "http://127.0.0.1:3000/newchar",
			//xhrFields: { withCredentials:true },
			data: JSON.stringify({"charname":$charname,"stats":$stats, "gear":$gear}),
			contentType: 'application/json',
			dataType: 'json',
			crossDomain: true,
			success:function(response){
				//console.log(response)
				},
			error:function (response) {
				console.log(response.getAllResponseHeaders())
				console.log(response)
			}
		})
		
		Game.init();
	})

	}
	if (key == 78) {
		$.ajax({
			method:"GET",
			url: "http://localhost:3000/load",
			xhrFields: { withCredentials:true },
			success: function (response) {
			$('#load').attr('class',response)
			//console.log("done!"+ something.getAllResponseHeaders());
			console.log(response)
			Game.player = null
			$overplayer = new Player(response[0],response[1][0],response[1][1],"#FF0000",response[2],response[3])
			$data = [response[4],response[5],response[6]]
			document.body.removeChild(display.getContainer());
			Game.init();
			},
			error: function(response){
				console.log(response.status)
				display.clear()
				display.drawText(2,2, "Something borked itself")
				return;
			}
		});
		
	}
}


//the actual game
var Game = {
	display: null,
	indisplay: null,
	mapdisplay: null,
	map: {},
	engine: null,
	player: null,
	monsters: [],
	items: [],
	screenWidth: 45,
	screenHeight: 30,
	scheduler: new ROT.Scheduler.Action(),
	init: function() {

		this.display = new ROT.Display();//setting up the screen

		this.display.setOptions({width:this.screenWidth,height:this.screenHeight,forceSquareRatio:true})
		this.display.cache = true
		//this.display.setOptions({width:50,height:30})
		this.indisplay = new ROT.Display();//setting up the screen
		this.indisplay.setOptions({width:45,height:3,bg:"#2B467F"})
		this.mapdisplay = new ROT.Display();//setting up the screen
		this.mapdisplay.setOptions({width:50,height:50,bg:"#2B467F",spacing:0.7,fontSize:7,forceSquareRatio:true})
		document.body.appendChild(this.display.getContainer());
		
		document.body.appendChild(this.mapdisplay.getContainer());
		document.body.appendChild(this.indisplay.getContainer());
		this._generateMap();
		
		this.scheduler.add(this.player, true,1);
		for (var i = this.monsters.length - 1; i >= 0; i--) {
			this.scheduler.add(this.monsters[i], true,1);
	   }
		
		this.engine = new ROT.Engine(this.scheduler);
		this.engine.start();
	},

	_generateMap: function() {
		if ($data[0]!=null) {
			Game.map = $data[0];
			Game.monsters = $data[1];
			Game.items = $data[2]
			return;
		}
		var forest = new ROT.Map.Cellular(100,60,{
		//born: [4, 5, 6, 7, 8],
		//survive: [2, 3, 4, 5],
		connected: true
		});
		freeCells =[]
		forest.randomize(0.47)

		var forCallback = function(x, y, value) {
			var key = x+","+y;
			if (value) { 
			this.map[key] = "#";
			return; 
			}            
			this.map[key] = ".";
			freeCells.push(key);
		}
		for (var i=49; i>=0; i--) {
		forest.create(forCallback.bind(this));
		forest.connect(this.display.DEBUG,0)
		}
		var waterer = new ROT.Map.Cellular(this.screenWidth,this.screenHeight,{
			born: [4, 5, 6, 7, 8],
			survive: [3,4, 5],});
		waterer.randomize(0.2)
		var watCallback = function(x, y, value) {
			var key = x+","+y;
			if (value & this.map[key]=='.') { 
			this.map[key] = "~";
			return; 
			}            
			//this.map[key] = null;
		  	if (this.map[key]!="#") {freeCells.push(key);}
		  	
		}
		for (var i=40; i>=0; i--) {
			waterer.create(watCallback.bind(this));
		}
		
		this._generateBoxes(freeCells);
		this._createPlayer(freeCells);//spawn things
		this._generateMonsters(freeCells);
		this._drawWholeMap();   
	},

	_generateNextMap: function() {
		Game.map = {};

	    var digger = new ROT.Map.Digger(100,60,{roomWidth:[5,10], roomHeight:[5,10], corridorLength:[3,10], dugPercentage:0.3});
	 	var freeCells = [];
	    var digCallback = function(x, y, value) {
        	var key = x+","+y;
			if (value) {
			this.map[key] = "#";
			return; 
			}            
			this.map[key] = ".";
			freeCells.push(key);
    	}
   		digger.create(digCallback.bind(this));

		$overplayer=null
		this._createPlayer(freeCells);//spawn things
		this.items = [];
		this._generateBoxes(freeCells);
		this.monsters = [];
		this._generateMonsters(freeCells);
		this._drawWholeMap();
		this.scheduler = new ROT.Scheduler.Action()
		this.scheduler.add(this.player, true,1);
		for (var i = this.monsters.length - 1; i >= 0; i--) {
			this.scheduler.add(this.monsters[i], true,1);
	   }
		
		this.engine = new ROT.Engine(this.scheduler);
		this.engine.start();
	},
	_createPlayer: function(freeCells) {
		if ($overplayer!=null) {this.player= $overplayer;}
		var index = Math.floor(ROT.RNG.getUniform() * freeCells.length);
		var key = freeCells.splice(index, 1)[0];
		if (key!=null) {
		var parts = key.split(",");
		}
		var x = parseInt(parts[0]);
		var y = parseInt(parts[1]);
		this.player._x = x;//= new Player(x, y,'#FF0000',[20,5,10,20],[100,100],0,[new Item(x,y,true,[1,5],"Sword")]);//[HP,STR,CON,DEX],[Food,Water],score,[inv]
		this.player._y = y;
		this.map[key] = "@"
	},
	_generateBoxes: function(freeCells) {
		for (var i=0;i<10;i++) {
			var index = Math.floor(ROT.RNG.getUniform() * freeCells.length);
			var key = freeCells.splice(index, 1)[0];
			this.map[key] = "*";
			var parts = key.split(",");
			var x = parseInt(parts[0]);
			var y = parseInt(parts[1]);
			this.items.push(new Item(x,y,"consumable",[0,10],"Health Potion", (Math.floor(Math.random()*20))+25))
		}
		for (var i=0;i<10;i++) {
			var index = Math.floor(ROT.RNG.getUniform() * freeCells.length);
			var key = freeCells.splice(index, 1)[0];
			this.map[key] = "+";
			var parts = key.split(",");
			var x = parseInt(parts[0]);
			var y = parseInt(parts[1]);
			var first = Math.floor(Math.random()*2)+1
			var second = Math.floor(Math.random()*5)+1
			this.items.push(new Item(x,y,"weapon",[false,first,second],first+"d"+second+" Sword", (Math.floor(Math.random()*50))+(10*second)))
		}
		var index = Math.floor(ROT.RNG.getUniform() * freeCells.length);
		var key = freeCells.splice(index, 1)[0];
		this.map[key] = ">";
	},
	_generateMonsters: function(freeCells) {
		for (var i=0;i<7;i++) {
			var index = Math.floor(ROT.RNG.getUniform() * freeCells.length);
			var key = freeCells.splice(index, 1)[0];
			var parts = key.split(",");
			var x = parseInt(parts[0]);
			var y = parseInt(parts[1]);
			//this.display.draw(x, y, 'K', '#FF0000');
			//this.monsters.push(new Monster(x,y,0,[10,2,0,5]))
			this.map[key] = "K";
			this.monsters.push(new Monster(x,y,i,[Math.floor(Math.random()*(10))+10,2,2,5,Math.floor(Math.random()*(50))+50],[new Item(x,y,"weapon",[true,1,2],"Sword")]))
		}
	},
	//display:65,26
	//tells the map how to display
	_drawWholeMap: function() {
		var ppx = this.player._x-25
		var ppy = this.player._y-25
		for (var i = 0 - 1; i <= 50; i++) {
			for (var j = 0 - 1; j <= 50; j++) {
	        this.mapdisplay.draw(i, j, this.map[(ppx+i)+","+(ppy+j)]);
			}
		}
		var px = this.player._x-15
		var py = this.player._y-15
		for (var i = 0 - 1; i <= 30; i++) {
			for (var j = 0 - 1; j <= 30; j++) {
				
				if (Game.map[(px+i)+","+(py+j)]=="#") {
					Game.display.draw(i, j, Game.map[(px+i)+","+(py+j)], '#21CC04');
				}
				if (Game.map[(px+i)+","+(py+j)]==">") {
					Game.display.draw(i, j, Game.map[(px+i)+","+(py+j)], '#9D00FF');
				}
				if (Game.map[(px+i)+","+(py+j)]=="+") {
					Game.display.draw(i, j, '+', "#CF7800",'#000000');
				}
			   if (Game.map[(px+i)+","+(py+j)]==".") {
					Game.display.draw(i, j, Game.map[(px+i)+","+(py+j)], '#995024');
				}
				if (Game.map[(px+i)+","+(py+j)]=="*") {
					Game.display.draw(i, j, Game.map[(px+i)+","+(py+j)], '#CCB600');
				}
				if (Game.map[(px+i)+","+(py+j)]=="~") {
					Game.display.draw(i, j, Game.map[(px+i)+","+(py+j)], '#0000FF');
				}
				if (Game.map[(px+i)+","+(py+j)]=="K") {
					Game.display.draw(i, j, Game.map[(px+i)+","+(py+j)], '#FF0000');
				}
				if (Game.map[(px+i)+","+(py+j)]=="@") {
					Game.display.draw(i, j, '@', this.player.color,'#000000');
				}
				if (Game.map[(px+i)+","+(py+j)]=="c") {
					Game.display.draw(i, j, 'c', this.player.color);
				}
				else if (Game.map[(px+i)+","+(py+j)]==null) {
					Game.display.draw(i, j, ' ', '#5C1C99');
				}        		

			}
		}
	
		//this is all right side display
		for (var j = 30 - 1; j >= 0; j--) {
		for (var i = Game.screenWidth - 1; i >= 31; i--) {
			Game.display.drawText(i,j,"%b{black}%c{black}-")
		}
	}	Game.indisplay.clear()
		Game.indisplay.drawText(0, logger, log, 40);
		Game.display.drawText(31,0,Game.player.name)

		Game.display.drawText(31,1, '%b{black}|X:'+this.player._x+', Y:'+this.player._y+'');
		Game.display.drawText(31,2, '%b{black}|Score:'+this.player._stats[5]+'')
		Game.display.drawText(31,3, '%b{black}|HP: '+this.player._stats[0]+'');
		Game.display.drawText(31,4, '%b{black}|STR: '+this.player._stats[1]+'');
		Game.display.drawText(31,5, '%b{black}|CON: '+this.player._stats[2]+'');
		Game.display.drawText(31,6, '%b{black}|DEX: '+this.player._stats[3]+'');
		Game.display.drawText(31,10, '%b{black}|Weapons:');
		Game.display.drawText(31,11+this.player.inv[0].length, '%b{black}|Consumables:');
		
		if (this.player._stats[4][0]>50) {Game.display.drawText(31,7, '%b{black}|Hungry'+this.player._stats[4][0]);}
		if (this.player._stats[4][1]>50) {Game.display.drawText(31,8, '%b{black}|Thirsty'+this.player._stats[4][1]);}


		for (var i = 0; i <= this.player.inv[0].length; i++) {
			var dingle = '%b{black}|';
			if (this.player.inv[0][i]!=null) {
				if (this.player.inv[0][i].stats[0]==true) {dingle='%b{orange}|'}
				Game.display.drawText(31,11+i, dingle+this.player.inv[0][i].desc+'');					
			}
		}
		for (var i = 0; i <= this.player.inv[1].length; i++) {
			if (this.player.inv[1][i]!=null) {
				Game.display.drawText(31,12+i+this.player.inv[0].length, '%b{black}|'+this.player.inv[1][i].desc+'');
				}	
		}
		var sel = this.player.select;
		if (sel<this.player.inv[0].length) {Game.display.drawText(31,11+sel, '%b{blue}|'+this.player.inv[0][sel].desc+'');}
		else{Game.display.drawText(31,12+sel+this.player.inv[0].length-this.player.inv[1].length, '%b{blue}|'+this.player.inv[1][sel-this.player.inv[0].length].desc+'');}
	}
}
var Item = function(x,y,tag,stats,description, score) {
	this.x = x;
	this.y = y;
	this.tag = tag;
	this.stats = stats;
	this.desc = description;
	this.score=score;
}
var Monster = function(x,y,name,stats,inv){
	this.x = x;
	this.y = y;
	this.name = name;
	this.stats = stats;
	this.inv = inv
	this.speed = 10;
}
Monster.prototype.navigate = function(){//monster pathfinding
	if ((Math.sqrt( (this.x-Game.player._x)*(this.x-Game.player._x) + (this.y-Game.player._y)*(this.y-Game.player._y)))>10) {return;}
	//some way to get distance before generating?
	/* input callback informs about map structure */
	var passableCallback = function(x,y) {
		return (Game.map[x+","+y]!="#" && Game.map[x+","+y]!="~"); //&& Game.map[x+","+y]!="K");
	}

	/* prepare path to given coords */
	var astar = new ROT.Path.AStar(Game.player._x, Game.player._y, passableCallback, {topology:4});

	/* compute from given coords */
	var monpath = [];
	
	astar.compute(this.x, this.y, function(x, y){
		monpath.push([x,y]);
	});
	monpath.shift(); /* remove Monster's position */
	
	if (monpath.length == 1) {
		for (var i = Game.monsters.length - 1; i >= 0; i--) {//which monster is it?
			if (Game.monsters[i]===this){
				curm = i
			}
		}
		this._combat(curm)
	} 

	else {
		var newx = monpath[0][0];
		var newy = monpath[0][1];
		var newKey = newx+","+newy;
		if (Game.map[newKey]!='.') { return; }
	    if (!(newKey in Game.map)) { return; }
		Game.map[this.x+","+this.y]='.';
		this.x = newx;
		this.y = newy;
		Game.map[this.x+","+this.y]='K'
	}
}
Monster.prototype._combat = function(curm) {
	var theitem = this.inv.find(function(item){return item.stats[0]==true;})
	if ((Math.floor(Math.random()*20))+(this.stats[3])>=(Math.floor(Math.random()*20))+(Game.player._stats[3])) {
	Game.player._stats[0]=(Game.player._stats[0])-(this.stats[1]+diceRoll(theitem.stats[1],theitem.stats[2]))
	logger-=1;
	log+="\nThe monster hits you!"
	}
	return;
} 
Monster.prototype.act = function(){
	//console.log(Game.scheduler.getTime())
	Game.scheduler.setDuration(this.speed);
	if (this.stats[0]<=0) {Game.map[this.x+","+this.y]='.';Game.scheduler.remove(Game.monsters[curm]);}
	this.navigate();
	Game._drawWholeMap()
	if (Game.player._stats[0]<=0) {
		Game.engine.lock();
		document.body.removeChild(Game.indisplay.getContainer());
		document.body.removeChild(Game.mapdisplay.getContainer());
		Game.display.clear()
		Game.display.draw(1,1,"You lose! Restart? y/n")
		window.addEventListener("keydown", this);
	}
}
Monster.prototype.handleEvent = function(e) {
	var key = e.keyCode ? e.keyCode : e.which;
	if (key == 89) {
	console.log("reload")
	location.reload(true)
	}
}

var Player = function(name,x,y,color,stats,inv) {
	this.name = name;
	this._x = x;
	this._y = y;
	this.color=color;
	this._stats=stats;
	//this.score=0;
	this.inv = inv;
	this.select=0;
	this.speed = 10;
}
  
Player.prototype.act = function() {
	Game.scheduler.setDuration(this.speed)
	Game.engine.lock();
	this._stats[4][0]+=2
	this._stats[4][1]+=2
	Game._drawWholeMap()
	window.addEventListener("keydown", this);
}
	
Player.prototype.handleEvent = function(e) {

	var keyMap = {};
	keyMap[87] = 0;//w; up
	keyMap[105] = 1;//top-right
	keyMap[68] = 2;//d;right
	keyMap[99] = 3;//bottom-right
	keyMap[83] = 4;//s;down
	keyMap[97] = 5;//bottom-left
	keyMap[65] = 6;//a;left
	keyMap[103] = 7;//top-left
	keyMap[69] = 8;//e; use key
	keyMap[101] = 9;//5: wait
	keyMap[38] = 10;//up arrow
	keyMap[40] = 11;//down arrow
	keyMap[32] = 12;//spacebar
	keyMap[190] = 13;//>and. key

	var code = e.keyCode;
	/* one of numpad/wasd directions? */
	if (!(code in keyMap)) { return; }
	
	if (code == 190) {//this is temporary
		Game._generateNextMap();
		return;
	}

	if (code == 32) {
		this._checkAction();
		return;
	}

	if (code == 101) {
		this._draw();
		window.removeEventListener("keydown", this);
		Game.engine.unlock();
		return;
	}
	if (code == 69) {
		window.addEventListener("keydown", this._use);
		return;
	}
	var invlength = (this.inv[0].length+this.inv[1].length)-1;
	if (this.inv[1].length!=0) {invlength = (this.inv[0].length+this.inv[1].length)-2;}
	//console.log("invlength "+invlength)
	if (code == 38) {
		if (this.select>0) {
		this.select-=1;}
		//console.log(this.select)
		this._draw();
		return;
	}
	if (code == 40) {
		if (this.select<=invlength) {
		this.select+=1;}
		//console.log(this.select)
		this._draw();
		return;
	}
	/* is there a free space? */
	var dir = ROT.DIRS[8][keyMap[code]];
	var newX = this._x + dir[0];
	var newY = this._y + dir[1];
	var newKey = newX + "," + newY;
	if (!(newKey in Game.map)) { return; }

	if (Game.map[newKey]==='>'){
		logger-=1;
		log+=("\nYou found the stairs")
		this._stats[5]+=1000;
		Game._generateNextMap();
		window.removeEventListener("keydown", this);
		Game.engine.unlock();
		return;
	}

	if (Game.map[newKey]==='*' || Game.map[newKey]==='+') {//pickup function
		for (var i = Game.items.length - 1; i >= 0; i--) {
			if (Game.items[i].x+","+Game.items[i].y===newKey){
				var curi = i
			}
		}
		this._stats[5]+=Game.items[curi].score;
		if (this.inv[0].find(function(item){return item.desc===Game.items[curi].desc})===undefined && Game.items[curi].tag==="weapon") {this.inv[0].push(Game.items[curi])}
		else if(Game.items[curi].tag==="consumable"){this.inv[1].push(Game.items[curi])}
		Game.display.draw(this._x, this._y, Game.map[this._x+","+this._y],'#995024');
		Game.map[this._x+","+this._y]='.'
		this._x = newX;
		this._y = newY;
		Game.map[this._x+","+this._y]='@'
		this._draw();
		window.removeEventListener("keydown", this);
		Game.engine.unlock();
		return;
	}
   //	BATTLE 
   //todo: give attacker advantage
	if (Game.map[newKey]==='K') {//combat function
		for (var i = Game.monsters.length - 1; i >= 0; i--) {//which monster is it?
			if (Game.monsters[i].x+","+Game.monsters[i].y===newKey){
				curm = i
			}
		}
		//dodge and hit dice
		this._combat(curm)
		if (Game.monsters[curm].stats[0]>0) {//not dead yet
			this._draw();
			window.removeEventListener("keydown", this);
			Game.engine.unlock();
			return;
		}	
		if (Game.monsters[curm].stats[0]<=0) {
			//console.log("workign")
			Game.scheduler.remove(Game.monsters[curm]);
			Game.map[newX+","+newY]='c'
			this._stats[5]+=Game.monsters[curm].stats[4]
			this._draw();
			window.removeEventListener("keydown", this);
			Game.engine.unlock();
			return;
		}
	}
	if (Game.map[newKey]!='.') { return; }
	Game.display.draw(this._x, this._y, Game.map[this._x+","+this._y],'#995024');
	Game.map[this._x+","+this._y]='.'
	this._x = newX;
	this._y = newY;
	Game.map[this._x+","+this._y]='@'
	this._draw();
	window.removeEventListener("keydown", this);
	Game.engine.unlock();
}

Player.prototype._draw = function() {
	Game._drawWholeMap();
}    

function diceRoll(times,sides) {
	var result = 1;
	for (var i = times; i > 0; i--) {
		result+=(Math.floor(Math.random()*(sides)))+1;
		//console.log("result "+result)
	}
	
	return result;
}
//hp,strength,con,dex
Player.prototype._combat = function(curm) {
	var theitem = this.inv[0].find(function(item){return item.stats[0]==true;})
	if ((Math.floor(Math.random()*20))+(this._stats[3])>=(Math.floor(Math.random()*20))+(Game.monsters[curm].stats[3])) {
	Game.monsters[curm].stats[0]=(Game.monsters[curm].stats[0])-(this._stats[1]+diceRoll(theitem.stats[1],theitem.stats[2]))
	logger-=1;
	log+=("\nYou hit the monster!")
	}
	//console.log(Game.monsters[curm].stats[0],this._stats[0])
} 

Player.prototype._checkAction = function() {
	//this.color=("rgb("+ROT.Color.randomize([100, 128, 230], [30, 10, 20])+")")
	var sel = this.select;
	if (this.select>this.inv[0].length) {
		sel = this.select-this.inv[0].length;
		var number = this.inv[1][sel].stats[1]
		var statto = this.inv[1][sel].stats[0]
		console.log(sel)
	}
	if (this.inv[1][0]!=null && (sel)>=0) {
	console.log("sel+inv "+(sel))
	
	}
	if (this.select<=this.inv[0].length){
		for (var i = this.inv[0].length - 1; i >= 0; i--) {
			this.inv[0][i].stats[0]=false;
		}
		this.inv[0][sel].stats[0]=true;
		logger-=1;
		log+=("\nYou equip your "+this.inv[0][sel].desc)
		this._draw();
		return;
	}
	else if((this.inv[1][sel].stats[0])===4){
		
		//console.log(this._stats[statto[1]],number[1])
		this._stats[statto][0]+=number[0]
		this._stats[statto][1]+=number[1]

		logger-=1;
		log+=("\nYou consume your "+this.inv[1][sel].desc)
		this.inv[1].splice(sel,1)
		if (this.select>this.inv[1].length) {
		this.select-=1;
		}
		this._draw();
		return;
	}
	else{
		logger-=1;
		log+=("\nYou consume your "+this.inv[1][sel].desc);
		this.inv[1].splice(sel,1)
		this._stats[statto]+=number
		if (this.select>this.inv[1].length) {
			this.select-=1;
		}
		this._draw();
		return;
	}
}
Player.prototype._use = function(event){
//this seems overly complicated for picking up water, but whatevs
	var keyMap = {};
	keyMap[87] = 0;//w; up
	keyMap[68] = 2;//d;right
	keyMap[83] = 4;//s;down
	keyMap[65] = 6;//a;left
	var code = event.keyCode;
	/* one of wasd directions? */
	if (!(code in keyMap)) { return; }
	var dir = ROT.DIRS[8][keyMap[code]];
	var newX = Game.player._x + dir[0];
	var newY = Game.player._y + dir[1];
	var newKey = newX + "," + newY;
	//console.log(newKey)
	//console.log(dir)
	if (!(newKey in Game.map)) { return; }
	if (Game.map[newKey]=='~') {
		window.removeEventListener("keydown", Game.player._use);
		Game.player.inv[1].push(new Item(0,0,"consumable",[4,[-1,-100]],"Water"))
		Game.player._draw();
		//console.log("checker")
		Game.engine.unlock();
		return;
	};
	if (Game.map[newKey]=='c') {
		window.removeEventListener("keydown", Game.player._use);
		Game.player.inv[1].push(new Item(0,0,"consumable",[4,[-100,-1]],"Meat"))
		Game.map[newKey]='.'
		Game.player._draw();
		//console.log("checker")
		Game.engine.unlock();
		return;
	};
}