"use client";

import React, { useEffect, useRef } from "react";
import {
  Engine,
  Render,
  World,
  Bodies,
  Mouse,
  MouseConstraint,
  Events,
  Collision,
  Composite,
  Runner,
  Body,
} from "matter-js";

const Brick = () => {
  const sceneRef = useRef(null);
  const engineRef = useRef(null);
  const renderRef = useRef(null);

  const blockColor = "#fddfc0";
  const ballColor = "#fb7d00";

  useEffect(() => {
    // Engine 생성
    engineRef.current = Engine.create({
      gravity: { x: 0, y: 0.0 }, // 중력을 약간 줄임
      constraintIterations: 2, // 충돌 정확도 향상
    });
    // Render 생성
    renderRef.current = Render.create({
      element: sceneRef.current,
      engine: engineRef.current,
      options: {
        width: window.innerWidth,
        height: window.innerHeight,
        wireframes: false,
        background: "#e2e2e2",
      },
    });

    const ctx = renderRef.current.context;

    // Function to draw text in the center
    const drawText = () => {
      const { width, height } = renderRef.current.options;
      ctx.font = "bold 40px Arial";
      ctx.fillStyle = "black";
      ctx.textAlign = "center";
      ctx.fillText("Bouncing Blocks!", width / 2, height / 2);
    };

    // Custom rendering loop
    const originalRender = renderRef.current.render;
    renderRef.current.render = () => {
      originalRender(renderRef.current);
      drawText();
    };

    // 벽 생성
    const wallThickness = 10;
    const ground = Bodies.rectangle(
      window.innerWidth / 2,
      window.innerHeight + wallThickness / 2 - 28,
      window.innerWidth,
      100,
      { isStatic: true, restitution: 1.001, friction: 0.0 }
    );
    const leftWall = Bodies.rectangle(
      -wallThickness / 2 - 50,
      window.innerHeight / 2,
      100,
      window.innerHeight,
      { isStatic: true, restitution: 1.001, friction: 0.0 }
    );
    const rightWall = Bodies.rectangle(
      window.innerWidth + wallThickness / 2 + 50,
      window.innerHeight / 2,
      100,
      window.innerHeight,
      { isStatic: true, restitution: 1.001, friction: 0.0 }
    );
    const ceiling = Bodies.rectangle(
      window.innerWidth / 2,
      -wallThickness / 2 - 46,
      window.innerWidth,
      100,
      { isStatic: true, restitution: 1.001, friction: 0.0 }
    );

    const x0 = window.innerWidth / 2; // Center x position
    const y0 = window.innerHeight / 2 - 100; // Starting y position
    const blockWidth = window.innerHeight / 9; // Width of each block
    const blockHeight = window.innerWidth / 12; // Height of each block
    // const blockWidth = 60; // Width of each block
    // const blockHeight = 140; // Height of each block
    const dx = blockHeight; // Horizontal spacing between blocks
    const dy = blockWidth; // Vertical spacing between rows

    const createBlockInit = () => ({  // 블록 설정 통합
      restitution: 1.0,
      friction: 0.0,
      frictionAir: 0.0,
      render: {
        fillStyle: blockColor,
        strokeStyle: 'gray',
        lineWidth: 1
      },
      angle: Math.PI / 2,
      chamfer: { radius: 10 },
    });

    const block1 = Bodies.rectangle(x0 - 4 * dx, y0, blockWidth, blockHeight, createBlockInit());
    const block2 = Bodies.rectangle(x0 - 3 * dx, y0, blockWidth, blockHeight, createBlockInit());
    const block3 = Bodies.rectangle(x0 - 2 * dx, y0, blockWidth, blockHeight, createBlockInit());
    const block4 = Bodies.rectangle(x0 - dx, y0, blockWidth, blockHeight, createBlockInit());
    const block5 = Bodies.rectangle(x0, y0, blockWidth, blockHeight, createBlockInit());
    const block6 = Bodies.rectangle(x0 + dx, y0, blockWidth, blockHeight, createBlockInit());
    const block7 = Bodies.rectangle(x0 + 2 * dx, y0, blockWidth, blockHeight, createBlockInit());
    const block8 = Bodies.rectangle(x0 + 3 * dx, y0, blockWidth, blockHeight, createBlockInit());
    const block9 = Bodies.rectangle(x0 + 4 * dx, y0, blockWidth, blockHeight, createBlockInit());
    const block10 = Bodies.rectangle(
      x0 - 3.5 * dx,
      y0 - dy,
      blockWidth,
      blockHeight,
      createBlockInit()
    );
    const block11 = Bodies.rectangle(
      x0 - 2.5 * dx,
      y0 - dy,
      blockWidth,
      blockHeight,
      createBlockInit()
    );
    const block12 = Bodies.rectangle(
      x0 - 1.5 * dx,
      y0 - dy,
      blockWidth,
      blockHeight,
      createBlockInit()
    );
    const block13 = Bodies.rectangle(
      x0 - 0.5 * dx,
      y0 - dy,
      blockWidth,
      blockHeight,
      createBlockInit()
    );
    const block14 = Bodies.rectangle(
      x0 + 0.5 * dx,
      y0 - dy,
      blockWidth,
      blockHeight,
      createBlockInit()
    );
    const block15 = Bodies.rectangle(
      x0 + 1.5 * dx,
      y0 - dy,
      blockWidth,
      blockHeight,
      createBlockInit()
    );
    const block16 = Bodies.rectangle(
      x0 + 2.5 * dx,
      y0 - dy,
      blockWidth,
      blockHeight,
      createBlockInit()
    );
    const block17 = Bodies.rectangle(
      x0 + 3.5 * dx,
      y0 - dy,
      blockWidth,
      blockHeight,
      createBlockInit()
    );
    const block18 = Bodies.rectangle(
      x0 - 4 * dx,
      y0 - 2 * dy,
      blockWidth,
      blockHeight,
      createBlockInit()
    );
    const block19 = Bodies.rectangle(
      x0 - 3 * dx,
      y0 - 2 * dy,
      blockWidth,
      blockHeight,
      createBlockInit()
    );
    const block20 = Bodies.rectangle(
      x0 - 2 * dx,
      y0 - 2 * dy,
      blockWidth,
      blockHeight,
      createBlockInit()
    );
    const block21 = Bodies.rectangle(
      x0 - dx,
      y0 - 2 * dy,
      blockWidth,
      blockHeight,
      createBlockInit()
    );
    const block22 = Bodies.rectangle(x0, y0 - 2 * dy, blockWidth, blockHeight, createBlockInit());
    const block23 = Bodies.rectangle(
      x0 + dx,
      y0 - 2 * dy,
      blockWidth,
      blockHeight,
      createBlockInit()
    );
    const block24 = Bodies.rectangle(
      x0 + 2 * dx,
      y0 - 2 * dy,
      blockWidth,
      blockHeight,
      createBlockInit()
    );
    const block25 = Bodies.rectangle(
      x0 + 3 * dx,
      y0 - 2 * dy,
      blockWidth,
      blockHeight,
      createBlockInit()
    );
    const block26 = Bodies.rectangle(
      x0 + 4 * dx,
      y0 - 2 * dy,
      blockWidth,
      blockHeight,
      createBlockInit()
    );

    const circle1 = Bodies.circle(
      window.innerWidth / 2,
      window.innerHeight / 1.2,
      20,
      {
        restitution: 1.05,
        friction: 0.0,
        frictionAir: 0.0,
        render: { fillStyle: ballColor },
      }
    );

    // 월드에 벽과 블록 추가
    World.add(engineRef.current.world, [
      ground,
      leftWall,
      rightWall,
      ceiling,
      block1,
      block2,
      block3,
      block4,
      block5,
      block6,
      block7,
      block8,
      block9,
      block10,
      block11,
      block12,
      block13,
      block14,
      block15,
      block16,
      block17,
      block18,
      block19,
      block20,
      block21,
      block22,
      block23,
      block24,
      block25,
      block26,
      circle1,
    ]);

    circle1.label = "circle1";
    ground.label = "ground";
    ceiling.label = "ceiling";
    rightWall.label = "rightWall";
    leftWall.label = "leftWall";

    Events.on(engineRef.current, "collisionStart", (event) => {
      const pairs = event.pairs;

      for (let i = 0; i < pairs.length; i++) {
        const { bodyA, bodyB } = pairs[i];
        // block1과 block2의 충돌 감지
        if (bodyA.label === "circle1") {
          if (
            bodyB.label !== "ground" &&
            bodyB.label !== "ceiling" &&
            bodyB.label !== "rightWall" &&
            bodyB.label !== "leftWall"
          ) {
            World.remove(engineRef.current.world, bodyB);
          }
        }
        if (bodyB.label === "circle1") {
          if (
            bodyA.label !== "ground" &&
            bodyA.label !== "ceiling" &&
            bodyA.label !== "rightWall" &&
            bodyA.label !== "leftWall"
          ) {
            World.remove(engineRef.current.world, bodyA);
          }
        }
      }
    });

    // 마우스 컨트롤 추가
    const mouse = Mouse.create(renderRef.current.canvas);
    const mouseConstraint = MouseConstraint.create(engineRef.current, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false },
      },
    });

    World.add(engineRef.current.world, mouseConstraint);

    // 마우스 이벤트를 캔버스에 연결
    renderRef.current.mouse = mouse;

    // Runner 생성 및 실행
    const runner = Runner.create();
    Runner.run(runner, engineRef.current);
    Render.run(renderRef.current);

    // 윈도우 리사이즈 이벤트 처리
    const handleResize = () => {
      renderRef.current.canvas.width = window.innerWidth;
      renderRef.current.canvas.height = window.innerHeight;
      Render.setPixelRatio(renderRef.current, window.devicePixelRatio);
    };

    window.addEventListener("resize", handleResize);

    // 컴포넌트 언마운트 시 정리
    return () => {
      window.removeEventListener("resize", handleResize);
      Render.stop(renderRef.current);
      World.clear(engineRef.current.world);
      Engine.clear(engineRef.current);
      renderRef.current.canvas.remove();
      // Runner.stop(runner);
    };
  }, []);

  return (
    <div ref={sceneRef} style={{ width: "100%", height: "calc(100vh-60px)" }} />
  );
};

export default Brick;
