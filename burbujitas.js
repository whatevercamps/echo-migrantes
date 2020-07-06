var odss_res;
var svg_burbujas;
var xx_burb;
var data_burb;
var force;


d3.json('https://raw.githubusercontent.com/whatevercamps/graph_jsons_tw_unfpa/master/ods.json').then(res_ods => {
    odss_res = res_ods;
});


function dibujar_burbujas(res_hist) {
    var odss = odss_res;
    
    var histograma = res_hist;

    var pie_st = [false, false];
    const margin = { left: 30, right: 30, top: 30, bottom: 30 };
    var div_burb = d3.select("#burbujas");
    const bounds_div_burb = div_burb.node().getBoundingClientRect();
    const width_col_burb = bounds_div_burb.width;
    const height_col_burb = bounds_div_burb.height / 2;
    const body_width = d3.select('#sect2').node().getBoundingClientRect().width;
    const body_height = d3.select('#sect2').node().getBoundingClientRect().height;
    const radio_calc = d3.scalePow().exponent(0.7).domain([0, d3.max(histograma, d => d.value)]).range([10, height_col_burb / 6]);
    iwidth = width_col_burb / 2 - margin.left - margin.right;
    iheight = height_col_burb - margin.top - margin.bottom;
    // div_burb.select("svg").remove();


    if (xx_burb) {
        pie_st = [true, true];
        let nodos = d3.selectAll('.node')
            .transition().duration(2000)
            .tween('radius', function (d) {
                var that = d3.select(this);
                const ods = histograma.find(x => x.name == d.id);

                var i = d3.interpolate(d.radius, radio_calc(parseInt((ods ? ods['value'] : 0) || 0)));
                return function (t) {
                    d.radius = i(t);
                    that.attr('r', function (d) {
                        return d.radius;
                    });
                    force.nodes(data_burb)
                }
            });     
            
        
            
            d3.selectAll(".text_node")
            .transition().duration(500)
            .attr("opacity", 0)
            .text(function (d, i) {
                
                if (histograma[0] && histograma[1] && histograma[2]) {
                    if (d.id == histograma[0].name || d.id == histograma[1].name || d.id == histograma[2].name) {
                        var por= histograma.filter(h => h.name==d.id)[0].porcentaje;
                        return  (por*100).toFixed(0) + '%'
                    }
                }
                else if (histograma[0] && histograma[1]) {
                    if (d.id == histograma[0].name || d.id == histograma[1].name) {
                        var por= histograma.filter(h => h.name==d.id)[0].porcentaje;
                        return  (por*100).toFixed(0) + '%'
                    }
                }
            })
            .transition().delay(500).duration(500)
            .attr("opacity", 1)
            .style('fill', '#fff')
            .style('font-size', '20px');

        force.alpha(1).restart();

    } else {

        xx_burb = xx_burb || div_burb.append("svg").attr("width", width_col_burb).attr("width", body_width).attr("height", body_height).attr("id", "burbujas_svg_burbujas");
        //xx_burb.attr("transform", "translate(" + (div_width_bar / 2 * (-1)) + ", " + 0 + ")");
        //xx_burb.attr("opacity", 0).transition().duration(500).attr("opacity", 1);
        svg_burbujas = xx_burb
            .attr("width", body_width)
            .attr("height", body_height).attr("transform", "translate(-" + Math.abs(width_col_burb) + ", " + 0 + ")");




        data_burb = d3.range(17).map(d => {//
            const ods = histograma.find(x => x.name == `ods_${d + 1}`);
            return {
                radius: radio_calc(parseInt((ods ? ods['value'] : 0) || 0)),
                id: `ods_${d + 1}`,
                name: `ods ${d + 1}`,
                marked: false,
                percent: (ods ? (ods['porcentaje']*100).toFixed(0) + '%' : 0) || 0,
                value: (ods ? parseInt(ods['value']) : 0) || 0
            }
        });
        var forceCollide = d3.forceCollide(function (d) {
            return d.radius;
        })
            .strength(0.8);

        var s = 0.02;

        var forceX = d3.forceX(width_col_burb / 2).strength(s);
        var forceY = d3.forceY(height_col_burb / 2).strength(s);

        force = d3.forceSimulation(data_burb)
            .force('x', forceX)
            .force('y', forceY)
            .force('center', d3.forceCenter(width_col_burb / 2, height_col_burb / 2))
            .force("cluster", forceCluster())
            .force('collide', forceCollide)
            .on('tick', function () {
                svg_burbujas.selectAll('.node')
                    .attr('cx', function (d) {

                        // .attr('transform', _ => `translate(${d.x},${d.y})}`)
                        //                    .attr('cx', _ => d.marked?d.x:990)
                        //                    .attr('x', _ => d.marked?d.x:990)
                        return d.x;
                    })
                    .attr('cy', function (d) {


                        svg_burbujas.selectAll('.inside')
                        // .attr('transform', `translate(${d.x},${d.y})}`)
                        //                    .attr('cy', _ => d.marked?d.y:990)
                        //                    .attr('y', _ => d.marked?d.y:990)
                        return d.y;
                    })

                svg_burbujas.selectAll('.text_node')
                    .attr('cx', function (d) {
                        return d.x;
                    })
                    .attr('cy', function (d) {
                        return d.y;
                    })
                    .attr('x', function (d) {
                        return d.x - d.radius / 3;
                    })
                    .attr('y', function (d) {
                        return d.y;
                    })
            });

        function forceCluster() {
            const strength = 0.2;
            let nodes;

            function force(alpha) {
                const l = alpha * strength;
                for (const d of nodes) {
                    const {
                        x: cx,
                        y: cy
                    } = {
                        x: iwidth / 2,
                        y: iheight / 2
                    };
                    d.vx -= (d.x - cx) * l;
                    d.vy -= (d.y - cy) * l;
                }
            }

            force.initialize = _ => nodes = _;

            return force;
        }
        const main_g = svg_burbujas.append("g");
        main_g.attr("transform", "translate(" + Math.abs(body_width - width_col_burb) * 2 / 3 + ", " + body_height / 2 + ")")
        const node = main_g
            .selectAll(".node")
            .data(data_burb)
            .join("g");

        const circle = node.append('circle')
            .classed('node', true).call(drag(force))
            .on('click', (d, i) => switchRadius(iheight / 4, i)());

        circle.attr('r', function (d) {
            return d.radius;
        })
            .attr("fill", d => odss[d.id].color);

        const circle_is = circle.append('circle').classed('inside', true).attr('r', 5)
            .attr("fill", d => '#ddd');

        

        node.append("text")
            .attr("class", "text_node")
            .text(function (d, i) {
                
                if (histograma[0] && histograma[1] && histograma[2]) {
                    if (d.id == histograma[0].name || d.id == histograma[1].name || d.id == histograma[2].name) {
                        return d.percent;
                    }
                }
            })
            .style('fill', '#fff')
            .style('font-size', '20px')

        force.nodes(data_burb)
            .alpha(1)
            .restart();


    }
    //finallll de la construccion 



    // var body_gg = d3.select("body");
    // const bounds_body = body_gg.node().getBoundingClientRect();
    // const width_body = bounds_body.width;
    // const height_body = bounds_body.height;
    // xx_burb.attr("width", width_body).attr("height", height_body);

    function drag(force) {

        function dragstarted(d) {
            if (!d3.event.active) force.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }

        function dragged(d) {
            d.fx = d3.event.x;
            d.fy = d3.event.y;
        }

        function dragended(d) {
            if (!d3.event.active) force.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }

        return d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended);
    }



    function switchRadius(newRadius, index) {
        return function () {

            const marked_finder = d3.selectAll('.node')
                .filter(function (d, i) {
                    return d.marked === true;
                });

            if (marked_finder._groups[0].length == 0) {
                pie_st = [true, true];
                d3.selectAll('.node')
                    .transition().duration(1000)
                    .tween('radius', function (d) {
                        var that = d3.select(this);
                        var i = d3.interpolate(d.radius, iheight / 20);
                        return function (t) {
                            d.radius = i(t);
                            that.attr('r', function (d) {
                                return d.radius;
                            });
                            force.nodes(data_burb)
                        }
                    });




                const amigito = d3.selectAll('.node')
                    .filter(function (d, i) {
                        return i === index;
                    });
                amigito.transition().duration(1000)
                    .tween('radius', function (d) {
                        var that = d3.select(this);
                        var i = d3.interpolate(d.radius, newRadius);
                        return function (t) {
                            d.radius = i(t);
                            d.marked = true;
                            that.attr('r', function (d) {
                                var bar_svg_burbujas = d3.select('#bar_svg_burbujas');
                                bar_svg_burbujas.selectAll('.enter')
                                    .selectAll("g")
                                    .filter(w => w.data.name == d.id)
                                    .attr("class", v => { down(bar_svg_burbujas, v); return v });
                                return d.radius;
                            });
                            force.nodes(data_burb)
                        }
                    });

                mapaCalor(index + 1);
                force.alpha(1).restart();


                //fin del if
            } else {
                dibujar_mapita();
                pie_st = [false, true];
                d3.selectAll('.node')
                    .transition().duration(1000)
                    .tween('radius', function (d) {
                        var that = d3.select(this);
                        var i = d3.interpolate(d.radius, radio_calc(d.value || 0));

                        return function (t) {
                            d.radius = i(t);
                            d.marked = false;
                            that.attr('r', function (d) {
                                return d.radius;
                            });
                            force.nodes(data_burb)
                        }
                    });

                // d3.selectAll('.inside').transition().attr('visibility', 'hidden').duration(2500);
                // d3.selectAll('.inside').transition().attr('opacity', 0.5);
            }
        }
    }

}

