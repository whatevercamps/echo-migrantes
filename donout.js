var svg = d3.select("#svg-donout")
    .append("svg")
    .attr("id", "donout")
    .append("g")
    

svg.append("g")
    .attr("class", "slices");
svg.append("g")
    .attr("class", "labelName");
svg.append("g")
    .attr("class", "labelValue");
svg.append("g")
    .attr("class", "lines");

var width = 960,
    height = 400,
    radius = Math.min(width, height) / 2;

var pie = d3.pie()
    .sort(null)
    .value(function (d) {
        return d.value;
    });

var arc = d3.arc()
    .outerRadius(radius * 0.8)
    .innerRadius(radius * 0.4);

var outerArc = d3.arc()
    .innerRadius(radius * 0.9)
    .outerRadius(radius * 0.9);

var legendRectSize = (radius * 0.05);
var legendSpacing = radius * 0.02;


var div = d3.select("body").append("div").attr("class", "toolTip");

svg.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

var colorRange = d3.scaleOrdinal(d3.schemeCategory10);
var color = d3.scaleOrdinal()
    .range(colorRange.range());


d3.selectAll("#next")
    .on("click", next);

d3.selectAll("#prev")
    .on("click", prev);

function next() {
    let n = donoutsData.length;
    index=(index+1)%n;

    action(donoutsData[index]);
}

function prev() {
    let n = donoutsData.length;
    index=(index-1) & (n - 1)

    action(donoutsData[index]);
}

function change(data) {

    /* ------- PIE SLICES -------*/
    
    var slice = svg.select(".slices").selectAll("path.slice")
        .data(pie(data), function (d) { return d.data.label });

    slice.enter()
        .insert("path")
        .style("fill", function (d) { return color(d.data.label); })
        .attr("class", "slice");

    slice
        .transition().duration(1000)
        .attrTween("d", function (d) {
            this._current = this._current || d;
            var interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function (t) {
                return arc(interpolate(t));
            };
        })
    slice
        .on("mousemove", function (d) {
            div.style("left", d3.event.pageX + 10 + "px");
            div.style("top", d3.event.pageY - 25 + "px");
            div.style("display", "inline-block");
            div.html((d.data.label) + "<br>" + (d.data.value));
        });
    slice
        .on("mouseout", function (d) {
            div.style("display", "none");
        });

    slice.exit()
        .remove();


    /* ------- TEXT LABELS -------*/

    var text = svg.select(".labelName").selectAll("text")
        .data(pie(data), function (d) { return d.data.label });

    text.enter()
        .append("text")
        .attr("dy", ".35em")
        .text(function (d) {
            let per = d.data.percentage.toFixed(3);
            return (d.data.label + "+ " + per + "%");
        });

    function midAngle(d) {
        return d.startAngle + (d.endAngle - d.startAngle) / 2;
    }

    text
        .transition().duration(1000)
        .attrTween("transform", function (d) {
            this._current = this._current || d;
            var interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function (t) {
                var d2 = interpolate(t);
                var pos = outerArc.centroid(d2);
                pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
                return "translate(" + pos + ")";
            };
        })
        .styleTween("text-anchor", function (d) {
            this._current = this._current || d;
            var interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function (t) {
                var d2 = interpolate(t);
                return midAngle(d2) < Math.PI ? "start" : "end";
            };
        })
        .text(function (d) {
            let per = d.data.percentage.toFixed(3)*100;
            return (d.data.label + ": " + per.toFixed(1) + "%");
        });


    text.exit()
        .remove();

    /* ------- SLICE TO TEXT POLYLINES -------*/

    var polyline = svg.select(".lines").selectAll("polyline")
        .data(pie(data), function (d) { return d.data.label });

    polyline.enter()
        .append("polyline");

    polyline.transition().duration(1000)
        .attrTween("points", function (d) {
            this._current = this._current || d;
            var interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function (t) {
                var d2 = interpolate(t);
                var pos = outerArc.centroid(d2);
                pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
                return [arc.centroid(d2), outerArc.centroid(d2), pos];
            };
        });

    polyline.exit()
        .remove();
};

function action(data){
    d3.select("#titulo-donout").text(data.name);
    change(data.data);
    change(data.data);
}
var donoutsData;
var index=0;
postData(urlBack+'openQuestions', {"sexos":["Hombre","Mujer"],"edades":["jovenes","adultos","mayores"],"respuesta":[0]})
	.then(function (data) {
        donoutsData = data;
		action(data[index]);
	})
