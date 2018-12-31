function make2Darray(cols, rows) {
    var arr = new Array(cols);
    for (var i = 0; i < arr.length; i++) {
        arr[i] = new Array(rows);
    }
    return arr;
}

function Block(x, y, id, h, placed, hp, w) {
    this.x = x;
    this.y = y;
    this.left = x;
    this.right = x + blockSize;
    this.top = y;
    this.bottom = y + blockSize;
    this.id = id;
    this.h = h;
    this.w = w;
    this.placed = placed;
    this.hp = hp;
    
    this.display = function() {
        strokeWeight(1);
        stroke(0);
            image(textures[this.id], this.x, this.y, blockSize, blockSize);
    }
}

function createBlocks(blockSize, noiseIntensity) {
    var n = int(noise(xoff) * yBlocks);
    
    for (var x = 0; x <= (xBlocks); x++) {
        for (var y = 0; y <= n + minYBlocks; y++) {
            if (y != n + minYBlocks) {
                blocks[x][y] = new Block(x * blockSize, (y * -blockSize), 0, 1, false, 3, 3);
            }
            else {
                blocks[x][y] = new Block(x * blockSize, (y * -blockSize), 1, 1, false, 3, 3);
            }
        }
        xoff += noiseIntensity;
        n = int(noise(xoff) * yBlocks);
    }
}

function displayBlocks() {
    for (var i = int((player.x - width/2) / blockSize); i <= int((player.x + width/2) / blockSize); i++) {
        if (i >= 0 && i <= xBlocks - 1) {
            for (var j = int((-player.y - height/2) / blockSize); j <= int((-player.y + height/2 + blockSize) / blockSize); j++) {
                if (j >= 0 && j <= minYBlocks + yBlocks + 200) {
                    if (blocks[i][j] != null) {
                        blocks[i][j].display();
                    }
                }
            }
        }
    }
}

function smoothTerrain() {
    var smooth = false;
    while (smooth == false) {
        smooth = true;
        for (var x = 1; x <= xBlocks - 1; x++) {
            for (var y = minYBlocks; y <= blocks[x].length; y++) {
                if (blocks[x][y] != null) {
                    if (blocks[x][y].id == 1) {
                        if (blocks[x-1][y] == null && blocks[x+1][y] == null) {
                            smooth = false;
                            blocks[x].splice(y, 1);
                            for (var found = 1; found > 0; found++) {
                                if (blocks[x][y - found] != null) {
                                    blocks[x][y - found].id = 1;
                                    found = -1;
                                }
                                if (found > minYBlocks + yBlocks) {
                                    found = -1;
                                }
                            }
                        }
                        if (blocks[x][y] != null) {
                            if (blocks[x-1][y+1] != null && blocks[x+1][y+1] != null) {
                                smooth = false;
                                blocks[x][y].id = 0;
                                blocks[x][y + 1] = new Block(blocks[x][y].x, blocks[x][y].y - blockSize, 1, 1, false, 3);
                            }
                        }
                    }
                }
            }
        }
    }
}

function makeTrees() {
    for (var x = 6; x<= xBlocks - 6; x++) {
        for (var y = minYBlocks; y<= blocks[x].length; y++) {
            if (blocks[x][y] != null) {
                if (blocks[x][y].id == 1) {
                    if (blocks[x-1][y] != null && blocks[x+1][y] != null) {
                        if(blocks[x-1][y].id == 1 && blocks[x+1][y].id == 1) {
                            if (blocks[x-1][y+1] == null && blocks[x+1][y+1] == null) {
                                if (blocks[x - 2][y+1] == null && blocks[x+2][y+1] == null) {
                                    var chance = random(0, 1);
                                    if (chance <= 0.25) {
                                        var randHeight = int(random(5, 18));
                                        for (var i = 1; i <= randHeight; i++) {
                                            if (y + 8 < blocks[x].length - 1);
                                            blocks[x][y + i] = new Block(blocks[x][y].x, blocks[x][y].y - blockSize * i, 2, randHeight, false, 25);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

function createCaves() {
    var caves = int(random(10, 15));
    for (var i = 0; i <= caves; i++) {
        var x = int(random(0, xBlocks - 1));
        var y = int(random(0, minYBlocks));
        for (var j = 0; j <= 5000; j++) {
            if (x >= 0 && x <= xBlocks - 1) {
                if (y >= 0 && y <= minYBlocks + yBlocks) {
                    if (blocks[x][y] != null) {
                        blocks[x][y] = null;
                    }
                    console.log(x, y);
                }
            }
            var walkDir = random(0, 1);
            if (walkDir <= 0.25) {
                x--;
            } else if (walkDir <= 0.5) {
                x++;
            } else if (walkDir <= 0.75) {
                y--;
            } else if (walkDir <= 1) {
                y++;
            }
        }
    }
}

function createCaves() {
    var caves = int(random(10, 15));
    for (var i = 0; i <= caves; i++) {
        var x = int(random(0, xBlocks - 1));
        var y = int(random(0, minYBlocks));
        for (var j = 0; j <= 100; j++) {
            if (x >= 0 && x <= xBlocks - 1) {
                if (y >= 0 && y <= minYBlocks + yBlocks) {
                    for (var tempX = -5; tempX <= 5; tempX++) {
                        for (var tempY = -5; tempY <= 5; tempY++) {
                            if (x + tempX >= 0 && x + tempX <= xBlocks - 1) {
                                if (y + tempY >= 0 && y + tempY <= minYBlocks + yBlocks) {
                                    if (blocks[x + tempX][y + tempY] != null) {
                                        blocks[x + tempX][y + tempY] = null;
                                        console.log(x + tempX, y + tempY);
                                    }
                                }
                            }
                        }
                    }
//                    if (blocks[x][y] != null) {
//                        blocks[x][y] = null;
//                    }
                    //console.log(x, y);
                }
            }
            var walkDir = random(0, 1);
            if (walkDir <= 0.25) {
                x-= 5;
            } else if (walkDir <= 0.5) {
                x+= 5;
            } else if (walkDir <= 0.75) {
                y-= 5;
            } else if (walkDir <= 1) {
                y+= 5;
            }
        }
    }
}

function createCopper() {
    var deposits = int(random(100, 120));
    for (var i = 0; i <= deposits; i++) {
        //createDeposit(someX, someY, 3);
        createDeposit(int(random(0, blocks.length - 1)), int(random(0, minYBlocks)), 3);
    }
}

function createDeposit(x, y, id) {
    var cycles = int(random(3, 9));
    var depX = x;
    var depY = y;
    console.log(x, y);
    for (var j = 0; j <= cycles; j++) {
        if (isBlock(depX, depY)) {
            blocks[depX][depY] = new Block(depX * blockSize, (depY * -blockSize), id, 1, false, 8);
        }
        console.log(depX, depY);
        var tempChance = random(0, 1);
        if (tempChance <= 0.25) {
            depX++;
        }
        else if (tempChance <= 0.5) {
            depX--;
        }
        else if (tempChance <=0.75) {
            depY++;
        }
        else {
            depY--;
        }
    }
}

function someX() {
    return int(random(0, blocks.length - 1));
}

function someY() {
    return int(random(0, minYBlocks));
}

function moveCamera() {
    currentCamX = player.x - width/2;
    currentCamY = player.y - height/2;
    camera(currentCamX, currentCamY);
    myWindow.update();
}

function Window() {
    this.top;
    this.bottom;
    this.left;
    this.right;
    
    this.update = function() {
        this.top = currentCamY - height/2;
        this.bottom = currentCamY + height/2;
        this.left = currentCamX - width/2;
        this.right = currentCamX + width/2;
    }
}