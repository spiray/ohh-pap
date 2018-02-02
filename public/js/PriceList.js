$(document).ready(function() {
    $('#contact-submit').click(() => {
        console.log('Modal Hidden...');
        $('#contact-us').modal('hide');
    })
    $(function() {
        $('[data-toggle="popover"]').popover()
    })
    $(function() {
        $('.example-popover').popover({
            container: 'body'
        })
    })
    $('[data-toggle="popover"][data-timeout]').on('shown.bs.popover', function() {
        this_popover = $(this);
        setTimeout(function() {
            this_popover.popover('hide');
        }, $(this).data("timeout"));
    });
    $('.search').keyup(function() {
        let searchTerm = $('.search').val();
        let listItem = $('.results tbody').children('tr');
        let searchSplit = searchTerm.replace(/ /g, "'):containsi('");
        $.extend($.expr[':'], {
            'containsi': function(elem, i, match, array) {
                return (elem.textContent || elem.innerText || '').toLowerCase().indexOf((match[3] || '').toLowerCase()) >= 0;
            }
        })
        $(".results tbody tr").not(":containsi('" + searchSplit + "')").each(function() {
            $(this).attr('visible', 'false');
        })
        $(".results tbody tr:containsi('" + searchSplit + "')").each(function() {
            $(this).attr('visible', 'true');
        })
        let jobCount = $('.results tbody tr[visible="true"]').length;
        if (jobCount != 1) {
            $('.counter').text(jobCount + ' items');
        } else {
            $('.counter').text(jobCount + ' item');
        }
        if (jobCount == 0) {
            $('no-result').show();
        } else {
            $('no-result').hide();
        }
    })
})