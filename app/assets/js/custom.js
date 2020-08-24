jQuery(document).ready(function(){
    $(".rating .rating-point").each(function(){
      var point = $(this).attr('rel');
      var ww = parseFloat(point) / 5 * 100;
      if (ww > 100) {
        ww = 100;
      }
      $(this).css('width', ww + "%");
    })

    $(document).on("click", ".rating.variable", function(e){
      var parentOffset = $(this).offset(); 
      var relX = e.pageX - parentOffset.left;
      $(".rating-value").val(relX / 130 * 5);

      $(this).find(".rating-point").css('width', relX + "px");
    })
  })