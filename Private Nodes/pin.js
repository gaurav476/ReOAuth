
function generatePIN() {    
    var digits = Math.floor(Math.random() * 6) + 4 // 4 to 9 digits 
    let PIN = '';
    for (let i = 0; i < digits; i++) { 
        PIN += Math.floor(Math.random() * 10); 
    } 
    return PIN; 
} 

console.log(generatePIN());
