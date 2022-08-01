// JS-File to create the scatter_plot
var marginScatter = {top: 20, right: 20, bottom: 130, left: 10},
    width_scatter = 480 - marginScatter.left - marginScatter.right,
    height_scatter = 480 - marginScatter.top - marginScatter.bottom;

// create an svg object and append it to div "#scatter_plot"
var svgScatter = d3.select("#scatter_plot")
    .append("svg")
    .attr("width", width_scatter + marginScatter.left + marginScatter.right)
    .attr("height", height_scatter + marginScatter.top + marginScatter.bottom)
    .append("g")
    .attr("transform",
        "translate(" + marginScatter.left + "," + marginScatter.top + ")");

// function to create the plot, is called in index.html
function createScatterplot(data) {

     svgScatter.append("g")
        .attr("transform", "translate(0," + height_scatter + ")");

    //add x axis with correct range
    var x_scatter = d3.scaleLinear()
        .domain([-4.3, 6.6])
        .range([0, width_scatter]);

    //add y axis with correct range
    var y_scatter = d3.scaleLinear()
        .domain([-4, 4])
        .range([height_scatter, 0]);


    //create scatter plot with mouseover and standard color
    svgScatter.append('g')
        .selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function (d) {
            return x_scatter(d.x);
        })
        .attr("cy", function (d) {
            return y_scatter(d.y);
        })
        .attr("r", 5.5)
        .style("fill", "#dbdcdb")
        .on("mouseover", onMouseover)
        .on("mouseleave", onMouseout);
}

function onMouseover(element) {
    offset_data = get_heatmap_offset_by_country(width);
    d3.select(this).style('stroke', HIGHLIGHT_COLOR).style("stroke-width", HIGHLIGHT_STROKE_WIDTH);
    d3.select("#selection_column").attr("x", offset_data[element[COUNTRY_KEY]]);
}

function onMouseout(element) {
    d3.select(this).style('stroke', '#ffffff').style("stroke-width", 1);
}


function updateScatterPlotColors(color_map, country) {
    d3.select("#scatter_plot").selectAll("circle")
        .style("fill", function (d) {
            return colorMap(color_map[d[COUNTRY_KEY]].scaled)
        })
        .style('stroke', function (d) {
            if (d[COUNTRY_KEY] === country) {
                return HIGHLIGHT_COLOR;
            }
            return '#ffffff';
        })
        .style("stroke-width", HIGHLIGHT_STROKE_WIDTH);
}

function removeStrokeHighlight() {
    d3.select("#scatter_plot").selectAll("circle").style('stroke', '#ffffff');
}

function get_heatmap_offset_by_country(cell_width) {
    offset_data = {};
    w = cell_width / bli_data.length;
    index = 0;
    for (var entry of bli_data) {
        offset_data[entry[COUNTRY_KEY]] = index * w;
        index++;
    }
    return offset_data;
}