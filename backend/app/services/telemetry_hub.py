import asyncio
from collections import defaultdict


class TelemetryHub:
    """In-process pub/sub broker: simulator publishes frames, WS connections subscribe."""

    def __init__(self) -> None:
        self._queues: dict[int, list[asyncio.Queue]] = defaultdict(list)

    def subscribe(self, robot_id: int) -> asyncio.Queue:
        q: asyncio.Queue = asyncio.Queue(maxsize=50)
        self._queues[robot_id].append(q)
        return q

    def unsubscribe(self, robot_id: int, q: asyncio.Queue) -> None:
        try:
            self._queues[robot_id].remove(q)
        except ValueError:
            pass

    async def publish(self, robot_id: int, frame: dict) -> None:
        for q in list(self._queues[robot_id]):
            try:
                q.put_nowait(frame)
            except asyncio.QueueFull:
                pass  # slow consumer — drop frame


hub = TelemetryHub()
