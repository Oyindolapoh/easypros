/* Copyright (C) Elartica Team, http://www.gnu.org/licenses/gpl.html GNU/GPL */

jQuery(function($) {

    "use strict";

    var html = $('html'),
        config = html.data('config') || {},
        win    = $(window),
        toolbar = $('.tm-toolbar'),
        navbar = $('.tm-navbar'),
        headerbar = $('.tm-headerbar');
    
    // Toolbar
    if (toolbar.length) {
        $.UIkit.sticky(toolbar, (function() {

            var cfg = {top: 0, media: 0};

            if (headerbar.length) {
                cfg.top = headerbar.innerHeight() * -1;
                cfg.animation = 'uk-animation-slide-top';
                cfg.clsactive =' tm-toolbar-attached';
            }

            return cfg;

        })());
    }

    // Switcher
    if ($.fn.hoverIntent) {
        
        $('.tm-switcher > li').hoverIntent(function () {
            $(this).trigger('click.uk.switcher');
        });
    } else {
        $('.tm-switcher > li').hover(function () {
            $(this).trigger('click.uk.switcher');
        });
    }
    $('.tm-switcher > li > a').on('click', function() {
        window.location.href = $(this).attr('href');
    });

    // Select2 init
    if ($.fn.select2) {
        $('.select2').select2({ minimumResultsForSearch : Infinity });
        $('.tm-shipping-calculator-form select, select.select2_country').select2({ minimumResultsForSearch : Infinity, width: '100%' });
    }

    // Category menu
    $('.tm-blog-categories li, .tm-product-categories li').each(function () {
        var $this = $(this);
        if($this.hasClass('current-cat') || $this.hasClass('current-cat-parent')){
            $this.has('ul').prepend('<span class="open-child-menu uk-active"></span>');
        } else {
            $this.has('ul').prepend('<span class="open-child-menu"></span>');
        }
    });

    $(document).on('click', 'span.open-child-menu', function () {
        var $this = $(this);
        if ($this.hasClass('uk-active')) {
            $(this)
                .removeClass('uk-active')
                .siblings('ul')
                .slideUp('800');
        } else {
            $(this)
                .addClass('uk-active')
                .siblings('ul')
                .slideDown('800');
        }
    });
    
    // Check selected color
    var theme_style = $('link#theme-style'),
        isset_theme_style = theme_style.length;
    
    if(isset_theme_style) 
    {
        var change_selected_color = function (color) 
        {
            $('.tm-color-schemes a').removeClass('uk-active');
            $('a.tm-color-' + color).addClass('uk-active');
            
            var this_color_file = '';
            
            if (color == 'default') 
            {
                this_color_file = 'css/theme.css';
                $('.tm-logo img').attr("src", 'images/logo.png');
            } else {
                this_color_file = 'css/theme-' + color + '.css';
                $('.tm-logo img').attr("src", 'images/logo-dark.png');
            }

            theme_style.attr('href', this_color_file);
        };

        if ($.cookie('selected_color') && $.cookie('selected_color') != 'default' && typeof $.cookie('selected_color') !== 'undefined') {
            change_selected_color($.cookie('selected_color'));
        } else {
            $('a.tm-color-default').addClass('uk-active');
        }
    } 

    $('.tm-color-schemes a').on('click', function () {
        var selected_color = $(this).data('color');
        $.cookie('selected_color', selected_color, {expires: 365, path: '/'});
        
        if(isset_theme_style) {
            change_selected_color(selected_color);
        } else {
            window.location.href = 'index.html';
        }
    });

    // Progress bar
    $('.uk-progress-bar').on('inview.uk.scrollspy', function()
    {
        $(this).css('width', $(this).data('value')+'%' );
    });

    // Custom modal
    var modal_autoload_selector = $('.tm-modal-autoload');
    if(modal_autoload_selector.length) {
        var autoload_modal = modal_autoload_selector.eq(0),
            autoload_modal_id = autoload_modal.attr('id'),
            autoload_modal_bgclose = autoload_modal.data('bgclose'),
            autoload_modal_center = autoload_modal.data('center'),
            autoload_modal_delay = parseInt(autoload_modal.data('delay'), 10),
            autoload_modal_display = !!JSON.parse(String(autoload_modal.data('display')).toLowerCase());

        if(autoload_modal_id != '' && ($.cookie('custom_modal_'+autoload_modal_id) != 'hide' || $.cookie('custom_modal_length_'+autoload_modal_id) != autoload_modal.text().length)) {
            var modal = UIkit.modal('#'+autoload_modal_id, {bgclose:autoload_modal_bgclose,center:autoload_modal_center});

            if ( !modal.isActive() ) {
                if(autoload_modal_delay) {
                    setTimeout(function() {
                        modal.show();
                    }, autoload_modal_delay);
                } else {
                    modal.show();
                }
            }

            if(autoload_modal_display) {
                modal.on({
                    'hide.uk.modal': function(){
                        $.cookie('custom_modal_'+autoload_modal_id, 'hide', {expires: 365, path: '/' });
                        $.cookie('custom_modal_length_'+autoload_modal_id, autoload_modal.text().length, {expires: 365, path: '/' });
                    }
                });
            }
        }
    }

    // Add to cart
    if( $('ul.tm-products').length ) {
        $(document).on('click', '.tm-add-to-cart', function () {
            var spacer = $(this).closest('.uk-panel');

            spacer.block({message: null,
                overlayCSS: {
                    cursor: 'none'
                }
            });

            var ico = spacer.find('.tm-icon-cart'),
                message = $('.tm-shopping-cart .ajax-product-added');
            
            setTimeout(function(){

                ico.addClass('add');
                ico.parent().addClass('added');

                message.addClass('uk-animation-slide-top').show();

                setTimeout(function () {
                    ico.removeClass('add');
                    ico.parent().removeClass('added');
                    message.removeClass('uk-animation-slide-top').fadeOut();
                }, 2000);

                spacer.unblock();
            }, 2000);
        });
    }
    
    // Remove cart item
    $(document).on('click', '.tm-mini-cart-item .remove', function (e) {
        e.preventDefault();
        
        var cart_item = $(this).closest('.tm-mini-cart-item');

        cart_item.block({message: null,
            overlayCSS: {
                cursor: 'none'
            }
        });

        setTimeout(function(){
            cart_item.remove();
            
            if(!$('ul.tm-cart-list li').length) {
                $('.tm-shopping-cart-content').html('<ul class="tm-cart-list"><li class="empty">No products in the cart.</li></ul>');
                
            }
        }, 2000);
    });

    // Price slider uses jquery ui
    if($('.price_slider').length) {
        var min_price = $('.price_slider_amount #min_price').data('min'),
            max_price = $('.price_slider_amount #max_price').data('max'),
            current_min_price = parseInt(min_price, 10),
            current_max_price = parseInt(max_price, 10);

        $('.price_slider').slider({
            range: true,
            animate: true,
            min: min_price,
            max: max_price,
            values: [current_min_price, current_max_price],
            create: function () {
                $('.price_slider_amount #min_price').val(current_min_price);
                $('.price_slider_amount #max_price').val(current_max_price);
                $('.price_slider_amount span.from').html('£' + current_min_price);
                $('.price_slider_amount span.to').html('£' + current_max_price);
            },
            slide: function (event, ui) {
                $('input#min_price').val(ui.values[0]);
                $('input#max_price').val(ui.values[1]);
                $('.price_slider_amount span.from').html('£' + ui.values[0]);
                $('.price_slider_amount span.to').html('£' + ui.values[1]);
            }
        });
    }

    // product lightbox
    var product_lightbox_img = $('.tm-product-gallery-img a');
    if (product_lightbox_img.length) {
        var product_lightbox = UIkit.lightbox(product_lightbox_img, {});

        $(product_lightbox_img).on('click', function (e) {
            e.preventDefault();
            product_lightbox.show(product_lightbox_img.index(this));
        });

        // Reset lightbox first img
        $('body').on('variation-has-changed', function () {
            product_lightbox.siblings[0].source = product_lightbox_img.eq(0).attr('href');
        });
    }

    $( document ).on( 'change', 'select#pa_color', function() {
        if($(this).val() == 'black') {
            $('.tm-product-gallery-img a').attr('href', 'images/products/prod-img4.jpg');
            $('.tm-product-gallery-img img').attr('src', 'images/products/prod-img4.jpg');
        } else {
            $('.tm-product-gallery-img a').attr('href', 'images/products/prod-img2.jpg');
            $('.tm-product-gallery-img img').attr('src', 'images/products/prod-img2.jpg');
        }

        $('body').trigger('variation-has-changed');
        return false;
    });

    // product reviews
    $(document).on('click', '.stars a', function (e) {
        e.preventDefault();

        var parent = $(this).parent().parent(),
            this_select = parent.next(),
            this_option = this_select.find('option'),
            this_active_option = this_select.find('option[value='+$(this).text()+']');

        this_option.removeAttr('selected');
        this_active_option.attr('selected', 'selected');

        parent.find('a').removeClass('uk-active');
        $(this).addClass('uk-active');
    });

    // Change quantity
    var change_quantity = function(qty_operator, qty_object) {
        var step = parseInt(qty_object.attr('step'), 10),
            max = parseInt(qty_object.attr('max'), 10);

        if(isNaN(step)){ step = 1; }

        if(isNaN(max)){ max = 100000; }

        if(qty_operator == "plus") {
            var Qtt = parseInt(qty_object.val(), 10);
            if (!isNaN(Qtt) && Qtt < max) {
                qty_object.val(Qtt + step);
            }
        }

        if(qty_operator == "minus") {
            var Qtt = parseInt(qty_object.val(), 10);
            if (!isNaN(Qtt) && Qtt > step) {
                qty_object.val(Qtt - step);
            } else qty_object.val(step);
        }

        if(qty_operator == "blur") {
            var Qtt = parseInt(qty_object.val(), 10);
            if (!isNaN(Qtt) && Qtt > max) {
                qty_object.val(max);
            }
        }
    };

    $(document).on('click', '.quantity .plus', function(){
        change_quantity('plus', $(this).parent().find('.qty'));
    });
    $(document).on('click', '.quantity .minus', function(){
        change_quantity('minus', $(this).parent().find('.qty'));
    });
    $(document).on('blur', '.quantity .qty', function(){
        change_quantity('blur', $(this));
    });

    // Shipping toggle
    $( document ).on( 'click', '.tm-shipping-calculator-button', function() {
        $( '.tm-shipping-calculator-form' ).slideToggle( 'slow' );
        return false;
    });

    // Payment method toggle
    var payment_method_selected = function(){
        $('.tm-checkout-payment li').each(function(){
            var target_payment_box = $(this).find('.payment_box'),
                target_payment_input = $(this).find('input');

            if(target_payment_input.is(':checked') && !target_payment_box.is( ':visible' ) ) {
                target_payment_box.slideDown( 250 );
            } else if(!target_payment_input.is(':checked')){
                target_payment_box.slideUp( 250 );
            }
        });
    };

    payment_method_selected();
    $( document ).on( 'change', 'input[name=payment_method]', function() {
        payment_method_selected();
        return false;
    });

    // Create account toggle
    $( document ).on( 'change', '#createaccount', function() {
        $( this).next().next().slideToggle( 'slow' );
        return false;
    });

    // Ship to a different address
    $( document ).on( 'change', '#ship-to-different-address-checkbox', function() {
        $( this).parent().next().slideToggle( 'slow' );
        win.trigger('resize');
        return false;
    });

    // Make full width row
    var full_width_row = function() {
        var $elements = $('.tm-row-full-width');
        
        $.each($elements, function (key, item) {
            var $el = $(this),
                $el_full = $el.next(".tm-row-full-width-js");
            
            $el.addClass("uk-hidden");
           
            if ($el_full.length) {
                var el_margin_left = parseInt($el.css("margin-left"), 10), 
                    el_margin_right = parseInt($el.css("margin-right"), 10), 
                    offset = 0 - $el_full.offset().left - el_margin_left, 
                    width = win.width();
                
                $el.css({
                    position: "relative",
                    left: offset,
                    "box-sizing": "border-box",
                    width: width
                }).removeClass("uk-hidden");
            }
        });
    };

    // login switcher
    $('.change_login_form_tab').on( 'click' , function()
    {
        var tab_id = $(this).data('tab_id');
        $('.tm-modal-login-form-switcher-nav li').eq(tab_id).trigger('click');
        return false;
    });

    // Mini Cart DropDown Overlay  
    var cart_widget = $('.tm-cart-widget');
    if(cart_widget.hasClass('tm-add-cart-overlay'))
    {
        $('.tm-toolbar').after('<div class="tm-cart-overlay uk-dropdown-close"></div>');

        cart_widget.on('show.uk.dropdown', function()
        {
            if($(this).parents('.tm-toolbar').length) {
                $('.tm-cart-overlay').fadeIn(300);
            }
        }).on('hide.uk.dropdown', function()
        {
            if($(this).parents('.tm-toolbar').length) {
                $('.tm-cart-overlay').fadeOut(300);
            }
        });
    }

    // Products Quick View
    $(document).on('click', '.tm-quick-view', function()
    {
        var product_id = $(this).data('product_id'),
            modal = UIkit.modal("#tm-quick-view-modal"),
            quick_view_container = $('#tm-quick-view-content'),
            html = quick_view_container.html();

        quick_view_container.html('<div class="uk-modal-spinner-quick-view"></div>');

        modal.defaults.center = true;
        modal.options.center = true;

        //toolbar.css('z-index', 1011);

        if ( modal.isActive() ) {
            modal.hide();
        } else {
            modal.show();
        }

        /*$.post( 'ajax_url', { action: 'load_product_quick_view', product_id: product_id }, function (html)
        {
            quick_view_container.html(html);
            modal.resize();
        });*/

        setTimeout(function()
        {
            quick_view_container.html(html);

            var product_lightbox_img = quick_view_container.find('.tm-product-gallery-img a');

            if (product_lightbox_img.length)
            {
                var product_lightbox = UIkit.lightbox(product_lightbox_img, {});

                $(product_lightbox_img).on('click', function (e)
                {
                    e.preventDefault();
                    product_lightbox.show(product_lightbox_img.index(this));
                });
            }
        }, 1000);

        return false;
    });

    /*$('#tm-quick-view-modal').on({
        'hide.uk.modal': function(){
            toolbar.css('z-index', 100);
        }
    });*/

    // Add to Compare and WishList
    $(document).on('click', '.add_compare, .add_wish_list', function()
    {
        var $_this = $(this),
            product_id = $_this.data('product_id'),
            parent = $_this.parent(),
            spacer = $_this.closest('.uk-panel'),
            action = '';

        if( $_this.hasClass('added') ) {
            return true
        } else if( $_this.hasClass('add_compare') ){
            action = 'add_compare';
        } else if( $_this.hasClass('add_wish_list') ){
            action = 'add_wish_list';
        }

        parent.css('z-index', 1001);

        spacer.block({message: null,
            overlayCSS: {
                cursor: 'none'
            }
        });

        /*$.post( 'ajax_url', { action: action, product_id: product_id }, function ()
        {

        });*/

        setTimeout(function()
        {
            $_this.addClass('added');
            spacer.unblock();
            parent.css('z-index', 6);

            if( action == 'add_compare') {
                $_this.data('cached-title', 'Browse Compare').find('.title').html('Browse Compare');
            }

            if( action == 'add_wish_list') {
                $_this.data('cached-title', 'Browse Wishlist').find('.title').html('Browse Wishlist');
            }
        }, 2000);

        return false;
    });

    // Compare page
    var carousel_compare = $('#carousel-compare');
    if ( carousel_compare.length )
    {
        carousel_compare.owlCarousel({
            nav: true,
            margin: 0,
            responsive: {
                0:{
                    items:1
                },
                768:{
                    items:2
                },
                1220:{
                    items:3
                }
            },
            navText: ['<span class="uk-slidenav-previous"></span>', '<span class="uk-slidenav-next"></span>']
        });

        var show_compare_no_product_message = function()
        {
            $('.tm-compare-container').fadeOut(500, function()
            {
                $(this).next().fadeIn();
            });
        };

        $(document).on('click', '.compare-product-remove', function()
        {
            var this_item = $(this).parents('.owl-item'),
                this_item_index = this_item.index();

            this_item.find('.tm-compare-element').css('width', this_item.width());
            this_item.animate({
                'width': 0
            }, 500, function()
            {
                carousel_compare.trigger('remove.owl.carousel', [this_item_index]).trigger('refresh.owl.carousel');
                if( ! carousel_compare.find('.owl-item').length )
                {
                    show_compare_no_product_message();
                }
            });
            return false;
        });

        $(document).on('click', '.remove-all-compare', function()
        {
            show_compare_no_product_message();
            return false;
        });

        var propsSimHeight = function()
        {
            var container = $(".tm-compare-container"),
                propsContainer = container.find(".tm-compare-props"),
                props = propsContainer.find(".prop-one"),
                elementsContainer = container.find(".tm-compare-elements"),
                elements = elementsContainer.find(".tm-compare-element"),
                elementsProps = elements.find(".prop-one"),
                propsArray = {},
                top_container = container.find(".tm-top-container"),
                top_container_height = top_container.eq(1).find('.uk-panel').outerHeight(true);

            top_container.css({"height" : top_container_height, "position" : "relative"});

            props.each(function() {
                if(propsArray[$(this).data("id")] === undefined) {
                    propsArray[$(this).data("id")] = [];
                }
                propsArray[$(this).data("id")].push(this);
            });

            elementsProps.each(function() {
                propsArray[$(this).data("id")].push(this);
            });

            for(var id in propsArray)
            {
                var colMaxHeight = 0;

                for(var element in propsArray[id])
                {
                    var wrap_height = $(propsArray[id][element]).find(".prop-wrap").outerHeight(true);

                    if(wrap_height > colMaxHeight)
                    {
                        colMaxHeight = wrap_height;
                    }
                }

                $(propsArray[id]).css({"height" : colMaxHeight, "position" : "relative"});
            }
        };

        $(document).ready(function() {
            propsSimHeight();
        });

        win.on('resize', function()
        {
            window.resizeEvt;
            win.resize(function(){
                clearTimeout(window.resizeEvt);
                window.resizeEvt = setTimeout(function(){
                    propsSimHeight();
                }, 250);
            });
        });
    }

    // Fix footer
    var footer_move = function() {
        if(html.hasClass('tm-coming-soon') || html.hasClass('tm-error')) {
            if(win.height() < $('.uk-vertical-align-middle').height()) {
                html.removeClass('uk-height-1-1');
            } else {
                html.addClass('uk-height-1-1');
            }
        }

        var get_viewport_height = function() {
                return ((document.compatMode || isIE) && !isOpera)
                    ? (document.compatMode=='CSS1Compat')
                    ? document.documentElement.clientHeight
                    : document.body.clientHeight
                    : (document.parentWindow || document.defaultView).innerHeight;
            },
            ua = navigator.userAgent.toLowerCase(),
            isOpera = (ua.indexOf('opera')  > -1),
            isIE = (!isOpera && ua.indexOf('msie') > -1),
            viewportHeight = get_viewport_height(),
            wrapper = $("#tm-wrapper"),
            footer = $("#tm-footer");

        wrapper.css("min-height", viewportHeight-footer.outerHeight(true));

    };
    
    footer_move();
    full_width_row();

    // Window resize
    win.on('resize', function() {
        footer_move();
        full_width_row();
    });

    // Progress bar scroller
    var top_progress_bar = function() {
        var winHeight = win.height(),
            docHeight = $(document).height(),
            max = docHeight - winHeight,
            value = win.scrollTop(),
            width = value / max * 100;

        $('.tm-top-progress-bar').css({width: width+'%'})
    };

    if($('.tm-top-progress-bar').length) {
        top_progress_bar();
    }

    // Scroll to top
    win.scroll(function () {
        if (win.scrollTop() > 200) {
            $('.tm-totop-scroller').addClass('uk-active');
        } else {
            $('.tm-totop-scroller').removeClass('uk-active');
        }

        if($('.tm-top-progress-bar').length) {
            top_progress_bar();
        }
    });


    var is_email = function(email) {
        var regex = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        
        if(!regex.test(email)) {
            return false;
        }else{
            return true;
        }
    };
    
    $('.tm-contact-form form').on('submit', function(e){
        e.preventDefault();
        
        var form = $(this),
            name = form.find('#contact-form-author'),
            email = form.find('#contact-form-email'),
            subject = form.find('#contact-form-subject'),
            text = form.find('#contact-form-text'),
            button = form.find('.uk-button');
        
        if(name.val()) {
            name.removeClass('uk-form-danger');
        } else {
            name.addClass('uk-form-danger');
        }

        if(is_email(email.val())) {
            email.removeClass('uk-form-danger');
        } else {
            email.addClass('uk-form-danger');
        }

        if(subject.val()) {
            subject.removeClass('uk-form-danger');
        } else {
            subject.addClass('uk-form-danger');
        }
        
        if(form.find('.uk-form-danger').length) {
            return false;
        }

        button.next().fadeIn();
        
        $.post('sendmail.php', form.serialize(), function (result)
        {
            setTimeout(function() {
                var result_arr = result.split('|');

                button.next().fadeOut();
                button.next().after('<div class="uk-alert uk-alert-'+result_arr[0]+' uk-text-left uk-animation-fade">'+result_arr[1]+'</div>');
                
                if(result_arr[0] == 'success') {
                    name.val('');
                    email.val('');
                    subject.val('');
                    text.val('');
                }
            }, 2000);
        });
    });
});

(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','../www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-71610751-5', 'auto');
ga('send', 'pageview');
