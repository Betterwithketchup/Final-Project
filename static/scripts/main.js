$(document).ready(function(){
	$('#start').on('click', function(){
		event.preventDefault();
		$.ajax({
		    method: "GET",
		    url: "http://127.0.0.1:3000/",
		    success:function(response){
		    }
		})
	})



}