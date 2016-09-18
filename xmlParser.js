function XMLParser() {
    function parseFromString(xmlText) {
        xmlText = xmlText.replace(/\s{2,}/g, '').replace(/\\t\\n\\r/g, '').replace(/>/g, '>\n');
        var tags = xmlText.split('\n');
        var xml = [];
        
        for (var i = 0; i < tags.length; i++) {
            if (tags[i].indexOf('?xml') < 0) {
                if (tags[i].indexOf('<') == 0 && tags[i].indexOf('CDATA') < 0) {
                    xml.push(parseTag(tags[i]));
                } else {
                    xml[xml.length - 1].value = parseValue(tags[i]);
                }
            }
        }
                
        return convertTagsArrayToTree(xml)[0];
    }
    
    function parseTag(tagText, parent) {
        tagText = tagText.replace('<', '').replace('>', '').split(' ');
        
        var tag = {
            name: tagText[0],
            attributes: {},
            children: [],
            value: '',
            getElementsByTagName: function (tagName) {
                var matches = [];
                
                if (tagName == '*' || this.name.toLowerCase() == tagName.toLowerCase()) {
                    matches.push(this);
                }
                
                for (var i = 0; i < this.children.length; i++) {
                    matches = matches.concat(this.children[i].getElementsByTagName(tagName));
                }
                
                return matches;
            }
        };
        
        for (var i = 1; i < tagText.length; i++) {
            var attribute = tagText[i].split('=');
            
            tag.attributes[attribute[0]] = attribute[1].replace(/"/g, '').replace(/'/g, '').trim();
        }
        
        return tag;
    }
    
    function parseValue(tagValue) {
        if (tagValue.indexOf('CDATA') < 0) {
            return tagValue.trim();
        }
        
        return tagValue.substring(tagValue.lastIndexOf('[') + 1, tagValue.indexOf(']'));
    }
    
    function convertTagsArrayToTree(xml) {
        var xmlTree = [];
        
        if (xml.length == 0) {
            return xmlTree;
        }
        
        var tag = xml.shift();
        
        if (tag.value.indexOf('</') > -1) {
            tag.value = tag.value.substring(0, tag.value.indexOf('</'));
            xmlTree.push(tag);
            xmlTree = xmlTree.concat(convertTagsArrayToTree(xml));
            
            return xmlTree;
        }
        
        if (tag.name.indexOf('/') == 0) {
            return xmlTree;
        }
        
        xmlTree.push(tag);
        tag.children = convertTagsArrayToTree(xml);
        xmlTree = xmlTree.concat(convertTagsArrayToTree(xml));
        
        return xmlTree;
    }
    
    function toString(xml) {
        var xmlText = convertTagToText(xml);
        
        if (xml.children.length > 0) {
            for (var i = 0; i < xml.children.length; i++) {
                xmlText += toString(xml.children[i]);
            }
            
            xmlText += '</' + xml.name + '>';
        }
        
        return xmlText;
    }
    
    function convertTagToText(tag) {
        var tagText = '<' + tag.name;
        var attributesText = [];
        
        for (var attribute in tag.attributes) {
            tagText += ' ' + attribute + '="' + tag.attributes[attribute] + '"';
        }
        
        if (tag.value.length > 0) {
            tagText += '>' + tag.value + '</' + tag.name + '>';
        } else {
            tagText += '>';
        }
        
        return tagText;
    }
    
    return {
        parseFromString: function (xmlText) {
            return parseFromString(xmlText);
        },
        toString: function (xml) {
            return toString(xml);
        }
    };
}

module.exports = XMLParser;