// Smooth scrolling
$(function() {
    $('a[href*=#]').on('click', function(e) {
      e.preventDefault();
      $('html, body').animate({ scrollTop: $($(this).attr('href')).offset().top}, 500, 'linear');
    });
});
$(window).scroll(function() {
    if ($(this).scrollTop()>70)
    {
        $('.scrolldown').fadeOut();
    }
    else
    {
        $('.scrolldown').fadeIn();
    }
});
 
// Animate Freiburg Muenster skyline once its in view
var element = document.getElementById('skyline');
var elementHeight = element.clientHeight;
document.addEventListener('scroll', animate);
function inView() {
  var windowHeight = window.innerHeight;
  var scrollY = window.scrollY || window.pageYOffset;
  var scrollPosition = scrollY + windowHeight;
  var elementPosition = element.getBoundingClientRect().top + scrollY + elementHeight;
  if (scrollPosition > elementPosition) {
    return true;
  }
  return false;
}
 