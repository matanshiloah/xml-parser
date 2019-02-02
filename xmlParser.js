module.exports = class {
    constructor() {}

    _parseFromString(xmlText) {
        var cleanXmlText = xmlText.replace(/\s{2,}/g, ' ').replace(/\\t\\n\\r/g, '').replace(/>/g, '>\n');
        var rawXmlData = [];

        cleanXmlText.split('\n').map(element => {
            element = element.trim();

            if (!element || element.indexOf('?xml') > -1) {
                return;
            }

            if (element.indexOf('<') == 0 && element.indexOf('CDATA') < 0) {
                var parsedTag = this._parseTag(element);

                rawXmlData.push(parsedTag);

                if (element.match(/\/\s*>$/)) {
                    rawXmlData.push(this._parseTag('</' + parsedTag.name + '>'));
                }
            } else {
                rawXmlData[rawXmlData.length - 1].value = this._parseValue(element);
            }

        });

        return this._convertTagsArrayToTree(rawXmlData)[0];
    }

    _getElementsByTagName(tagName) {
        var matches = [];

        if (tagName == '*' || this.name.toLowerCase() === tagName.toLowerCase()) {
            matches.push(this);
        }

        this.children.map(child => {
            matches = matches.concat(child.getElementsByTagName(tagName));
        });

        return matches;
    }

    _parseTag(tagText, parent) {
        var cleanTagText = tagText.match(/([^\s]*)=('([^']*?)'|"([^"]*?)")|([\/?\w\-\:]+)/g);

        var tag = {
            name: cleanTagText.shift().replace(/\/\s*$/, ''),
            attributes: {},
            children: [],
            value: '',
            getElementsByTagName: this._getElementsByTagName
        };

        cleanTagText.map(attribute => {
            var attributeKeyVal = attribute.split('=');

            if (attributeKeyVal.length < 2) {
                return;
            }

            var attributeKey = attributeKeyVal[0];
            var attributeVal = '';

            if (attributeKeyVal.length === 2) {
                attributeVal = attributeKeyVal[1];
            } else {
                attributeKeyVal = attributeKeyVal.slice(1);
                attributeVal = attributeKeyVal.join('=');
            }

            tag.attributes[attributeKey] = 'string' === typeof attributeVal ? (attributeVal.replace(/^"/g, '').replace(/^'/g, '').replace(/"$/g, '').replace(/'$/g, '').trim()) : attributeVal;
        });

        return tag;
    }

    _parseValue(tagValue) {
        if (tagValue.indexOf('CDATA') < 0) {
            return tagValue.trim();
        }

        return tagValue.substring(tagValue.lastIndexOf('[') + 1, tagValue.indexOf(']'));
    }

    _convertTagsArrayToTree(xml) {
        var xmlTree = [];

        if (xml.length == 0) {
            return xmlTree;
        }

        var tag = xml.shift();

        if (tag.value.indexOf('</') > -1 || tag.name.match(/\/$/)) {
            tag.name = tag.name.replace(/\/$/, '').trim();
            tag.value = tag.value.substring(0, tag.value.indexOf('</'));
            xmlTree.push(tag);
            xmlTree = xmlTree.concat(this._convertTagsArrayToTree(xml));

            return xmlTree;
        }

        if (tag.name.indexOf('/') == 0) {
            return xmlTree;
        }

        xmlTree.push(tag);
        tag.children = this._convertTagsArrayToTree(xml);
        xmlTree = xmlTree.concat(this._convertTagsArrayToTree(xml));

        return xmlTree;
    }

    _toString(xml) {
        var xmlText = this._convertTagToText(xml);


        if (xml.children.length > 0) {
            xml.children.map(child => {
                xmlText += this._toString(child);
            });

            xmlText += '</' + xml.name + '>';
        }

        return xmlText;
    }

    _convertTagToText(tag) {
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

        if (tag.children.length === 0) {
            tagText += '</' + tag.name + '>';
        }

        return tagText;
    }

    parseFromString(xmlText) {
        return this._parseFromString(xmlText);
    }

    toString(xml) {
        return this._toString(xml);
    }
};
