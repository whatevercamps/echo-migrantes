odss_bar = {
    "ods_1": {
        "name": "Fin de la pobreza",
        "color": "rgb(231, 56, 65)"
    },
    "ods_2": {
        "name": "Hambre cero",
        "color": "rgb(224, 164, 60)"
    },
    "ods_3": {
        "name": "Salud y bienestar",
        "color": "rgb(78, 160, 73)"
    },
    "ods_4": {
        "name": "Educación de calidad",
        "color": "rgb(200, 46, 51)"
    },
    "ods_5": {
        "name": "Igualdad de género",
        "color": "rgb(236, 63, 51)"
    },
    "ods_6": {
        "name": "Agua limpia y saneamiento",
        "color": "rgb(77, 191, 234)"
    },
    "ods_7": {
        "name": "Energía asequible y no contaminante",
        "color": "rgb(248, 195, 70)"
    },
    "ods_8": {
        "name": "Trabajo y crecimiento económico",
        "color": "rgb(167, 40, 70)"
    },
    "ods_9": {
        "name": "Industria, innovación e infraestructura",
        "color": "rgb(239, 105, 55)"
    },
    "ods_10": {
        "name": "Reducción de las desigualdades",
        "color": "rgb(224, 58, 104)"
    },
    "ods_11": {
        "name": "Ciudades y comunidades sostenible",
        "color": "rgb(244, 157, 63)"
    },
    "ods_12": {
        "name": "Producción y consumo responsables",
        "color": "rgb(191, 138, 50)"
    },
    "ods_13": {
        "name": "Acción por el clima",
        "color": "rgb(67, 126, 74)"
    },
    "ods_14": {
        "name": "Vida submarina",
        "color": "rgb(54, 150, 215)"
    },
    "ods_15": {
        "name": "Vida de ecosistemas terrestres",
        "color": "rgb(93, 184, 72)"
    },
    "ods_16": {
        "name": "Paz, justicia e instituciones sólidas",
        "color": "rgb(35, 105, 157)"
    },
    "ods_17": {
        "name": "Alianzas para lograr los objetivos",
        "color": "rgb(21, 71, 108)"
    }
};
var data = null;
var div_bar = d3.select("#bar");
var bounds_div_bar = div_bar.node().getBoundingClientRect();
margin_bar = { top: 30, right: 0, bottom: 30, left: 70 }
var div_width_bar = bounds_div_bar.width - margin_bar.left - margin_bar.right;
var div_height_bar = bounds_div_bar.height - 60;
var duration = 750;
var barStep = div_height_bar / 19;
barPadding = 3 / barStep;
x = d3.scaleLinear().range([margin_bar.left, div_width_bar - margin_bar.right])

function stagger() {
    let value = 0;
    return (d, i) => {
        const t = `translate(${x(value) - x(0)},${barStep * i})`;
        value += d.value;
        return t;
    };
}
function stack(i) {
    let value = 0;
    return d => {
        const t = `translate(${x(value) - x(0)},${barStep * i})`;
        value += d.value;
        return t;
    };
}
// Creates a set of bars for the given data node, at the specified index.
function bar(svg, down, d, selector) {
    const g = svg.insert("g", selector)
        .attr("class", "enter")
        .attr("transform", `translate(0,${margin_bar.top + barStep * barPadding})`)
        .attr("text-anchor", "end")
        .style("font", "10px sans-serif");

    const bar = g.selectAll("g")
        .data(d.children)
        .join("g")
        .attr("cursor", d => !d.children ? null : "pointer")
        
        .on("click", d => down(svg, d, odss_bar[d.data.name] != undefined ? odss_bar[d.data.name].color : "rgb(255,255,255)"));

    bar.append("text")
        .attr("x", margin_bar.left - 6)
        .attr("y", barStep * (1 - barPadding) / 2)
        .attr("dy", ".35em")
        .attr("fill", "white")
        .text(d => d.data.name);

    bar.append("rect")
        .attr("x", x(0))
        .attr("width", d => {
            //

            return x(d.value) - x(0)
        })
        .attr("height", barStep * (1 - barPadding));

    return g;
}


function down(svg_bar, d_param, color_ods) {
    //
    if (!d_param.children || d3.active(svg_bar.node())) return;

    // Rebind the current node to the background.
    svg_bar.select(".background").datum(d_param);

    // Define two sequenced transitions.
    var transition1 = svg_bar.transition().duration(duration);
    var transition2 = transition1.transition();

    // Mark any currently-displayed bars as exiting.
    const exit = svg_bar.selectAll(".enter")
        .attr("class", "exit");

    // Entering nodes immediately obscure the clicked-on bar, so hide it.
    exit.selectAll("rect")
        .attr("fill-opacity", p => p === d_param ? 0 : null);

    // Transition exiting bars to fade out.
    exit.transition(transition1)
        .attr("fill-opacity", 0)
        .remove();

    // Enter the new bars for the clicked-on data.
    // Per above, entering bars are immediately visible.
    const enter = bar(svg_bar, down, d_param, ".y-axis")
        .attr("fill-opacity", 0);

    // Have the text fade-in, even though the bars are visible.
    enter.transition(transition1)
        .attr("fill-opacity", 1);

    // Transition entering bars to their new y-position.
    enter.selectAll("g")
        .attr("transform", stack(d_param.index))
        .transition(transition1)
        .attr("transform", stagger());

    // Update the x-scale domain.
    //
    var max_en_down = d3.max(d_param.children, d => { return d.value });
    //
    x.domain([0, max_en_down]);

    // Update the x-axis.
    svg_bar.selectAll(".x-axis").transition(transition2)
        .call(xAxis);

    // Transition entering bars to the new x-scale.
    enter.selectAll("g").transition(transition2)
        .attr("transform", (d, i) => `translate(0,${barStep * i})`);

    // Color the bars as parents; they will fade to children if appropriate.
    enter.selectAll("rect")
        .attr("fill", color_bar(true))
        .attr("fill-opacity", 1)
        .transition(transition2)
        .attr("fill", d => odss_bar[d.data.name] != undefined ? odss_bar[d.data.name].color : color_ods || "rgb(255,255,255)")
        .attr("width", d => {
            //
            //
            return x(d.value) - x(0);
        });
}






function up(svg_bar, d_param) {
    //
    if (!d_param.parent || !svg_bar.selectAll(".exit").empty()) return;

    // Rebind the current node to the background.
    svg_bar.select(".background").datum(d_param.parent);

    // Define two sequenced transitions.
    const transition1 = svg_bar.transition().duration(duration);
    const transition2 = transition1.transition();

    // Mark any currently-displayed bars as exiting.
    const exit = svg_bar.selectAll(".enter")
        .attr("class", "exit");

    // Update the x-scale domain.
    //
    x.domain([0, d3.max(d_param.parent.children, d => d.value)]);

    // Update the x-axis.
    svg_bar.selectAll(".x-axis").transition(transition1)
        .call(xAxis);

    // Transition exiting bars to the new x-scale.
    exit.selectAll("g").transition(transition1)
        .attr("transform", stagger());

    // Transition exiting bars to the parent’s position.
    exit.selectAll("g").transition(transition2)
        .attr("transform", stack(d_param.index));

    // Transition exiting rects to the new scale and fade to parent color.
    exit.selectAll("rect").transition(transition1)
        .attr("width", d => {
            //

            return x(d.value) - x(0)
        })
        .attr("fill", color_bar(true));

    // Transition exiting text to fade out.
    // Remove exiting nodes.
    exit.transition(transition2)
        .attr("fill-opacity", 0)
        .remove();

    // Enter the new bars for the clicked-on data's parent.
    const enter = bar(svg_bar, down, d_param.parent, ".exit")
        .attr("fill-opacity", 0);

    enter.selectAll("g")
        .attr("transform", (d, i) => `translate(0,${barStep * i})`);

    // Transition entering bars to fade in over the full duration.
    enter.transition(transition2)
        .attr("fill-opacity", 1);

    // Color the bars as appropriate.
    // Exiting nodes will obscure the parent bar, so hide it.
    // Transition entering rects to the new x-scale.
    // When the entering parent rect is done, make it visible!
    enter.selectAll("rect")
    .attr("fill", d => odss_bar[d.data.name] != undefined ? odss_bar[d.data.name].color : "rgb(255,255,255)")
        .attr("fill-opacity", p => p === d_param ? 0 : null)
        .transition(transition2)
        .attr("width", d => {
            //

            return x(d.value) - x(0)
        })
        .on("end", function (p) { d3.select(this).attr("fill-opacity", 1); });
}


d3.json("https://raw.githubusercontent.com/whatevercamps/graph_jsons_tw_unfpa/master/sunburst.json").then(response => {


    dibujar_barritas(response)

})


function dibujar_barritas(data) {
    xAxis = g => g
        .attr("class", "x-axis axis")
        .attr("transform", `translate(0,${margin_bar.top})`)
        .call(d3.axisTop(x).ticks(div_width_bar / 80, "s"))
        .call(g => (g.selection ? g.selection() : g).select(".domain").remove())

    yAxis = g => g
        .attr("class", "y-axis axis")
        .attr("transform", `translate(${margin_bar.left + 0.5},0)`)
        .call(g => g.append("line")
            .attr("stroke", "#ffffff")
            .attr("y1", margin_bar.top)
            .attr("y2", div_height_bar - margin_bar.bottom))


    color_bar = d3.scaleOrdinal([true, false], ["steelblue", "#aaa"]);

    root = d3.hierarchy(data)
        .sum(d => d.value)
        .sort((a, b) => b.value - a.value)
        .eachAfter(d => d.index = d.parent ? d.parent.index = d.parent.index + 1 || 0 : 0)

    div_bar.select("svg").remove();
    const svg_bar = div_bar.append("svg").attr("width", div_width_bar).attr("height", div_height_bar).attr("id", "bar_svg");
    //
    x.domain([0, root.value]);

    svg_bar.append("rect")
        .attr("class", "background")
        .attr("fill", "none")
        .attr("pointer-events", "all")
        .attr("width", div_width_bar)
        .attr("height", div_height_bar)
        .attr("cursor", "pointer")
        .on("click", d => up(svg_bar, d));

    svg_bar.append("g")
        .call(xAxis);

    svg_bar.append("g")
        .call(yAxis);

    down(svg_bar, root);
}