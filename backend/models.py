from sqlalchemy import Column, Integer, String, Text
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class DebugHistory(Base):
    __tablename__ = "debug_history"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(Text, nullable=False)
    fixed_code = Column(Text, nullable=True)
    explanation = Column(Text, nullable=True)
    error_type = Column(String(100), nullable=True) 