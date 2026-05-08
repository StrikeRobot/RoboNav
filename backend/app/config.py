from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    db_path: str = "/data/robonav.db"
    allowed_origins: str = "http://localhost:3000"
    sim_tick_hz: float = 2.0
    sim_speed_ms: float = 10.0  # metres per second

    @property
    def origins_list(self) -> list[str]:
        return [o.strip() for o in self.allowed_origins.split(",")]

    model_config = {"env_file": ".env"}


settings = Settings()
