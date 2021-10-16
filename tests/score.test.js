/**
 * Fuzzy string search across a list of elements with support for multiple algorithms,
 * short string search and scoring.
 *
 * @author Itay Grudev
 * @copyright (c) 2021 Clustermarket Ltd.
 * @license MIT
 */
let fuzzybear = require( '../fuzzybear.js' ).fuzzybear

describe( '#score', ()=>{
    it( 'returns 0 for unrelated strings', ()=>{
        expect(
            fuzzybear.score( 'prism', 'contact' )
        ).toEqual( 0 )
    })

    it( 'returns 1 for identical strings', ()=>{
        expect(
            fuzzybear.score( 'prism', 'prism' )
        ).toEqual( 1 )
    })

    it( 'returns the positive number for similar strings', ()=>{
        let distance = fuzzybear.score( 'prism', 'unpristine' )
        expect( distance ).toBeGreaterThan( 0 )
        expect( distance ).toBeLessThan( 1 )
    })
})
