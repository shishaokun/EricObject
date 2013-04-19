window.addEventListener('scroll',go);
function go(e){
	e = window.even || e;
	var top = document.getElementById('top');
	if(document.body.scrollTop > 360){
		top.className  = 'fix';
	}else{
		top.className  = 'b';
	}
}