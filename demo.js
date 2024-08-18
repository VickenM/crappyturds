function getRandomInt(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
}

const demo = () => {
  canvas = document.getElementById("demo");
  ctx = canvas.getContext("2d");

  ctx.font = "48px Arial";
  console.log(ctx.measureText("P"));
  console.log(ctx.measureText("r"));
  console.log(ctx.measureText("e"));
  console.log(ctx.measureText("s"));

  const WIDTH = canvas.getAttribute('width');
  const HEIGHT =canvas.getAttribute('height');

  const colors = {
    neutral: '#888',
    text: '#fff',
    logotext: '#f88',
    sky: '#8df',
    background: '#c06',
    player: '#66d',
    obstacle: '#8f8',
  }

  let keystates = new Set();

  const introState = {
    frame: 0,
  }

  const intro = {
    init: () => {},
    update: (state) => {
      if (keystates.has(" ")) {
        keystates.delete(" ");
        if (!state.transitioning) {
          state.next = level;
          state.next.init();
          state.transition = fadeOut
          state.transitioning = true;
          state.transitionPosition = 0;
        }
      }

      if (state.transitioning) {
        state.transitionPosition++;
        if (state.transitionPosition > state.duration) {
          state.transitionPosition = 0;
          if (state.transition === fadeOut) {
            state.transition = fadeIn;
            state.current = state.next;
            state.next = undefined;
          } else {
            state.transitioning = false;
          }
        }
      }

      introState.frame++;
    },
    render: (state) => {
      ctx.fillStyle = colors.sky;
      ctx.fillRect(0, 0, WIDTH, HEIGHT);
      ctx.fillStyle = colors.logotext;
      ctx.lineWidth = 1;
      ctx.font = "48px Arial";
     
      metric = ctx.measureText("Crappy Turds");
      const width = metric['width']
      ctx.fillText("Crappy Turds", (WIDTH/2)-(width/2), 200);

      ctx.fillStyle = colors.logotext;
      ctx.font = "24px Arial";
      const pressstart = ['P', 'r', 'e', 's', 's', '  ', 's', 't', 'a', 'r', 't']
      let x_offset = 0;
      for ([index, letter] of pressstart.entries()) {
        let y_offset = 15*Math.sin(0.1 * (index + introState.frame))
        let measure = ctx.measureText(letter);
        ctx.fillText(letter, 200 + x_offset, 300 + y_offset);
        x_offset += measure.actualBoundingBoxRight;
      }

      if (state.transitioning) {
        let pos = state.transitionPosition / state.duration;
        let c;
        if (state.transition === fadeOut) {
          c = 255 - 255 * Math.sin(0.5 * pos * Math.PI);
        } else {
          c = 255 - 255 * (1-Math.sin(0.5 * pos * Math.PI));
        }
        ctx.globalCompositeOperation = 'multiply';
        ctx.fillStyle = `rgb(${c}, ${c}, ${c})`;
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
        ctx.globalCompositeOperation = 'normal';
      }
    }
  }

  const levelState = {
    frame: 0,
    player: {
      x: 100,
      y: HEIGHT/2,
      thrust: 0,
      y_vel: 1,
      width: 10,
      height: 10,
    },
    obstacles: [],
    topObstacles: [],
    skylines: [],
    skylineOffset: 500,
    obstaclesCleared: 0,
  };

  const level = {
    init: () => {
      levelState.frame = 0;
      levelState.player.x = 50;
      levelState.player.y = 250;
      levelState.player.y_vel = 1;
      levelState.obstacles = [];
      levelState.topObstacles = [];
      levelState.skylines = [
        {
          x: 0,
          y: HEIGHT,
          width: 50,
          height: 100
        },
        {
          x: 200,
          y: HEIGHT,
          width: 50,
          height: 200
        },
        {
          x: 370,
          y: HEIGHT,
          width: 100,
          height: 150
        },
        {
          x: 500,
          y: HEIGHT,
          width: 50,
          height: 350
        },
      ];
      levelState.skylineOffset = 500;
      levelState.obstaclesCleared = 0;
    },
    update: (state) => {
      if (state.transitioning) {
        state.transitionPosition++;
        if (state.transitionPosition > state.duration) {
          state.transitionPosition = 0;
          if (state.transition === fadeOut) {
            state.current = state.next;
            state.next = undefined;
            state.transition = fadeIn;
          } else {
            state.transitioning = false;
          }
        }
      }

      if (!state.transitioning) {
        if (keystates.has("Escape")) {
          state.next = intro;
          state.next.init()
          state.transition = fadeOut;
          state.transitioning = true;
          state.transitionPosition = 0;
        }

        if (keystates.has(" ")) {
          levelState.player.y_vel = -2;
          // keystates.delete(" ");
        }

        levelState.player.y_vel += 0.1; //gravity
        levelState.player.y += levelState.player.y_vel;

        if (levelState.player.y > HEIGHT) {
          state.next = intro;
          state.next.init()
          state.transition = fadeOut;
          state.transitioning = true;
          state.transitionPosition = 0;
        }

        for (obstacle of levelState.obstacles) {
          if ((levelState.player.x + levelState.player.width > obstacle.x) && 
              (levelState.player.x < obstacle.x + obstacle.width) &&
              (levelState.player.y > 500 - obstacle.height)) {
            state.next = intro;
            state.next.init()
            state.transition = fadeOut;
            state.transitioning = true;
            state.transitionPosition = 0;
          }
        }


        for (obstacle of levelState.topObstacles) {
          if ((levelState.player.x + levelState.player.width > obstacle.x) && 
              (levelState.player.x < obstacle.x + obstacle.width) &&
              (levelState.player.y < obstacle.height)) {
            state.next = intro;
            state.next.init()
            state.transition = fadeOut;
            state.transitioning = true;
            state.transitionPosition = 0;
          }
        }

        // move obstacles
        obstacles = []
        for (obstacle of levelState.obstacles) {
          obstacle.x -= 3;
          if (obstacle.x >= -obstacle.width) {
            obstacles.push(obstacle)
          }
        }
        levelState.obstacles = obstacles;

        topObstacles = []
        for (topObstacle of levelState.topObstacles) {
          topObstacle.x -= 3;
          if (topObstacle.x >= -topObstacle.width) {
            topObstacles.push(topObstacle)
          } else {
            levelState.obstaclesCleared++;
          }
        }
        levelState.topObstacles = topObstacles;
        
        // create new obstacles
        if (levelState.frame % 100 === 0) {
          let height = getRandomInt(100, 400);
          levelState.obstacles.push({
            x: WIDTH,
            y: HEIGHT,
            width: 50,
            height: height,
          });

          levelState.topObstacles.push({
            x: WIDTH,
            y: 0,
            width: 50,
            height: HEIGHT - height - 100,
          });
        }

        // skyline
        levelState.skylineOffset -= 1;
        if (levelState.skylineOffset < -WIDTH-100) {
          levelState.skylineOffset = 500;
        }
        levelState.frame++;
      }
    },

    render: (state) => {
      //ctx.clearRect(0, 0, WIDTH, HEIGHT);
      // background
      ctx.fillStyle = colors.sky;
      ctx.fillRect(0, 0, WIDTH, HEIGHT);

      ctx.fillStyle = colors.background;
      for (skyline of levelState.skylines) {
        ctx.fillRect(skyline.x + levelState.skylineOffset, skyline.y-skyline.height, skyline.width, skyline.y);
      }

      // player
      ctx.fillStyle = colors.player;
      ctx.fillRect(levelState.player.x, levelState.player.y, levelState.player.width, levelState.player.height);
 
      // obstacles
      ctx.fillStyle = colors.obstacle;
      for (obstacle of levelState.obstacles) {
        ctx.fillRect(obstacle.x, obstacle.y-obstacle.height, obstacle.width, obstacle.y);
      }

      for (topObstacle of levelState.topObstacles) {
        ctx.fillRect(topObstacle.x, topObstacle.y, topObstacle.width, topObstacle.height);
      }

      // level text
      ctx.fillStyle = colors.text;
      ctx.lineWidth = 2;
      ctx.font = "24px Arial";
      ctx.fillText(`Cleared: ${levelState.obstaclesCleared}`, 350, 50);

      // screen transition
      if (state.transitioning) {
        let pos = state.transitionPosition / state.duration;
        let c;
        if (state.transition === fadeOut) {
          c = 255 - 255 * Math.sin(0.5 * pos * Math.PI);
        } else {
          c = 255 - 255 * (1-Math.sin(0.5 * pos * Math.PI));
        }
        ctx.globalCompositeOperation = 'multiply';
        ctx.fillStyle = `rgb(${c}, ${c}, ${c})`;
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
        ctx.globalCompositeOperation = 'normal';
      }
    }
  }
  const fadeOut = 1;
  const fadeIn = 2;

  let gameState = {
    current: intro,
    next: undefined,
    transition: undefined,
    transitioning: false,
    transitioningPosition: 0,
    duration: 50,
  }

  const render = () => {
    gameState.current.render(gameState);
  }

  const update = () => {
    gameState.current.update(gameState);
  }

  const main = () => {
    update();
    render();
  }

  window.addEventListener("keydown", (event) => {
    keystates.add(event.key);
  });
  window.addEventListener("keyup", (event) => {
    keystates.delete(event.key);
  });
  window.addEventListener("mousedown", (event) => {
    keystates.add(" ");
  });
  window.addEventListener("mouseup", (event) => {
    keystates.delete(" ");
  });
  setInterval(main, 1000.0/60);
}

demo();
