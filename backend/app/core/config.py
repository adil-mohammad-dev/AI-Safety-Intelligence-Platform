import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    APP_NAME = os.getenv("APP_NAME", "AI Safety Intelligence Platform")
    APP_VERSION = os.getenv("APP_VERSION", "1.0.0")
    SECRET_KEY = os.getenv("SECRET_KEY", "defaultsecret")
    DATABASE_URL = os.getenv("DATABASE_URL", "")
    GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")


settings = Settings()