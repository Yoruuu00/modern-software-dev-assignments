from __future__ import annotations

from typing import List

from fastapi import APIRouter, HTTPException

from .. import db
from ..schemas import NoteCreateRequest, NoteOut

router = APIRouter(prefix="/notes", tags=["notes"])


@router.post("", response_model=NoteOut)
def create_note(payload: NoteCreateRequest) -> NoteOut:
    content = payload.content.strip()
    note_id = db.insert_note(content)
    note = db.get_note(note_id)

    return NoteOut(
        id=note["id"],
        content=note["content"],
        created_at=note["created_at"],
    )


@router.get("", response_model=List[NoteOut])
def list_all_notes() -> List[NoteOut]:
    rows = db.list_notes()
    return [
        NoteOut(
            id=row["id"],
            content=row["content"],
            created_at=row["created_at"],
        )
        for row in rows
    ]


@router.get("/{note_id}", response_model=NoteOut)
def get_single_note(note_id: int) -> NoteOut:
    row = db.get_note(note_id)
    if row is None:
        raise HTTPException(status_code=404, detail="note not found")

    return NoteOut(
        id=row["id"],
        content=row["content"],
        created_at=row["created_at"],
    )