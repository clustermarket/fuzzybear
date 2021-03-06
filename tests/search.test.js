/**
 * Fuzzy string search across a list of elements with support for multiple algorithms,
 * short string search and scoring.
 *
 * @author Itay Grudev
 * @copyright (c) 2021 Clustermarket Ltd.
 * @license MIT
 */

import { search } from '../fuzzybear'

function sharedExamples( term, matches ){
    describe( 'options.results', ()=>{
        it( 'returns all results by default', ()=>{
            expect(
                search( term, matches ).length
            ).toEqual( matches.length )
        })

        it( 'returns the specified number of results with options.results specified', ()=>{
            expect( matches.length ).toBeGreaterThan( 3 )
            expect(
                search(
                    term,
                    matches,
                    {
                        results: 3
                    }
                ).length
            ).toEqual( 3 )
        })
    })

    describe( 'options.minScore', ()=>{
        it( 'returns all results by default', ()=>{
            expect(
                search( term, matches ).length
            ).toEqual( matches.length )
        })

        it( 'returns only results with score above the specified', ()=>{
            expect( matches.length ).toBeGreaterThan( 4 )
            expect(
                search(
                    term,
                    matches,
                    {
                        methods: [
                            {
                                function: function( _a, _b, _params ){
                                    return 1 / (Math.min( _b.length, 10 ))
                                }
                            }
                        ],
                        minScore: 1 - 1 / 8 // (8 chars or longer)
                    }
                ).length
            ).toEqual( 4 )
        })
    })

    it( 'returns a score of 1 for exact matches', ()=>{
        expect( search( term, matches )[0]._score ).toEqual( 1 )
    })

    it( 'returns a score of 0 for completely different strings', ()=>{
        expect( search( '@!-=()%$', matches )[0]._score ).toEqual( 0 )
    })

    it( 'returns results sorted in ascending distance', ()=>{
        let results = search( term, matches )
        let prevResult = results[0]
        for( let i = 1; i < results.length; ++i ){
            expect( results[i]._score ).toBeLessThanOrEqual( prevResult._score )
            prevResult = results[i]
        }
    })

    it( 'is case insensitive by default', ()=>{
        let resultsLower = search( term.toLowerCase(), matches )
        let resultsUpper = search( term.toUpperCase(), matches )
        expect( resultsLower ).toEqual( resultsUpper )
    })

    it( 'is case sensitive with caseSensitive set to true', ()=>{
        let resultsLower = search( term.toLowerCase(), matches, { caseSensitive: true })
        let resultsUpper = search( term.toUpperCase(), matches, { caseSensitive: true })
        expect( resultsLower ).not.toEqual( resultsUpper )
    })

    it( 'includes meaningful results', ()=>{
        let results = search( term, matches )
        expect(
            results.map(( el ) => el.label)
        ).toContain( 'dentical' )
        expect(
            results.filter(( el ) => el.label === 'dentical' )[0]._score
        ).toBeGreaterThan( 0 )
        expect(
            results.map(( el ) => el.label)
        ).toContain( 'Dental' )
        expect(
            results.filter(( el ) => el.label === 'Dental' )[0]._score
        ).toBeGreaterThan( 0 )
    })

    it( 'raises an exception when no methods are specified', ()=>{
        expect(
            ()=>{
                search( term, matches, { methods: [] } )
            }
        ).toThrowError( 'No search methods specified.' )
    })

    it( 'returns 0 distances when the search term is empty', ()=>{
        expect(
            search( '', matches ).map( e => e._score )
        ).toEqual( matches.map( _ => 0 ) )
    })
}

describe( 'search', ()=>{
    describe( 'with string elements', ()=>{
        let term = 'Identical'
        let matches = [ 'Identical', 'Identifier', 'dentical', 'Dental', 'dentist', 'different' ]

        sharedExamples( term, matches )
    })

    describe( 'with object elements', ()=>{
        let term = 'Identical'
        let matches = [
            { label: 'Identical', id: 's0' },
            { label: 'Identifier', id: 's1' },
            { label: 'dentical', id: 's2' },
            { label: 'Dental', id: 's3' },
            { label: 'dentist', id: 's4' },
            { label: 'Different', id: 's5' },
        ]

        sharedExamples( term, matches )
    })

    it( 'returns 0 distances when search elements are empty', ()=>{
        expect(
            search( 'asd', [ '', '' ] ).map( e => e._score )
        ).toEqual( [ 0, 0 ])
    })

    it( 'raises an exception when no string values can be found', ()=>{
        expect(
            ()=>{
                search( 'term', [ {}, {}, {} ])
            }
        ).toThrowError( 'Element without label is not searchable' )
        expect(
            ()=>{
                search( 'term', [ 1, 2, 3 ])
            }
        ).toThrowError( 'Element without label is not searchable' )
    })
})
