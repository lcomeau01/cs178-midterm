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