import { connect } from "./connect";

$(window).on("load", function () {
    connect(document.getElementById("connect-btn"));
});

$("#enable-busd").click(function () {
    $(this).addClass("loader");
    setTimeout(function () {
        $("#enable-busd").removeClass("btn-primary");
        $("#enable-busd").addClass("btn-outline-primary");
        $("#enable-busd").removeClass("loader");
        $("#enable-busd").prop("disabled", true);
        $("#swap").addClass("btn-primary");
    }, 900);
});

$("#btn-private-sale").click(function () {
    $("#section-participate").get(0).scrollIntoView({ behavior: "smooth" });
});
