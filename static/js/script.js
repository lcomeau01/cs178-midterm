function draw_slider(column, min, max){
    slider = document.getElementById(column+'-slider')
    noUiSlider.create(slider, {
      start: [min, max],
      connect: false,
          tooltips: true,
      step: 1,
      range: {'min': min, 'max': max}
    });
    // slider.noUiSlider.on('change', function(){
    //     update(scatter_svg, bar_svg, scatter_scale, bar_scale)
    // });
}

function draw_svg(container_id, margin, width, height){
    svg = d3.select("#"+container_id)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .style("background-color", "#dbdad7")
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    return svg
}

function update_dropdown(value, type){

    state[type] = value

    update_plots(
        state.xOption,
        state.yOption,
        state.facetOption
    )
}


function update_plots(xOption, yOption, facetOption){

    fetch("/update_plot", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            xOption: xOption,
            yOption: yOption,
            facetOption: facetOption
        })
    })
    .then(res => res.json())
    .then(result => {

        const data = result.data

        const facetValues = [...new Set(data.map(d => d.facet))]

        const plot1 = data.filter(d => d.facet === facetValues[0])
        const plot2 = data.filter(d => d.facet === facetValues[1])

        draw_scatter("#scatter1", plot1)
        draw_scatter("#scatter2", plot2)

    })
}