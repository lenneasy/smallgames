import './nouvPartie.html';

import kaboom from "kaboom/dist/kaboom.mjs";
// initialize context
kaboom({
    width: 768,
    height: 360,
    background: [0,0,0]
});
/* loadSprite("paddle", "pong/sprites/paddle.png");
loadSprite("paddle2", "pong/sprites/paddle2.png");
loadSprite("ball", "pong/sprites/ball.png"); */
const LEVELOPT = {
    width: 32,
    height: 16,
    "@": () => [ // paddle
        sprite("paddle"),
        area(),
        origin("center"),
        "paddle",
        "bouncy",
        {
            name: "paddle",
            speed: 400,
        }
    ],
    "#": () => [ // paddle2
        sprite("paddle2"),
        area(),
        origin("center"),
        "paddle2",
        "bouncy",
        {
            speed: 400,
            name: "paddle2",
        }
    ],
    ".": () => [ // ball
        sprite("ball"),
        color(WHITE),
        area(),
        origin("center"),
        "ball",
        {
            hspeed: 200,
            vspeed: 100
        }
    ]
};

scene("game", ({levelIndex, player2, lives}) => {
addLevel(LEVELS[levelIndex], LEVELOPT);
// player's paddle
const paddle = get("paddle")[0];
const paddle2 = get("paddle2")[0];
// mouse controls
onKeyDown("a", () => {
    paddle.move(-paddle.speed, 0);
})
onKeyDown("d", () => {
    paddle.move(paddle.speed, 0);
})
onKeyDown("left", () => {
    paddle2.move(-paddle2.speed, 0);
})
onKeyDown("right", () => {
    paddle2.move(paddle2.speed, 0);
})
/*onUpdate("paddle",() => {
    if (mousePos().x > 0 && mousePos().x < width() && mousePos().y > 0 && mousePos().y < height()) {
        if (mousePos().x < paddle.worldArea().p1.x) { // left
            paddle.move(-paddle.speed, 0);
        }
        else if (mousePos().x > paddle.worldArea().p2.x) { // right
            paddle.move(paddle.speed, 0);
        }
    }
});
onUpdate("paddle2",() => {
    if (mousePos().x > 0 && mousePos().x < width() && mousePos().y > 0 && mousePos().y < height()) {
        if (mousePos().x < paddle2.worldArea().p1.x) { // left
            paddle2.move(-paddle2.speed, 0);
        }
        else if (mousePos().x > paddle2.worldArea().p2.x) { // right
            paddle2.move(paddle2.speed, 0);
        }
    }
});*/

// ball movement
onUpdate("ball", (ball) => {
    // bounce off screen edges
    if (ball.worldArea().p1.x < 0 || ball.worldArea().p2.x > width()) {
        ball.hspeed = -ball.hspeed;
    }

/*  if (ball.worldArea().p1.y < 0 || ball.worldArea().p2.y > height()) {
        ball.vspeed = -ball.vspeed;
    } */
// fall off screen down
if (ball.pos.y > height()) {
    lives -= 1;
    if (lives <= 0) {
    go("lose", { score: lives });
    }
    else {
    ball.pos.x = width()/2;
    ball.pos.y = height()/2;
    ball.hspeed = 200;
    ball.vspeed = 100;
    }
}

if (ball.pos.y < 0) {
    player2 -= 1;
    if (player2 <= 0) {
    go("loseplayer2", { player2: player2 });
    }
    else {
    ball.pos.x = width()/2;
    ball.pos.y = height()/2;
    ball.hspeed = 200;
    ball.vspeed = 100;
    }
}

    // move
    ball.move(ball.hspeed, ball.vspeed);
});

// collisions
onCollide("ball", "bouncy", (ball, bouncy) => {
    ball.vspeed = -ball.vspeed;  
    
    

    if (bouncy.is("paddle")) { // play sound
        /* play("paddlehit"); */
    ball.vspeed -=100;
    ball.hspeed -=50;
    }
else if (bouncy.is("paddle2")) { // play sound
        /* play("paddlehit"); */
    ball.vspeed +=100;
    ball.hspeed +=50;
    }
});

// ui
onDraw(() => {
    drawText({
        text: `PLAYER 2: ${player2}`,
        size: 16,
        pos: vec2(8,8),
        font: "breakout",
        color: WHITE
    });
    drawText({
        text: `PLAYER 1: ${lives}`,
        size: 16,
        pos: vec2(width()*13/16, 8),
        font: "breakout",
        color: WHITE
    });
});


});

// gameover screens
scene("lose", ({ score }) => {

    add([
        text(`PLAYER 2 WIN\n\nREVENGE ? `, {
            size: 32,
            width: width(),
            font: "breakout"
        }),
        pos(12),
    ]);

    add([
        text(`PRESS SPACE KEY TO RESTART`, {
            size: 16,
            width: width(),
            font: "breakout"
        }),
        pos(width()/2, height()*(3/4)),
        area(),
    ]);
    onKeyPress("space", start);
    /* onKeyPress(start);
    onMousePress(start); */
});

scene("loseplayer2", ({ player2 }) => {

    add([
        text(`PLAYER 1 WIN\n\nREVENGE`, {
            size: 32,
            width: width(),
            font: "breakout"
        }),
        pos(12),
    ]);

    add([
        text(`PRESS ANY KEY TO RESTART`, {
            size: 16,
            width: width(),
            font: "breakout"
        }),
        pos(width()/2, height()*(3/4)),
    ]);

    onKeyPress(start);
    onMousePress(start);
});

/* scene("win", ({ score }) => {

    add([
        text(`CONGRATULATIONS, YOU WIN!\n\nYOUR FINAL SCORE WAS ${score}`, {
            size: 32,
            width: width(),
            font: "breakout"
        }),
        pos(width()/2, height()/2),
    ]);

    add([
        text(`PRESS ANY KEY TO RESTART`, {
            size: 16,
            width: width(),
            font: "breakout"
        }),
        pos(width()/2, height()*(3/4)),
    ]);

    onKeyPress(start);
    onMousePress(start);
}); */

// start game



function start() {
    go("game", {
        levelIndex: 0,
        player2: 3,
        lives: 3,
    });
}

start();

loadSpriteAtlas("pong/sprites/breakout_pieces.png", {
    "paddle": {
        x: 8,
        y: 152,
        width: 64,
        height: 16,
    },
    "paddle2": {
        x: 8,
        y: 152,
        width: 64,
        height: 50,
    },
    "ball": {
        x: 48,
        y: 136,
        width: 8,
        height: 8,
    },
    "heart": {
        x: 120,
        y: 136,
        width: 8,
        height: 8,
    }
});
loadFont("breakout", "pong/sprites/breakout_font.png", 6, 8,  { chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZ  0123456789:!'" });

// levels
const LEVELS = [
    [
        "            #           ",
        "                        ",
        "                        ",
        "                        ",
        "                        ",
        "                        ",
        "                        ",
        "                        ",
        "                        ",
        "                        ",
        "                        ",
        "            .           ",
        "                        ",
        "                        ",
        "                        ",
        "                        ",
        "                        ",
        "                        ",
        "                        ",
        "                        ",
        "                        ",
        "                        ",
        "            @           ",
    ],
];