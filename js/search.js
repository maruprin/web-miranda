/* <form>

	<input type="text" id="search">

	<input type="button" onkeypress="buscar(e)" value="buscar">

</form> */
const search = document.querySelector('#search');
search.addEventListener("keypress", function(e) {
    if (e.keyCode === 13) {
        console.log(document.getElementById("search").value)
        let paginas=["about","rooms","contact","offers"];

        let search=document.getElementById("search").value;
    
        for(var i=0;i<paginas.length;i++) {
    
            if(search===paginas[i]) {
    
                window.location.href=search+".html";
                
                console.log('hola')
    
                return;
            }
            else {console.log('chau')}
        }
        alert('pagina no encontrada')
    }
});



