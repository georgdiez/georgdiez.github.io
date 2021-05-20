var inited = false

function init() {
  new Vue({
    el: '#muenster'
  })
}

$(window).on('scroll', function() {
  if ( inited ) {
    return
  }
  
  if ( skyline.offsetTop >= window.innerHeight + document.body.scrollTop ) {
    inited = true
    init()
  }
  
})

