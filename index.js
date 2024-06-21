// script.js
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var canvasRect = canvas.getBoundingClientRect();
var offsetX = canvasRect.left;
var offsetY = canvasRect.top;
var startX;
var startY;
var isDown = false;
var selectedOval = null;
var ovals = [];
var colors = ["red", "green", "blue", "orange", "purple", "cyan", "magenta"];
var currentColorIndex = 0;

function getNextColor() {
    var color = colors[currentColorIndex];
    currentColorIndex = (currentColorIndex + 1) % colors.length;
    return color;
}

function drawAllOvals() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ovals.forEach(function (oval) {
        drawOval(oval.startX, oval.startY, oval.endX, oval.endY, oval.color);
        // Fill the oval for selection
        ctx.fillStyle = oval.color;
        ctx.globalAlpha = 0.2; // Adjust transparency for better visibility
        ctx.fill();
        ctx.globalAlpha = 1.0;
    });
}

function drawOval(startX, startY, endX, endY, color) {
    ctx.beginPath();
    ctx.moveTo(startX, startY + (endY - startY) / 2);
    ctx.bezierCurveTo(startX, startY, endX, startY, endX, startY + (endY - startY) / 2);
    ctx.bezierCurveTo(endX, endY, startX, endY, startX, startY + (endY - startY) / 2);
    ctx.closePath();
    ctx.strokeStyle = color;
    ctx.stroke();
}

function handleMouseDown(e) {
    e.preventDefault();
    e.stopPropagation();
    var mouseX = parseInt(e.clientX - offsetX);
    var mouseY = parseInt(e.clientY - offsetY);
    selectedOval = null;

    // Check if the click is inside any existing oval
    ovals.forEach(function (oval) {
        if (mouseX >= oval.startX && mouseX <= oval.endX &&
            mouseY >= oval.startY && mouseY <= oval.endY) {
            selectedOval = oval;
            startX = oval.startX;
            startY = oval.startY;
            endX = oval.endX;
            endY = oval.endY;
            return;
        }
    });

    if (!selectedOval) {
        startX = mouseX;
        startY = mouseY;
        isDown = true;
    }
}

function handleMouseUp(e) {
    if (!isDown && !selectedOval) {
        return;
    }
    e.preventDefault();
    e.stopPropagation();

    if (selectedOval) {
        selectedOval = null; // Clear selected oval after dragging
    } else {
        var endX = parseInt(e.clientX - offsetX);
        var endY = parseInt(e.clientY - offsetY);
        var color = getNextColor();
        ovals.push({ startX: startX, startY: startY, endX: endX, endY: endY, color: color });
        drawAllOvals();
        console.log(ovals); // Log the ovals array
    }
    isDown = false;
}

function handleMouseMove(e) {
    if (!isDown && !selectedOval) {
        return;
    }
    e.preventDefault();
    e.stopPropagation();
    var mouseX = parseInt(e.clientX - offsetX);
    var mouseY = parseInt(e.clientY - offsetY);

    if (selectedOval) {
        // Calculate new positions for the selected oval
        var deltaX = mouseX - startX;
        var deltaY = mouseY - startY;
        selectedOval.startX += deltaX;
        selectedOval.startY += deltaY;
        selectedOval.endX += deltaX;
        selectedOval.endY += deltaY;

        // Update start and end points for drawing
        startX = mouseX;
        startY = mouseY;
        endX = selectedOval.endX;
        endY = selectedOval.endY;

        // Redraw all ovals with the updated position
        drawAllOvals();
    } else {
        // Draw the oval while dragging
        drawAllOvals();
        var color = getNextColor();
        drawOval(startX, startY, mouseX, mouseY, color);
    }
}

canvas.addEventListener("mousedown", handleMouseDown);
canvas.addEventListener("mousemove", handleMouseMove);
canvas.addEventListener("mouseup", handleMouseUp);

function init() {
    // Initial function to set up canvas and listeners
    canvas.width = 600;
    canvas.height = 400;
}

init();  // Initialize the canvas
