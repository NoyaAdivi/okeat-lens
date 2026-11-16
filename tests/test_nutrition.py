import pytest

from lens.diet import (ALLERGENS, FOOD_GROUPS, NUTRIENT_FAMILIES, calorie_split, classes, daily_reference,
                       dish, load_labels, meal_totals, nutrient_families, scale_nutrition)

ALL = classes() + load_labels()["extras"]


def test_every_dish_has_sane_nutrition():
    for c in ALL:
        n = c["nutrition"]
        assert n["serving_g"] > 0, c["key"]
        assert n["fiber"] <= n["carbs"] and n["sugar"] <= n["carbs"], c["key"]
        assert n["protein"] + n["carbs"] + n["fat"] <= n["serving_g"], c["key"]
        assert abs(n["kcal"] - (4 * n["protein"] + 4 * n["carbs"] + 9 * n["fat"])) <= 1, c["key"]
        assert 0 <= n["water_pct"] <= 100
        assert set(c["groups"]) <= set(FOOD_GROUPS)
        assert set(c["allergens"]) <= set(ALLERGENS)


def test_allergens_agree_with_diet_tags():
    for c in ALL:
        a, t = set(c["allergens"]), set(c["tags"])
        if "vegan" in t:
            assert not a & {"milk", "eggs", "fish", "shellfish"}, c["key"]
        if "gluten_free" in t:
            assert "gluten" not in a, c["key"]


def test_scale_and_split():
    n = dish("hummus")["nutrition"]
    double = scale_nutrition(n, 2)
    assert double["kcal"] == 2 * n["kcal"] and double["protein"] == 2 * n["protein"]
    assert sum(calorie_split(n).values()) == 100
    with pytest.raises(ValueError):
        scale_nutrition(n, 0)


def test_families():
    f = nutrient_families(dish("steak")["nutrition"])
    assert set(f) == set(NUTRIENT_FAMILIES)
    assert f["protein"] == 3 and f["carbs"] == 0
    assert nutrient_families(dish("miso_soup")["nutrition"])["water"] == 3


def test_meal_totals():
    m = meal_totals([("falafel", 1), ("hummus", 0.5)])
    f, h = dish("falafel")["nutrition"], dish("hummus")["nutrition"]
    assert m["kcal"] == f["kcal"] + round(h["kcal"] * 0.5)
    assert m["daily_pct"]["kcal"] == round(100 * m["kcal"] / daily_reference()["kcal"])
    with pytest.raises(KeyError):
        meal_totals([("shakshuka", 1)])
