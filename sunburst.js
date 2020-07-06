const sdg_img_repo = "https://i0.wp.com/www.un.org/sustainabledevelopment/es/wp-content/uploads/sites/3/2016/01/S_SDG_Icons-01-";
act_sdg = 0;
var nivel_profundidad = 1;
targest_img_repo = "assets/global-goals-media-cards/MC_Target_";
var col_5_ods = null;
var req_sun_inic = { ...req };
req_sun_inic.numero = 2013;
req_sun_inic.respuesta = [0];
var scale_per_barrita_sun;
var width_sunburst_col_pregunta1;
var height_sunburst_col_pregunta1;
var meta_seleccionada_primera = null;
var escala;
var radius_sunburst_medellin;
var testimonios_cargados_medellin = false;
var testimonios_medellin  = ["Cargando testimonios...", "Testimonio no encontrado."];
postData(urlBack+'sunburst', req_sun_inic).then(data => {
    data.name = "ODS";
    
    
    dibujar_sunburst(data);
    d3.select('#testimonio_sun').text(testimonios_medellin[0]);
    avisar();
});



function dibujar_sunburst(data) {
    var removes = d3.select("#quitame");
    removes.remove();
    nivel_profundidad = 1;
    $("#sera_que_es_este").append(profundidad_1);

    //def titulo
    var titulo_src = "assets/Medellin ECHO.svg";
    
    d3.select("#titulo_primera_pregunta").attr("src", titulo_src)
    //fin def 


    grupito = d3.select('#grupo_sunburst');
    //grupito.transition().duration(1000).attr("opacity", 0);

    var sunburst_col = d3.select("#sunburst_col");
    var sunburst_row = d3.select("#sect0");

    var bounds_sunburst_col = sunburst_col.node().getBoundingClientRect();
    var bounds_sunburst_row = sunburst_row.node().getBoundingClientRect();

    margin_sunburst = { top: 30, right: 0, bottom: 30, left: 70 }

    width_sunburst_col_pregunta1 = width_sunburst_col_pregunta1 || bounds_sunburst_col.width - (bounds_sunburst_col.width / 100) * 10;
    height_sunburst_col_pregunta1 = height_sunburst_col_pregunta1 || bounds_sunburst_row.height - (bounds_sunburst_col.height / 100) * 10;
    


    width_sunburst = width_sunburst_col_pregunta1;

    const escala_para_radio = d3.scaleLinear()
        .domain([100, 1000]).range([7, 4])


    radius_sunburst_medellin = Math.min(height_sunburst_col_pregunta1, width_sunburst_col_pregunta1) / escala_para_radio(Math.min(height_sunburst_col_pregunta1, width_sunburst_col_pregunta1));

    format = d3.format(",d")


    var arc = d3.arc()
        .startAngle(d => d.x0)
        .endAngle(d => d.x1)
        .padAngle(d => Math.min((d.x1 - d.x0) / 2, 0.005))
        .padRadius(radius_sunburst_medellin * 1.5 + 1000)
        .innerRadius(d => d.y0 * radius_sunburst_medellin)
        .outerRadius(d => Math.max(d.y0 * radius_sunburst_medellin, d.y1 * radius_sunburst_medellin - 1))

    var partition = data => {
        escala = d3.scalePow().exponent(0.75);
        const root = d3.hierarchy(data)
            .sum(d => escala(d.value))
            //.sum(d => d.value)
            .sort((a, b) => b.value - a.value);
        return d3.partition()
            .size([2 * Math.PI, root.height + 1])
            (root);
    }

    var partition2 = data => {
        //const escala = d3.scalePow().exponent(0.5);
        const root2 = d3.hierarchy(data)
            //.sum(d => escala(d.value))
            .sum(d => d.value)
            .sort((a, b) => b.value - a.value);
        return d3.partition()
            .size([2 * Math.PI, root2.height + 1])
            (root2);
    }

    color_sunburst = d3.scaleOrdinal(d3.quantize(d3.interpolateRainbow, data.children.length + 1))
    var root = partition(data);
    root2 = partition2(data);
    root.each(d => d.current = d);
    root2.each(d => d.current = d);

    

    const svg = d3.select('#svg_sunburst')
        // .attr("width", width_sunburst)
        // .attr("height", height_sunburst_col_pregunta1)
        .attr("viewBox", [0, 0, width_sunburst, width_sunburst])
        .style("font", "10px sans-serif");

    var prev_g = svg.selectAll("#grupo_sunburst");
    if (prev_g._groups[0][0] != undefined) {
        
        prev_g.transition().duration(1000).attr("opacity", 0).transition().delay(1000).remove();
    }

    const g = svg.append("g")
        .attr("transform", `translate(${width_sunburst / 2},${width_sunburst / 2})`).attr("id", "grupo_sunburst");

    g.attr("opacity", 0).transition().duration(1000).attr("opacity", 1);
    const path = g.append("g")
        .selectAll("path")
        .data(root.descendants().slice(1))
        .join("path")
        .attr("fill", d => { return ods[d.data.name] != undefined ? ods[d.data.name].color : ods[d.parent.data.name] != undefined ? ods[d.parent.data.name].color : "#ff" })
        .attr("fill-opacity", d => arcVisible(d.current) ? 1 : 0)
        .attr("id", d => `${d.ancestors().map(d => d.data.name).reverse().join("/")}`)
        .attr("d", d => {
            return arc(d.current)
        });

    path.filter(d => d.children)
        .style("cursor", "pointer")
        .on("mouseover", mouseover_sunburst)

    path.filter(d => d.children).on("click", clicked);

    path.filter(d => !d.children).on("mouseover", meta_over)
    path.append("title")
        .text(d => `${d.ancestors().map(d => d.data.name).reverse().join("/")}\n${format(d.value)}`);

    const label = g.append("g")
        .attr("pointer-events", "none")
        .attr("text-anchor", "middle")
        .style("user-select", "none")
        .selectAll("text")
        .data(root.descendants().slice(1))
        .join("text")
        .attr("dy", "0.35em")
        .attr('font-size', '1.5vw')
        .style("fill", "#272838")
        .attr("fill-opacity", d => d.children ? 0 : 0)
        .attr("transform", d => labelTransform(d.current))
        .text(d => d.data.name);

    const parent = g.append("circle")
        .datum(root)
        .attr("r", radius_sunburst_medellin)
        .attr("fill", "none")
        .attr("pointer-events", "all")
        .on("click", clicked);

    

    

    (_ => {
        //$("#sera_que_es_este").append(profundidad_1);
        max_ods_sun = root2.children[0];
        root2.children.forEach(element => {
            if (element.value > max_ods_sun.value)
                max_ods_sun = element
        });


        sdg_bur_id = max_ods_sun.data.name.split("_")[1].padStart(2, '0');

        d3.select('#imagen_ods_sun').attr('src', sdg_img_repo + sdg_bur_id + ".jpg").attr("opacity", 0).transition().delay(1000).duration(1000).attr("opacity", 1);
        per = max_ods_sun.value;
        perc = (100 / root2.value) * per;
        val_to_show = perc < 1 ? perc.toPrecision(1) : perc < 10 ? perc.toPrecision(2) : perc.toFixed(0);
        d3.select('#percent_ods').text(`${val_to_show}%`).attr("opacity", 0).transition().delay(1000).duration(1000).attr("opacity", 1);

        path.attr("fill-opacity", d => { return arcVisible(d.current) ? d.data.name.split("ods_")[1] == sdg_bur_id ? 1 : 0.7 : 0 });
        //path.select(`#ODS/ods_${sdg_bur_id}`).transition().duration(1000).attr("fill-opacity", d => arcVisible(d.current) ? 1 : 0);

        max_meta = max_ods_sun.children[0];
        max_ods_sun.children.forEach(element => {
            if (max_meta.data.value < element.data.value)
                max_meta = element
        });

        d3.select('#imagen_meta_sun').attr('src', "assets/Metas%20ODS/ODS%20" + max_meta.data.name.split("_")[1] + "/" + max_meta.data.name.split("meta_")[1].replace("_", ".") + ".png");
        d3.select('#nombre_meta').text(`${max_meta.data.name}`.toUpperCase().replace("_", " ").replace("_", "."));
        per = max_meta.data.value;
        perc = (100 / root2.value) * per;
        val_to_show = perc < 1 ? perc.toPrecision(1) : perc < 10 ? perc.toPrecision(2) : perc.toFixed(0);
        d3.select('#percent_meta').text(`${val_to_show}%`)

    })();





    function meta_over() {

        sdg_bur_id = this.id.toString().split(/\//g)[2];



        path.attr("fill-opacity", d => {
            if (arcVisible(d.current)) {
                if (d.data.name == sdg_bur_id && sdg_bur_id != meta_seleccionada_primera) {
                    meta_seleccionada_primera = sdg_bur_id;

                    label.attr("fill-opacity", d => d.children ? 0 : 0)
                        .filter(d => d.data.name == sdg_bur_id)
                        .attr("fill-opacity", d => d.children ? 0 : +labelVisible(d.current))
                        .text(d => d.data.name.split("meta_")[1].replace("_", "."));

                    d3.selectAll('#imagen_3meta_sun').attr('src', d => {
                        return "assets/Metas%20ODS/ODS%20" + d.parent.data.name.split("_")[1] + "/" + sdg_bur_id.split("meta_")[1].replace("_", ".") + ".png"

                    });

                    var selected_meta = null;
                    root2.each(d => { if (d.data.name == sdg_bur_id) selected_meta = d });


                    var selected_testimonio_medellin = null;

                    if (selected_meta) {
                        testimonios_medellin.forEach(d => {
                            if (d.meta) {
                                if (d.meta.replace("s", "") == selected_meta.data.name) {
                                    selected_testimonio_medellin = d
                                }
                            }
                        })
                    }

                    d3.select('#testimonio_sun').text(selected_testimonio_medellin ? selected_testimonio_medellin.respuesta + "." : testimonios_cargados_medellin ? testimonios_medellin[1] : testimonios_medellin[0])

                    max_meta = selected_meta.parent.children.slice(0, 1)[0];
                    selected_meta.parent.children.forEach(element => {
                        if (max_meta.data.value < element.data.value)
                            max_meta = element;
                    });

                    barritas_meta.selectAll("rect")
                        .transition().duration(500)
                        .attr("width", d => scale_per_barrita_sun(selected_meta.value))
                        .attr("height", 40);


                    barritas_meta.selectAll("#nombre_meta_en_barra")
                        .transition().duration(300)
                        .attr("opacity", 0)


                    barritas_meta.select("#nombre_meta_en_barra")
                        .transition().delay(300)
                        .text(selected_meta.data.name.replace("_", " ").replace("_", "."))
                        .attr("x", d => scale_per_barrita_sun(selected_meta.value) - 100)
                        .transition().duration(500)
                        .attr("opacity", 1);


                    barritas_meta.select('#porcentaje_meta_en_barra')
                        .transition().duration(300)
                        .attr("opacity",0);


                    barritas_meta.select('#porcentaje_meta_en_barra')
                        .transition().delay(300)
                        .text(d => {
                            per = selected_meta.data.value;
                            perc = (100 / selected_meta.parent.value) * per;
                            val_to_show = perc < 1 ? perc.toPrecision(1) : perc < 10 ? perc.toPrecision(2) : perc.toFixed(0);
                            return val_to_show + "%"
                        })
                        .attr("x", d => scale_per_barrita_sun(selected_meta.data.value) + 5)
                        .transition().duration(500)
                        .attr("opacity", 1);


                    d3
                        .select('#desc_meta_sun_int_primera')
                        .transition().duration(300)
                        .style("opacity", 0);

                    d3.select('#desc_meta_sun_int_primera')
                        .transition().delay(300)
                        .text(descripciones_metas["meta_" + selected_meta.data.name.split("meta_")[1]])
                        .transition().duration(500)
                        .style("opacity", 1);
                }
                return d.data.name == sdg_bur_id ? 0.7 : 1;
            } else
                return 0
        });
        // 
        // 


        //volver



    }

    function mouseover_sunburst() {


        sdg_bur_id = `${this.id.toString()}`.split(/\//g)[1].split("_")[1];

        path.attr("fill-opacity", d => {
            if (arcVisible(d.current)) {
                return d.data.name.split("ods_")[1] == sdg_bur_id ? 0.7 : 1;
            } else
                return 0
        });

        sdg_bur_id = sdg_bur_id.padStart(2, '0')
        if (act_sdg != sdg_bur_id) {
            act_sdg = sdg_bur_id;
            d3.select('#imagen_ods_sun').attr('src', sdg_img_repo + act_sdg + ".jpg");
            var per = d3.select(this)._groups[0][0].__data__.data.name;
            
            root2.each(d => {
                if (d.data.name == per) {
                    
                    per = d.value;
                }

            })

            
            

            perc = (100 / root2.value) * per;
            val_to_show = perc < 1 ? perc.toPrecision(1) : perc < 10 ? perc.toPrecision(2) : perc.toFixed(0);
            d3.select('#percent_ods').text(`${val_to_show}%`)


            max_meta = d3.select(this)._groups[0][0].__data__.children[0];
            d3.select(this)._groups[0][0].__data__.children.forEach(element => {
                if (max_meta.data.value < element.data.value)
                    max_meta = element
            });

            d3.select('#desc_meta_sun').text("" + descripciones_metas["meta_" + max_meta.data.name.split("meta_")[1]] + ".")
            d3.select('#imagen_meta_sun').attr('src', "assets/Metas%20ODS/ODS%20" + max_meta.data.name.split("_")[1] + "/" + max_meta.data.name.split("meta_")[1].replace("_", ".") + ".png");
            d3.select('#nombre_meta').text(`${max_meta.data.name}`.toUpperCase().replace("_", " ").replace("_", "."));
            per = max_meta.data.value;
            perc = (100 / root2.value) * per;
            val_to_show = perc < 1 ? perc.toPrecision(1) : perc < 10 ? perc.toPrecision(2) : perc.toFixed(0);
            d3.select('#percent_meta').text(`${val_to_show}%`)
        }
    }

    function loaded(p) {

        
        if (p.data.name == "ODS" && p.parent == null) {
            parent.datum(p.parent || root);

            root.each(d => d.target = {
                x0: Math.max(0, Math.min(1, (d.x0 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
                x1: Math.max(0, Math.min(1, (d.x1 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
                y0: Math.max(0, d.y0 - p.depth),
                y1: Math.max(0, d.y1 - p.depth)
            });



            const t = g.transition().duration(750);

            // Transition the data on all arcs, even the ones that aren’t visible,
            // so that if this transition is interrupted, entering arcs will start
            // the next transition from the desired position.
            path.transition(t)
                .tween("data", d => {
                    const i = d3.interpolate(d.current, d.target);
                    return t => d.current = i(t);
                })
                .filter(function (d) {
                    return +this.getAttribute("fill-opacity") || arcVisible(d.target);
                })
                .attr("fill-opacity", d => arcVisible(d.target) ? 1 : 0)
                .attrTween("d", d => () => arc(d.current));

            label.filter(function (d) {
                return +this.getAttribute("fill-opacity") || labelVisible(d.target);
            }).transition(t)
                .attr("fill-opacity", d => d.children ? 0 : 0)
                .attrTween("transform", d => () => labelTransform(d.current));

            
        }

        return true;
    }

    function clicked(p) {
        
        d3.select('#atras').style("visibility", "visible");

        $('#atras').click(d => {
            clicked(root);
            d3.select('#atras').style("visibility", "hidden");
        });
        parent.datum(p.parent || root);

        root.each(d => d.target = {
            x0: Math.max(0, Math.min(1, (d.x0 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
            x1: Math.max(0, Math.min(1, (d.x1 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
            y0: Math.max(0, d.y0 - p.depth),
            y1: Math.max(0, d.y1 - p.depth)
        });

        const t = g.transition().duration(750);

        // Transition the data on all arcs, even the ones that aren’t visible,
        // so that if this transition is interrupted, entering arcs will start
        // the next transition from the desired position.
        path.transition(t)
            .tween("data", d => {
                const i = d3.interpolate(d.current, d.target);
                return t => d.current = i(t);
            })
            .filter(function (d) {
                return +this.getAttribute("fill-opacity") || arcVisible(d.target);
            })
            .attr("fill-opacity", d => arcVisible(d.target) ? 1 : 0)
            .attrTween("d", d => () => arc(d.current));

        label.filter(function (d) {
            return +this.getAttribute("fill-opacity") || labelVisible(d.target);
        }).transition(t)
            .attr("fill-opacity", d => d.children ? 0 : 0)
            .attrTween("transform", d => () => labelTransform(d.current));



        if (p.parent != undefined && p.parent.data.name == "ODS" && nivel_profundidad == 1) {
            
            nivel_profundidad = 2;

            col_5_ods = d3.select("#quitame");
            col_5_ods.remove();

            root2.each(d => { if (d.data.name == p.data.name) { p = d; return true; } });


            $("#sera_que_es_este").append(profundidad_2);
            d3.selectAll('#imagen_3meta_sun').data(p.children.slice(0, 1)).join().attr('src', d => {
                

                return "assets/Metas%20ODS/ODS%20" + d.parent.data.name.split("_")[1] + "/" + d.data.name.split("meta_")[1].replace("_", ".") + ".png"
            });

            d3.selectAll('.desc_meta_sun_int').data(p.children.slice(0, 1)).join().text(d => descripciones_metas["meta_" + d.data.name.split("meta_")[1]]);

            const sunburst_barrita_col = d3.select("#prueba_barrita");

            const bounds_sunburst_barrita_col = sunburst_barrita_col.node().getBoundingClientRect();

            const width_percent_sunb_col_p1 = bounds_sunburst_barrita_col.width - bounds_sunburst_barrita_col.width*20/100;
            const height_percent_sunb_col = bounds_sunburst_barrita_col.height;

            //


            //
            max_meta = p.children.slice(0, 1)[0];
            p.children.slice(0, 1).forEach(element => {
                if (max_meta.data.value < element.data.value)
                    max_meta = element;
            });

            scale_per_barrita_sun = d3.scaleLinear()
                .domain([0, max_meta.value]).range([0, width_percent_sunb_col_p1 - (width_percent_sunb_col_p1 / 100) * 20])

            meta_seleccionada_primera = max_meta.data.name
            barritas_meta = d3.selectAll('.perc_barras_metas_sun').data(p.children.slice(0, 1)).join().append("svg")
                .attr("id", "barritas_svg").attr("viewBox", [0, 0, width_percent_sunb_col_p1, height_percent_sunb_col]).attr("width", width_percent_sunb_col_p1)
                .append("g")
                .attr("fill", ods[p.data.name].color)
                .attr("height", 40);

            barritas_meta.append("rect").attr("x", 0)
                .attr("y", 0)
                .attr("height", 40)
                .attr("width", 0)
                .transition().duration(2000)
                .attr("width", d => scale_per_barrita_sun(d.value))
                .attr("height", 40);

            //volver
            barritas_meta.append("text")
                .attr("id", "nombre_meta_en_barra")
                .attr("x", d => scale_per_barrita_sun(d.value) - 100)
                .attr("y", height_percent_sunb_col / 2)
                .text(d => d.data.name.replace("_", " ").replace("_", "."))
                .attr("opacity", 0)
                .transition().delay(1400)
                .duration(500)
                .attr("opacity", 1)
                .attr("font-family", "Arial")
                .attr("font-size", "2vh")
                .attr("fill", "white");

            barritas_meta.append("text")
                .attr("id", "porcentaje_meta_en_barra")
                .attr("x", d => scale_per_barrita_sun(d.value) + 5)
                .attr("y", height_percent_sunb_col / 2 + 10)
                .text(d => {
                    per = d.data.value;
                    perc = (100 / d.parent.value) * per;
                    val_to_show = perc < 1 ? perc.toPrecision(1) : perc < 10 ? perc.toPrecision(2) : perc.toFixed(0);
                    return val_to_show + "%"
                })
                .attr("opacity", 0)
                .transition().delay(1400)
                .duration(500)
                .attr("opacity", 1)
                .attr("font-weight", "bold")
                .attr("font-family", "Arial")
                .attr("font-size", "3vh")
                .attr("fill", "#272838");
            ;


            const pata = { ...req };
            pata.ods = [max_meta.parent.data.name];

            postData(urlBack+'historias/1', pata).then(testimonio => {
                

                testimonio.forEach(element => {
                    testimonios_medellin.push(element)
                });
                testimonios_cargados_medellin = true;
                d3.select('#testimonio_sun').text(testimonio[0] != undefined ? testimonio[0].respuesta + "." : testimonios_medellin[1])
            });
        }

        if (p.data.name == "ODS" && nivel_profundidad == 2) {
            
            nivel_profundidad = 1;

            col_5_ods = d3.select("#quitame");
            col_5_ods.remove();

            $("#sera_que_es_este").append(profundidad_1);

            (_ => {
                max_ods_sun = root2.children[0];
                root2.children.forEach(element => {
                    if (element.value > max_ods_sun.value)
                        max_ods_sun = element
                });


                sdg_bur_id = max_ods_sun.data.name.split("_")[1].padStart(2, '0');
                
                

                d3.select('#imagen_ods_sun').attr('src', sdg_img_repo + sdg_bur_id + ".jpg").attr("opacity", 0).transition().delay(1000).duration(1000).attr("opacity", 1);
                per = max_ods_sun.value;
                perc = (100 / root2.value) * per;
                val_to_show = perc < 1 ? perc.toPrecision(1) : perc < 10 ? perc.toPrecision(2) : perc.toFixed(0);
                d3.select('#percent_ods').text(`${val_to_show}%`).attr("opacity", 0).transition().delay(1000).duration(1000).attr("opacity", 1);

                path.attr("fill-opacity", d => { return arcVisible(d.current) ? d.data.name.split("ods_")[1] == sdg_bur_id ? 1 : 0.7 : 0 });
                //path.select(`#ODS/ods_${sdg_bur_id}`).transition().duration(1000).attr("fill-opacity", d => arcVisible(d.current) ? 1 : 0);

                max_meta = max_ods_sun.children[0];
                max_ods_sun.children.forEach(element => {
                    if (max_meta.data.value < element.data.value)
                        max_meta = element
                });

                d3.select('#imagen_meta_sun').attr('src', "assets/Metas%20ODS/ODS%20" + max_meta.data.name.split("_")[1] + "/" + max_meta.data.name.split("meta_")[1].replace("_", ".") + ".png");
                d3.select('#nombre_meta').text(`${max_meta.data.name}`.replace("_", " ").replace("_", "."));
                per = max_meta.data.value;
                perc = (100 / root2.value) * per;
                val_to_show = perc < 1 ? perc.toPrecision(1) : perc < 10 ? perc.toPrecision(2) : perc.toFixed(0);
                d3.select('#percent_meta').text(`${val_to_show}%`)

            })();
        }

        
    }


    function arcVisible(d) {
        return d.y1 <= 2 && d.y0 >= 1 && d.x1 > d.x0;
    }

    function labelVisible(d) {
        return d.y1 <= 2 && d.y0 >= 1 && (d.y1 - d.y0) * (d.x1 - d.x0) > 0.03;
    }

    function labelTransform(d) {
        const x = (d.x0 + d.x1) / 2 * 180 / Math.PI;
        const y = (d.y0 + d.y1) / 2 * radius_sunburst_medellin;
        return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
    }


}