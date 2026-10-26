#!/usr/bin/env python3
"""
Vocabulary Import Pipeline for English Lab
==========================================
Extracts, translates, and integrates words from Oxford 3000 & Oxford 5000 (A1-C1)
and CEFR resources into `data/words.json`.

Preserves existing words and sentences in `data/words.json`.
Caches translations in `data/sources/translations_cache.json` for fast re-runs.
"""

import os
import sys
import json
import time
import urllib.request
import urllib.parse
from concurrent.futures import ThreadPoolExecutor

sys.stdout.reconfigure(encoding='utf-8')

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, "data")
SOURCES_DIR = os.path.join(DATA_DIR, "sources")
WORDS_JSON_PATH = os.path.join(DATA_DIR, "words.json")
BACKUP_JSON_PATH = os.path.join(DATA_DIR, "words.backup.json")
CACHE_PATH = os.path.join(SOURCES_DIR, "translations_cache.json")
OXFORD_RAW_PATH = os.path.join(SOURCES_DIR, "oxford_5000_raw.json")

# POS mapping to project's WordType: "noun" | "verb" | "adjective" | "adverb" | "phrase" | "other"
POS_MAP = {
    "noun": "noun",
    "verb": "verb",
    "modal verb": "verb",
    "auxiliary verb": "verb",
    "adjective": "adjective",
    "adverb": "adverb",
    "phrase": "phrase",
    "idiom": "phrase",
    "phrasal verb": "phrase",
}

def map_pos(raw_type: str) -> str:
    if not raw_type:
        return "other"
    t = raw_type.lower().strip()
    return POS_MAP.get(t, "other")

def load_translation_cache() -> dict:
    if os.path.exists(CACHE_PATH):
        try:
            with open(CACHE_PATH, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return {}
    return {}

def save_translation_cache(cache: dict):
    with open(CACHE_PATH, "w", encoding="utf-8") as f:
        json.dump(cache, f, ensure_ascii=False, indent=2)

def translate_batch(chunk: list[str]) -> dict[str, str]:
    if not chunk:
        return {}
    text = "\n".join(chunk)
    url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=uz&dt=t&q=" + urllib.parse.quote(text)
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    
    for attempt in range(3):
        try:
            with urllib.request.urlopen(req, timeout=12) as resp:
                res = json.loads(resp.read().decode("utf-8"))
                full_text = "".join([segment[0] for segment in res[0]])
                lines = [l.strip() for l in full_text.split("\n")]
                results = {}
                for idx, w in enumerate(chunk):
                    if idx < len(lines) and lines[idx]:
                        results[w] = lines[idx]
                    else:
                        results[w] = w
                return results
        except Exception as e:
            time.sleep(1 + attempt)
    
    # Fallback if all attempts fail
    return {w: w for w in chunk}

def batch_translate_words(words: list[str], cache: dict, max_workers: int = 5) -> dict[str, str]:
    needed = [w for w in words if w not in cache]
    if not needed:
        print(f"All {len(words)} words already in translation cache.")
        return cache

    print(f"Translating {len(needed)} words ({len(needed)//50 + 1} batches) using {max_workers} workers...")
    chunks = [needed[i:i + 50] for i in range(0, len(needed), 50)]
    
    start_time = time.time()
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        for idx, result in enumerate(executor.map(translate_batch, chunks)):
            cache.update(result)
            if (idx + 1) % 10 == 0 or (idx + 1) == len(chunks):
                print(f"  Progress: {(idx + 1) * 50}/{len(needed)} words translated...")
                save_translation_cache(cache)
    
    save_translation_cache(cache)
    elapsed = time.time() - start_time
    print(f"Translation complete in {elapsed:.2f}s.")
    return cache

def main():
    print("=" * 60)
    print("English Lab: Oxford 3000 & 5000 Vocabulary Importer")
    print("=" * 60)

    # 1. Load existing words.json
    if not os.path.exists(WORDS_JSON_PATH):
        print(f"Error: {WORDS_JSON_PATH} not found!")
        sys.exit(1)

    with open(WORDS_JSON_PATH, "r", encoding="utf-8") as f:
        current_db = json.load(f)

    # Backup current words.json
    with open(BACKUP_JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(current_db, f, ensure_ascii=False, indent=2)
    print(f"Backup created at: {BACKUP_JSON_PATH}")

    # Build index of existing words
    existing_words_by_level = {}
    existing_word_texts = set()
    total_before = 0
    for level_group in current_db.get("levels", []):
        lvl = level_group["level"].lower()
        existing_words_by_level[lvl] = level_group.get("words", [])
        total_before += len(existing_words_by_level[lvl])
        for w in existing_words_by_level[lvl]:
            existing_word_texts.add((lvl, w["en"].lower().strip()))

    print(f"Existing words in database: {total_before}")

    # 2. Load Oxford 5000 raw dataset
    if not os.path.exists(OXFORD_RAW_PATH):
        print(f"Error: {OXFORD_RAW_PATH} not found!")
        sys.exit(1)

    with open(OXFORD_RAW_PATH, "r", encoding="utf-8") as f:
        raw_oxford = json.load(f)

    oxford_items = list(raw_oxford.values()) if isinstance(raw_oxford, dict) else raw_oxford
    print(f"Loaded Oxford dataset: {len(oxford_items)} total entries.")

    # 3. Filter and gather words to translate
    words_to_translate = set()
    cleaned_entries = []

    for item in oxford_items:
        word = item.get("word", "").strip()
        cefr = item.get("cefr", "").lower().strip()
        if not word or cefr not in ["a1", "a2", "b1", "b2", "c1"]:
            continue
        
        words_to_translate.add(word)
        cleaned_entries.append({
            "en": word,
            "level": cefr,
            "type": map_pos(item.get("type", "")),
            "hint": item.get("definition", "").strip(),
            "example": item.get("example", "").strip(),
        })

    print(f"Valid Oxford entries across A1-C1: {len(cleaned_entries)}")
    print(f"Unique words to translate/lookup: {len(words_to_translate)}")

    # 4. Translate words
    cache = load_translation_cache()
    cache = batch_translate_words(sorted(list(words_to_translate)), cache)

    # 5. Group and merge into level structure
    # Standard descriptions for levels
    level_titles = {
        "a1": ("Beginner", "Boshlang'ich darajadagi eng sodda va kundalik so'zlar hamda gaplar"),
        "a2": ("Elementary", "Kundalik muloqot va oddiy mavzulardagi iboralar"),
        "b1": ("Intermediate", "O'rta darajadagi asosiy tushunchalar va tajribalar"),
        "b2": ("Upper-Intermediate", "Murakkab fikrlar va mavhum tushunchalar"),
        "c1": ("Advanced", "Keng qamrovli va chuqur akademik va professional so'z boyligi"),
        "c2": ("Proficiency", "Yuqori darajadagi professional va ona tili darajasidagi lug'at"),
    }

    # Ensure all levels exist in current_db
    existing_levels_dict = {lg["level"].lower(): lg for lg in current_db.get("levels", [])}
    
    # Process each level
    final_levels = []
    total_added = 0

    for lvl in ["a1", "a2", "b1", "b2", "c1", "c2"]:
        lvl_group = existing_levels_dict.get(lvl, {
            "level": lvl,
            "title": level_titles[lvl][0],
            "description": level_titles[lvl][1],
            "words": [],
            "sentences": [],
        })
        
        current_words = lvl_group.get("words", [])
        seen_in_level = set(w["en"].lower().strip() for w in current_words)
        id_counter = len(current_words) + 1

        # Add new entries from Oxford for this level
        level_oxford = [e for e in cleaned_entries if e["level"] == lvl]
        for e in level_oxford:
            norm_en = e["en"].lower().strip()
            if norm_en in seen_in_level:
                continue
            
            seen_in_level.add(norm_en)
            uz_trans = cache.get(e["en"], e["en"]).strip()
            
            # Create word entry
            word_obj = {
                "id": f"{lvl}-w-{id_counter:04d}",
                "en": e["en"],
                "uz": uz_trans,
                "type": e["type"],
            }
            if e["hint"]:
                word_obj["hint"] = e["hint"]
            if e["example"]:
                word_obj["examples"] = [
                    {
                        "en": e["example"],
                        "uz": ""
                    }
                ]
            
            current_words.append(word_obj)
            id_counter += 1
            total_added += 1

        lvl_group["words"] = current_words
        final_levels.append(lvl_group)

    current_db["levels"] = final_levels

    # 6. Save updated words.json
    with open(WORDS_JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(current_db, f, ensure_ascii=False, indent=2)

    # 7. Print summary
    print("\n" + "=" * 60)
    print("IMPORT COMPLETE SUMMARY:")
    print("=" * 60)
    print(f"Initial words count: {total_before}")
    print(f"Added new words:     {total_added}")
    total_after = sum(len(lg.get("words", [])) for lg in final_levels)
    print(f"Total words now:     {total_after}")
    print("\nBreakdown by CEFR level:")
    for lg in final_levels:
        lvl = lg["level"]
        w_cnt = len(lg.get("words", []))
        s_cnt = len(lg.get("sentences", []))
        print(f"  {lvl.upper():<3} ({lg['title']:<18}): {w_cnt:>5} words, {s_cnt:>2} sentences")
    print("=" * 60)

if __name__ == "__main__":
    main()
