// JS-File to create the heatmap_plot
var marginHeatmap = {top: 20, right: 10, bottom: 130, left: 310},
    width = 980 - marginHeatmap.left - marginHeatmap.right,
    height = 600 - marginHeatmap.top - marginHeatmap.bottom;

// create an svg object and append it to div "#heatmap_plot"
var svgHeatmap = d3.select("#heatmap_plot")
    .append("svg")
    .attr("width", width + marginHeatmap.left + marginHeatmap.right)
    .attr("height", height + marginHeatmap.top + marginHeatmap.bottom)
    .append("g")
    .attr("transform",
        "translate(" + marginHeatmap.left + "," + marginHeatmap.top + ")");

//create tooltip box
var tooltip = d3.select("#heatmap_plot")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("color", HIGHLIGHT_COLOR)
    .style("padding", "5px")
    .style("margin-left", marginHeatmap.left.toString() + "px")
    .style("margin-right", marginHeatmap.right.toString() + "px");

// function to create the plot, is called in index.html
function createHeatmap(bli_data) {
    // create a list of all countries from bli_data
    var countries = [];
    for (var entry of bli_data) {
        countries.push(entry[COUNTRY_KEY]);
    }

    // create a list of all categories from bli_data
    var bli_categories = [];
    bli_categories = Object.keys(bli_data[0]);
    bli_categories.shift();     //remove the first element 'country'
    bli_categories = pretty_format_list(bli_categories);    //remove all '_' to make the categories more readable

    var x = d3.scaleBand()
        .range([0, width])
        .domain(countries)
        .padding(0.01);

    svgHeatmap.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("class", "axis")
        .attr("transform", "rotate(-65)");



// Build X scales and axis:
    var y = d3.scaleBand()
        .range([height, 0])
        .domain(bli_categories)
        .padding(0.01);

    svgHeatmap.append("g")
        .call(d3.axisLeft(y))
        .attr("class", "axis");

    // map data to a tabular form for each category/country combination
    flatData = flat_map_data(bli_data);
    svgHeatmap.selectAll()
        .data(flatData, function (d) {
            return d.group + ':' + d.variable;
        })
        .enter()
        .append("rect")
        .attr("x", function (d) {
            return x(d.group)
        })
        .attr("y", function (d) {
            return y(d.variable)
        })
        .attr("width", x.bandwidth())
        .attr("height", y.bandwidth())
        .style("fill", function (d) {
            return colorMap(d.scaled_value)
        })
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave);

    //Add vertical highlight-frame for heatmap
    svgHeatmap.append('rect')
        .attr("id", "selection_column")
        .attr("width", x.bandwidth())
        .attr("height", height)
        .attr("x", 0)
        .attr("y", 0)
        .attr("opacity", 1)
        .attr("stroke", HIGHLIGHT_COLOR)
        .attr("stroke-width", 2)
        .style("fill", "none");

    //Add horizontal highlight-frame for heatmap
    svgHeatmap
        .append("rect")
        .style("opacity", 1)
        .attr("id", "selection_row")
        .attr("width", width)
        .attr("height", y.bandwidth())
        .attr("x", 0)
        .attr("y", 0)
        .attr("stroke", HIGHLIGHT_COLOR)
        .attr("stroke-width", 2)
        .style("fill", "none");
}

function flat_map_data(nested_data){
    flatList = [];
    for (var entry of nested_data) {
        var country = entry[COUNTRY_KEY]
        for (var key of Object.keys(entry)) {
            pretty_key = pretty_format(key)
            flatList.push({
                "group": country,
                "variable": pretty_key,
                "scaled_value": entry[key][SCALED_KEY],
                "actual_value": entry[key][ACTUAL_KEY]
            })
        }
    }
    return flatList;
}

function pretty_format_list(unformattedList) {
    tempList = [];
    for (var key of unformattedList) {
        tempList.push(pretty_format(key));
    }
    return tempList;
}

function pretty_format(unformatedStr) {
    return unformatedStr.replaceAll("_", " ");
}

function get_all_color_values_by_cat(cat_key) {
    color_data = {};
    for (var entry of bli_data) {
        color_data[entry[COUNTRY_KEY]] = entry[cat_key];
    }
    return color_data;
}

var mouseover = function (d) {
    const color_map = get_all_color_values_by_cat(d.variable.replaceAll(" ", "_"));
    const country = d.group;
    updateScatterPlotColors(color_map, country);
    d3.select("#selection_column").attr("x", d3.select(this).attr("x"));
    d3.select("#selection_row").attr("y", d3.select(this).attr("y"));

    tooltip.style("opacity", 1);
}
var mousemove = function (d) {
    d3.select("#selection_column").attr("x", d3.select(this).attr("x"));
    d3.select("#selection_row").attr("y", d3.select(this).attr("y"));
    tooltip
        .html("<strong>" + d.group + ":</strong><br>" + d.variable + ": " + d.actual_value)
        .style("left", (d3.mouse(this)[0] + 70) + "px")
        .style("top", (d3.mouse(this)[1]) + "px");
}
var mouseleave = function (d) {
    tooltip.style("opacity", 0);
    removeStrokeHighlight();
}