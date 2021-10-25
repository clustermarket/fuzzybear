/**
 * Fuzzy string search across a list of elements with support for multiple algorithms,
 * short string search and scoring.
 *
 * @author Itay Grudev
 * @copyright (c) 2021 Clustermarket Ltd.
 * @license MIT
 */
let fuzzybear = require( '../fuzzybear.js' ).fuzzybear

function sharedExamples( term, matches ){
    describe( 'options.results', ()=>{
        it( 'returns all results by default', ()=>{
            expect(
                fuzzybear.search( term, matches ).length
            ).toEqual( matches.length )
        })

        it( 'returns the specified number of results with options.results specified', ()=>{
            expect( matches.length ).toBeGreaterThan( 3 )
            expect(
                fuzzybear.search(
                    term,
                    matches,
                    {
                        results: 3
                    }
                ).length
            ).toEqual( 3 )
        })
    })

    describe( 'options.minSearchScore', ()=>{
        it( 'returns all results by default', ()=>{
            expect(
                fuzzybear.search( term, matches ).length
            ).toEqual( matches.length )
        })

        it( 'returns only results with score above the specified', ()=>{
            expect( matches.length ).toBeGreaterThan( 4 )
            expect(
                fuzzybear.search(
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
                        minSearchScore: 1 - 1 / 8 // (8 chars or longer)
                    }
                ).length
            ).toEqual( 4 )
        })
    })

    it( 'returns a score of 1 for exact matches', ()=>{
        expect( fuzzybear.search( term, matches )[0].score ).toEqual( 1 )
    })

    it( 'returns a score of 0 for completely different strings', ()=>{
        expect( fuzzybear.search( '@!-=()%$', matches )[0].score ).toEqual( 0 )
    })

    it( 'returns results sorted in ascending distance', ()=>{
        let results = fuzzybear.search( term, matches )
        let prevResult = results[0]
        for( let i = 1; i < results.length; ++i ){
            expect( results[i].score ).toBeLessThanOrEqual( prevResult.score )
            prevResult = results[i]
        }
    })

    it( 'is case insensitive by default', ()=>{
        let resultsLower = fuzzybear.search( term.toLowerCase(), matches )
        let resultsUpper = fuzzybear.search( term.toUpperCase(), matches )
        expect( resultsLower ).toEqual( resultsUpper )
    })

    it( 'is case sensitive with caseSensitive set to true', ()=>{
        let resultsLower = fuzzybear.search( term.toLowerCase(), matches, { caseSensitive: true })
        let resultsUpper = fuzzybear.search( term.toUpperCase(), matches, { caseSensitive: true })
        expect( resultsLower ).not.toEqual( resultsUpper )
    })

    it( 'includes meaningful results', ()=>{
        let results = fuzzybear.search( term, matches )
        expect(
            results.map(( el ) => el.value)
        ).toContain( 'dentical' )
        expect(
            results.filter(( el ) => el.value === 'dentical' )[0].score
        ).toBeGreaterThan( 0 )
        expect(
            results.map(( el ) => el.value)
        ).toContain( 'Dental' )
        expect(
            results.filter(( el ) => el.value === 'Dental' )[0].score
        ).toBeGreaterThan( 0 )
    })

    it( 'raises an exception when no methods are specified', ()=>{
        expect(
            ()=>{
                fuzzybear.search( term, matches, { methods: [] } )
            }
        ).toThrowError( 'No search methods specified.' )
    })

    it( 'returns 0 distances when the search term is empty', ()=>{
        expect(
            fuzzybear.search( '', matches ).map( e => e.score )
        ).toEqual( matches.map( _ => 0 ) )
    })
}

describe( 'fuzzybear.search', ()=>{
    describe( 'with string elements', ()=>{
        let term = 'Identical'
        let matches = [ 'Identical', 'Identifier', 'dentical', 'Dental', 'dentist', 'different' ]

        sharedExamples( term, matches )
    })

    describe( 'with object elements', ()=>{
        let term = 'Identical'
        let matches = [
            { value:'Identical', id: 's0' },
            { value:'Identifier', id: 's1' },
            { value:'dentical', id: 's2' },
            { value:'Dental', id: 's3' },
            { value:'dentist', id: 's4' },
            { value:'Different', id: 's5' },
        ]

        sharedExamples( term, matches )
    })

    it( 'returns 0 distances when search elements are empty', ()=>{
        expect(
            fuzzybear.search( 'asd', [ '', '' ] ).map( e => e.score )
        ).toEqual( [ 0, 0 ])
    })

    it( 'raises an exception when no string values can be found', ()=>{
        expect(
            ()=>{
                fuzzybear.search( 'term', [ {}, {}, {} ])
            }
        ).toThrowError( 'Element without value is not searchable' )
        expect(
            ()=>{
                fuzzybear.search( 'term', [ 1, 2, 3 ])
            }
        ).toThrowError( 'Element without value is not searchable' )
    })
})
