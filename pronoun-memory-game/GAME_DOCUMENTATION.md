# Pronoun Power: A Digital Memory Card Game for Practicing Personal, Possessive, and Object Pronouns

**Student Name**
Department of English, Universidad Nacional de Educación a Distancia (UNED)
Course: English A1 — Grammar and Everyday Communication
Instructor Name
September 21, 2026

> **Note.** This is an APA 7–styled documentation file. Replace *Student Name*, *Instructor Name*, and the course details above with your own information before submitting. For a print-ready title page and hanging-indent references, open **GAME_DOCUMENTATION.html** and choose **Print → Save as PDF**.

---

## Access Links

- **Play the game (live link):**
  https://raw.githack.com/estibenR80/appweb1/add-pronoun-memory-game/pronoun-memory-game/pronoun-power.html
- **Source code (GitHub repository):**
  https://github.com/estibenR80/appweb1/tree/add-pronoun-memory-game/pronoun-memory-game
- **Pull request (project submission):**
  https://github.com/estibenR80/appweb1/pull/3

---

## Pronoun Power: A Digital Memory Card Game

Pronoun Power is an interactive, browser-based memory card game designed to help A1-level learners practice and strengthen the correct use of English pronouns in everyday contexts. The game presents 20 cards organized into 10 matching pairs, plus 2 wildcard cards, and it reinforces three pronoun categories: personal (subject) pronouns, object pronouns, and possessive pronouns and adjectives. This document explains how the web application works, how to play it, and how its design supports language learning.

### Purpose of the Game

Pronouns allow speakers to communicate naturally without repeating names, which makes them essential for introducing oneself, describing possessions, and talking about friends and family (Muñoz-Ortiz, 2020). The application turns this grammar point into a playful matching task so that learners connect grammatical accuracy with fun, contextualized practice (Santiesteban-Naranjo, 2024).

## How the Web Application Works

### Interface and Navigation
When the page loads, the learner sees a title header and four tabs: *Play*, *Rules*, *Examples*, and *Reflection*. Clicking a tab shows its panel and hides the others, so the interface stays clean and focused. The *Play* tab contains the game board; the other three tabs provide bilingual instructions, worked examples, and a metacognitive reflection.

### The Game Board
The board displays 22 face-down cards in a responsive grid that adapts to phones, tablets, and computers. Each card has two faces: a decorative back showing a question mark and a front showing its content. There are three kinds of cards: a *sentence card* (an everyday sentence with a blank, e.g., "____ am a student at this school."), a *pronoun card* (a single pronoun, e.g., "I"), and a *wildcard* (a special action).

### Flipping and Matching Logic
When a learner clicks a card, it flips over with a smooth 3D animation to reveal its front. The player flips two cards per turn. The program checks whether the two cards belong to the same pair and whether one is a sentence and the other is its correct pronoun. If they match, a green **"Match!"** message appears with a short grammar explanation, the pair stays face up, the score increases, and the same player plays again. If they do not match, a red **"Try again!"** message appears and the cards flip back automatically, passing the turn to the other player.

### Color Coding of Pronoun Types
To make grammar visible, each pronoun category has its own color used on card borders, tags, and highlighted words: **blue** for personal pronouns, **purple** for possessive pronouns and adjectives, and **red** for object pronouns. **Orange** marks the wildcards. This color coding helps learners recognize each category at a glance (Escobar-Álvarez, 2020).

### Wildcards
Two wildcards add variety and engagement. The **"Extra Turn"** card lets the current player flip again, while the **"Lose a Pair"** card requires the player to return one previously won pair. Wildcards resolve immediately and do not end the player's turn.

### Scoring and Winning
The scoreboard tracks pairs for Player 1 and Player 2 and highlights whose turn it is. A **Solo mode** is available for individual practice. When all 10 pairs have been matched, a banner announces the winner (most pairs) or a tie. A **"New Game"** button reshuffles the deck at any time.

## Card Content

**Table 1**
*The Ten Matching Pairs in Pronoun Power*

| # | Sentence card | Pronoun card | Type |
|---|---------------|--------------|------|
| 1 | ____ am a student at this school. | I | Personal |
| 2 | ____ studies English every evening at home. | She | Personal |
| 3 | ____ play football with our friends after class. | We | Personal |
| 4 | My teacher helped ____ with the homework. | me | Object |
| 5 | I really like ____; he is a good friend. | him | Object |
| 6 | Please call ____ when dinner is ready. | us | Object |
| 7 | This is ____ backpack; it belongs to Anna. | her | Possessive |
| 8 | That blue notebook is ____, not yours. | mine | Possessive |
| 9 | ____ house has a big garden where we play. | Our | Possessive |
| 10 | The dog wagged ____ tail happily. | its | Possessive |

## Examples With Grammatical Explanations

- **"This is her bag."** The pronoun *her* shows possession (whose bag it is).
- **"I like him."** The pronoun *him* is an object pronoun that receives the action of "like".
- **"That is mine."** The pronoun *mine* replaces the noun and shows possession without repeating it.

## Conclusion

Pronoun Power demonstrates how a simple web technology stack (HTML, CSS, and JavaScript) can turn a grammar objective into an engaging, self-checking activity. By combining flip animations, immediate feedback, color-coded categories, and wildcards, the game helps learners practice personal, possessive, and object pronouns in realistic contexts while enjoying the process.

---

## References

Escobar-Álvarez, M. Á. (Coord.). (2020). *Curso de inglés para adultos* (pp. 24–30). UNED – Universidad Nacional de Educación a Distancia.

Muñoz-Ortiz, F. (2020). *Inglés A1* (pp. 136–146). Editorial Tutor Formación.

Santiesteban-Naranjo, E. (2024). *Sharpening up your vocabulary: A practical guide for English as a foreign language learner* (pp. 5–12). Editorial Tecnocientífica Americana.
