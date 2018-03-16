# react-xml-parser

A simple and user-friendly XML parser for React-native developers.
This library's goal is to parse simple XML responses, from and to string.

# Installation

```
$ npm install react-xml-parser
```

# Example

XML:

```
<?xml version='1.0' encoding='utf-8'?>
<Library>
   <Books count='1'>
       <Book id='1'>
           <Name>Me Before You</Name>
           <Author>Jojo Moyes</Author>
       </Book>
   </Books>
   <Music count=1>
       <CD id='2'>
           <Name>Houses of the Holy</Name>
           <Artist>Led Zeppelin</Artist>
       </CD>
   </Music>
</Library>
```

JS:

```
var XMLParser = require('react-xml-parser');
var xml = new XMLParser().parseFromString(xmlText);    // Assume xmlText contains the example XML
console.log(xml);
console.log(xml.getElementsByTagName('Name'));
```

Output:

```
// XML parsing response
{
    name: 'Library', attributes: {}, value: '', chiildren: [
        {
            name: 'Books', attributes: { count: '1' }, value: '', children: [
                {
                    name: 'Book', attributes: { id: '1' }, value: '', children: [
                        {
                            name: 'Name', attributes: {}, value: 'Me Before You', children: []
                        }, {
                            name: 'Author', attributes: {}, value: 'Jojo Moyes', children: []
                        }
                    ]
                }
            ]
        },
        {
            name: 'Music', attributes: { count: '1' }, value: '', children: [
                {
                    name: 'CD', attributes: { id: '2' }, value: '', children: [
                        {
                            name: 'Name', attributes: {}, value: 'Houses of the Holy', children: []
                        }, {
                            name: 'Artist', attributes: {}, value: 'Led Zeppelin', children: []
                        }
                    ]
                }
            ]
        }
    ]
}

// getElementsByTagName response
[
    {
        name: 'Name', attributes: {}, value: 'Me Before You', children: []
    }, {
        name: 'Name', attributes: {}, value: 'Houses of the Holy', children: []
    }
]
```

# Usage

Methods that are currently supported:

1. parseFromString(string): Returns an XML object as described in the example output that represents the input text.

2. toString(XML object): Returns text representation of an input XML.

3. getElementsByTagName(string): Returns all tags with the same name as the method's input string (case-insensitive). for all possible tags, use '*' as input.

# License

ISC