const div_pie = d3.select("#pie");
const bounds_div_burb = div_pie.node().getBoundingClientRect();
const width_col_pie = bounds_div_burb.width;
const height_col_pie = bounds_div_burb.height;
const dataset = ({ 'A': 35, 'B': 30, 'C': 25, 'D': 20, 'E': 15, 'F': 10 });
color = d3.scaleOrdinal()
.domain(dataset)
.range(['#F1892D', '#0EAC51', '#0077C0', '#7E349D', '#DA3C78', '#E74C3C']);
//creamos pie 
const pie = d3.pie()
    .value((d) => d.value);


const arc = d3.arc()
    .innerRadius(0)
    .outerRadius(d3.min([width_col_pie,height_col_pie], x => x)/2 - 20);


grupito = div_pie.append("svg").attr("width", width_col_pie).attr("height", height_col_pie).attr("id", "burbujas_svg");

const g_pie = grupito.append('g')
    .attr('transform', 'translate(' + width_col_pie / 2 + ',' + height_col_pie / 2 + ') scale(' + 0.8 + ')');

const part = g_pie.selectAll('.part')
    .data(pie(d3.entries(dataset)))
    .enter()
    .append('g');
part.append('path')
    .attr('d', arc)
    .attr('fill', (d, i) => color(i));
part.append("text")
    .attr('transform', (d) => 'translate(' + arc.centroid(d) + ')')
    .text((d) => d.data.key)
    .attr('fill', 'white');


