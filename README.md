Fuzzybear
=========
[![Tests](https://github.com/clustermarket/fuzzybear/actions/workflows/tests.yml/badge.svg)](https://github.com/clustermarket/fuzzybear/actions/workflows/tests.yml)
[![CodeQL](https://github.com/clustermarket/fuzzybear/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/clustermarket/fuzzybear/actions/workflows/codeql-analysis.yml)

Fuzzybear is a JavaScript library for fuzzy string search with a special focus on short strings. It is designed to use 
multiple string distance functions (including custom) but by default it uses a combination of Jaro-Winkler and Jaccard 
string distances. The former favours matches from the beginning of a string, while the latter splits the string into
tokens and analyses those. Together these provide a reasonable performance for  most cases, but the library allows the
user to customise the methods and parameters for searching.

![Fuzzy bear](fuzzybear.jpg "Cute Fuzzy Bear")

Usage
-----

### Subset Search

`fuzzybear.search` is the primary method used for searching. It accepts either a string array or an object. array where
each element contains a key `value`.

```js
let matches = [ 'Identical', 'Identifier', 'dentical', 'Dental', 'dentist', 'different' ]
// OR
let matches = [
    { value:'Identical', id: 's0' },
    { value:'Identifier', id: 's1' },
    { value:'dentical', id: 's2' },
    { value:'Dental', id: 's3' },
    { value:'dentist', id: 's4' },
    { value:'Different', id: 's5' },
]
fuzzybear.search( 'Identical', matches )
```

You can also restrict the number of results returned:

```js
fuzzybear.search( 'Identical', matches, { results: 3 })
```

### Manual scoring
```js
fuzzybear.score( 'prism', 'contact' )    // => 0
fuzzybear.score( 'prism', 'prism' )      // => 1
fuzzybear.score( 'prism', 'unpristine' ) // => 0.56
```

### Advanced usage

You can pass custom methods and/or use one of the implemented methods in fuzzybear. You can also specify certain method
parameters to override the method's behaviour. For example, you can use a minimum of 3 letter substring matches in the
Jaccard search method to ignore matches with less than 3 letters.

```js
fuzzybear.search( 'Identical', matches, { 
    methods: [
        {
            name: 'jaccard',
            params: { n: 3 } // Minimum ngram length
        }
    ]
})
```

License
-------

All code and documentation are licensed under the MIT license.
