from types import SimpleNamespace

from week2.app.services.extract import (
    extract_action_items,
    extract_action_items_llm,
)


def test_extract_action_items_finds_bullets_and_keywords():
    text = """
    - Write README
    TODO: add tests
    We discussed timelines.
    """
    result = extract_action_items(text)
    assert result == ["Write README", "TODO: add tests"]


def test_extract_action_items_llm_empty_input():
    assert extract_action_items_llm("") == []


def test_extract_action_items_llm_parses_json_items(monkeypatch):
    def fake_chat(**kwargs):
        return SimpleNamespace(
            message=SimpleNamespace(
                content='{"items": ["Finish API docs by Friday", "Email the project mentor"]}'
            )
        )

    monkeypatch.setattr("week2.app.services.extract.chat", fake_chat)

    text = """
    - Finish the API docs by Friday
    - Email the project mentor
    Discussion: deployment was delayed.
    """

    result = extract_action_items_llm(text)

    assert result == [
        "Finish API docs by Friday",
        "Email the project mentor",
    ]


def test_extract_action_items_llm_deduplicates_items(monkeypatch):
    def fake_chat(**kwargs):
        return SimpleNamespace(
            message=SimpleNamespace(
                content='{"items": ["Write tests", "write tests", "Update README"]}'
            )
        )

    monkeypatch.setattr("week2.app.services.extract.chat", fake_chat)

    result = extract_action_items_llm("Some meeting notes")

    assert result == ["Write tests", "Update README"]


def test_extract_action_items_llm_returns_empty_on_bad_json(monkeypatch):
    def fake_chat(**kwargs):
        return SimpleNamespace(
            message=SimpleNamespace(
                content="not valid json"
            )
        )

    monkeypatch.setattr("week2.app.services.extract.chat", fake_chat)

    result = extract_action_items_llm("Some meeting notes")

    assert result == []


def test_extract_action_items_llm_returns_empty_when_items_not_list(monkeypatch):
    def fake_chat(**kwargs):
        return SimpleNamespace(
            message=SimpleNamespace(
                content='{"items": "not-a-list"}'
            )
        )

    monkeypatch.setattr("week2.app.services.extract.chat", fake_chat)

    result = extract_action_items_llm("Some meeting notes")

    assert result == []