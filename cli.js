#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs';
import { createInterface } from 'readline';
import chalk from 'chalk';

// Load data from JSON file
const data = JSON.parse(readFileSync('./data.json', 'utf8'));

console.log(data.random1);


// Function to save data back to JSON file
function saveData() {
  writeFileSync('./data.json', JSON.stringify(data, null, 2));
}

// List all available commands
console.log('Available commands:');
console.log('- exit: Exit the CLI tool');
console.log('- getRandom (or gR): Select two different random objects');
console.log('- select <choice>: Select an element by providing a valid string choice');
console.log('- show <choice>: Display stats of the selected element');
console.log('- clear: Sets every stat of every dataobject to 0');

// Create readline interface
const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Process users input
rl.on('line', (input) => {
  const [command, ...args] = input.trim().split(' ');

  switch (command) {
    case 'exit':
      console.log('Exitin the tool..');
      rl.close();
      break;

    case 'getRandom':
    case 'gR':
      const randomKeys = Object.keys(data);
      const randomIndex1 = Math.floor(Math.random() * randomKeys.length);
      let randomIndex2 = Math.floor(Math.random() * randomKeys.length);
      while (randomIndex2 === randomIndex1) {
        randomIndex2 = Math.floor(Math.random() * randomKeys.length);
      }

      const random1 = randomKeys[randomIndex1];
      const random2 = randomKeys[randomIndex2];

      console.log(`"${random1}" vs "${random2}". Choose with 1 or 2.`);

      choose(random1, random2);

      
      break;

    case 'select':
      const choice = args[0];
      if (Object.keys(data).includes(choice)) {
        console.log(`Selected element: ${choice}`);
        console.log(JSON.stringify(data[choice], null, 2));
      } else {
        console.log('Invalid choice.');
      }
      console.log(""); // Add an empty line for better output formatting
      break;

    case 'show':
      const showChoice = args[0];
      show(showChoice);
      break;

    case 'clear':
      clear();
      // Added an empty line for better output formatting
      console.log("");
      break;
      
    default:
      console.log('Invalid command. Please try again.');
      // Added an empty line for better output formatting
      console.log(""); 
      break;
  }
});


function Winner(winner){
    let winning = `${winner}`
    data[winning].gamesPlayed++;
    data[winning].wins++;
    data[winning].winRate = data[winning].wins/data[winning].gamesPlayed;

}

function Loser(loser){
    let losing = `${loser}`
    data[losing].gamesPlayed++;
    data[losing].looses++;
    data[losing].winRate = data[losing].wins/data[losing].gamesPlayed;
    
}

function clear(){
  for(const key of Object.keys(data)){
    data[key].gamesPlayed = 0;
    data[key].wins = 0;
    data[key].looses = 0;
    data[key].winRate = 0;

  }
}

function choose(random1, random2){
  rl.question('Enter your choice: ', (choice) => {
    if (choice === '1' || choice === '2') {
      const selected = choice === '1' ? random1 : random2;
      const notSelected = choice === '1' ? random2 : random1;

      console.log(`You selected "${selected}".`);
      Winner(selected);
      Loser(notSelected)
      saveData();
      show(selected);
    } else {
      console.log('Invalid choice. Try again or exit with Crtl+C');
      choose();
      
    }

    console.log(""); // Add an empty line for better output formatting
  });
}

function show(choice){
  
      if (Object.keys(data).includes(choice)) {
        console.log(`\nShowing stats for ${choice}:`);
        console.log(JSON.stringify(data[choice], null, 2));
      } else {
        console.log('Invalid choice.');
      }
      // Added an empty line for better output formatting
      console.log(""); 
}

// Handle CLI tool exit
rl.on('close', () => {
  console.log('Exiting the CLI tool...');
  process.exit(0);
});
