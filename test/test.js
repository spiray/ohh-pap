const assert = require('chai').assert,
    main = require('../public/js/HomePage');

describe('Table tests', () => {
    it('Price Table is loaded', () => {
        assert(main.priceData.isArray(), 'Price Data is an array.');
    })
});