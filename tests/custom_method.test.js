/**
 * Fuzzy string search across a list of elements with support for multiple algorithms,
 * short string search and scoring.
 *
 * @author Itay Grudev
 * @copyright (c) 2021 Clustermarket Ltd.
 * @license MIT
 */

let fuzzybear = require( '../fuzzybear.js' ).fuzzybear

describe( 'custom search methods', ()=>{
    it( 'returns the correct distances based on the custom distance function', ()=>{
        expect(
            fuzzybear.search( 'asd', [ 'a', 'b', 'c', 'd' ], {
                methods: [
                    {
                        name: 'match-all',
                        function: function( _a, _b, _params ){
                            return 0.36
                        }
                    }
                ]
            }).map( e => e._score )
        ).toEqual( [ 0.64, 0.64, 0.64, 0.64 ]) // note that score is the inverse of distance s = 1 - d
    })
})
