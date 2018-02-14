$(document).ready(function() {
    $('#contact-submit').click(() => {
        console.log('Modal Hidden...');
        $('#contact-us').modal('hide');
    })
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
            $('.counter').text(`Found ${jobCount} items`);
        } else {
            $('.counter').text(`Found ${jobCount} item`);
        }
        if (jobCount == 0) {
            $('no-result').show();
        } else {
            $('no-result').hide();
        }
    })
})