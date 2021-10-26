/**
 *  Jaccard index, also known as the Jaccard similarity coefficient, is a statistic used
 *  for gauging the similarity and diversity of sample sets.
 *
 * @author Subhajit Sahu
 * @author Itay Grudev
 * @copyright (c) 2020 Subhajit Sahu
 * @copyright (c) 2021 Clustermarket Ltd.
 * @license MIT
 */

/**
 * Calculates the Jaccard similarity between two strings
 * @param {String} a
 * @param {String} b
 * @param {Object} params Parameters for the similarity calculation
 * @param {Number} params.n Minimum Ngram length
 *  upwards for having common prefixes.
 * @returns {Number} Similarity score, normalized between 0 and 1, where 0 is an exact match
 */
export default function distance(a, b, params ){
    params = Object.assign({}, {
        n: 2
    }, params )

    // Exit early if either string is empty
    if( a.length === 0 || b.length === 0 ) return 1

    // Exit early if they're an exact match.
    if( a === b ) return 0

    let ga = Math.max(a.length - params.n + 1, 0)
    let gb = Math.max(b.length - params.n + 1, 0)
    let G = ga + gb, g = matchingNgramCount( a, b, params.n )
    return G ? 1 - g/(G-g): 1
}

function matchingNgramCount( a, b, n ){
  let m = new Map(), z = 0;
  for( let i = 0, I = a.length - n + 1; i < I; ++i ){
    let g = a.substr( i, n )
    m.set( g, (m.get( g ) || 0) + 1 )
  }
  for( let i = 0, I = b.length-n + 1; i<I; ++i){
    let g = b.substr( i, n ), c = m.get( g )
    if( c ){ z++; m.set( c - 1 )}
  }

  return z;
}
