# Latin Vocabulary Database Structure Documentation

## Overview
This document describes the structure of the Latin vocabulary database (`token.sqlite`) used in the meum-diarium project. The database contains three main tables that work together to provide comprehensive Latin vocabulary with grammatical forms and descriptions.

## Database Tables

### 1. VOC Table - Main Vocabulary Entries
The primary table containing core vocabulary information.

**Table Name**: `VOC`

**Columns**:
- `id` (INTEGER PRIMARY KEY AUTOINCREMENT) - Unique internal ID
- `vok_id` (TEXT UNIQUE NOT NULL) - External vocabulary identifier 
- `latin` (TEXT) - Latin word/phrase
- `desc` (TEXT) - German description/translation
- `html` (TEXT) - Formatted HTML description (optional)
- `key` (TEXT NOT NULL) - Search key (collate nocase)
- `grammar` (TEXT) - Grammar type (e.g., "Verb, a-Konj.", "Subst., o-Dekl.")
- `typnr` (INTEGER) - Type number for categorization

**Indexes**:
- `idx1` on `key` - For fast text search
- `idx2` on `vok_id` - For vocabulary lookup
- `idx5` on `typnr` - For type filtering

**Sample Data**:
```
vok_id: "RRLX-geN"
latin: "zygius a um (gr. Fdw.)"
desc: "zur Hochzeit gehörig"
key: "zygius a um (gr. Fdw.)  zur Hochzeit gehörig"
grammar: "Adj."
```

### 2. GRAMMAR Table - Grammar Forms and Patterns
Contains all grammatical forms and conjugation/declension patterns for each vocabulary entry.

**Table Name**: `GRAMMAR`

**Columns**:
- `id` (INTEGER PRIMARY KEY AUTOINCREMENT) - Unique internal ID
- `vok_id` (TEXT NOT NULL) - Foreign key to VOC table
- `nr` (TEXT) - Form number (e.g., "500", "501", etc.)
- `form` (TEXT) - The actual Latin grammatical form

**Indexes**:
- `idx3` on `vok_id` - For fast vocabulary lookup

**Sample Data**:
```
vok_id: "RRLX-geN"
nr: "510"
form: "zygius"

vok_id: "RRLX-geN" 
nr: "511"
form: "zygii"

vok_id: "RRLX-geN"
nr: "520"
form: "zygia"
```

### 3. FORM Table - Detailed Grammatical Descriptions
Contains detailed grammatical descriptions for forms, providing the "meaning" of each grammatical case.

**Table Name**: `FORM`

**Columns**:
- `id` (INTEGER PRIMARY KEY AUTOINCREMENT) - Unique internal ID
- `vok_id` (TEXT NOT NULL) - Foreign key to VOC table
- `form` (TEXT NOT NULL) - The Latin form (matches GRAMMAR.form)
- `bestimmung` (TEXT) - Grammatical description (e.g., "Nom. Sg.", "Gen. Pl., Abl. Pl.")

**Indexes**:
- `idx4` on `form` - For fast form lookup

**Sample Data**:
```
vok_id: "RRLX-geN"
form: "zygia"
bestimmung: "Nom. Sg. fem."

vok_id: "RRLX-geN"
form: "zygiae" 
bestimmung: "Nom. Pl. fem."

vok_id: "RRLX-geN"
form: "zygiam"
bestimmung: "Akk. Sg. fem."
```

## Table Relationships

### Foreign Key Relationships
- `GRAMMAR.vok_id` → `VOC.vok_id` (One-to-Many)
- `FORM.vok_id` → `VOC.vok_id` (One-to-Many)
- `GRAMMAR.form` ↔ `FORM.form` (Many-to-Many, optional matching)

### Data Flow
1. **VOC** provides the main vocabulary entry
2. **GRAMMAR** provides all possible forms (numbered 500-999+)
3. **FORM** provides grammatical descriptions for a subset of forms

## Key Patterns and Conventions

### Form Numbering System
- Forms are numbered sequentially (500, 501, 502, etc.)
- Different vocabulary entries may have different numbers of forms
- Numbers are consistent within each vocabulary entry

### Grammatical Description Format
Descriptions in `FORM.bestimmung` follow these patterns:

**Single Case**: "Nom. Sg.", "Gen. Pl.", "Akk. Sg."
**Multiple Cases**: "Nom. Sg., Abl. Sg.", "Dat. Pl., Abl. Pl."
**Gender Indicators**: "mask.", "fem.", "neut."

**Common Abbreviations**:
- `Nom` = Nominative
- `Gen` = Genitive  
- `Dat` = Dative
- `Akk` = Accusative
- `Abl` = Ablative
- `Vok` = Vocative
- `Sg` = Singular
- `Pl` = Plural
- `mask` = Masculine
- `fem` = Feminine
- `neut` = Neuter

### Word Types
The `grammar` field indicates word types:
- **Nouns**: "Subst.", with declension type (o-Dekl., a-Dekl., etc.)
- **Adjectives**: "Adj.", with gender patterns (a um, etc.)
- **Verbs**: "Verb", with conjugation type (a-Konj., e-Konj., etc.)

## Database Statistics
- **VOC entries**: ~36,140 vocabulary words
- **GRAMMAR entries**: ~1,496,593 grammatical forms  
- **FORM entries**: ~916,384 described forms
- **Coverage**: ~61% of forms have explicit descriptions

## API Integration

### Matching Strategy
The system uses a 6-tier matching strategy:

1. **Exact Match** - Direct form-to-form matching
2. **Case-Insensitive Match** - Ignores case differences
3. **Alternative Forms** - Handles "Achillis/Achillei" type forms
4. **Smart Gender Inference** - Derives missing forms from existing ones
5. **Partial Matching** - Form contains existing form
6. **Reverse Partial** - Existing form contains target form

### Gender Inference Logic
When FORM table only has partial coverage (e.g., only feminine forms), the system:
1. Detects existing gender patterns from available descriptions
2. Infers missing gender forms using Latin declension rules
3. Maintains consistency with known grammatical patterns

## Usage Examples


### For AI Systems
When integrating with other AI systems:
1. Use `VOC` as primary vocabulary source
2. Use `GRAMMAR` for all possible forms
3. Use `FORM` for grammatical meanings
4. Implement smart matching for partial coverage
5. Respect the comma-separated format for multiple cases

### Data Consistency
- `vok_id` is the primary identifier across all tables
- Form numbers may vary between vocabulary entries
- Not all GRAMMAR forms have corresponding FORM entries
- Smart inference can fill gaps using Latin grammatical rules

This structure enables comprehensive Latin vocabulary support with intelligent form recognition and grammatical description generation.
