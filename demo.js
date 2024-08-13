function getRandomInt(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
}

const demo = () => {
  canvas = document.getElementById("demo");
  ctx = canvas.getContext("2d");

  const WIDTH = 500;
  const HEIGHT = 500;

  let keystates = new Set();

  const intro = {
    init: () => {},
    update: (state) => {
      if (keystates.has(" ")) {
        if (!state.transitioning) {
          state.next = level;
          state.next.init()
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

    },
    render: (state) => {
      ctx.fillStyle = "#888";
      ctx.fillRect(0, 0, WIDTH, HEIGHT);
      ctx.fillStyle = "rgb(255, 125, 125)";
      ctx.lineWidth = 2;
      ctx.font = "48px Arial";
      
      ctx.fillText("Crappy Turds", 100, 200);
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
    },
    obstacles: [],
    topObstacles: []
  };

  const level = {
    init: () => {
      levelState.frame = 0;
      levelState.player.x = 50;
      levelState.player.y = 250;
      levelState.player.y_vel = 1;
      levelState.obstacles = [];
      levelState.topObstacles = [];
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
          console.log(levelState.player.y_vel);
        }
        levelState.player.y_vel += 0.1; //gravity
        levelState.player.y += levelState.player.y_vel;


        if (levelState.player.y > 500) {
          state.next = intro;
          state.next.init()
          state.transition = fadeOut;
          state.transitioning = true;
          state.transitionPosition = 0;
        }

        obstacles = []
        topObstacles = []
        for (obstacle of levelState.obstacles) {
          obstacle.x -= 3;
          if (obstacle.x >= -obstacle.width) {
            obstacles.push(obstacle)
          }
        }
        levelState.obstacles = obstacles;

        for (topObstacle of levelState.topObstacles) {
          topObstacle.x -= 3;
          if (topObstacle.x >= -topObstacle.width) {
            topObstacles.push(topObstacle)
          }
        }
        levelState.topObstacles = topObstacles;
        
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
            height: 500 - height - 100,
          });
        }

        levelState.frame++;
      }
    },
    render: (state) => {
      //ctx.clearRect(0, 0, WIDTH, HEIGHT);
      // background
      ctx.fillStyle = "#888";
      ctx.fillRect(0, 0, WIDTH, HEIGHT);

      // player
      ctx.fillStyle = "#88f"
      ctx.fillRect(levelState.player.x, levelState.player.y, 10, 10);
 
      // obstacles
      ctx.fillStyle = "#8f8";
      for (obstacle of levelState.obstacles) {
        ctx.fillRect(obstacle.x, obstacle.y-obstacle.height, obstacle.width, obstacle.y);
      }

      for (topObstacle of levelState.topObstacles) {
        ctx.fillRect(topObstacle.x, topObstacle.y, topObstacle.width, topObstacle.height);
      }

      // level text
      ctx.fillStyle = "#fff";
      ctx.lineWidth = 2;
      ctx.font = "24px Arial";
      ctx.fillText("level 1", 400, 50);

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

  setInterval(main, 1000.0/60);
}

demo();
