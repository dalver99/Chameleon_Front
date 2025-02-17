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

const BouncingBlocks = () => {
  const sceneRef = useRef(null);
  const engineRef = useRef(null);
  const renderRef = useRef(null);

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
      { isStatic: true }
    );
    const leftWall = Bodies.rectangle(
      -wallThickness / 2 - 50,
      window.innerHeight / 2,
      100,
      window.innerHeight,
      { isStatic: true }
    );
    const rightWall = Bodies.rectangle(
      window.innerWidth + wallThickness / 2 + 50,
      window.innerHeight / 2,
      100,
      window.innerHeight,
      { isStatic: true }
    );
    const ceiling = Bodies.rectangle(
      window.innerWidth / 2,
      -wallThickness / 2 - 46,
      window.innerWidth,
      100,
      { isStatic: true }
    );

    // 블록 생성
    const block1 = Bodies.rectangle(
      window.innerWidth / 4,
      window.innerHeight / 2,
      60,
      140,
      {
        restitution: 0.95,
        friction: 0.0,
        frictionAir: 0.0,
        render: { fillStyle: "#ff0000" },
        angle: Math.PI / 4, // 초기 각도 (라디안 단위)
        chamfer: { radius: 10 },
      }
    );

    const block2 = Bodies.rectangle(
      window.innerWidth / 1.2,
      window.innerHeight / 2,
      60,
      140,
      {
        restitution: 1.001,
        friction: 0.0,
        frictionAir: 0.0,
        render: { fillStyle: "#56ee11" },
        angle: Math.PI / 6, // 초기 각도 (라디안 단위)
        chamfer: { radius: 10 },
      }
    );

    const block3 = Bodies.rectangle(
      window.innerWidth / 3.2,
      window.innerHeight / 2.2,
      90,
      90,
      {
        restitution: 1.001,
        friction: 0.0,
        frictionAir: 0.0,
        render: { fillStyle: "#56ee11" },
        angle: Math.PI / 6, // 초기 각도 (라디안 단위)
        chamfer: { radius: 10 },
      }
    );

    const block4 = Bodies.rectangle(
      window.innerWidth / 1.4,
      window.innerHeight / 1.6,
      70,
      100,
      {
        restitution: 1.001,
        friction: 0.0,
        frictionAir: 0.0,
        render: { fillStyle: "#56ee11" },
        angle: Math.PI / 6, // 초기 각도 (라디안 단위)
        chamfer: { radius: 10 },
      }
    );

    const circle1 = Bodies.circle(
      window.innerWidth / 4,
      window.innerHeight / 1.2,
      40,
      {
        restitution: 1.001,
        friction: 0.0,
        frictionAir: 0.0,
        render: { fillStyle: "#2255ee" },
      }
    );

    const minv = 8;
    const maxv = 20;
    const randomvNumber = Math.floor(Math.random() * (maxv - minv + 1)) + minv;

    Body.setVelocity(block1, { x: randomvNumber, y: -3 });
    Body.setVelocity(block2, { x: -randomvNumber, y: -3 });
    Body.setVelocity(block3, { x: randomvNumber, y: -3 });
    Body.setVelocity(block4, { x: -randomvNumber, y: -3 });
    Body.setVelocity(circle1, { x: randomvNumber, y: 18 });

    const minav = 0.1;
    const maxav = 0.4;
    const randomavNumber = Math.random() * (maxav - minav + 1) + minav;
    const randomavNumber2 = Math.random() * (maxav - minav + 1) + minav;
    Body.setAngularVelocity(block1, randomavNumber);
    Body.setAngularVelocity(block2, randomavNumber2);

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
      circle1,
    ]);

    ground.label = "ground";
    ceiling.label = "ceiling";
    rightWall.label = "rightWall";
    leftWall.label = "leftWall";

    Events.on(engineRef.current, "collisionStart", (event) => {
      const pairs = event.pairs;

      for (let i = 0; i < pairs.length; i++) {
        const { bodyA, bodyB } = pairs[i];
        const mincol = 50;
        const maxcol = 200;
        const randomR = Math.random() * (maxcol - mincol + 1) + mincol;
        const randomG = Math.random() * (maxcol - mincol + 1) + mincol;
        const randomB = Math.random() * (maxcol - mincol + 1) + mincol;

        // block1과 block2의 충돌 감지
        if (
          bodyA.label === "ground" ||
          bodyB.label === "ground" ||
          bodyA.label === "ceiling" ||
          bodyB.label === "ceiling" ||
          bodyA.label === "rightWall" ||
          bodyB.label === "rightWall" ||
          bodyA.label === "leftWall" ||
          bodyB.label === "leftWall"
        ) {
          bodyA.render.fillStyle = `rgb(${randomR},${randomG},${randomB})`;
          bodyB.render.fillStyle = `rgb(${randomR},${randomG},${randomB})`;
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
      renderRef.current.canvas.height = window.innerHeight - 80;
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

export default BouncingBlocks;
