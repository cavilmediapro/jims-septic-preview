(function(){
  var m=document.querySelector('.menu'), n=document.getElementById('nav');
  if(m&&n){m.addEventListener('click',function(){
    var o=n.classList.toggle('open');
    m.setAttribute('aria-expanded',o?'true':'false');
    m.textContent=o?'Close':'Menu';
    document.body.style.overflow=o?'hidden':'';
  });}
  var els=[].slice.call(document.querySelectorAll('.up'));
  if(!('IntersectionObserver' in window)||window.matchMedia('(prefers-reduced-motion:reduce)').matches){
    els.forEach(function(e){e.classList.add('in')});return;
  }
  var io=new IntersectionObserver(function(es){
    es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});
  },{rootMargin:'0px 0px -8% 0px',threshold:.06});
  els.forEach(function(e){io.observe(e)});
})();
