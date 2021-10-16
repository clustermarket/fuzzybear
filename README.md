Fuzzybear
=========
Fuzzybear is a JavaScript library for fuzzy string search with a special focus on performing equally well on short strings
as it does on long text. It is designed to use multiple string distance functions (including custom) but by default it
uses a combination of Jaro-Winkler and Jaccard string distances. The former favours matches from the beginning of a string,
while  the latter splits the string into tokens and analyses those. Together these provide a reasonable performance for
most cases, but the library allows the user to customise the methods and parameters for searching.

![Fuzzy bear](fuzzybear.jpg "Cute Fuzzy Bear")

Usage
-----

TODO. See tests for examples.

License
-------

All code and documentation are licensed under the MIT license.
