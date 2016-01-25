angular.module('ex2').service('xmlparserService',function() {


    var parseXml=function(xml, arrayTags) //xml to javascript object pharser
    {
        // create xml DOM object
        var dom = null;
        if (window.DOMParser)
        {
            dom = (new DOMParser()).parseFromString(xml, "text/xml");
        }
        else if (window.ActiveXObject)
        {
            dom = new ActiveXObject('Microsoft.XMLDOM');
            dom.async = false;
            if (!dom.loadXML(xml))
            {
                throw dom.parseError.reason + " " + dom.parseError.srcText;
            }
        }
        else
        {
            throw "cannot parse xml string!";
        }


        function parseNode(xmlNode, result) // pars XML nodes
        {
            if(xmlNode.nodeName == "#text" && xmlNode.nodeValue.trim() == "")
            {
                return;
            }

            var jsonNode = {};
            var existing = result[xmlNode.nodeName];
            if(existing)
            {
                if(!angular.isArray(existing))
                {
                    result[xmlNode.nodeName] = [existing, jsonNode];
                }
                else
                {
                    result[xmlNode.nodeName].push(jsonNode);
                }
            }
            else
            {
                if(arrayTags && arrayTags.contains(xmlNode.nodeName))
                {
                    result[xmlNode.nodeName] = [jsonNode];
                }
                else
                {
                    result[xmlNode.nodeName] = jsonNode;
                }
            }

            if(xmlNode.attributes)
            {
                angular.forEach(xmlNode.attributes, function(attributesValue, attributesKey) {
                    var attribute = attributesValue;
                    jsonNode[attribute.nodeName] = attribute.nodeValue;
                });
            }


            angular.forEach(xmlNode.childNodes, function(childNodesValue, childNodesKey) {
                parseNode(childNodesValue, jsonNode);
            });
            
        }

        var result = {};
        if(dom.childNodes.length)
        {
            parseNode(dom.childNodes[0], result);
        }

        // return object result
        return result;
    }

    // method to create object with list secound nodes, and count all subnodes of them
    this.generateParseArray=function(userXml)
    {

        // define object to return
        var listOfChild=new Array();
        // defain validate error var
        var parseCorrect=true;

        var userObject=parseXml(userXml);

        // method to create object with name nodes and count subnodes
        var pushElement = function (name,valueToCount)
        {
            if(name=='parsererror' ||name=='body') // if nodes cant be parsed (xml has bad structure) return false
            {
                return null;
            }
            else // return object to push in final array
            {
                var objectToPush={
                    "name":name,
                    "size": Object.keys(valueToCount).length
                };

                return objectToPush;
            }
        }

        // method using to build list of child
        var buildListOfChild = function(name,valueToCount){
            var objectToPush=pushElement(name,valueToCount);
            if(!objectToPush) // if objcet cant be parsed change value of validete var
            {
                parseCorrect=false;
            }
            else // if parse was goot push object to array
            {
                listOfChild.push(objectToPush);
            }
        }

        angular.forEach(userObject, function(valueFirst, keyFirst) // iterate first nodes
        {
                angular.forEach(valueFirst, function(valueSecound, keySecound) // iterate secound nodes
                {
                    if(angular.isArray(valueSecound)) // if elements in xml string are repeated
                    {
                        angular.forEach(valueSecound, function(valueThrid, keyThrid) // iterate at reoeated elements
                        {
                            buildListOfChild(keySecound,valueThrid);
                        }); 
                    }
                    else {
                        buildListOfChild(keySecound,valueSecound);
                    }
                });
            
        });


        return  ( (parseCorrect) ? listOfChild: false);

    }


});