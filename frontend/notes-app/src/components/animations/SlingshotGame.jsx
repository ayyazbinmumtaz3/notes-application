import React, { useEffect, useRef } from "react";
import Matter from "matter-js";

const SlingshotGame = () => {
  const maskStyle = {
    // This mask will start from white at the bottom and fade to transparent at the top
    WebkitMask: `linear-gradient(to top, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 50%, rgba(255,255,255,0) 100%)`,
    mask: `linear-gradient(to top, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 50%, rgba(255,255,255,0) 100%)`,
    position: "absolute",
    left: 0,
    zIndex: 1,
  };

  const canvasStyle = {
    display: "block",
    margin: "0 auto",
    backgroundColor: "transparent", // Remove black background
  };

  const canvasRef = useRef(null);
  const engineRef = useRef(null);
  const runnerRef = useRef(null);

  useEffect(() => {
    const {
      Engine,
      Render,
      Runner,
      Composites,
      Events,
      Constraint,
      MouseConstraint,
      Mouse,
      World,
      Bodies,
    } = Matter;

    // Create engine
    const engine = Engine.create();
    const world = engine.world;
    engineRef.current = engine;

    // Create renderer
    const render = Render.create({
      element: canvasRef.current,
      engine: engine,
      options: {
        width: window.innerWidth, // Expand to full viewport width
        height: window.innerHeight, // Expand to full viewport height
        wireframes: false,
      },
    });

    // Create runner
    const runner = Runner.create();
    runnerRef.current = runner;

    // Add bodies
    const ground = Bodies.rectangle(
      window.innerWidth / 2,
      window.innerHeight,
      window.innerWidth,
      50,
      { isStatic: true }
    );
    const rockOptions = { density: 0.004 };
    let rock = Bodies.polygon(170, 450, 8, 20, rockOptions);
    const anchor = { x: 170, y: 450 };
    const elastic = Constraint.create({
      pointA: anchor,
      bodyB: rock,
      stiffness: 0.05,
    });

    const pyramid = Composites.pyramid(500, 300, 9, 10, 0, 0, (x, y) =>
      Bodies.rectangle(x, y, 25, 40)
    );
    const ground2 = Bodies.rectangle(610, 220, 200, 20, { isStatic: true }); // Adjusted position to prevent scroll
    const pyramid2 = Composites.pyramid(550, 0, 5, 10, 0, 0, (x, y) =>
      Bodies.rectangle(x, y, 25, 40)
    );

    World.add(engine.world, [
      ground,
      pyramid,
      ground2,
      pyramid2,
      rock,
      elastic,
    ]);

    Events.on(engine, "afterUpdate", () => {
      if (
        mouseConstraint.mouse.button === -1 &&
        (rock.position.x > 190 || rock.position.y < 430)
      ) {
        rock = Bodies.polygon(170, 450, 7, 20, rockOptions);
        World.add(engine.world, rock);
        elastic.bodyB = rock;
      }
    });

    // Add mouse control
    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: false,
        },
      },
    });

    World.add(world, mouseConstraint);
    render.mouse = mouse;

    // Fit the render viewport to the scene
    Render.lookAt(render, {
      min: { x: 0, y: 0 },
      max: { x: window.innerWidth, y: window.innerHeight },
    });

    // Run the engine and renderer
    Render.run(render);
    Runner.run(runner, engine);

    // Cleanup function
    return () => {
      Render.stop(render);
      Runner.stop(runner);
      engineRef.current = null;
      runnerRef.current = null;
    };
  }, []);

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh" }}>
      <h1>Slingshot Game</h1>
      <div ref={canvasRef} style={canvasStyle} />
    </div>
  );
};

export default SlingshotGame;
