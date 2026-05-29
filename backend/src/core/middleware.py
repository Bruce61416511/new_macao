import time
from collections import defaultdict
from typing import Dict, Tuple

from fastapi import Request, HTTPException
from starlette.middleware.base import BaseHTTPMiddleware


class RateLimiter:
    """简单的内存限流器：每日200次，并发50"""

    def __init__(self, daily_limit: int = 200, concurrent_limit: int = 50):
        self.daily_limit = daily_limit
        self.concurrent_limit = concurrent_limit
        self._daily: Dict[str, list] = defaultdict(list)
        self._concurrent: Dict[str, int] = defaultdict(int)

    async def check(self, request: Request) -> None:
        client_ip = request.client.host if request.client else "unknown"
        now = time.time()

        # 清理过期记录
        self._daily[client_ip] = [t for t in self._daily[client_ip] if now - t < 86400]

        # 日限额检查
        if len(self._daily[client_ip]) >= self.daily_limit:
            raise HTTPException(status_code=429, detail="请求频率超限，请明天再试")

        # 并发检查
        if self._concurrent[client_ip] >= self.concurrent_limit:
            raise HTTPException(status_code=429, detail="并发请求过多，请稍后再试")

        self._daily[client_ip].append(now)
        self._concurrent[client_ip] += 1

    def release(self, client_ip: str):
        if self._concurrent.get(client_ip, 0) > 0:
            self._concurrent[client_ip] -= 1


class RateLimitMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, daily_limit: int = 200, concurrent_limit: int = 50):
        super().__init__(app)
        self.limiter = RateLimiter(daily_limit, concurrent_limit)

    async def dispatch(self, request: Request, call_next):
        path = request.url.path
        if path in ("/health", "/docs", "/openapi.json"):
            return await call_next(request)
        client_ip = request.client.host if request.client else "unknown"
        try:
            await self.limiter.check(request)
        except HTTPException as e:
            raise e
        try:
            response = await call_next(request)
        finally:
            self.limiter.release(client_ip)
        return response
