var $userid=""
class player{
	constructor(){

	}
}
$(document).ready(function(){
/*	console.log("Ping!");
	$('#login').on('click', function(event){
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
			url: "http://127.0.0.1:3000/load",
			xhrFields: { withCredentials:true },
			data: {'name':$('.h1').val()},
			success: function (response) {

		$('#load').attr('class',response)

      	//console.log("done!"+ something.getAllResponseHeaders());
      	console.log(response)
      	console.log($('.title').html)
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
    
    init: function() {
        this.display = new ROT.Display();
        document.body.appendChild(this.display.getContainer());
        
        this._generateMap();
        
        var scheduler = new ROT.Scheduler.Simple();
        scheduler.add(this.player, true);

        this.engine = new ROT.Engine(scheduler);
        this.engine.start();
    },
    
    _generateMap: function() {
        var digger = new ROT.Map.Arena(80,30);
        var freeCells = [];
        
        var digCallback = function(x, y, value) {
            if (value) { return; }
            
            var key = x+","+y;
            this.map[key] = ".";
            freeCells.push(key);
        }
        digger.create(digCallback.bind(this));
        
        this._generateBoxes(freeCells);
        this._drawWholeMap();
        this._createPlayer(freeCells);
    },
    
    _createPlayer: function(freeCells) {
        var index = Math.floor(ROT.RNG.getUniform() * freeCells.length);
        var key = freeCells.splice(index, 1)[0];
        var parts = key.split(",");
        var x = parseInt(parts[0]);
        var y = parseInt(parts[1]);
        this.player = new Player(x, y);
    },
    
    _generateBoxes: function(freeCells) {
        for (var i=0;i<10;i++) {
            var index = Math.floor(ROT.RNG.getUniform() * freeCells.length);
            var key = freeCells.splice(index, 1)[0];
            this.map[key] = "*";
        }
    },
    
    _drawWholeMap: function() {
        for (var key in this.map) {
            var parts = key.split(",");
            var x = parseInt(parts[0]);
            var y = parseInt(parts[1]);
            this.display.draw(x, y, this.map[key]);
        }
    }
};

var Player = function(x, y) {
    this._x = x;
    this._y = y;
    this._draw();
}
    
Player.prototype.act = function() {
    Game.engine.lock();
    window.addEventListener("keydown", this);
}
    
Player.prototype.handleEvent = function(e) {
    var keyMap = {};
    keyMap[87] = 0;
    keyMap[33] = 1;
    keyMap[68] = 2;
    keyMap[34] = 3;
    keyMap[83] = 4;
    keyMap[35] = 5;
    keyMap[65] = 6;
    keyMap[36] = 7;

    var code = e.keyCode;
    /* one of numpad directions? */
    if (!(code in keyMap)) { return; }

    /* is there a free space? */
    var dir = ROT.DIRS[8][keyMap[code]];
    var newX = this._x + dir[0];
    var newY = this._y + dir[1];
    var newKey = newX + "," + newY;
    if (!(newKey in Game.map)) { return; }

    Game.display.draw(this._x, this._y, Game.map[this._x+","+this._y]);
    this._x = newX;
    this._y = newY;
    this._draw();
    window.removeEventListener("keydown", this);
    Game.engine.unlock();
}

Player.prototype._draw = function() {
    Game.display.draw(this._x, this._y, "@", "#ff0");
}    

Game.init();
