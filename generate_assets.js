const fs = require('fs');
const { createCanvas } = require('canvas');

const ingredients = [
    { name: 'bread_top', color: '#F4A460' },
    { name: 'bread_bottom', color: '#F4A460' },
    { name: 'lettuce', color: '#90EE90' },
    { name: 'cheese', color: '#FFD700' },
    { name: 'tomato', color: '#FF6347' },
    { name: 'meat', color: '#8B4513' },
    { name: 'bacon', color: '#CD5C5C' },
    { name: 'egg', color: '#FFFACD' },
    { name: 'mayo', color: '#FFFFFF' },
    { name: 'mustard', color: '#FFD700' },
    { name: 'ketchup', color: '#FF0000' },
    { name: 'onion', color: '#DDA0DD' }
];

const uiElements = [
    { name: 'order_box', width: 300, height: 150, color: '#4A4A4A' },
    { name: 'timer_bar_bg', width: 300, height: 20, color: '#333333' },
    { name: 'timer_bar_fill', width: 300, height: 20, color: '#00FF00' },
    { name: 'button_start', width: 200, height: 50, color: '#4CAF50' },
    { name: 'ingredient_button', width: 120, height: 40, color: '#808080' },
    { name: 'stack_area', width: 200, height: 400, color: '#DCDCDC' },
    { name: 'background', width: 800, height: 600, color: '#87CEEB' }
];

const customers = [
    { name: 'customer1', color: '#FFB6C1' },
    { name: 'customer2', color: '#98FB98' },
    { name: 'customer3', color: '#DDA0DD' }
];

function createImage(name, width, height, color) {
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    
    // Fill background
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, width, height);
    
    // Add border
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, width - 2, height - 2);
    
    // Add text
    ctx.fillStyle = '#000000';
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(name, width / 2, height / 2);
    
    return canvas.toBuffer();
}

// Create ingredient images
ingredients.forEach(ing => {
    const buffer = createImage(ing.name, 100, 60, ing.color);
    fs.writeFileSync(`assets/images/ingredients/${ing.name}.png`, buffer);
});

// Create UI elements
uiElements.forEach(ui => {
    const buffer = createImage(ui.name, ui.width, ui.height, ui.color);
    fs.writeFileSync(`assets/images/ui/${ui.name}.png`, buffer);
});

// Create customer avatars
customers.forEach(customer => {
    const buffer = createImage(customer.name, 100, 100, customer.color);
    fs.writeFileSync(`assets/images/customers/${customer.name}.png`, buffer);
});
