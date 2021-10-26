/**
 * Fuzzy string search across a list of elements with support for multiple algorithms,
 * short string search and scoring.
 *
 * @author Itay Grudev
 * @copyright (c) 2021 Clustermarket Ltd.
 * @license MIT
 * @export fuzzybear
 */

/**
 * Perform a fuzzy string search across a list of elements.
 * @param {String}   searchTerm
 * @param {Object[]|String[]} elements
 * @param {String}   elements[].value - Value to be searched against
 * @param {Object}   options
 * @param {Number}   options.results - Number of results to return. Defaults to 0 - all elements distanced
 * @param {Boolean}  options.caseSensitive - Whether to perform a case sensitive match. Defaults to false
 * @param {Number}   options.minScore - Minimum score of matches to be included in the results
 * @param {Object[]} options.methods - Which methods to use when scoring matches
 * @param {String}   options.methods[].name - Search algorithm name
 * @param {Number}   options.methods[].weight - Search algorithm weight in scoring
 * @param {Object}   options.methods[].params - Search algorithm parameters
 * @raises {Error} if the search method is not supported or if element are invalid
 */
function search( searchTerm, elements, options = {}){
    options = optionsDefaults( options )
    validateOptions( options )
    loadMethods( options )

    let resultSet = []
    elements.forEach( ( element ) => {
        let value
        if( typeof element === 'string' ){
            value = element
        } else if( typeof element === 'object' && typeof element.value === 'string' ){
            value = element.value
        } else {
            throw new Error( 'Element without value is not searchable' )
        }

        // Convert the string only values to object with value and distance
        if( typeof element === 'string' ) {
            element = {
                value: element
            }
        }

        let searchScore = score( searchTerm, value, options, true );
        if( searchScore >= options.minScore )
            resultSet.push( Object.assign({}, element, { _score: searchScore }))
    })

    // Sort ascending based on index
    resultSet.sort(( left, right ) => { return right._score - left._score })

    if( options.results > 0 )
        resultSet = resultSet.slice( 0, options.results )

    return resultSet
}

/**
 * Perform a fuzzy string distance of two strings.
 * @param {String}   searchTerm
 * @param {String}   testString
 * @param {Object}   options
 * @param {Number}   options.results - Number of results to return. Defaults to 0 - all elements distanced
 * @param {Boolean}  options.caseSensitive - Whether to perform a case sensitive match. Defaults to false
 * @param {Number}   options.minScore - Minimum score of matches to be included in the results
 * @param {Object[]} options.methods - Which methods to use when scoring matches
 * @param {String}   options.methods[].name - Search algorithm name
 * @param {Number}   options.methods[].weight - Search algorithm weight in scoring
 * @param {Object}   options.methods[].params - Search algorithm parameters
 * @raises {Error} if the search method is not supported or if element are invalid
 */
function score( searchTerm, testString, options = {}, _skipOptionsPrep = false ){
    if( ! _skipOptionsPrep ){
        options = optionsDefaults( options )
        validateOptions( options )
        loadMethods( options )
    }

    if( ! options.caseSensitive ) searchTerm = searchTerm.toLowerCase()
    if( ! options.caseSensitive ) testString = testString.toLowerCase()

    let score = 0, weight = 0
    options.methods.forEach( ( method ) => {
        score += (1 - method.function( searchTerm, testString, method.params )) * method.weight
        weight += method.weight
    })

    return score / weight
}

function optionsDefaults( options ){
    options =  Object.assign({}, {
        results: 0,
        minScore: - Number.MAX_VALUE,
        caseSensitive: false,
        methods: [
            {
                name: 'jaro-winkler',
                params: { p: 0.1 },
                weight: 1.5
            },
            {
                name: 'jaccard',
                params: { n: 2 },
                weight: 1
            },
        ],
    }, options )

    options.methods = options.methods.map(( method ) => {
        if( typeof method === 'string' ){
            method = {
                name: method,
                weight: 1
            }
        } else if( typeof method === 'function' ){
            method = {
                function: method,
                weight: 1
            }
        } else if( typeof method === 'object' ){
            if( method.weight === undefined ) method.weight = 1
        } else {
            throw new Error( 'Invalid method definition' )
        }

        return method
    })

    return options
}

function validateOptions( options ){
    // Raise an error if there are no methods specified
    if( options.methods.length === 0 )
        throw new Error( 'No search methods specified.' )
}

function loadMethods( options ){
    // Load specified methods
    options.methods.forEach( (method, index) => {
        if( method.function ) return // Skip if a function is already defined

        method.function = require( `./methods/${method.name}.js` ).distance
    })
}

exports.fuzzybear = {
    search: search,
    score: score,
}
