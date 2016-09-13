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
            
            tag.attributes[attribute[0]] = attribute[1].replace(/"/g, '').trim();
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
        
        if (tag.name.indexOf('/') == 0) {
            return xmlTree;
        }
        
        xmlTree.push(tag);
        tag.children = convertTagsArrayToTree(xml);
        xmlTree = xmlTree.concat(convertTagsArrayToTree(xml));
        
        return xmlTree;
    }
    
    return {
        parseFromString: function (xmlText) {
            return parseFromString(xmlText);
        }
    };
}

module.exports = XMLParser;