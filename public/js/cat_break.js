$(document).ready(function() {
  $.ajax({
    url: (`http://thecatapi.com/api/images/get?format=xml&results_per_page=1`),
    dataType: 'text',
    success(data) {
      console.log(`url(${$(data).find('url')[0].innerHTML})`);
      document.getElementById('cat').src = $(data).find('url')[0].innerHTML;
    }
  });

  const getNewCat = function() {
    $.ajax({
      url: (`http://thecatapi.com/api/images/get?format=xml&results_per_page=1`),
      dataType: 'text',
      success(data) {
        document.getElementById('cat').src = $(data).find('url')[0].innerHTML;
      }
    });
  };

  $('#new_cat').click(getNewCat);
});
