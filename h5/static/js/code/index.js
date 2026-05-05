var t,
  fastest,
  fastest1,
  tim = 0,
  arr = [],
  atim = 0;

function Index() {
  (this.lis = $(".item")),
    (this.speed = $(".flexcon>.speed")),
    this.init();
}
(Index.prototype.init = function () {
  this.speedTest();
}),
  (Index.prototype.speedTest = function () {
    (tim = 10), (t = setInterval("tim++", 10));
    for (var e = 0; e < this.lis.length; e++) {
      var i = $(this.lis[e]).attr("href");
      $(this.speed[e]).html(
        "测试中...<img src=" +
          i +
          ' width="1" height="1" onerror="Index.speedTouch(' +
          e +
          ')">'
      );
    }
  }),
  (Index.speedTouch = function (e) {
    if (1e3 < tim) {
      var t = "超时";
    } else if (fastest) {
      t =parseFloat((tim / 100).toFixed(2)) + "s";
    } else {
      fastest = !0;
      t = parseFloat((tim / 100).toFixed(2)) + "s<span style='margin-left:0.1rem;'>最快</span>";
      $(".item").eq(e).addClass("active"),
      $(".item.active .text1").text("最佳线路");
      $('.loading-mask').hide();
      // $('.home-btn a').attr('href', $(".item.active").attr('data-url'));
    }
    $(".flexcon>.speed").eq(e).html(t);
  }),
  new Index();
