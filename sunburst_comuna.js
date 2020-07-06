

var width_sunburst_col_pregunta2;
var height_sunburst_col_pregunta2;
var req_sun_inic_dos = { ...req };
req_sun_inic_dos.respuesta = [0];
req_sun_inic_dos.numero = 1023;
var scale_per_barrita_sun_comuna;
var meta_seleccionada_segunda;
var radius_sunburst_comuna;
var testimonios_cargados_comuna = false;
var testimonios_comuna = ["Cargando testimonios...", "Testimonio no encontrado."];
postData(urlBack+'sunburst', req_sun_inic_dos).then(data => {
    data.name = "ODS";
    dibujar_sunburst_comuna(data);
    d3.select('#comuna_aislada').select('#testimonio_sun').text(testimonios_comuna[0]);
    avisar();
});



function dibujar_sunburst_comuna(data) {

    var comunitas = [
        { id: "C8", n: "Villa Hermosa" },
        { id: "C9", n: "Buenos Aires" },
        { id: "C10", n: "La Candelaria" },
        { id: "C4", n: "Aranjuez" },
        { id: "C2", n: "Santa Cruz" },
        { id: "C3", n: "Manrique" },
        { id: "C1", n: "Popular" },
        { id: "C14", n: "El Poblado" },
        { id: "C11", n: "Laureles-Estadio" },
        { id: "C12", n: "La América" },
        { id: "C13", n: "San Javier" },
        { id: "C15", n: "Guayabal" },
        { id: "C16", n: "Belén" },
        { id: "C7", n: "Robledo" },
        { id: "C5", n: "Castilla" },
        { id: "C6", n: "Doce de Octubre" },
        { id: "CO1", n: "Altavista" },
        { id: "CO2", n: "San Antonio de Prado" },
        { id: "CO3", n: "San Sebastián de Palmitas" },
        { id: "CO4", n: "San Cristóbal" },
        { id: "CO5", n: "Santa Elena" }
    ];

    var col_5_ods = null;
    var act_sdg = 0;
    var removes = d3.select("#comuna_aislada").select("#quitame");
    removes.remove();
    var nivel_profundidad = 1;
    //$("#mapas_juntos").append(profundidad_1_tercer_slide);


    var grupito = d3.select("#mapas_juntos").select('#grupo_sunburst');
    //grupito.transition().duration(1000).attr("opacity", 0);

    var sunburst_col = d3.select("#sunburst_col_intr");
    var sunburst_row = d3.select("#sunburst_row_intr");

    var bounds_sunburst_col = sunburst_col.node().getBoundingClientRect();
    var bounds_sunburst_row = sunburst_row.node().getBoundingClientRect();

    var margin_sunburst = { top: 0, right: 0, bottom: 0, left: 0 }

    width_sunburst_col_pregunta2 = width_sunburst_col_pregunta2 || bounds_sunburst_col.width + (bounds_sunburst_col.width / 100) * 10;
    height_sunburst_col_pregunta2 = height_sunburst_col_pregunta2 || bounds_sunburst_row.height + (bounds_sunburst_col.height / 100) * 10;



    var width_sunburst = width_sunburst_col_pregunta2;
    const escala_para_radio = d3.scaleLinear()
        .domain([100, 1000]).range([3, 5])


    radius_sunburst_comuna = Math.min(height_sunburst_col_pregunta2, width_sunburst_col_pregunta2) / escala_para_radio(Math.min(height_sunburst_col_pregunta2, width_sunburst_col_pregunta2));


    var format = d3.format(",d")


    var arc = d3.arc()
        .startAngle(d => d.x0)
        .endAngle(d => d.x1)
        .padAngle(d => Math.min((d.x1 - d.x0) / 2, 0.005))
        .padRadius(radius_sunburst_comuna * 1.5)
        .innerRadius(d => d.y0 * radius_sunburst_comuna)
        .outerRadius(d => Math.max(d.y0 * radius_sunburst_comuna, d.y1 * radius_sunburst_comuna - 1))

    var partition = data => {
        //escala = d3.scalePow().exponent(0.75);
        const root = d3.hierarchy(data)
            //.sum(d => escala(d.value))
            .sum(d => d.value)
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
    var root2 = partition2(data);
    root.each(d => d.current = d);
    root2.each(d => d.current = d);


    const svg = d3.select('#svg_sunburst_refer')
        .attr("width", width_sunburst - (width_sunburst / 100) * 35)
        .attr("height", height_sunburst_col_pregunta2)
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
        .on("click", clicked);

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
        .attr("r", radius_sunburst_comuna)
        .attr("fill", "none")
        .attr("pointer-events", "all")

        .on("click", clicked);


    (_ => {


        $("#comuna_aislada").append(profundidad_1_tercer_slide);


        //pintar pregunta

        d3.select("#comuna-actual-2").text(comunitas.filter(d => d.id == comuna_act)[0] ? comunitas.filter(d => d.id == comuna_act)[0].n : "")


        //fin pintar pregunta 

        max_ods_sun = root2.children[0];
        root2.children.forEach(element => {
            if (element.value > max_ods_sun.value)
                max_ods_sun = element
        });


        sdg_bur_id = max_ods_sun.data.name.split("_")[1];
        if (sdg_bur_id.length < 2)
            sdg_bur_id = "0" + sdg_bur_id
        d3.select('#comuna_aislada').select('#imagen_ods_sun').attr('src', sdg_img_repo + sdg_bur_id + ".jpg").attr("opacity", 0).transition().delay(1000).duration(1000).attr("opacity", 1);
        per = max_ods_sun.value;
        perc = (100 / root2.value) * per;
        val_to_show = perc < 1 ? perc.toPrecision(1) : perc < 10 ? perc.toPrecision(2) : perc.toFixed(0);
        d3.select('#comuna_aislada').select('#percent_ods').text(`${val_to_show}%`).attr("opacity", 0).transition().delay(1000).duration(1000).attr("opacity", 1);

        path.attr("fill-opacity", d => { return arcVisible(d.current) ? d.data.name.split("ods_")[1] == sdg_bur_id ? 1 : 0.7 : 0 });
        //path.select(`#ODS/ods_${sdg_bur_id}`).transition().duration(1000).attr("fill-opacity", d => arcVisible(d.current) ? 1 : 0);

        max_meta = max_ods_sun.children[0];
        max_ods_sun.children.forEach(element => {
            if (max_meta.data.value < element.data.value)
                max_meta = element
        });

        d3.select('#comuna_aislada').select('#imagen_meta_sun').attr('src', "assets/Metas%20ODS/ODS%20" + max_meta.data.name.split("_")[1] + "/" + max_meta.data.name.split("meta_")[1].replace("_", ".") + ".png");
        d3.select('#comuna_aislada').select('#nombre_meta').text(`${max_meta.data.name}`.replace("_", " ").replace("_", "."));
        per = max_meta.data.value;
        perc = (100 / root2.value) * per;
        val_to_show = perc < 1 ? perc.toPrecision(1) : perc < 10 ? perc.toPrecision(2) : perc.toFixed(0);
        d3.select('#comuna_aislada').select('#percent_meta').text(`${val_to_show}%`)

    })();

    function meta_over() {

        sdg_bur_id = this.id.toString().split(/\//g)[2];

        path.attr("fill-opacity", d => {
            if (arcVisible(d.current)) {
                if (d.data.name == sdg_bur_id && sdg_bur_id != meta_seleccionada_segunda) {
                    meta_seleccionada_segunda = sdg_bur_id;

                    label.attr("fill-opacity", d => d.children ? 0 : 0)
                        .filter(d => d.data.name == sdg_bur_id)
                        .attr("fill-opacity", d => d.children ? 0 : +labelVisible(d.current))
                        .text(d => d.data.name.split("meta_")[1].replace("_", "."));

                    d3.selectAll('#imagen_3meta_sun').attr('src', d => {
                        return "assets/Metas%20ODS/ODS%20" + d.parent.data.name.split("_")[1] + "/" + sdg_bur_id.split("meta_")[1].replace("_", ".") + ".png"

                    });

                    var selected_meta = null;
                    root2.each(d => { if (d.data.name == sdg_bur_id) selected_meta = d });
                    var selected_testimonio = null;

                    if (selected_meta) {
                        testimonios_comuna.forEach(d => {
                            if (d.meta) {
                                if (d.meta.replace("s", "") == selected_meta.data.name) {
                                    selected_testimonio = d
                                }
                            }
                        })
                    }

                    
                    d3.select('#comuna_aislada').select('#testimonio_sun').text(selected_testimonio ? selected_testimonio.respuesta + "." : testimonios_cargados_comuna ? testimonios_comuna[1] : testimonios_comuna[0])




                    max_meta = selected_meta.parent.children.slice(0, 1)[0];
                    selected_meta.parent.children.forEach(element => {
                        if (max_meta.data.value < element.data.value)
                            max_meta = element;
                    });

                    barritas_meta.selectAll("rect")
                        .transition().duration(500)
                        .attr("width", d => scale_per_barrita_sun_comuna(selected_meta.value))
                        .attr("height", 40);


                    barritas_meta.selectAll("#nombre_meta_en_barra")
                        .transition().duration(300)
                        .attr("opacity", 0)


                    barritas_meta.select("#nombre_meta_en_barra")
                        .transition().delay(300)
                        .text(selected_meta.data.name.replace("_", " ").replace("_", "."))
                        .attr("x", d => scale_per_barrita_sun_comuna(selected_meta.value) - 100)
                        .transition().duration(500)
                        .attr("opacity", 1);


                    barritas_meta.select('#porcentaje_meta_en_barra')
                        .transition().duration(300)
                        .attr("opacity", 0);


                    barritas_meta.select('#porcentaje_meta_en_barra')
                        .transition().delay(300)
                        .text(d => {
                            per = selected_meta.data.value;
                            perc = (100 / selected_meta.parent.value) * per;
                            val_to_show = perc < 1 ? perc.toPrecision(1) : perc < 10 ? perc.toPrecision(2) : perc.toFixed(0);
                            return val_to_show + "%"
                        })
                        .attr("x", d => scale_per_barrita_sun_comuna(selected_meta.data.value) + 5)
                        .transition().duration(500)
                        .attr("opacity", 1);


                    d3
                        .select("#comuna_aislada")
                        .select('#desc_meta_sun_int_primera')
                        .transition().duration(300)
                        .style("opacity", 0);

                    d3
                        .select("#comuna_aislada")
                        .select('#desc_meta_sun_int_primera')
                        .transition().delay(300)
                        .text(descripciones_metas["meta_" + selected_meta.data.name.split("meta_")[1]])
                        .transition().duration(500)
                        .style("opacity", 1);
                }

                return d.data.name == sdg_bur_id ? 0.7 : 1;
            } else
                return 0
        });
        label.attr("fill-opacity", d => d.children ? 0 : 0)
            .filter(d => d.data.name == sdg_bur_id)
            .attr("fill-opacity", d => d.children ? 0 : +labelVisible(d.current))
            .text(d => d.data.name.split("meta_")[1].replace("_", "."));
    }

    function mouseover_sunburst() {

        sdg_bur_id = `${this.id.toString()}`.split(/\//g)[1].split("_")[1];


        path.attr("fill-opacity", d => {
            if (arcVisible(d.current)) {
                return d.data.name.split("ods_")[1] == sdg_bur_id ? 0.7 : 1;
            } else
                return 0
        });

        if (sdg_bur_id.length < 2)
            sdg_bur_id = "0" + sdg_bur_id
        if (act_sdg != sdg_bur_id) {
            act_sdg = sdg_bur_id;
            d3.select('#comuna_aislada').select('#imagen_ods_sun').attr('src', sdg_img_repo + act_sdg + ".jpg");
            per = d3.select(this)._groups[0][0].__data__.data.name;



            root2.each(d => {
                if (d.data.name == per) {
                    per = d.value;
                }

            })


            perc = (100 / root2.value) * per;
            val_to_show = perc < 1 ? perc.toPrecision(1) : perc < 10 ? perc.toPrecision(2) : perc.toFixed(0);
            d3.select('#comuna_aislada').select('#percent_ods').text(`${val_to_show}%`)


            max_meta = d3.select(this)._groups[0][0].__data__.children[0];
            d3.select(this)._groups[0][0].__data__.children.forEach(element => {
                if (max_meta.data.value < element.data.value)
                    max_meta = element
            });

            d3.select('#comuna_aislada').select('#desc_meta_sun').text("\"" + descripciones_metas["meta_" + max_meta.data.name.split("meta_")[1]] + "\"")
            d3.select('#comuna_aislada').select('#imagen_meta_sun').attr('src', "assets/Metas%20ODS/ODS%20" + max_meta.data.name.split("_")[1] + "/" + max_meta.data.name.split("meta_")[1].replace("_", ".") + ".png");
            d3.select('#comuna_aislada').select('#nombre_meta').text(`${max_meta.data.name}`.replace("_", " ").replace("_", "."));
            per = max_meta.data.value;
            perc = (100 / root2.value) * per;
            val_to_show = perc < 1 ? perc.toPrecision(1) : perc < 10 ? perc.toPrecision(2) : perc.toFixed(0);
            d3.select('#comuna_aislada').select('#percent_meta').text(`${val_to_show}%`)
        }
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

            var col_5_ods = d3.select('#comuna_aislada').select("#quitame");
            col_5_ods.remove();


            $("#comuna_aislada").append(profundidad_2);
            d3.select('#comuna_aislada').selectAll('#imagen_3meta_sun').data(p.children.slice(0, 1)).join().attr('src', d => {
                return "assets/Metas%20ODS/ODS%20" + d.parent.data.name.split("_")[1] + "/" + d.data.name.split("meta_")[1].replace("_", ".") + ".png"
            });

            d3.select('#comuna_aislada').selectAll('.desc_meta_sun_int').data(p.children.slice(0, 1)).join().text(d => descripciones_metas["meta_" + d.data.name.split("meta_")[1]]);

            const sunburst_barrita_col = d3.select('#comuna_aislada').select("#prueba_barrita");

            const bounds_sunburst_barrita_col = sunburst_barrita_col.node().getBoundingClientRect();

            const width_percent_sunb_col = bounds_sunburst_barrita_col.width - bounds_sunburst_barrita_col.width * 20 / 100;
            const height_percent_sunb_col = bounds_sunburst_barrita_col.height;

            max_meta = p.children[0];

            p.children.forEach(element => {
                if (max_meta.data.value < element.data.value)
                    max_meta = element;
            });



            root2.children.forEach(element => {
                if (element.data.name == max_meta.data.name)
                    max_meta = element
            });




            scale_per_barrita_sun_comuna = d3.scaleLinear()
                .domain([0, max_meta.value]).range([0, width_percent_sunb_col - (width_percent_sunb_col / 100) * 20])

            meta_seleccionada_segunda = max_meta.data.name
            barritas_meta = d3.select('#comuna_aislada').selectAll('.perc_barras_metas_sun').data(p.children.slice(0, 1)).join().append("svg")
                .attr("viewBox", [0, 0, width_percent_sunb_col, height_percent_sunb_col]).attr("width", width_percent_sunb_col)
                .append("g")
                .attr("fill", ods[p.data.name].color)
                .attr("height", 40);

            barritas_meta.append("rect").attr("x", 0)
                .attr("y", 0)
                .attr("height", 40)
                .attr("width", 0)
                .transition().duration(2000)
                .attr("width", d => scale_per_barrita_sun_comuna(d.value))
                .attr("height", 40);

            barritas_meta.append("text")
                .attr("id", "nombre_meta_en_barra")
                .attr("x", d => scale_per_barrita_sun_comuna(d.value) - 100)
                .attr("y", height_percent_sunb_col / 2)
                .text(d => d.data.name.replace("_", " ").replace("_", "."))
                .attr("opacity", 0)
                .transition().delay(1400)
                .duration(500)
                .attr("opacity", 1)
                .attr("font-family", "Arial")
                .attr("font-size", "2vh")
                .attr("fill", "#fff");

            barritas_meta.append("text")
                .attr("id", "porcentaje_meta_en_barra")
                .attr("x", d => scale_per_barrita_sun_comuna(d.value) + 5)
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
                    testimonios_comuna.push(element)
                });
                testimonios_cargados_comuna = true;
                d3.select('#comuna_aislada').select('#testimonio_sun').text(testimonio[0] != undefined ? testimonio[0].respuesta + "." : testimonios_comuna[1])
            });
        }

        if (p.data.name == "ODS" && nivel_profundidad == 2) {
            nivel_profundidad = 1;

            col_5_ods = d3.select('#comuna_aislada').select("#quitame");
            col_5_ods.remove();

            $("#comuna_aislada").append(profundidad_1_tercer_slide);

            (_ => {
                max_ods_sun = root2.children[0];
                root2.children.forEach(element => {
                    if (element.value > max_ods_sun.value)
                        max_ods_sun = element
                });

                sdg_bur_id = max_ods_sun.data.name.split("_")[1];

                if (sdg_bur_id.length < 2)
                    sdg_bur_id = "0" + sdg_bur_id;

                d3.select('#comuna_aislada').select('#imagen_ods_sun').attr('src', sdg_img_repo + sdg_bur_id + ".jpg").attr("opacity", 0).transition().delay(1000).duration(1000).attr("opacity", 1);
                per = max_ods_sun.value;
                perc = (100 / root2.value) * per;
                val_to_show = perc < 1 ? perc.toPrecision(1) : perc < 10 ? perc.toPrecision(2) : perc.toFixed(0);
                d3.select('#comuna_aislada').select('#percent_ods').text(`${val_to_show}%`).attr("opacity", 0).transition().delay(1000).duration(1000).attr("opacity", 1);

                path.attr("fill-opacity", d => { return arcVisible(d.current) ? d.data.name.split("ods_")[1] == sdg_bur_id ? 1 : 0.7 : 0 });
                //path.select(`#ODS/ods_${sdg_bur_id}`).transition().duration(1000).attr("fill-opacity", d => arcVisible(d.current) ? 1 : 0);

                max_meta = max_ods_sun.children[0];
                max_ods_sun.children.forEach(element => {
                    if (max_meta.data.value < element.data.value)
                        max_meta = element
                });

                d3.select('#comuna_aislada').select('#imagen_meta_sun').attr('src', "assets/Metas%20ODS/ODS%20" + max_meta.data.name.split("_")[1] + "/" + max_meta.data.name.split("meta_")[1].replace("_", ".") + ".png");
                d3.select('#comuna_aislada').select('#nombre_meta').text(`${max_meta.data.name}`.replace("_", " ").replace("_", "."));
                per = max_meta.data.value;
                perc = (100 / root2.value) * per;
                val_to_show = perc < 1 ? perc.toPrecision(1) : perc < 10 ? perc.toPrecision(2) : perc.toFixed(0);
                d3.select('#comuna_aislada').select('#percent_meta').text(`${val_to_show}%`)

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
        const y = (d.y0 + d.y1) / 2 * radius_sunburst_comuna;
        return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
    }
}