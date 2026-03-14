let currentState = {
    xOption: 'CGPA',
    yOption: 'CGPA',
    facetOption: 'ExtracurricularActivities'
};

function draw_slider(column, min, max){
    slider = document.getElementById(column+'-slider')
    noUiSlider.create(slider, {
      start: [min, max],
      connect: false,
          tooltips: true,
      step: 1,
      range: {'min': min, 'max': max}
    });
    slider.noUiSlider.on('change', function(){
        update_plots(currentState.xOption, currentState.yOption, currentState.facetOption)
    });
}


function get_params(){
    var internships = document.getElementById("Internships-slider").noUiSlider.get().map(Number);
    var projects = document.getElementById("Projects-slider").noUiSlider.get().map(Number);
    var aptitudeTestScore = document.getElementById("AptitudeTestScore-slider").noUiSlider.get().map(Number);
    var softSkillsRating = document.getElementById("SoftSkillsRating-slider").noUiSlider.get().map(Number);
    var sscMarks = document.getElementById("SSC_Marks-slider").noUiSlider.get().map(Number);
    var hscMarks = document.getElementById("HSC_Marks-slider").noUiSlider.get().map(Number);

    return {
        'Internships': internships,
        'Projects': projects,
        'AptitudeTestScore': aptitudeTestScore,
        'SoftSkillsRating': softSkillsRating,
        'SSC_Marks': sscMarks,
        'HSC_Marks': hscMarks
    };
}

function draw_regression_line(data, svg, scale, color = "red") {
    svg.selectAll(".regression-line").remove();
    
    const regression = calculateLinearRegression(data);
    if (!regression) return;
    
    const { slope, intercept } = regression;
    
    const xMin = scale.x.domain()[0];
    const xMax = scale.x.domain()[1];
    
    const y1 = slope * xMin + intercept;
    const y2 = slope * xMax + intercept;
    
    svg.append("line")
        .attr("class", "regression-line")
        .attr("x1", scale.x(xMin))
        .attr("y1", scale.y(y1))
        .attr("x2", scale.x(xMax))
        .attr("y2", scale.y(y2))
        .attr("stroke", color)
        .attr("stroke-width", 2)
        .attr("opacity", 0.7);
}

function calculateLinearRegression(data) {
    const points = data.map(d => ({ x: d.x, y: d.y }));
    const n = points.length;
    
    const sumX = points.reduce((sum, p) => sum + p.x, 0);
    const sumY = points.reduce((sum, p) => sum + p.y, 0);
    const meanX = sumX / n;
    const meanY = sumY / n;
    
    let numerator = 0;
    let denominator = 0;
    
    points.forEach(p => {
        numerator += (p.x - meanX) * (p.y - meanY);
        denominator += (p.x - meanX) ** 2;
    });
    
    const slope = numerator / denominator;
    const intercept = meanY - slope * meanX;
    
    return { slope, intercept };
}

function draw_svg(container_id, margin, width, height){
    svg = d3.select("#"+container_id)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .style("background-color", "#EBEBEB")
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    return svg
}

function draw_axes(plot_name, svg, width, height, domainx, domainy){
    var x_scale = draw_axis(plot_name, 'x', svg, height, domainx, [0, width])
    var y_scale = draw_axis(plot_name, 'y', svg, height, domainy, [height, 0])
    return {'x': x_scale, 'y': y_scale}
}


function draw_axis(plot_name, axis, svg, height, domain, range)
{ 
    var scale = d3.scaleLinear()
                  .domain(domain)
                  .range(range); 
    if (axis == 'x') draw_xaxis(plot_name, svg, height, scale); 
    else if (axis == 'y') draw_yaxis(plot_name, svg, scale); 

    return scale; 
}

function draw_xaxis(plot_name, svg, height, scale){
    svg.append("g")
        .attr('class', plot_name + "-xaxis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(scale).tickSize(0))
}

function draw_yaxis(plot_name, svg, scale){
    svg.append("g")
        .attr('class', plot_name + "-yaxis")
        .call(d3.axisLeft(scale));
}

function draw_xTitle(svg, width, height)
{ 
     return svg.append("text")
       .attr("class", "title")
       .attr("text-anchor", "end")
       .attr("x", width - margin.right)
       .attr("y", height + 43); 
}

function draw_yTitle(svg, width, height)
{ 
    return svg.append("text")
        .attr("class", "title")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("x", -height/2)
        .attr("y", -40);
}

function draw_chartTitle(svg, width, height)
{ 
    return svg.append("text")
        .attr("class", "title")
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("text-decoration", "underline")
        .attr("x", width/2)
        .attr("y", -10); 
}

function draw_scatter(data, svg, scale){
     svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cy", d => scale.y(d.y + (Math.random() - 0.5) * 0.1))
        .attr("cx", d => scale.x(d.x + (Math.random() - 0.5) * 0.1))
        .attr("r", 4)
        .attr("opacity", 0.8)
        .attr("fill", "#1D78B4"); 
}

function update_dropdown(value, type){

    currentState[type] = value

    update_plots(
        currentState.xOption,
        currentState.yOption,
        currentState.facetOption
    )
}

// function that removes the old data points and redraws the scatterplot
function update_scatter(data, svg, scale){
    svg.selectAll("circle").remove();
    draw_scatter(data, svg, scale);
}

// Add this function
function get_bool_filters() {
    const boolFilters = {};
    
    const extracurricular = document.querySelector('input[name="ExtracurricularActivities"]:checked');
    if (extracurricular) {
        boolFilters['ExtracurricularActivities'] = extracurricular.value;
    }
    
    const placement = document.querySelector('input[name="PlacementTraining"]:checked');
    if (placement) {
        boolFilters['PlacementTraining'] = placement.value;
    }
    
    return boolFilters;
}

// Update your update_plots function
// Update your update_plots function - replace the existing one with this
function update_plots(xOption, yOption, facetOption){
    params = get_params(); 
    boolFilters = get_bool_filters();  // Get boolean values

    fetch("/update_scatter", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            params: params, 
            boolFilters: boolFilters,  // Include boolean filters
            xOption: xOption,
            yOption: yOption,
            facetOption: facetOption
        })
    })
    .then(res => res.json())
    .then(result => {
        const data = result.data
        console.log("Bool filters:", boolFilters);  // For debugging
        console.log("Data received:", data);

        // split by facet
        const facetValues = [...new Set(data.map(d => d.facet))]

        // Handle case where there's only one facet value
        const plot1 = data.filter(d => d.facet === facetValues[0])
        const plot2 = facetValues.length > 1 ? data.filter(d => d.facet === facetValues[1]) : []
        
        // update titles 
        xTitle1.text(result.x_column)
        xTitle2.text(result.x_column)
        yTitle1.text(result.y_column)
        yTitle2.text(result.y_column)
        title1.text(facetOption + ": " + (facetValues[0] || "None"))
        title2.text(facetOption + ": " + (facetValues[1] || "None"))

        // compute new domains
        const xDomain = d3.extent(data, d => d.x); 
        const yDomain = d3.extent(data, d => d.y); 

        // Handle empty data
        if (xDomain[0] === undefined || yDomain[0] === undefined) {
            console.log("No data for current filters");
            return;
        }

        // update scales
        scatter1_scale.x.domain([Math.max(0, xDomain[0] - 0.5), xDomain[1] + 0.5]).nice(); 
        scatter1_scale.y.domain([Math.max(0, yDomain[0] - 0.5), yDomain[1] + 0.5]).nice(); 
        scatter2_scale.x.domain([Math.max(0, xDomain[0] - 0.5), xDomain[1] + 0.5]).nice(); 
        scatter2_scale.y.domain([Math.max(0, yDomain[0] - 0.5), yDomain[1] + 0.5]).nice(); 

        // update ticks 
        const xTicks1 = scatter1_scale.x.ticks().filter(Number.isInteger); 
        const yTicks1 = scatter1_scale.y.ticks().filter(Number.isInteger);
        const xTicks2 = scatter2_scale.x.ticks().filter(Number.isInteger); 
        const yTicks2 = scatter2_scale.y.ticks().filter(Number.isInteger);  

        // update axes
        scatter1_svg.select(".scatter1-xaxis").call(d3.axisBottom(scatter1_scale.x).tickValues(xTicks1));
        scatter1_svg.select(".scatter1-yaxis").call(d3.axisLeft(scatter1_scale.y).tickValues(yTicks1));
        scatter2_svg.select(".scatter2-xaxis").call(d3.axisBottom(scatter2_scale.x).tickValues(xTicks2));
        scatter2_svg.select(".scatter2-yaxis").call(d3.axisLeft(scatter2_scale.y).tickValues(yTicks2));

        // redraw points
        update_scatter(plot1, scatter1_svg, scatter1_scale); 
        if (plot2.length > 0) {
            update_scatter(plot2, scatter2_svg, scatter2_scale); 
        } else {
            // Clear second plot if no data
            scatter2_svg.selectAll("circle").remove();
        }

        // update regression line
        if (plot1.length > 0) {
            draw_regression_line(plot1, scatter1_svg, scatter1_scale, "red");
        }
        if (plot2.length > 0) {
            draw_regression_line(plot2, scatter2_svg, scatter2_scale, "red");
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// Add this at the end of your script
document.addEventListener('DOMContentLoaded', function() {
    // Add change event listeners to boolean radio buttons
    document.querySelectorAll('input[name="ExtracurricularActivities"], input[name="PlacementTraining"]').forEach(radio => {
        radio.addEventListener('change', function() {
            update_plots(
                currentState.xOption,
                currentState.yOption,
                currentState.facetOption
            );
        });
    });
});