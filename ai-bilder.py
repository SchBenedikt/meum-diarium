import json
import base64
import os
import time
from google import genai

# Client initialisieren (zieht sich GEMINI_API_KEY automatisch aus der Umgebung)
client = genai.Client()

POSTS_DIR = "/Users/benedikt.schaechner/Documents/GitHub/meum-diarium/public/posts"
IMAGES_BASE = "/Users/benedikt.schaechner/Documents/GitHub/meum-diarium/public/images"

STYLE = "classicist historicist painting style in the tradition of 17th-19th century European history painting, Baroque composition, Rembrandtesque chiaroscuro lighting, academic realism, oil painting texture, rich warm colors, dramatic shadows, highly detailed figures, classical harmonious composition, masterpiece"

AUTHORS_TO_PROCESS = ["catilina", "cicero", "sallust", "sokrates", "seneca"]

author_info = {
    "catilina": "Lucius Sergius Catilina",
    "cicero": "Marcus Tullius Cicero",
    "sallust": "Gaius Sallustius Crispus",
    "sokrates": "Socrates",
    "seneca": "Seneca the Younger",
}

prompts = {
    # CATILINA
    "ambitionen-verraten": "Catilina with fierce ambitious expression in the Roman Senate, supporters gathering behind him in shadows, dramatic Baroque lighting",
    "die-verschwoerung-entfaltet-sich": "Secret nocturnal meeting of Catilinarian conspirators in a dark Roman catacomb, torches casting flickering light on faces, Rembrandt style",
    "enttarnt-und-trotzig": "Cicero denouncing Catilina in the Roman Senate, Catilina standing alone and defiant as senators turn away from him, dramatic moment",
    "letzter-widerstand": "Battle of Pistoria: Catilina fighting desperately surrounded by Roman soldiers, his last stand, dramatic battlefield scene with dark storm clouds",
    "rechtfertigung-des-handelns": "Catilina addressing his followers with passionate rhetoric in a torch-lit camp at night, dramatic shadows on faces",
    # CICERO
    "enthuellung-der-catilinarischen-verschwoerung": "Cicero delivering his First Catilinarian Oration in the Senate, dramatic sweeping gesture, senators listening in rapt attention, Baroque lighting",
    "freundschaft-und-weisheit": "Cicero and his friend Atticus conversing in a Roman peristyle garden, philosophical discussion, warm golden hour light filtering through columns",
    "gegen-den-neuen-tyrannen": "Cicero speaking passionately against Mark Antony in the Senate, powerful oratory, tense political atmosphere, dark shadows",
    "ich-besiege-den-korrupten-statthalter": "Cicero prosecuting the corrupt governor Verres in the Roman court, presenting evidence scrolls, dramatic courtroom scene with jury",
    "ich-rette-die-republik": "Cicero as Consul giving orders to suppress the Catilinarian conspiracy, resolute expression, Roman lictors with fasces standing by",
    "konflikt-mit-antonius": "Cicero and Mark Antony facing each other in angry confrontation in the Roman Forum, crowd watching in tension, dramatic sunset lighting",
    "mein-bitteres-exil": "Cicero in exile sitting melancholic by the seashore, his Roman villa visible in the distance, storm clouds gathering, emotional scene",
    "meine-triumphale-rueckkehr": "Cicero returning to Rome from exile, crowds cheering and throwing flowers, triumphal atmosphere with warm golden light",
    "reflexionen-im-exil": "Cicero writing philosophical works in his study by candlelight, pensive and melancholic mood, books and scrolls around him",
    "verteidigung-des-milo": "Cicero defending Milo in the Roman court, dramatic oratory gesture, jury and crowd listening intently, tense atmosphere",
    # SALLUST
    "catilinarische-analyse": "Sallust writing his history of the Catilinarian conspiracy in his Roman study, scrolls and reference works around him, scholarly atmosphere",
    "historische-methode": "Sallust examining ancient inscriptions and historical sources, scholarly Roman setting with manuscripts and artifacts",
    "jugurthinischer-krieg": "Epic battle scene from the Jugurthine War, Numidian cavalry clashing with Roman legions in a desert landscape with dramatic sky",
    "politische-korruption": "Allegorical scene of political corruption: Roman senators accepting bribes in a dimly lit chamber, decaying moral values, dark Baroque style",
    "tugend-und-macht": "Sallust presenting his historical works, allegorical figures of Virtue and Power flanking him, noble classical Roman interior",
    # SENECA
    "briefe-an-lucilius": "Seneca writing letters in his luxurious Roman study, Stoic philosopher with serene expression, warm candlelight, classical setting",
    "erziehung-neros": "Young Nero as a student with Seneca the teacher, philosophical lesson in a Roman courtyard with columns, golden afternoon light",
    "freiheit-und-sklaverei": "Seneca in deep conversation with a slave, discussing freedom and Stoic philosophy, interior with dramatic candle lighting",
    "naturphilosophie": "Seneca studying the natural world, looking at the night sky through a Roman window, astronomical instruments beside him",
    "reichtum-und-tugend": "Seneca renouncing material wealth, giving away luxurious possessions to the poor, virtuous expression, dramatic Baroque lighting",
    # SOKRATES
    "das-delphische-orakel": "Socrates at the Oracle of Delphi, the Pythia on her tripod in mystical vapors, Socrates listening intently, ancient Greek temple setting",
    "der-tod-des-sokrates": "The death of Socrates: Socrates calmly reaching for the hemlock cup, his disciples grieving around him, prison cell with dramatic Rembrandt lighting",
    "die-aporie": "Socrates debating in the Athenian agora, his interlocutor perplexed and confused, engaged listeners forming a circle around them",
    "die-kunst-der-maieutik": "Socrates teaching a young student through questioning in a Greek palaestra, classical architectural setting with columns and statues",
    "meine-verteidigung": "Socrates defending himself before the Athenian jury, dignified calm demeanor, the jurors listening, classical Greek courtroom",
}

generation_config = {
    'temperature': 1,
    'max_output_tokens': 65536,
    'top_p': 0.95,
    'thinking_level': 'low',
    'image_config': {
        'image_size': '1K',
    },
}

# Gesamtzahl berechnen
total = 0
for author in AUTHORS_TO_PROCESS:
    ap = os.path.join(POSTS_DIR, author)
    if not os.path.isdir(ap):
        continue
    for fn in sorted(os.listdir(ap)):
        if not fn.endswith(".json"):
            continue
        total += 1

print(f"Generating {total} images using Nano Banana 2 Lite via Interactions API...")
print()

done = 0
for author in AUTHORS_TO_PROCESS:
    ap = os.path.join(POSTS_DIR, author)
    if not os.path.isdir(ap):
        continue
    author_name = author_info.get(author, author)
    img_dir = os.path.join(IMAGES_BASE, f"{author}-posts")
    os.makedirs(img_dir, exist_ok=True)
    
    for fn in sorted(os.listdir(ap)):
        if not fn.endswith(".json"):
            continue
        
        with open(os.path.join(ap, fn), "r") as f:
            d = json.load(f)
            
        slug = d.get("slug", "")
        title = d.get("title", slug)
        done += 1
        
        outpath = os.path.join(img_dir, f"{slug}.png")
        prompt = prompts.get(slug, f"Historical scene: {title}, featuring {author_name}")
        full_prompt = f"Generate a historical masterpiece painting based on this description: {prompt}, {STYLE}"
        
        print(f"[{done}/{total}] {author}/{slug}: {title}")
        print("  Generating via Interactions...")
        
        try:
            # Funktionierender API-Aufruf über das Interactions-Submodul
            interaction = client.interactions.create(
                model='models/gemini-3.1-flash-lite-image',
                input=full_prompt,
                generation_config=generation_config,
                response_modalities=['image'],
            )
            
            img_data = None
            for step in interaction.steps:
                if step.type == 'model_output' and step.content:
                    for part in step.content:
                        if part.type == 'image':
                            # Die Daten kommen als base64-String aus der API
                            img_data = base64.b64decode(part.data)
                            break
            
            if img_data:
                with open(outpath, "wb") as f:
                    f.write(img_data)
                print(f"  ✓ {len(img_data)//1024}KB saved to {outpath}")
            else:
                print("  ✗ Error: Could not extract image part from interaction steps")
                
        except Exception as e:
            print(f"  ✗ Error: {e}")
        
        # Sicherungspause gegen Spam-Limits
        time.sleep(3)

print(f"\n✅ Done! Processed {done} inputs.")
