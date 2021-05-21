var inited = false

function isScrolledIntoView(elem) {
  var docViewTop = $(window).scrollTop();
  var docViewBottom = docViewTop + $(window).height();

  var elemTop = $(elem).offset().top;
  var elemBottom = elemTop - $(elem).height();

  return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
}

function init() {
  new Vue({
    el: '#muenster'
  })
}

$(window).on('scroll', function() {
  if ( inited ) {
    return
  }
  
  if (isScrolledIntoView(skyline)) {
    inited = true
    init()
  }
  
})

