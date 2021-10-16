/**
 * The Jaro–Winkler distance uses a prefix scale `p` which gives more favourable ratings
 * to strings that match from the beginning for a set prefix length `ℓ`.
 *
 * The higher the Jaro–Winkler distance for two strings is - the more similar the strings
 * are. The score is normalized such that 1 means an exact match and 0 means there is no
 * similarity. The original paper actually defined the metric in terms of similarity, so
 * the distance is defined as the inversion of that value (distance = 1 − similarity).
 *
 * @author Jordan Thomas
 * @author Itay Grudev
 * @copyright (c) 2015 Jordan Thomas
 * @copyright (c) 2021 Clustermarket Ltd.
 * @license MIT
 */

/**
 * Calculates the Jaro Winkler similarity between two strings
 * @param {String} a
 * @param {String} b
 * @param {Object} params Parameters for the similarity calculation
 * @param {Number} params.n Constant scaling factor for how much the score is adjusted
 *  upwards for having common prefixes.
 * @returns {Number} Similarity score, normalized between 0 and 1, where 0 is an exact match
 */
exports.distance = (a, b, params )=>{
    params = Object.assign({}, {
        p: 0.1
    }, params )

    // Exit early if either string is empty
    if( a.length === 0 || b.length === 0 ) return 1

    // Exit early if the strings are an exact match.
    if( a === b ) return 0

    let m = 0, i, j

    let range = Math.floor(Math.max( a.length, b.length ) / 2) - 1
    let aMatch = new Array( a.length )
    let bMatch = new Array( b.length )
    for( i = 0; i < a.length; i++ ){
        let low = (i >= range) ? i - range : 0
        let high = (i + range <= (b.length - 1)) ? (i + range) : (b.length - 1)
        for( j = low; j <= high; j++ ){
            if( aMatch[i] !== true && bMatch[j] !== true && a[i] === b[j] ){
                ++m
                aMatch[i] = bMatch[j] = true
                break
            }
        }
    }
    // Exit early if no matches were found.
    if( m === 0 ) return 1

    // Count the transpositions.
    let k = 0, numTrans = 0
    for( i = 0; i < a.length; i++ ){
        if( aMatch[i] === true ){
            for( j = k; j < b.length; j++ ){
                if( bMatch[j] === true ){
                    k = j + 1
                    break
                }
            }
            if( a[i] !== b[j] ) ++numTrans
        }
    }
    let weight = (m / a.length + m / b.length + (m - (numTrans / 2)) / m) / 3
    let l = 0
    if( weight > 0.7 ){
        while( a[l] === b[l] && l < 4 ) ++l
        weight += l * params.p * (1 - weight)
    }
    return 1 - weight
}
