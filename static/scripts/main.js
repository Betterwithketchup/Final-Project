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
	        success:function(response){
	        	//console.log(response)
				}
			})
		})
	})



})
var Game = {
    display: null,
 
    init: function() {
        this.display = new ROT.Display();
        document.body.appendChild(this.display.getContainer());
    }
}