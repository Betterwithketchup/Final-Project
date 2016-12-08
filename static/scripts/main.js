userid=""
$(document).ready(function(){
	$('#login').on('click', function(event){
		//event.preventDefault();
    	var $username = $("input[name='name']").val();
    	var $password = $("input[name='password']").val();
    	$.ajax({
        method: "POST",
        url: "http://127.0.0.1:3000/data",
        data: {'username':$username,'password':$password},
        //dataType: 'json',
        success:function(response){
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
var Game = {
    display: null,
    map: {},
    
    init: function() {
        this.display = new ROT.Display();
        document.body.appendChild(this.display.getContainer());
        this.display.drawText(5,  2, "Hello world");
        $.ajax({
		        method: "GET",
		        url: "http://127.0.0.1:3000/load",
			
        success: function(response){

        }
        })
        this._generateMap();
    },
    
    _generateMap: function() {
        var digger = new ROT.Map.Digger();
        var freeCells = [];
        
        var digCallback = function(x, y, value) {
            if (value) { return; }
            
            var key = x+","+y;
            this.map[key] = ".";
            freeCells.push(key);
        }
        digger.create(digCallback.bind(this));
        
        //this._generateBoxes(freeCells);
        
        this._drawWholeMap();
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

