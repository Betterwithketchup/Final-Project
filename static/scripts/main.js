var $overplayer = null;
$(document).ready(function(){
	console.log("Ping!");

	$('#load').on('click', function(){
		$.ajax({
			method:"POST",
			url: "http://localhost:3000/load",
			xhrFields: { withCredentials:true },
			success: function (response) {
		$('#load').attr('class',response)
		//console.log("done!"+ something.getAllResponseHeaders());
		console.log(response)
		x=response[2][0]
		y=response[2][0]
		Game.player = null
		Game.player= new Player(x,y, '#FF0000')
	}
		});

	})
	/*$('#logout').on('click', function(event){
		$.ajax({
		method: "POST",
		url: "http://127.0.0.1:3000/weout",
		success:function(response){
			//console.log(response)
			}
		})
	})*/
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
		event.preventDefault();
		$("li").hide()
		$("#submitter").hide()
		document.body.removeChild(display.getContainer());
		var $charname = $("#charname").val();
		var $stats = [0,$("#strength").val(),$("#constitution").val(),$("#dexterity").val()];
		$overplayer = new Player(0,0,"#FF0000",$stats,[10,10],0,[[new Item(0,0,"weapon",[1,1],"Fists")],[]],[])
		//console.log($stats)
		/*$.ajax({
		method: "POST",
		url: "http://127.0.0.1:3000/data",
		data: {'charname':$charname,'stats':$stats},
		//dataType: 'json',
		success:function(response){
			//console.log(response)
			}
		})*/
		
		Game.init();
	})

	}
	if (key == 78) {
		throw new Error("wey");
	}
}


//the actual game
var Game = {
	display: null,
	map: {},
	engine: null,
	player: null,
	monsters: [],
	items: [],
	screenWidth: 65,
	screenHeight: 30,
	scheduler: new ROT.Scheduler.Action(),
	init: function() {

		this.display = new ROT.Display();//setting up the screen
		this.display.setOptions({width:this.screenWidth,height:this.screenHeight,forceSquareRatio:true})
		//this.display.setOptions({width:50,height:30})
		document.body.appendChild(this.display.getContainer());

		this._generateMap();
		
		this.scheduler.add(this.player, true,1);
		for (var i = this.monsters.length - 1; i >= 0; i--) {
			this.scheduler.add(this.monsters[i], true,1);
	   }
		
		this.engine = new ROT.Engine(this.scheduler);
		this.engine.start();
	},

	_generateMap: function() {
		var digger = new ROT.Map.Cellular(100,60,{
		//born: [4, 5, 6, 7, 8],
		//survive: [2, 3, 4, 5],
		connected: true
		});
		freeCells =[]
		digger.randomize(0.47)

		var digCallback = function(x, y, value) {
			var key = x+","+y;
			if (value) { 
			this.map[key] = "#";
			return; 
			}            
			this.map[key] = ".";
			freeCells.push(key);
		}
		for (var i=49; i>=0; i--) {
		digger.create(digCallback.bind(this));
		digger.connect(this.display.DEBUG,0)
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
		  // freeCells.push(key);
		}
		for (var i=40; i>=0; i--) {
			waterer.create(watCallback.bind(this));
		}
		
		this._generateBoxes(freeCells);
		this._createPlayer(freeCells);//spawn things
		this._generateMonsters(freeCells);
		this._drawWholeMap();   
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
			this.items.push(new Item(x,y,"consumable",[0,10],"Health Potion"))
		   
		}
	},
	_generateMonsters: function(freeCells) {
		for (var i=0;i<5;i++) {
			var index = Math.floor(ROT.RNG.getUniform() * freeCells.length);
			var key = freeCells.splice(index, 1)[0];
			var parts = key.split(",");
			var x = parseInt(parts[0]);
			var y = parseInt(parts[1]);
			//this.display.draw(x, y, 'K', '#FF0000');
			//this.monsters.push(new Monster(x,y,0,[10,2,0,5]))
			this.map[key] = "K";
			this.monsters.push(new Monster(x,y,i,[10,7,0,5]))
		}
	},
	//display:65,26
	//tells the map how to display
	_drawWholeMap: function() {
		var px = this.player._x-15
		var py = this.player._y-15
		for (var i = 0 - 1; i <= 30; i++) {
			for (var j = 0 - 1; j <= 30; j++) {
				
				if (Game.map[(px+i)+","+(py+j)]=="#") {
					Game.display.draw(i, j, Game.map[(px+i)+","+(py+j)], '#21CC04');
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
	}
		Game.display.drawText(31,1, '%b{black}|X:'+this.player._x+', Y:'+this.player._y+'');
	
		Game.display.drawText(31,3, '%b{black}|Score: '+this.player._stats[0]+'');
		Game.display.drawText(31,4, '%b{black}|STR: '+this.player._stats[1]+'');
		Game.display.drawText(31,5, '%b{black}|CON: '+this.player._stats[2]+'');
		Game.display.drawText(31,6, '%b{black}|DEX: '+this.player._stats[3]+'');
		Game.display.drawText(31,10, '%b{black}|Weapons:');
		Game.display.drawText(31,14, '%b{black}|Consumables:');
		
		if (this.player.needs[0]>50) {Game.display.drawText(31,7, '%b{black}|Hungry');}
		if (this.player.needs[1]>50) {Game.display.drawText(31,8, '%b{black}|Thirsty');}


		for (var i = 0; i <= this.player.inv[0].length; i++) {
			if (this.player.inv[0][i]!=null) {
				Game.display.drawText(31,11+i, '%b{black}|'+this.player.inv[0][i].desc+'');					
			}
		}
		for (var i = 0; i <= this.player.inv[1].length; i++) {
			if (this.player.inv[1][i]!=null) {
				Game.display.drawText(31,15+i, '%b{black}|'+this.player.inv[1][i].desc+'');
				}	
		}
		var sel = this.player.select;
		if (sel<=this.player.inv[0].length-1) {Game.display.drawText(31,11+sel, '%b{blue}|'+this.player.inv[0][sel].desc+'');}
		else{Game.display.drawText(31,15+sel-this.player.inv[0].length, '%b{blue}|'+this.player.inv[1][sel-this.player.inv[0].length].desc+'');}
	}
}
var Item = function(x,y,tag,stats,description) {
	this.x = x;
	this.y = y;
	this.tag = tag;
	this.stats = stats;
	this.desc = description;
}
var Monster = function(x,y,name,stats){
	this.x = x;
	this.y = y;
	this.name = name;
	this.stats = stats;
	this.speed = 7;
}
Monster.prototype.navigate = function(){

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
	   //battle here
	   //console.log(monpath)
	} 

	else {
		if (monpath.length>10) {return;}
		var newx = monpath[0][0];
		var newy = monpath[0][1];
		var newKey = newx+","+newy;
		if (Game.map[newKey]!='.') { return; }
	    if (!(newKenewy in Game.map)) { return; }
		Game.map[this.x+","+this.y]='.';
		this.x = newx;
		this.y = newy;
		Game.map[this.x+","+this.y]='K'
	}
}

Monster.prototype.act = function(){
	//console.log(Game.scheduler.getTime())
	Game.scheduler.setDuration(this.speed);
	this.navigate();
	if (this.stats[0]<=0) {Game.map[this.x+","+this.y]='.'}
	Game._drawWholeMap()
}


var Player = function(x, y,color,stats,needs,score,inv) {
	this._x = x;
	this._y = y;
	this.color=color;
	this._stats=stats;
	this.needs=needs;
	this.score=0;
	this.inv = inv;
	this.select=0;
	this.speed = 10;
}
  
Player.prototype.act = function() {
	Game.scheduler.setDuration(this.speed)
	Game.engine.lock();
	this.needs[0]+=2
	this.needs[1]+=5
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
	keyMap[13] = 9;//enter
	keyMap[38] = 10;//up arrow
	keyMap[40] = 11;//down arrow
	keyMap[32] = 12;//spacebar

	var code = e.keyCode;
	/* one of numpad/wasd directions? */
	if (!(code in keyMap)) { return; }
	//action for enter and spacebar
	if (code == 32) {
		this._checkAction();
		return;
	}
	if (code == 69) {
		window.addEventListener("keydown", this._use);
		return;
	}
	var invlength = this.inv[0].length+this.inv[1].length;
	if (code == 38) {
		if (this.select>0) {
		this.select-=1;}
		console.log(this.select)
		return;
	}
	if (code == 40) {
		if (this.select<invlength-1) {
		this.select+=1;}
		console.log(this.select)
		return;
	}
	/* is there a free space? */
	var dir = ROT.DIRS[8][keyMap[code]];
	var newX = this._x + dir[0];
	var newY = this._y + dir[1];
	var newKey = newX + "," + newY;
	if (!(newKey in Game.map)) { return; }

	if (Game.map[newKey]==='*') {//pickup function
		for (var i = Game.items.length - 1; i >= 0; i--) {
			if (Game.items[i].x+","+Game.items[i].y===newKey){
				curi = i
			}
		}
		if (Game.items[curi].tag=="weapon") {this.inv[0].push(Game.items[curi])}
		else{this.inv[1].push(Game.items[curi])}
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
		if (Game.monsters[curm].stats[3]<=ROT.RNG.getPercentage()) {
		Game.monsters[curm].stats[0]=(Game.monsters[curm].stats[0])-(this._stats[1])
		//console.log(Game.monsters[curm].stats[0])
		}
		if (this._stats[3]<=ROT.RNG.getPercentage()){
		this._stats[0]=(this._stats[0])-(Game.monsters[curm].stats[1])
		//console.log(this._stats[0])
		}
		if (Game.monsters[curm].stats[0]>0) {//not dead yet
			this._draw();
			window.removeEventListener("keydown", this);
			Game.engine.unlock();
			return;
		}	
		if (Game.monsters[curm].stats[0]<=0) {
			//console.log("workign")
			Game.scheduler.remove(Game.monsters[curm]);
			Game.display.draw(this._x, this._y, Game.map[this._x+","+this._y],'#995024');
			Game.map[this._x+","+this._y]='.';
			this._x = newX;
			this._y = newY;
			Game.map[this._x+","+this._y]='@'
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

Player.prototype._checkAction = function() {
	this.color=("rgb("+ROT.Color.randomize([100, 128, 230], [30, 10, 20])+")")
	if (this.inv[this.select]==null) {return;}
	number = this.inv[1].stats[1]
	statto = this.inv[1].stats[0]
	this._stats[statto]+= number
	this.inv.splice(1,2)
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
		Game.player.inv[1].push(new Item(0,0,"consumable",[1,1],"Water"))
		Game.player._draw();
		console.log("checker")
		Game.engine.unlock();
		return;
	};
}