import os
import sys
from pathlib import Path

class Config:
    SEED = 42
    MODEL = "deepseek-chat"
    TEMPERATURE = 0.6
    APP_HOME = Path(os.getenv("APP_HOME", Path(__file__).parent))
    DATA_DIR = APP_HOME / "data"
