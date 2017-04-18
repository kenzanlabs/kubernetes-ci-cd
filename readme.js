#!/usr/bin/node

YAML = require('yamljs');
var fs = require('fs');

var markdown = "# Kubernetes ci/cd whitepaper for Linux.com\n\n This readme is dynamically generated when `node readme.js`";
markdown = markdown + "\n\n## Interactive tutorial version"
markdown = markdown + "\n* clone this repo\n"
markdown = markdown + "\n* Ensure you are starting with a clean slate: `minikube delete; minikube rm -rf ~/.minikube; rm -rf ~/.kube`\n"
markdown = markdown + "\n* run `npm install`\n"
markdown = markdown + "\nBegin the desired section `npm run part1` `npm run part2` `npm run part3`"
markdown = markdown + "\n\n## Manual tutorial version\n\n"

YAML.load('steps.yml', function(docs)
{
    docList = docs.parts;
    var parts = docs.parts;

    parts.forEach(function (item) {
        markdown = markdown + "## " + item.name + "\n"
        var part = item.name;
        markdown = markdown + "\n\n### " + item.name + "\n\n"
        var stepNum = 0;
        var stepList = item.steps;

        // console.log(item.steps);
        stepList.forEach(function (step) {
            stepNum++;
            markdown = markdown + "\n\n### Step" + stepNum
            markdown = markdown + "\n\n" + step.cap
            markdown = markdown + "\n\n`" + step.com + "`"
        })

    
    })


      fs.writeFile("README.md", markdown, function(err) {
    if(err) {
        return console.log(err);
    }

        console.log("README.md saved!");
    }); 

});