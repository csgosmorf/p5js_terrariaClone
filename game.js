var textures = [];
var items = [];
var xoff = 0.0;
var xBlocks;
var yBlocks;
var minYBlocks;
var blocks;
var trees;
var player;
var currentCamX;
var currentCamY;
var myWindow;
var blockSize;
var terrainIntensity;
var inv = 0;

function preload() {
    for (var i = 0; i <= 3; i++) {
        textures[i] = loadImage("images/textures/" + i + ".png");
    }

//    for (var i = 0; i <= 2; i++) {
//        items[i] = loadImage("images/items/" + i + ".png");
//    }

    // Game Configuration
    pixelDensity(5);
    xBlocks = 1024;
    yBlocks = 20;
    minYBlocks = 80;
    blockSize = 30;
    blocks = make2Darray(xBlocks + 1, minYBlocks + yBlocks + 200);
    trees = [];
    terrainIntensity = 0.044;

}

function setup() {
    createCanvas(1920, 974);
    myWindow = new Window();
    createBlocks(blockSize, terrainIntensity);
    player = new Player((xBlocks * blockSize) / 2, ((yBlocks + minYBlocks) * -blockSize));
    player.initializeInventory();
    smoothTerrain();
    makeTrees();
    //createCaves();
    createCopper();
    cursor("images/cursors/myCursor.png",0,0);
}


function draw() {
    background(0,191,255);
    player.update();
    player.move();
    moveCamera();
    displayBlocks();
    player.display();
    player.toolbar();
    player.interaction();
}
