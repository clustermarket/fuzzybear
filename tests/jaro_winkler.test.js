/**
 * Fuzzy string search across a list of elements with support for multiple algorithms,
 * short string search and scoring.
 *
 * @author Itay Grudev
 * @copyright (c) 2021 Clustermarket Ltd.
 * @license MIT
 */

import distance from '../methods/jaro_winkler.js'

describe( 'Jaro-Winkler string distance', ()=>{
    it( 'returns a score of 0 for identical strings', ()=>{
        expect(
            distance( 'prism', 'prism' )
        ).toEqual( 0 )
    })

    it( 'returns a score of 1 for different strings', ()=>{
        expect(
            distance( 'prism', 'contact' )
        ).toEqual( 1 )
    })

    it( 'returns a distance of 1 if either string is empty', ()=>{
        expect( distance( '', 'contact' ) ).toEqual( 1 )
        expect( distance( 'prism', '' ) ).toEqual( 1 )
    })

    it( 'returns a positive for similar strings', ()=>{
        let score = distance( 'prism', 'unpristine' )
        expect( score ).toBeGreaterThan( 0 )
        expect( score ).toBeLessThan( 1 )
    })

    it( 'returns a positive for similar strings across a multi-token search', ()=>{
        let score = distance( 'unifold prismatic', 'unpristine interface' )
        expect( score ).toBeGreaterThan( 0 )
        expect( score ).toBeLessThan( 1 )
    })

    it( 'returns a lower distance for more similar strings than for less similar strings', ()=>{
        let lower_distance = distance( 'prism', 'unprismatic' )
        let higher_distance = distance( 'prism', 'charismatic' )
        expect( lower_distance ).toBeLessThan( higher_distance )
    })
})
