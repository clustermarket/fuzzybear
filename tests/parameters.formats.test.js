/**
 * Fuzzy string search across a list of elements with support for multiple algorithms,
 * short string search and scoring.
 *
 * @author Itay Grudev
 * @copyright (c) 2021 Clustermarket Ltd.
 * @license MIT
 */

import { search } from '../fuzzybear'

it( 'method name shorthand', ()=>{
    expect(
        search( 'term', [ 'terminus', 'exterminator' ], {
            methods: [ 'jaro_winkler', 'jaccard' ]
        }).map( e => Math.round( e._score * 10) / 10 )
    ).toEqual( [ 0.7, 0.5, ])
})

it( 'custom method shorthand', ()=>{
    expect(
        search( 'term', [ 'terminus', 'exterminator' ], {
            methods: [ ()=> 0.8 ]
        }).map( e => Math.round( e._score * 10) / 10 )
    ).toEqual( [ 0.2, 0.2 ])
})

it( 'invalid method shorthand', ()=>{
    expect(
        ()=>{
            search( 'term', [ 'terminus', 'exterminator' ], {
                methods: [ 1, 3, 2 ]
            }).map( e => Math.round( e._score * 10) / 10 )
        }
    ).toThrowError( 'Invalid method definition' )
})
