$( () => {

  // function to show all results upon filter reset -- called in filterResults
  const showAllResults = function() {

    let $videos = $('.result__item');

    $videos.each((_, video) => {
      const $video = $(video);
      if ($video.hasClass('hidden')) $video.removeClass('hidden');
    });
  };

  // callback to filter results upon clicking 'Search' or hitting enter
  const filterResults = function(query) {

    let $videos = $('.result__item');
    showAllResults();                       // remove previous filters
    
    if (query === '') return;               // no filter, show all

    let queryTerms = query.toLowerCase().split(" ");

    // cb to test a single term's presence in video info in below each loop
    const containsQuery = function(video, queryTerm) {
      const $title = $(video).find('.result__title').text().toLowerCase();
      if ($title.includes(queryTerm)) return true;

      const $tags = $(video).find('.tags__list .basetext').text().toLowerCase();
      if ($tags.includes(queryTerm)) return true;

      const $description = $(video)
        .find('.description__container .basetext').text().toLowerCase();
      if ($description.includes(queryTerm)) return true;

      return false;
    }
    
    // hide videos that do not contains all search terms
    $videos.each((_, video) => {
      if (queryTerms.some(queryTerm => !containsQuery(video, queryTerm))) {
        $(video).addClass('hidden');
      }
    });
  }
  
  // grabbing html elements for jquery variables
  const $searchBar = $('#query');
  const $searchDisplay = $('#search__display');

  const $resetButton = $('#reset');
  const $searchButton = $('#submit');

  // event handler syncing display text with search bar text
  $searchBar.on('input', () => {
    let query = $searchBar.val()
    $searchDisplay.text(query);
  });

  // event handler to clear search bar and restore results upon clicking 'Reset'
  $resetButton.on('click', (event) => {
    event.preventDefault();
    $searchBar.val('');
    $searchDisplay.text('');
    showAllResults();
  });

  // event handler to filter results on clicking 'Search'
  $searchButton.on('click', (event) => {
    event.preventDefault();
    let query = $searchBar.val();
    filterResults(query);
  });

  // event handler to filter results upon hitting enter in text input area
  $searchBar.on('keypress', (event) => {
    if (event.keyCode === 13) {
      event.preventDefault();
      let query = $searchBar.val();
      filterResults(query);
    }    
  });

});