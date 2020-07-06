$('html, body').animate({
    scrollTop: $("#sect" + 0).offset().top - 85
}, 1000);
var act_sect = 0;
var max_sect = 2;
var wait_im_scrolling = false;
$('#sect' + (act_sect + 1)).css('visibility', 'hidden');
$('#sect' + (act_sect + 2)).css('visibility', 'hidden');

function cambiar_pos_directamente(targetId) {
    intTarget = parseInt(targetId.split("sect")[1]);
    while (intTarget != act_sect) {
        if (act_sect >= intTarget) {
            subir_scroll();
        } else {
            bajar_scroll();
        }
    }
}

function subir_scroll() {
    //wait_im_scrolling = true;

    act_sect = Math.max(0, act_sect-1);

    
    
    switch (act_sect) {
        case 0:
            d3.select("#titulo_footer").text("¿Cuál es el problema principal de Medellín para los migrantes?");
            break;
        case 1:
            
            d3.select("#titulo_footer").text("¿Cuál es el problema principal de los migrantes en su comuna o corregimiento?");
            break;
        case 2:
            d3.select("#flechita").transition().duration(100).style("opacity",1)
            d3.select("#titulo_footer").text("¿Cuál es el problema principal de los migrantes en su comuna o corregimiento?");
            break;
    }

    $('#sect' + (act_sect)).css('visibility', 'visible');
    $('html, body').animate({
        scrollTop: $("#sect" + act_sect).offset().top - 85
    }, 500);
    $('#sect' + (act_sect + 1)).css('visibility', 'hidden');
    //
    //setTimeout(function () { wait_im_scrolling = false }, 500);
}

function bajar_scroll() {
    //wait_im_scrolling = true;
    act_sect = Math.min(act_sect+1, 3);


    switch (act_sect) {
        case 0:
                d3.select("#titulo_footer").text("¿Cuál es el problema principal de Medellín?")
            break;
        case 1:
            d3.select("#titulo_footer").text("¿Cuál es el problema principal de los migrantes en su comuna o corregimiento?");
            break;
        case 2:
            d3.select("#titulo_footer").text("¿Cuál es el problema principal de los migrantes en su comuna o corregimiento?");
            break;
        case 3:
            d3.select("#titulo_footer").text("Preguntas abiertas")
            d3.select("#flechita").transition().duration(100).style("opacity",0)
            break
    }
    $('#sect' + (act_sect)).css('visibility', 'visible');
    $('html, body').animate({
        scrollTop: $("#sect" + act_sect).offset().top - 85
    }, 500);
    $('#sect' + (act_sect - 1)).css('visibility', 'hidden');
    //
    //setTimeout(function () { wait_im_scrolling = false }, 500);
}

// $('body').bind('mousewheel', $.debounce(50, true, function (e) {

//     if (e.originalEvent.deltaY > 0 && act_sect < max_sect && !wait_im_scrolling) {
//         bajar_scroll();
//     }
//     else if (e.originalEvent.deltaY < 0 && act_sect > 0 && !wait_im_scrolling) {
//         subir_scroll();
//     }
//     //
// })
// );


$("#footer").click(d => {
    bajar_scroll()
})


document.onkeydown = function(e) {
    switch (e.keyCode) {
        case 38:
            subir_scroll();
            break;
        case 40:
            bajar_scroll();
            break;
    }
};