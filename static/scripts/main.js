var $userid=""
$(document).ready(function(){
	console.log("Ping!");
	/*$('#login').on('click', function(event){
		//event.preventDefault();
    	var $username = $("input[name='username']").val();
    	var $password = $("input[name='password']").val();
    	console.log($username)
    	$.ajax({
        method: "POST",
        url: "http://127.0.0.1:3000/data",
        data: {'username':$username,'password':$password},
        success:function(response){
        	$userid=$username;
        	console.log("HEYO")
        	window.location.replace("http://stackoverflow.com");

			}
		})
	})*/
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



//the actual game
var Game = {
    display: null,
    map: {},
    engine: null,
    player: null,
    monsters: [],
    screenWidth: 30,
    screenHeight: 20,
    init: function() {

        this.display = new ROT.Display();
        this.display.setOptions({width:this.screenWidth,height:this.screenHeight,forceSquareRatio:true})
        //this.display.setOptions({width:50,height:30})
        document.body.appendChild(this.display.getContainer());
        
        this._generateMap();
        
        var scheduler = new ROT.Scheduler.Speed();
        scheduler.add(this.player, true);
        for (var i = this.monsters.length - 1; i >= 0; i--) {
        	scheduler.add(this.monsters[i], true);
       }
        

        this.engine = new ROT.Engine(scheduler);
        this.engine.start();
    },
    /*_loadGame: function(){
    	return;

    }*/
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
        this._generateMonsters(freeCells);
        this._generateBoxes(freeCells);
        this._createPlayer(freeCells);
        //this._drawWholeMap();

        
        
    },
    
    _createPlayer: function(freeCells) {
    	if (this.player!=null) {return;}
        var index = Math.floor(ROT.RNG.getUniform() * freeCells.length);
        var key = freeCells.splice(index, 1)[0];
        if (key!=null) {
        var parts = key.split(",");
    	}
        var x = parseInt(parts[0]);
        var y = parseInt(parts[1]);
        this.player = new Player(x, y,'#FF0000');
    },
    
    _generateBoxes: function(freeCells) {
        for (var i=0;i<10;i++) {
            var index = Math.floor(ROT.RNG.getUniform() * freeCells.length);
            var key = freeCells.splice(index, 1)[0];
            this.map[key] = "*";
            //console.log(key)
           
        }
    },
    _generateMonsters: function(freeCells) {
        for (var i=0;i<10;i++) {
            var index = Math.floor(ROT.RNG.getUniform() * freeCells.length);
            var key = freeCells.splice(index, 1)[0];
          	var parts = key.split(",");
          	var x = parseInt(parts[0]);
        	var y = parseInt(parts[1]);
        	//this.display.draw(x, y, 'K', '#FF0000');

        	this.monsters.push(new Monster(x,y,Math.floor(ROT.RNG.getUniform()*20)))
        }
    },
    
    _drawWholeMap: function() {
    	/*var px = this.player._x-25
        var py = this.player._y-25
    	for (var i = 20 - 1; i >= 0; i--) {
    		for (var j = 20 - 1; j >= 0; j--) {
    			this.display.draw(i, j, this.map[px+i,py+j]);
    		}
    	}*/
        for (var key in this.map) {
        	var i=0
            var parts = key.split(",");
            var x = parseInt(parts[0]);
            var y = parseInt(parts[1]);
            var px = this.player._x
            var py = this.player._y
            if (this.map[key]=="#") {
            	this.display.draw(x, y, this.map[key], '#21CC04');
            }
           if (this.map[key]==".") {
            	this.display.draw(x, y, this.map[key], '#995024');
            }
            if (this.map[key]=="*") {
            	this.display.draw(x, y, this.map[key], '#CCB600');
            }
            if (this.map[key]=="~") {
            	this.display.draw(x, y, this.map[key], '#0000FF');
            }
            if (this.map[key]=="K") {
            	this.display.draw(x, y, this.map[key], '#FF0000');
            }
            //this.display.draw(x, y, this.map[key]);
        }
    }
};
var Monster = class Monster{
	constructor(x,y,stats){
		this.x = x;
		this.y = y;
		this.stats = [stats];
	}
	getSpeed(){
		return 100;
	}
	draw() {
	Game.map[this.x+","+this.y]='K'
    //console.log(this.x+","+this.y)
	} 
	act(){
		Game.engine.lock();
		//this.draw()
		Game.map[this.x+","+this.y]='K'
		//Game.display.draw(this.x, this.y, 'K', '#FF0000');
		Game.engine.unlock();
	}
}
var Player = function(x, y,color,stats) {
    this._x = x;
    this._y = y;
    this._draw();
    this.color=color;
    this.stats=stats
    this.inv=[];
}
Player.prototype.getSpeed = function(){
	return 100
}    
Player.prototype.act = function() {
    Game.engine.lock();
    window.addEventListener("keydown", this);
}
    
Player.prototype.handleEvent = function(e) {
    var keyMap = {};
    keyMap[87] = 0;
    keyMap[104] = 1;
    keyMap[68] = 2;
    keyMap[98] = 3;
    keyMap[83] = 4;
    keyMap[97] = 5;
    keyMap[65] = 6;
    keyMap[99] = 7;
    keyMap[13] = 8;
    keyMap[32] = 9;

    var code = e.keyCode;
    /* one of numpad/wasd directions? */
    if (!(code in keyMap)) { return; }
    //action for enter and spacebar
    if (code == 13 || code == 32) {
        this._checkAction();
        return;
    }
    /* is there a free space? */
    var dir = ROT.DIRS[8][keyMap[code]];
    var newX = this._x + dir[0];
    var newY = this._y + dir[1];
    var newKey = newX + "," + newY;
    if (!(newKey in Game.map)) { return; }
    //console.log(Game.map)
   	if (Game.map[newKey]!='.') { return; }
   //	console.log(newKey)
   	if (Game.map[newKey]==='K') {
   		
   	}

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
    
    var px = this._x-10
    var py = this._y-10
   // console.log(this._x-5,this._y-5)
    //console.log(Game.map[(px+","+py)])
	for (var i = 0 - 1; i <= 20; i++) {
		for (var j = 0 - 1; j <= 20; j++) {
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
            	Game.display.draw(i, j, '@', this.color);
            }
        	else if (Game.map[(px+i)+","+(py+j)]==null) {
        		Game.display.draw(i, j, ' ', '#000000');
        	}        		

		}
	}

	Game.display.drawText(21,0, `|-------|`);
	Game.display.drawText(21,1, '%b{black}|'+this._x+', '+this._y+'');
	Game.display.drawText(29,1,'|')
	for (var i = 19; i >= 2; i--) {
		Game.display.drawText(20,i, `|///////|`);
	}
	
	//Game.display.drawText(21,3, `|////////////|`, '#0000FF');
}    
Player.prototype._checkAction = function() {
	this.color=('#0000FF')
}