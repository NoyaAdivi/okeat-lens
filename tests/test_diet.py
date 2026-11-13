import pytest

from lens.diet import DIET_TAGS, KOSHER_TYPES, OKEAT_MAP_URL, build_result, class_keys, classes, dish


def test_has_all_101_dishes_in_food101_order():
    keys = class_keys()
    assert len(keys) == 101 == len(set(keys))
    assert keys == sorted(keys)  # Food-101 classes are alphabetical
    assert keys[0] == "apple_pie" and keys[-1] == "waffles"


def test_every_dish_is_bilingual_and_valid():
    for c in classes():
        assert c["en"] and c["he"]
        assert any("֐" <= ch <= "׿" for ch in c["he"]), c["key"]
        assert set(c["tags"]) <= set(DIET_TAGS)
        assert c["kosher"] in KOSHER_TYPES


def test_vegan_is_always_vegetarian():
    for c in classes():
        if "vegan" in c["tags"]:
            assert "vegetarian" in c["tags"], c["key"]


def test_obvious_dishes():
    assert dish("pork_chop")["kosher"] == "not_kosher"
    assert dish("hummus")["tags"] == ["vegan", "vegetarian", "gluten_free"]
    assert dish("pizza")["kosher"] == "dairy"


def test_build_result_confident():
    r = build_result([("falafel", 0.91), ("hummus", 0.05)])
    assert r["dish"]["key"] == "falafel" and r["confident"]
    assert r["hints"] == {"tags": ["vegan", "vegetarian", "gluten_free"], "kosher": "parve", "verified": False}
    assert r["okeat_url"] == OKEAT_MAP_URL
    assert [d["key"] for d in r["top"]] == ["falafel", "hummus"]


def test_build_result_not_sure_gives_no_hints():
    r = build_result([("sushi", 0.08)])
    assert r["dish"] is None and not r["confident"]
    assert r["hints"]["tags"] == [] and r["hints"]["kosher"] is None


def test_unknown_dish():
    with pytest.raises(KeyError):
        dish("shakshuka")
