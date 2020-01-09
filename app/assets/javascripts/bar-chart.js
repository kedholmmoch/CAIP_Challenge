$( () => {

  // creating 960 x 525 svg area
  const width = 960;
  const height = 525;

  // margins
  const marginTop = 30;
  const marginBottom = 101;
  const marginLeft = 59;
  const marginRight = 72;
  
  // chart area
  const chartHeight = 525 - marginTop - marginBottom;
  const chartWidth = 960 - marginLeft - marginRight;  
  
  // Creating SVG / Gathering data once 'Graph' tab is clicked
  const $tabTwo = $("div[target='#page2']");
  
  $tabTwo.on('click', function() {

    // remove previous SVG if moving btwn tabs & changing search params
    let svg = d3.select('svg');
    if (svg) svg.remove();  

    svg = d3.select('#svg__container').append("svg");

    svg.attr('width', width);
    svg.attr('height', height);
  
    const chart = svg.append('g')
      .attr("class", "chart")
      .attr('transform', `translate(${marginLeft}, ${marginTop})`);

    // gathering data
    var data = [];
    const $videos = $('.result__item');

    // only grab info from videos that are currently filtered
    $videos.each((_, video) => {
      const $video = $(video);

      // some titles are too long, abbreviate w/ ellipsis
      const trimVideoTitle = function(title) {
        let words = title.split(" ");
        if (words.length > 6) {
          words = words.splice(0, 5).concat(["..."]);
        }
        return words.join(" ");
      }

      if (!$video.hasClass('hidden')) {
        let obj = {};

        obj.title = trimVideoTitle($video.find('.result__title').text().trim());
        obj.viewCount = parseInt($video.find('.view__count .basetext').text());
        obj.likeCount = parseInt($video.find('.like__count .basetext').text());

        data.push(obj);
      }
    });

    // creating x- and y- axes
    const maxDomain = function(array) {
      let totals = array.map(obj => obj.viewCount + obj.likeCount);
      return Math.max(...totals);
    }

    var x = d3.scaleBand()
      .range([0, chartWidth])
      .padding(0.5205)
      .domain(data.map(obj => obj.title))

    var y = d3.scaleLinear()
      .range([chartHeight, 0])
      .domain([0, maxDomain(data)]);

    var xAxis = d3.axisBottom(x);
    var yAxis = d3.axisLeft(y)

    chart.append('g')
        .attr('transform', `translate(0, ${chartHeight})`)
        .call(xAxis)
      .selectAll(".tick text")
        .attr("y", 12)
        .attr("x", 2)
        .attr("transform", "rotate(-9)")
        .style("text-anchor", "end");

    chart.append('g').call(yAxis);


    // hovering div
    var div = d3.select("#svg__container")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

    // creating views bars
    svg.selectAll(".views__bar")
      .data(data)
      .enter().append("rect")
      .style("fill", "#64AEFF")
      .attr("class", "views__bar")
      .attr("x", function (d) { return x(d.title) + marginLeft; })
      .attr("width", x.bandwidth())
      .attr("y", function (d) { return y(d.viewCount) + marginTop; })
      .attr("height", function (d) { return chartHeight - y(d.viewCount); })
      .attr("datamsg", function (d) { 
        return `Views: ${ d.viewCount }<br/>Likes: ${ d.likeCount }`
      })
      .on("mouseover", function(d, i) {
        d3.select(this).transition()
          .duration(100)
          .attr('opacity', '.95')

        let msg = d3.select(this).attr('datamsg');

        div.html(msg)
          .style("left", `${d3.event.pageX - 220}px`)
          .style("top", `${d3.event.pageY - 390}px`);
        div.transition()
          .duration(50)
          .style("opacity", .8);
      })
      .on('mouseout', function (d, i) {
        d3.select(this).transition()
          .duration('50')
          .attr('opacity', '1');

        div.transition()
          .duration('50')
          .style("opacity", 0);
      });

    // creating likes bars
    svg.selectAll(".likes__bar")
      .data(data)
      .enter().append("rect")
      .style("fill", "#AED5FF")
      .attr("class", "likes__bar")
      .attr("x", function (d) { return x(d.title) + marginLeft; })
      .attr("width", x.bandwidth())
      .attr("y", function (d) { return marginTop + y(d.viewCount); })
      .attr("height", function (d) { return chartHeight - y(d.likeCount); })
      .attr("datamsg", function (d) { 
        return `Views: ${ d.viewCount }<br/>Likes: ${ d.likeCount }`
      })
      .on("mouseover", function (d, i) {
        d3.select(this).transition()
          .duration(100)
          .attr('opacity', '.95')

        let msg = d3.select(this).attr('datamsg');

        div.html(msg)
          .style("left", `${d3.event.pageX - 220}px`)
          .style("top", `${d3.event.pageY - 390}px`);
        div.transition()
          .duration(50)
          .style("opacity", .8);
      })
      .on('mouseout', function (d, i) {
        d3.select(this).transition()
          .duration('50')
          .attr('opacity', '1');

        div.transition()
          .duration('50')
          .style("opacity", 0);
      });

    
    // horizontal grid lines for effect
    chart.append('g')
      .attr("class", "grid")
      .call(d3.axisLeft()
        .scale(y)
        .tickSize(-chartWidth, 0, 0)
        .tickFormat(''));

    // draw legend
    let legend = svg.selectAll(".legend")
      .data(["#64AEFF", "#AED5FF"])
      .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function (d, i) { return `translate(${(i * 126)}, 0)`});

    legend.append("rect")
      .attr("x", 351)
      .attr("y", chartHeight + marginTop + 64)
      .attr("width", 20)
      .attr("height", 20)
      .style("fill", function (d, i) { return ["#64AEFF", "#AED5FF"][i]; });

    legend.append("text")
      .attr("x", 351 + 20 + 5)
      .attr("class", "basetext")
      .attr("y", chartHeight + marginTop + 75)
      .attr("dy", ".35em")
      .style("text-anchor", "start")
      .text(function (d, i) {
        switch (i) {
          case 0: return "View Count";
          case 1: return "Like Count";
        }
      });
    
  });

});