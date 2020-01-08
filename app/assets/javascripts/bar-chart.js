$( () => {

  // creating 960 x 525 svg area
  const width = 960;
  const height = 525;

  const svg = d3.select('svg');
  svg.attr('width', width);
  svg.attr('height', height);

  // margins
  const marginTop = 30;
  const marginBottom = 101;
  const marginLeft = 59;
  const marginRight = 72;

  // chart area
  const chartHeight = 525 - marginTop - marginBottom;
  const chartWidth = 960 - marginLeft - marginRight;  

  const chart = svg.append('g').attr(
    'transform', `translate(${marginLeft}, ${marginTop})`
  );

  // .attr('width', chartWidth)
  // .attr('height', chartHeight);


  // Gathering data for the chart once the 'Graph' tab is clicked on
  const $tabTwo = $("div[target='#page2']");
  
  $tabTwo.on('click', function() {
    var data = [];
    const $videos = $('.result__item');

    // only grab info from videos that are currently filtered
    $videos.each((_, video) => {
      const $video = $(video);
      if (!$video.hasClass('hidden')) {
        let obj = {};

        obj.title = $video.find('.result__title').text().trim();
        obj.viewCount = parseInt($video.find('.view__count .basetext').text());
        obj.likeCount = parseInt($video.find('.like__count .basetext').text());

        data.push(obj);
      }
    });
    
    console.log(data);
    
    // creating x- and y- axes
    const maxDomain = function(array) {
      let totals = array.map(obj => obj.viewCount + obj.likeCount);
      return Math.max(...totals);
    }

    const yScale = d3.scaleLinear()
      .range([chartHeight, 0]).domain([0, maxDomain]);

    chart.append('g').call(d3.axisLeft(yScale));

    const xScale = d3.scaleBand()
      .range([0, chartWidth])
      .domain(data.map(obj => obj.title))
      .padding(0.9167);

    chart.append('g')
      .attr('transform', `translate(0, ${chartHeight})`)
      .call(d3.axisBottom(xScale));

      console.log(x.rangeBand());

    d3.select("text").each(text => {
      var text = d3.select(this);
      text.attr('max-width', '120px')
        .attr('overflow-wrap', 'break-word');
    })

  });




});