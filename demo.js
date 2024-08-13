const demo = () => {
  canvas = document.getElementById("demo");
  ctx = canvas.getContext("2d");

  const WIDTH = 500;
  const HEIGHT = 500;

  let frame = 0;
  let keystates = new Set();

  const intro = {
    update: (state) => {
      if (keystates.has(" ")) {
        if (!state.transitioning) {
          state.next = game;
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
      
      ctx.fillText("intro", 25, 100);
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

  const game = {
    update: (state) => {
      if (keystates.has(" ")) {
        if (!state.transitioning) {
          state.next = intro;
          state.transition = fadeOut;
          state.transitioning = true;
          state.transitionPosition = 0;
        }
      }

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

      state.levelState.x += 1;
      if (state.levelState.x > 400) {
        state.levelState.x = 0;
        state.levelState.y += 5;
      }
    },
    render: (state) => {
      //ctx.clearRect(0, 0, WIDTH, HEIGHT);
      ctx.fillStyle = "#888";
      ctx.fillRect(0, 0, WIDTH, HEIGHT);
      ctx.fillStyle = "rgb(125, 255, 125)";
      ctx.lineWidth = 2;
      ctx.font = "48px Arial";
      
      ctx.fillText("level 1", 25, 100);

      ctx.fillStyle = "#88f"
      ctx.fillRect(state.levelState.x, state.levelState.y, 10, 10);
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
    levelState: {
      x: 0, 
      y: 10
    },
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
    frame++;
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
