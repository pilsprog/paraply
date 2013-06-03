$('document').ready(function () {
    var table = $('#events');

    $('#date, #arranger, #venue')
        .wrapInner('<span title="sort this column"/>')
        .each(function(){

            var th = $(this),
                thIndex = th.index(),
                inverse = false;

                console.log(thIndex);
            th.click(function(){

                table.find('td').filter(function(){

                    return $(this).index() === thIndex;
                    console.log(thIndex + " " + $(this).index());
                }).sortElements(function(a, b){

                    if( $.text([a]) == $.text([b]) )
                        return 0;

                    return $.text([a]) > $.text([b]) ?
                        inverse ? -1 : 1
                        : inverse ? 1 : -1;

                }, function(){

                    // parentNode is the element we want to move
                    return this.parentNode;

                });

                inverse = !inverse;

            });

        });
});