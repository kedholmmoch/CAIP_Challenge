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
  
    const chart = svg.append('g').attr(
      'transform', `translate(${marginLeft}, ${marginTop})`
    );

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
    
    // creating stacked data

    // let stackdata = ["viewCount", "likeCount"]


    // creating x- and y- axes
    const maxDomain = function(array) {
      let totals = array.map(obj => obj.viewCount + obj.likeCount);
      console.log(totals);
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
      .ticks(13);

    chart.append('g')
        .attr('transform', `translate(0, ${chartHeight})`)
        .call(xAxis)
      .selectAll(".tick text")
        .attr("y", 12)
        .attr("x", 2)
        .attr("transform", "rotate(-9)")
        .style("text-anchor", "end");

    chart.append('g').call(yAxis);

    console.log(data);

    svg.selectAll(".bar")
      .data(data)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function (d) { return x(d.title) + marginLeft; })
      .attr("width", x.bandwidth())
      .attr("y", function (d) { return y(d.viewCount) + marginTop; })
      .attr("height", function (d) { return chartHeight - y(d.viewCount); });

  });

});