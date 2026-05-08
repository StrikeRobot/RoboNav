# Demo Assets

`robonav-demo.gif` is a placeholder animation generated with ImageMagick:

```bash
convert -size 800x500 -delay 50 xc:'#0f172a' xc:'#1e293b' xc:'#0f172a' -loop 0 robonav-demo.gif
```

To capture a real demo recording:

1. Start the stack: `docker compose up --build` from the repo root
2. Open http://localhost:3000
3. Select a robot from the sidebar
4. Click 3–5 waypoints on the map
5. Click **Start Mission** and watch the robot move in real time
6. Record with [LICEcap](https://www.cockos.com/licecap/) (Windows/Mac) or `peek` (Linux)
7. Save to `docs/demo/robonav-demo.gif` and replace this placeholder
