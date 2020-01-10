$( () => {  
  
  // callback to close addt'l info on clocking chevron
  const closeAccordion = function (description, chevron) {

    description.removeClass('displayed');
    chevron.removeClass('rotated');

    event.stopPropagation();
  };

  // callback to open addt'l info when line item clicked
  const openAccordion = function () {

    const $displayed = $(event.currentTarget).find('.displayed');

    if ($displayed) {
      $displayed.removeClass('displayed');
      $displayed.parent().find('.chevron').removeClass('rotated');
    }

    const $description = $(this).find('.result__addition');
    const $chevron = $(this).find('.chevron');

    $description.addClass("displayed");
    $chevron.addClass("rotated");

    $(this).on(
      'click', 
      '.chevron', 
      closeAccordion.bind(event, $description, $chevron)
    );
  };
  
  // main event handler to open addt'l info when line item is clicked
  $('#search__results').on('click', '.result__item', openAccordion);
});