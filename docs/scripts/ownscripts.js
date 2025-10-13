// Smooth scrolling
$(function() {
    // Match anchors with a hash (use quoted attribute value to avoid selector errors)
    $('a[href*="#"]').on('click', function(e) {
      var target = $(this).attr('href');
      // If it's just a hash and the target element exists on the page, do smooth scroll
      if (target && target.indexOf('#') === 0 && $(target).length) {
        e.preventDefault();
        $('html, body').animate({ scrollTop: $($(this).attr('href')).offset().top}, 500, 'linear');
      }
      // otherwise let the browser handle it (external links or missing targets)
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
 