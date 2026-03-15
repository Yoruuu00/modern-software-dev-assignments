from __future__ import annotations

from typing import List, Optional

from pydantic import BaseModel, ConfigDict, Field


class ExtractRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    text: str = Field(..., min_length=1)
    save_note: bool = False


class ActionItemOut(BaseModel):
    id: int
    text: str
    note_id: Optional[int] = None
    done: Optional[bool] = None
    created_at: Optional[str] = None


class ExtractResponse(BaseModel):
    note_id: Optional[int] = None
    items: List[ActionItemOut]


class MarkDoneRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    done: bool = True


class MarkDoneResponse(BaseModel):
    id: int
    done: bool


class NoteCreateRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    content: str = Field(..., min_length=1)


class NoteOut(BaseModel):
    id: int
    content: str
    created_at: str