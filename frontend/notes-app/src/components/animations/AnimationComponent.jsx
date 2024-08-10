// src/AnimationComponent.js
import React, { useEffect } from "react";
import Two from "two.js";
import Matter from "matter-js";

const AnimationComponent = () => {
  const maskStyle = {
    // This mask will start from white at the bottom and fade to transparent at the top
    WebkitMask: `linear-gradient(to top, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 50%, rgba(255,255,255,0) 100%)`,
    mask: `linear-gradient(to top, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 50%, rgba(255,255,255,0) 100%)`,
    position: "absolute",
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: 1,
  };

  useEffect(() => {
    const vector = new Two.Vector();
    const entities = [];
    const copy = [
      "Tasks",
      "Notes",
      "Ideas",
      "Calendar",
      "Reminders",
      "To-Do",
      "Grocery",
      "Projects",
      "Meetings",
      "Deadlines",
      "Planning",
      "Events",
      "Goals",
      "Documents",
      "Contacts",
      "Notes",
      "Review",
      "Drafts",
      "Milestones",
      "Journals",
      "Updates",
      "Appointments",
      "Feedback",
      "Suggestions",
      "Reference",
      "Lists",
      "Schedules",
      "Highlights",
    ];

    const two = new Two({
      type: Two.Types.canvas,
      fullscreen: true,
      autostart: true,
    }).appendTo(document.getElementById("animation-container"));

    const solver = Matter.Engine.create();
    solver.world.gravity.y = 0.5;

    const bounds = {
      length: 5000,
      thickness: 50,
      properties: {
        isStatic: true,
      },
    };

    bounds.left = createBoundary(bounds.thickness, bounds.length);
    bounds.right = createBoundary(bounds.thickness, bounds.length);
    bounds.bottom = createBoundary(bounds.length, bounds.thickness);

    Matter.World.add(solver.world, [
      bounds.left.entity,
      bounds.right.entity,
      bounds.bottom.entity,
    ]);

    const defaultStyles = {
      size: two.width * 0.08,
      weight: 400,
      fill: "white",
      leading: two.width * 0.08 * 0.8,
      family: "Angus, Arial, sans-serif",
      alignment: "center",
      baseline: "baseline",
      margin: {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      },
    };

    addSlogan();
    resize();
    const mouse = addMouseInteraction();
    two.bind("resize", resize).bind("update", update);

    function addMouseInteraction() {
      const mouse = Matter.Mouse.create(document.body);
      const mouseConstraint = Matter.MouseConstraint.create(solver, {
        mouse: mouse,
        constraint: {
          stiffness: 0.17, // Decreased stiffness by 15%
        },
      });

      Matter.World.add(solver.world, mouseConstraint);

      return mouseConstraint;
    }

    function resize() {
      console.log("Resize called");
      const length = bounds.length;
      const thickness = bounds.thickness;

      vector.x = -thickness / 2;
      vector.y = two.height / 2;
      Matter.Body.setPosition(bounds.left.entity, vector);

      vector.x = two.width + thickness / 2;
      vector.y = two.height / 2;
      Matter.Body.setPosition(bounds.right.entity, vector);

      vector.x = two.width / 2;
      vector.y = two.height + thickness / 2;
      Matter.Body.setPosition(bounds.bottom.entity, vector);

      let size;

      // Adjust size based on screen width
      if (two.width < 480) {
        size = two.width * 0.12 * 0.75; // 25% smaller for small screens
      } else if (two.width >= 480 && two.width < 768) {
        size = two.width * 0.1 * 0.75; // Slightly larger for tablets
      } else if (two.width >= 768 && two.width < 1080) {
        size = two.width * 0.08 * 0.75; // Medium screens (e.g., landscape tablets)
      } else if (two.width >= 1080 && two.width < 1600) {
        size = two.width * 0.07 * 0.75; // Large screens
      } else {
        size = two.width * 0.06 * 0.75; // Very large screens
      }

      const leading = size * 0.8;

      for (let i = 0; i < two.scene.children.length; i++) {
        const child = two.scene.children[i];

        if (!child.isWord) {
          continue;
        }

        const text = child.text;
        const rectangle = child.rectangle;
        const entity = child.entity;

        text.size = size;
        text.leading = leading;

        const rect = text.getBoundingClientRect(true);
        rectangle.width = rect.width * 0.75; // 25% smaller
        rectangle.height = rect.height * 0.75; // 25% smaller

        Matter.Body.scale(entity, 1 / entity.scale.x, 1 / entity.scale.y);
        Matter.Body.scale(entity, rect.width * 0.75, rect.height * 0.75); // 25% smaller
        entity.scale.set(rect.width * 0.75, rect.height * 0.75); // 25% smaller

        Matter.Body.setVelocity(entity, {
          x: (Math.random() - 0.5) * 10, // Random horizontal speed
          y: Math.random() * 10 + 5, // Random vertical speed
        });

        text.size = size / 3;
      }
    }

    function addSlogan() {
      let x = defaultStyles.margin.left;
      let y = -two.height; // Header offset

      // Limit the loop to create only 20 rectangles
      const maxRectangles = 23;

      for (let i = 0; i < Math.min(maxRectangles, copy.length); i++) {
        const word = copy[i];
        const group = new Two.Group();
        const text = new Two.Text("", 0, 0, defaultStyles);

        group.isWord = true;

        // Set the text value
        text.value = word;

        const rect = text.getBoundingClientRect();
        let ox = x + (rect.width * 0.75) / 2; // Center horizontally
        let oy = y + (rect.height * 0.75) / 2; // Center vertically

        const ca = x + rect.width * 0.75; // 25% smaller
        const cb = two.width;

        // New line
        if (ca >= cb) {
          x = defaultStyles.margin.left;
          y +=
            (defaultStyles.leading +
              defaultStyles.margin.top +
              defaultStyles.margin.bottom) *
            0.75; // 25% smaller

          ox = x + (rect.width * 0.75) / 2; // Center horizontally
          oy = y + (rect.height * 0.75) / 2; // Center vertically
        }

        group.translation.x = ox;
        group.translation.y = oy;
        text.translation.y = 14;

        // Create rectangle
        const rectangle = new Two.Rectangle(
          0,
          0,
          rect.width * 0.75,
          rect.height * 0.75
        ); // 25% smaller

        if (i % 2 === 0) {
          rectangle.fill = "rgba(40, 40, 40)"; // Light black color with some transparency
          rectangle.noStroke();
          text.fill = "white";
        } else {
          rectangle.fill = "rgba(255, 255, 255)";
          rectangle.stroke = "rgba(45, 45, 45)";
          text.fill = "rgba(50, 50, 50)";
        }

        rectangle.visible = true;

        const entity = Matter.Bodies.rectangle(ox, oy, 1, 1);
        Matter.Body.scale(entity, rect.width * 0.75, rect.height * 0.75); // 25% smaller

        entity.scale = new Two.Vector(rect.width * 0.75, rect.height * 0.75); // 25% smaller
        entity.object = group;
        entities.push(entity);
        console.log("Entities added:", entities.length);

        x +=
          (rect.width +
            defaultStyles.margin.left +
            defaultStyles.margin.right) *
          0.75; // 25% smaller

        group.text = text;
        group.rectangle = rectangle;
        group.entity = entity;

        group.add(rectangle, text);
        two.add(group);
      }

      Matter.World.add(solver.world, entities);
    }

    function update(frameCount, timeDelta) {
      console.log("Update called", { frameCount, timeDelta });
      const allBodies = Matter.Composite.allBodies(solver.world);
      Matter.MouseConstraint.update(mouse, allBodies);
      Matter.MouseConstraint._triggerEvents(mouse);

      Matter.Engine.update(solver);
      console.log("Engine updated");

      for (let i = 0; i < entities.length; i++) {
        const entity = entities[i];
        entity.object.position.copy(entity.position);
        entity.object.rotation = entity.angle;
      }
    }

    function createBoundary(width, height) {
      const rectangle = two.makeRectangle(0, 0, width, height);
      rectangle.visible = false;

      rectangle.entity = Matter.Bodies.rectangle(
        0,
        0,
        width,
        height,
        bounds.properties
      );
      rectangle.entity.position = rectangle.position;

      return rectangle;
    }

    return () => {
      console.log("AnimationComponent unmounted");
      two.clear();
      Matter.World.clear(solver.world);
    };
  }, []);

  return (
    <div
      id="animation-container"
      style={maskStyle}
      className="flex justify-center items-center"
    />
  );
};

export default AnimationComponent;
