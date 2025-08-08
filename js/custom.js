$(document).ready(function(){
    //Owl Carousel Config
    $('.owl-carousel').owlCarousel({
        loop: true,
        nav: true,
        navText: [
            '<i class="fas fa-chevron-left"></i>',
            '<i class="fas fa-chevron-right"></i>'
        ],
        responsive: {
            0: { items: 1 },
            600: { items: 1 },
            1000: { items: 1 }
        }
    });

    // Theme toggle
    $("#toggle-mode").click(function(e){
        e.preventDefault();
        $(".circles").toggleClass("light-mode");
        $(".s-content").toggleClass("light-mode");
        $(".s-header").toggleClass("light-mode");
        $(".s-intro").toggleClass("light-mode");
        $(".s-about").toggleClass("light-mode");
        $(".s-details").toggleClass("light-mode");
        $(".s-works").toggleClass("light-mode");
        $(".s-contact").toggleClass("light-mode");
        $(".s-footer").toggleClass("light-mode");


        // Change icon between sun and moon
        $(this).find("i").toggleClass("fa-sun fa-moon");

        // Remember choice
        if ($(".s-content").hasClass("light-mode")) {
            localStorage.setItem("theme", "light");
        } else {
            localStorage.setItem("theme", "dark");
        }
    });

    // Load saved theme
    if (localStorage.getItem("theme") === "light") {
        $(".circles").addClass("light-mode");
        $(".s-content").addClass("light-mode");
        $(".s-header").addClass("light-mode");
        $(".s-intro").addClass("light-mode");
        $(".s-about").addClass("light-mode");
        $(".s-details").addClass("light-mode");
        $(".s-works").addClass("light-mode");
        $(".s-contact").addClass("light-mode");
        $(".s-footer").addClass("light-mode");
        $("body").addClass("light-mode");
        $("#toggle-mode i").removeClass("fa-sun").addClass("fa-moon");
    }

});