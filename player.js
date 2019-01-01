function Player(x, y) {
    this.x = x;
    this.y = y;
    this.xspeed = 0;
    this.yspeed = 0;
    this.accellx = 0;
    this.accelly = 0;
    this.toolPlace = 0;
    this.inventory = make2Darray(27, 2);

    this.initializeInventory = function() {
        for (var i = 0; i < this.inventory.length; i++)
            this.inventory[i][1] = 0;
    }

    this.toolbar = function() {
        textSize(20);
        for (var i = 0; i <= 8; i++) {
            if (i == this.toolPlace) {
                fill(0, 131, 195, 160);
                strokeWeight(3);
                stroke(0, 131, 195, 240);
                rectMode(CORNER);
                rect(this.x - width/2 + 45 + i * 90, this.y - height/2 + 20, 80, 80, 15);
                if (this.inventory[i][0] != null) {
                    image(textures[this.inventory[i][0]], this.x - width/2 + 65 + i * 90, this.y - height/2 + 40, 40, 40);
                    fill(255);
                    noStroke();
                    strokeWeight(1);
                    text(this.inventory[i][1], this.x - width/2 + 90 + i * 90, this.y - height/2 + 90);
                }
            }
            else {
                fill(0, 131, 195, 160);
                strokeWeight(3);
                stroke(0, 131, 195, 240);
                rectMode(CORNER);
                rect(this.x - width/2 + 50 + i * 90, this.y - height/2 + 20, 70, 70, 15);
                if (this.inventory[i][0] != null) {
                    image(textures[this.inventory[i][0]], this.x - width/2 + 65 + i * 90, this.y - height/2 + 35, 35, 35);
                    fill(255);
                    noStroke(0);
                    strokeWeight(1);
                    text(this.inventory[i][1], this.x - width/2 + 85 + i * 90, this.y - height/2 + 80);
                }
            }
        }
    }

    this.update = function() {
        if (keyIsDown(65))      this.xspeed = -10;
        else if (keyIsDown(68)) this.xspeed = 10;
        else                    this.xspeed = 0;

        if (keyIsDown(87))      this.yspeed = -10;
        else if (keyIsDown(83)) this.yspeed = 10;
        else                    this.yspeed = 0;

        this.x += this.xspeed;
        this.y += this.yspeed;
    }

    this.display = function() {
        fill(0);
        noStroke();
        rectMode(CENTER);
        rect(this.x, this.y, 30, 90);
    }

    this.interaction = function() {
        if (mouseIsPressed) {
            if (mouseButton == LEFT) {
                mineBlock(mouseX, mouseY);
            }
            if (mouseButton == RIGHT) {
                placeBlock(mouseX, mouseY);
            }
        }
    }
}

//function mousePressed() {
//    if (event.which == 1) {
//        mineBlock(mouseX, mouseY);
//    }
//    else if (event.which == 3) {
//        placeBlock(mouseX, mouseY);
//    }
//}

function placeBlock(xpos, ypos) {
    var x = blockX(xpos);
    var y = blockY(ypos);
    if (player.inventory[player.toolPlace][0] != null) {
        if (isEmpty(x, y)) {
            var keepGoing = 0;
            if (isBlock(x-1, y) || isBlock(x+1, y)) {
                keepGoing = 1;
            }
            else if (isBlock(x, y-1) || isBlock(x, y+1)) {
                keepGoing = 1;
            }
            if (keepGoing == 1) {
                blocks[x][y] = new Block(int((currentCamX + xpos)/blockSize) * blockSize, int((currentCamY + ypos - blockSize)/blockSize)* blockSize, player.inventory[player.toolPlace][0], 1, true, 3);
                player.inventory[player.toolPlace][1]--;
                if (player.inventory[player.toolPlace][1] <= 0) {
                    player.inventory[player.toolPlace][0] = null;
                }
            }
        }
    }
}

function mouseWheel(event) {
    var temp = player.toolPlace;
    temp -= event.delta/100;
    if (temp == -1) {
        player.toolPlace = 8;
    }
    else if (temp == 9) {
        player.toolPlace = 0;
    }
    else {
        player.toolPlace = temp;
    }
}

function keyPressed() {
    if (keyCode >= 49 && keyCode <= 57)
        player.toolPlace = keyCode - 49;
}

function blockX(x) {
    return int((x + currentCamX)/blockSize);
}

function blockY(y) {
    return int((-y - currentCamY + blockSize)/blockSize);
}

function isEmpty(x, y) {
    if (inRange(x,0,blocks.length-1) && inRange(y,0,blocks[0].length-1))
      return blocks[x][y] == null;
    return false;
}

function inRange(x,min,max) {
    return x >= min && x <= max;
}

function isBlock(x, y) {
    if (inRange(x,0,blocks.length-1) && inRange(y,0,blocks[0].length-1))
      return blocks[x][y] != null;
    return false;
}

function mineBlock(xpos, ypos) {
    var x = blockX(xpos);
    var y = blockY(ypos);
    if (isBlock(x, y)) {
        //applyGrass(x, y);
        if (idOf(x, y) != 2 && idOf(x, y+1) != 2) {
            //addToInv(idOf(x, y), heightOf(x, y));
            blocks[x][y].hp -= 0.2;
                if (blocks[x][y].hp <= 0) {
                    addToInv(idOf(x, y), heightOf(x, y));
                    //applyGrass(x, y);
                    blocks[x][y] = null;
                }
        }
        else if (idOf(x, y) == 2 && idOf(x, y-1) != 2) {
            if (blocks[x][y].placed == true) {
                //addToInv(2, 1);
                blocks[x][y].hp -= 0.2;
                if (blocks[x][y].hp <= 0) {
                    addToInv(2, 1);
                    //applyGrass(x, y);
                    blocks[x][y] = null;
                }
            }
            else {
                //addToInv(2, heightOf(x, y));
                for (var i = 0; idOf(x,y+i) == 2; i++) {
                    //blocks[x][y+i] = null;
                    blocks[x][y + i].hp -= 0.2;
                if (blocks[x][y + i].hp <= 0) {
                    addToInv(2, heightOf(x, y));
                    //applyGrass(x, y + i);
                    blocks[x][y + i] = null;
                }
                }
            }
        }
        else if (idOf(x, y) == 2 && blocks[x][y].placed) {
            blocks[x][y].hp -= 0.2;
            if (blocks[x][y].hp <= 0) {
                addToInv(2, 1);
                blocks[x][y] = null;
            }
        }
    }
}

function addToInv(id, amount) {
    var hasItem = false;
    for (var i = 0; i < player.inventory.length; i++) {
        if (player.inventory[i][0] == id) {
            hasItem = true;
            player.inventory[i][1] += amount;
            i = player.inventory.length;
        }
    }
    if (hasItem == false) {
        for (var i = 0; i < player.inventory.length; i++) {
            if (player.inventory[i][0] == null) {
                player.inventory[i][0] = id;
                player.inventory[i][1] = amount;
                i = player.inventory.length;
            }
        }
    }
}

function heightOf(x, y) {
    if (isBlock(x, y))
      return blocks[x][y].h;
    return 0;
}

function idOf(x, y) {
    if (isBlock(x, y))
      return blocks[x][y].id;
    return null;
}


//function applyGrass(x, y) {
//    if (blocks[x][y].id == 1) {
//        for (var found = 1; found > 0; found++) {
//            if (blocks[x][y - found] != null) {
//                blocks[x][y - found].id = 1;
//                found = -1;
//            }
//            if (found > minYBlocks + yBlocks) {
//                found = -1;
//            }
//        }
//    }
//}
