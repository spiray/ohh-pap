const assert = require('chai').assert,
    { priceData, branchlisting, dateSum } = require('../public/js/HomePage');

// describe('Table tests', () => {
//     it('Price Table is an array', () => {
//         assert(main.priceData.isArray(), 'Price Data is an array.');
//     })
// });
describe('Does variable exist', () => {
    it('dateSum is defined', () => {
        assert.isDefined(dateSum);
    })
});