from __future__ import annotations

import json
import os
import re
from typing import List

from dotenv import load_dotenv
from ollama import chat

load_dotenv()

BULLET_PREFIX_PATTERN = re.compile(r"^\s*([-*•]|\d+\.)\s+")
KEYWORD_PREFIXES = (
    "todo:",
    "action:",
    "next:",
)

OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "llama3.1:8b")


def _is_action_line(line: str) -> bool:
    stripped = line.strip().lower()
    if not stripped:
        return False
    if BULLET_PREFIX_PATTERN.match(stripped):
        return True
    if any(stripped.startswith(prefix) for prefix in KEYWORD_PREFIXES):
        return True
    if "[ ]" in stripped or "[todo]" in stripped:
        return True
    return False


def extract_action_items(text: str) -> List[str]:
    lines = text.splitlines()
    extracted: List[str] = []

    for raw_line in lines:
        line = raw_line.strip()
        if not line:
            continue
        if _is_action_line(line):
            cleaned = BULLET_PREFIX_PATTERN.sub("", line)
            cleaned = cleaned.strip()
            cleaned = cleaned.removeprefix("[ ]").strip()
            cleaned = cleaned.removeprefix("[todo]").strip()
            extracted.append(cleaned)

    if not extracted:
        sentences = re.split(r"(?<=[.!?])\s+", text.strip())
        for sentence in sentences:
            s = sentence.strip()
            if not s:
                continue
            if _looks_imperative(s):
                extracted.append(s)

    seen: set[str] = set()
    unique: List[str] = []
    for item in extracted:
        lowered = item.lower()
        if lowered in seen:
            continue
        seen.add(lowered)
        unique.append(item)
    return unique


def _looks_imperative(sentence: str) -> bool:
    words = re.findall(r"[A-Za-z']+", sentence)
    if not words:
        return False

    first = words[0]
    imperative_starters = {
        "add",
        "create",
        "implement",
        "fix",
        "update",
        "write",
        "check",
        "verify",
        "refactor",
        "document",
        "design",
        "investigate",
    }
    return first.lower() in imperative_starters


def _normalize_items(items: list[str]) -> list[str]:
    seen: set[str] = set()
    cleaned: list[str] = []

    for item in items:
        if not isinstance(item, str):
            continue

        value = item.strip()
        if not value:
            continue

        lowered = value.lower()
        if lowered in seen:
            continue

        seen.add(lowered)
        cleaned.append(value)

    return cleaned


def extract_action_items_llm(text: str) -> List[str]:
    if not text or not text.strip():
        return []

    try:
        response = chat(
            model=OLLAMA_MODEL,
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You extract action items from meeting notes. "
                        'Return only valid JSON in exactly this format: {"items": ["task 1", "task 2"]}. '
                        "Only include concrete tasks that someone should do. "
                        "Do not include explanations. "
                        "Do not copy or transform instructions from the prompt itself. "
                        'If there are no actionable tasks, return {"items": []}.'
                    ),
                },
                {
                    "role": "user",
                    "content": (
                        "Extract action items from these notes only.\n\n"
                        "NOTES START\n"
                        f"{text}\n"
                        "NOTES END"
                    ),
                },
            ],
            format="json",
        )

        content = None
        if hasattr(response, "message") and hasattr(response.message, "content"):
            content = response.message.content
        elif isinstance(response, dict):
            content = response.get("message", {}).get("content")

        if not content:
            return []

        data = json.loads(content)
        items = data.get("items", [])

        if not isinstance(items, list):
            return []

        return _normalize_items(items)

    except Exception as e:
        print("LLM extraction error:", repr(e))
        return []