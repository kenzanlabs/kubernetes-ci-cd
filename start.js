#!/usr/bin/node

YAML = require('yamljs');
var inquirer = require('inquirer');
var Rx = require('rx');
var prompts = new Rx.Subject();

const execSync = require('child_process').execSync;

var ymlpath = process.argv[2];


inquirer.prompt(prompts).ui.process.subscribe(
    function(answers) {
        if(answers.hasOwnProperty('answer') && answers['answer'] === true){
            execSync(answers.name, {
                stdio: [0, 1, 2],
                env: process.env
            })
        } else {
            console.log('Skipping execution of: ', answers.name)
        }
    },
    function(err) {
        console.log('error')
    },
    function(message) {
        console.log('complete')
    }
);

prompts.onNext({
    type: 'confirm',
    name: ":",
    message: "Welcome to the Linux.com interactive Kubernetes tutorial by Kenzan. Press enter to begin\n",
    default: true
});

YAML.load(ymlpath, function(docs) {
    var stepIndex = 1;
    docs.parts.forEach(function(item) {
        item.steps.forEach(function(step) {
            prompts.onNext({
                type: 'confirm',
                name: step.com,
                message: "\n\n\n" + item.name + " Step: " + stepIndex++ + "\n" + step.cap + "\n\n" + step.com + "\n\nPress enter to the run the above command for the step.",
                default: true
            });
        })
    })
    prompts.onCompleted();
});
