/// <reference path="jquery-3.6.0.js" />

var arr = [];

$(function () {
  $(".row").html(
    `<div class="spinner-border main-loader" role="status">
        <span class="sr-only">Loading...</span>
      </div>`
  );
  $.ajax({
    url: "https://api.coingecko.com/api/v3/coins/list",
    success: (coins) => displaycoins(coins),
    error: (err) => console.error(err.status),
  });
  function displaycoins(coins) {
    $(".row").html("");
    var i = 0;
    for (const coin of coins) {
      if (i <= 100) {
        $("#cards").append(`
                    <div class="col-sm-4 col-md-3 for-search" >
                      <div class="card">
                          <div class="card-body">
                              <h5 class="card-title">${coin.symbol}</h5>
                              <div class="custom-control custom-switch">
                                  <input type="checkbox" class="custom-control-input" id="${coin.symbol}" name="${coin.name}">
                                  <label class="custom-control-label" for="${coin.symbol}"></label>
                              </div>
                              <p class="card-text">${coin.name}</p>
                              <button class="btn btn-primary info" type="button" data-toggle="collapse" id="${coin.id}" data-target="#y${coin.symbol}"
                                aria-expanded="false"  aria-controls="y${coin.symbol}">
                                More info
                              </button>
                              <div class="collapse" id="y${coin.symbol}">  
                                <div class="card card-body"> 
                                  <div class="spinner-border " role="status"> 
                                   <span class="sr-only">Loading...</span> 
                                  </div>
                                </div>
                              </div>
                          </div>
                      </div>
                    </div>
              `);
        i++;
      } else {
        return;
      }
    }
  }
});
$(document).on("click", ".info", function () {
  var idCoin = event.target.id;
  var dataCoinFromCookie = Cookies.get(idCoin)
    ? JSON.parse(Cookies.get(idCoin))
    : null;
  if (dataCoinFromCookie) {
    $(`#${idCoin}`)
      .next()
      .html(
        `<br/> <img src="${dataCoinFromCookie.coinimage}"<br/><p>${dataCoinFromCookie.coinusd}$</p><br/> <p>${dataCoinFromCookie.coineur}&euro;</p><br/> <p>${dataCoinFromCookie.coinils}₪</p>`
      );
  } else {
    $.ajax({
      url: `https://api.coingecko.com/api/v3/coins/${idCoin}`,
      success: (more) => displaymore(more),
      error: (err) => console.error(err),
    });
  }
  function displaymore(more) {
    var cookieData = {};
    cookieData.coinimage = more.image ? more.image.thumb : null;
    cookieData.coinusd = more.market_data.current_price.usd;
    cookieData.coineur = more.market_data.current_price.eur;
    cookieData.coinils = more.market_data.current_price.ils;
    $(`#${more.id}`)
      .next()
      .html(
        `<br/> <img src="${cookieData.coinimage}"<br/><p>${cookieData.coinusd}$</p><br/> <p>${cookieData.coineur}&euro;</p><br/> <p>${cookieData.coinils}₪</p>`
      );
    const now = new Date();
    now.setMinutes(now.getMinutes() + 2);
    Cookies.set(idCoin, cookieData, { expires: now });
  }
});

$(document).on("click", ".custom-control-input", function (event) {
  if ($(this).prop("checked") == false) {
    if (arr.includes(event.target.id)) {
      var index = arr.indexOf(event.target.id);
      arr.splice(index, 1);
    }
  } else {
    if (arr.length < 5) {
      arr.push(event.target.id);
    } else {
      var newcoinid = event.target.id;
      localStorage.setItem("newcoinid", newcoinid);
      $("#exampleModal").modal("show");
      $(".modal-body")
        .html(`${arr[0]}    <button type="button" class="btn btn-primary btn-sm" id="${arr[0]}">הסר</button><br/>
                ${arr[1]}    <button type="button" class="btn btn-primary btn-sm" id="${arr[1]}">הסר</button><br/>
                ${arr[2]}    <button type="button" class="btn btn-primary btn-sm" id="${arr[2]}">הסר</button><br/>
                ${arr[3]}    <button type="button" class="btn btn-primary btn-sm" id="${arr[3]}">הסר</button><br/>
                ${arr[4]}    <button type="button" class="btn btn-primary btn-sm" id="${arr[4]}">הסר</button><br/>`);
    }
  }
  $(function () {
    $(".modal-body > button").on("click", function (event) {
      var id = event.target.id;
      var index = arr.indexOf(id);
      arr.splice(index, 1);
      arr.push(newcoinid);
      $(
        ".modal-body"
      ).html(`${arr[0]}    <button type="button" class="btn btn-primary btn-sm" id="${arr[0]}">הסר</button><br/>
              ${arr[1]}    <button type="button" class="btn btn-primary btn-sm" id="${arr[1]}">הסר</button><br/>
              ${arr[2]}    <button type="button" class="btn btn-primary btn-sm" id="${arr[2]}">הסר</button><br/>
              ${arr[3]}    <button type="button" class="btn btn-primary btn-sm" id="${arr[3]}">הסר</button><br/>
              ${arr[4]}    <button type="button" class="btn btn-primary btn-sm" id="${arr[4]}">הסר</button><br/>`);
      $("#exampleModal").modal("hide");
      $("#" + id).prop("checked", false);
    });
  });

  $(function () {
    $(".modal-header > button , .btn-secondary").on("click", function (event) {
      var coin = localStorage.getItem("newcoinid");
      $("#" + coin).prop("checked", false);
    });
    $(".btn-secondary").on("click", function (event) {
      var coin = localStorage.getItem("newcoinid");
      $("#" + coin).prop("checked", false);
    });
  });
});

$(function () {
  $("#input-search").on("keyup", function () {
    var value = $(this).val();
    if (value.length >= 3 || value.length == 0) {
      $(".for-search").filter(function () {
        $(this).toggle($(this).text().indexOf(value) > -1);
      });
    }
  });
});

function setCookie(cname, cvalue) {
  var d = new Date();
  d.getTime() + 20000;
  var expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

$(function () {
  $(".about").on("click", function (event) {
    event.preventDefault();
    const fileName = $(this).attr("href");
    $.ajax({
      url: fileName,
      success: (response) => fillContentHtml(response),
    });
  });
});

function fillContentHtml(htmlContent) {
  $("body").html(htmlContent);
}
