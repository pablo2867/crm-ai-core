import { Brick } from "./types";

const bricks: Brick[] = [
  {
    id: "diagnostics",
    name: "Diagnostics",
    version: "1.0.0",
    enabled: true,
    description: "System diagnostics and performance monitoring",
  },
];

export function registerBrick(brick: Brick) {
  bricks.push(brick);
}

export function getBricks() {
  return bricks;
}

export function getBrick(id: string) {
  return bricks.find(
    (brick) => brick.id === id
  );
}