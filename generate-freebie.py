from __future__ import annotations

import html
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import cm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    HRFlowable,
    KeepTogether,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parent
OUTPUT = ROOT / "output" / "pdf" / "seitenfunkeln-starterpaket.pdf"
COVER_IMAGE = ROOT / "assets" / "images" / "seitenfunkeln-serie" / "06-buchidee-finden.png"

RASPBERRY = colors.HexColor("#791844")
RASPBERRY_DARK = colors.HexColor("#4B0C2E")
GOLD = colors.HexColor("#D0A15D")
ROSE = colors.HexColor("#CC7187")
BLUSH = colors.HexColor("#FFF7F6")
PINK_WASH = colors.HexColor("#F8E8EA")
SAGE = colors.HexColor("#587166")
INK = colors.HexColor("#321B27")
MUTED = colors.HexColor("#685761")
LINE = colors.HexColor("#E8D6D8")
WHITE = colors.white


def register_fonts() -> None:
    pdfmetrics.registerFont(TTFont("Georgia", r"C:\Windows\Fonts\georgia.ttf"))
    pdfmetrics.registerFont(TTFont("Georgia-Bold", r"C:\Windows\Fonts\georgiab.ttf"))
    pdfmetrics.registerFont(TTFont("Arial", r"C:\Windows\Fonts\arial.ttf"))
    pdfmetrics.registerFont(TTFont("Arial-Bold", r"C:\Windows\Fonts\arialbd.ttf"))


register_fonts()

styles = getSampleStyleSheet()
styles.add(ParagraphStyle(
    name="CoverEyebrow",
    fontName="Arial-Bold",
    fontSize=9,
    leading=12,
    textColor=GOLD,
    alignment=TA_CENTER,
    spaceAfter=12,
))
styles.add(ParagraphStyle(
    name="CoverTitle",
    fontName="Georgia-Bold",
    fontSize=27,
    leading=32,
    textColor=WHITE,
    alignment=TA_CENTER,
    spaceAfter=12,
))
styles.add(ParagraphStyle(
    name="CoverSub",
    fontName="Arial",
    fontSize=12,
    leading=18,
    textColor=colors.HexColor("#F7EDEE"),
    alignment=TA_CENTER,
    spaceAfter=14,
))
styles.add(ParagraphStyle(
    name="Eyebrow",
    fontName="Arial-Bold",
    fontSize=8.5,
    leading=11,
    textColor=RASPBERRY,
    spaceAfter=8,
))
styles.add(ParagraphStyle(
    name="H1",
    fontName="Georgia-Bold",
    fontSize=23,
    leading=29,
    textColor=RASPBERRY_DARK,
    spaceAfter=13,
))
styles.add(ParagraphStyle(
    name="H2",
    fontName="Georgia-Bold",
    fontSize=16,
    leading=21,
    textColor=RASPBERRY_DARK,
    spaceBefore=6,
    spaceAfter=9,
))
styles.add(ParagraphStyle(
    name="Body",
    fontName="Arial",
    fontSize=10.2,
    leading=15.5,
    textColor=INK,
    spaceAfter=8,
))
styles.add(ParagraphStyle(
    name="Small",
    fontName="Arial",
    fontSize=8.4,
    leading=12,
    textColor=MUTED,
))
styles.add(ParagraphStyle(
    name="PromptTitle",
    fontName="Georgia-Bold",
    fontSize=13.2,
    leading=17,
    textColor=RASPBERRY_DARK,
    spaceAfter=5,
))
styles.add(ParagraphStyle(
    name="PromptGoal",
    fontName="Arial-Bold",
    fontSize=8.2,
    leading=11,
    textColor=SAGE,
    spaceAfter=7,
))
styles.add(ParagraphStyle(
    name="PromptText",
    fontName="Arial",
    fontSize=9.2,
    leading=13.4,
    textColor=INK,
))
styles.add(ParagraphStyle(
    name="Tip",
    fontName="Arial",
    fontSize=8.5,
    leading=12.5,
    textColor=MUTED,
))
styles.add(ParagraphStyle(
    name="WorksheetLabel",
    fontName="Arial-Bold",
    fontSize=8.7,
    leading=11,
    textColor=RASPBERRY,
))
styles.add(ParagraphStyle(
    name="WorksheetText",
    fontName="Arial",
    fontSize=9.2,
    leading=13,
    textColor=INK,
))
styles.add(ParagraphStyle(
    name="Quote",
    fontName="Georgia",
    fontSize=15,
    leading=21,
    textColor=RASPBERRY,
    alignment=TA_CENTER,
    leftIndent=18,
    rightIndent=18,
    spaceBefore=10,
    spaceAfter=10,
))


def draw_cover(canvas, doc) -> None:
    width, height = A4
    canvas.saveState()
    canvas.setTitle("Seitenfunkeln Starterpaket")
    canvas.setAuthor("Seitenfunkeln")
    canvas.setSubject("Kostenlose Prompt-Galerie und Vorlagen für den Einstieg in KI-Bücher und KDP")
    canvas.setFillColor(RASPBERRY_DARK)
    canvas.rect(0, 0, width, height, fill=1, stroke=0)
    canvas.drawImage(
        str(COVER_IMAGE),
        0,
        height - 12.6 * cm,
        width=width,
        height=12.6 * cm,
        preserveAspectRatio=False,
        mask="auto",
    )
    canvas.setStrokeColor(GOLD)
    canvas.setLineWidth(1.2)
    canvas.line(2.2 * cm, 1.45 * cm, width - 2.2 * cm, 1.45 * cm)
    canvas.restoreState()


def draw_content_page(canvas, doc) -> None:
    width, height = A4
    canvas.saveState()
    canvas.setFillColor(BLUSH)
    canvas.rect(0, 0, width, height, fill=1, stroke=0)
    canvas.setFillColor(RASPBERRY_DARK)
    canvas.setFont("Georgia-Bold", 9)
    canvas.drawString(1.75 * cm, height - 1.05 * cm, "Seitenfunkeln")
    canvas.setFillColor(MUTED)
    canvas.setFont("Arial", 7.5)
    canvas.drawRightString(width - 1.75 * cm, height - 1.05 * cm, "DEIN KOSTENLOSES STARTERPAKET")
    canvas.setStrokeColor(GOLD)
    canvas.setLineWidth(0.7)
    canvas.line(1.75 * cm, height - 1.27 * cm, width - 1.75 * cm, height - 1.27 * cm)
    canvas.setFillColor(MUTED)
    canvas.setFont("Arial", 7.5)
    canvas.drawString(1.75 * cm, 0.85 * cm, "Mit Herz. Mit Freude. Schritt für Schritt.")
    canvas.drawRightString(width - 1.75 * cm, 0.85 * cm, str(doc.page))
    canvas.restoreState()


def section_header(eyebrow: str, title: str, intro: str | None = None):
    parts = [
        Paragraph(eyebrow.upper(), styles["Eyebrow"]),
        Paragraph(title, styles["H1"]),
        HRFlowable(width="100%", thickness=0.8, color=GOLD, spaceAfter=14),
    ]
    if intro:
        parts.append(Paragraph(intro, styles["Body"]))
        parts.append(Spacer(1, 5))
    return parts


def prompt_box(number: int | str, title: str, goal: str, prompt: str, tip: str):
    prompt_html = html.escape(prompt).replace("\n", "<br/>")
    label = f"PROMPT {number:02d}" if isinstance(number, int) else number
    body = [
        Paragraph(label, styles["Eyebrow"]),
        Paragraph(title, styles["PromptTitle"]),
        Paragraph(goal, styles["PromptGoal"]),
        Paragraph(prompt_html, styles["PromptText"]),
        Spacer(1, 8),
        Paragraph(f"<b>Kleiner Tipp:</b> {html.escape(tip)}", styles["Tip"]),
    ]
    table = Table([[body]], colWidths=[16.1 * cm])
    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), colors.white),
        ("BOX", (0, 0), (-1, -1), 0.8, LINE),
        ("LINEBEFORE", (0, 0), (0, -1), 4, GOLD),
        ("LEFTPADDING", (0, 0), (-1, -1), 14),
        ("RIGHTPADDING", (0, 0), (-1, -1), 14),
        ("TOPPADDING", (0, 0), (-1, -1), 13),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 13),
    ]))
    return KeepTogether([table, Spacer(1, 11)])


def worksheet_row(label: str, hint: str, height: float = 1.55 * cm):
    cell = [Paragraph(label, styles["WorksheetLabel"]), Paragraph(hint, styles["WorksheetText"])]
    table = Table([[cell]], colWidths=[16.1 * cm], rowHeights=[height])
    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), colors.white),
        ("BOX", (0, 0), (-1, -1), 0.7, LINE),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 11),
        ("RIGHTPADDING", (0, 0), (-1, -1), 11),
        ("TOPPADDING", (0, 0), (-1, -1), 9),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
    ]))
    return table


def bullet_list(items: list[str]):
    rows = []
    for item in items:
        rows.append([Paragraph("[ ]", styles["Body"]), Paragraph(item, styles["Body"])])
    table = Table(rows, colWidths=[0.65 * cm, 15.45 * cm])
    table.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (-1, -1), 4),
        ("TOPPADDING", (0, 0), (-1, -1), 2),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 2),
    ]))
    return table


def build_story():
    story = [
        Spacer(1, 13.2 * cm),
        Paragraph("KOSTENLOS · OHNE ANMELDUNG · FÜR DEINEN ANFANG", styles["CoverEyebrow"]),
        Paragraph("Dein erstes Buch darf<br/>klein anfangen", styles["CoverTitle"]),
        Paragraph(
            "Das Seitenfunkeln-Starterpaket mit 12 liebevollen KI-Prompts, "
            "4 ausfüllbaren Vorlagen und einem ruhigen 30-Tage-Weg.",
            styles["CoverSub"],
        ),
        Paragraph("Für Anfängerinnen und Anfänger, die aus einer Idee etwas Eigenes erschaffen möchten.", styles["CoverSub"]),
        PageBreak(),
    ]

    story += section_header(
        "Willkommen bei Seitenfunkeln",
        "Du brauchst noch keinen perfekten Plan.",
        "Vielleicht ist da bisher nur ein Gedanke, ein Thema oder der Wunsch, endlich ein eigenes Buch in den Händen zu halten. Dieses Starterpaket hilft dir, aus diesem leisen Anfang eine klare, prüfbare Buchidee zu machen.",
    )
    story += [
        Paragraph("So nutzt du dieses Paket", styles["H2"]),
        bullet_list([
            "Wähle zuerst nur einen Prompt, der zu deinem heutigen Schritt passt.",
            "Ersetze alle Wörter in eckigen Klammern durch deine eigenen Angaben.",
            "Bitte die KI um Rückfragen, wenn deine Idee noch zu allgemein ist.",
            "Prüfe jedes Ergebnis selbst. Du entscheidest, was zu deinem Buch passt.",
            "Notiere deine besten Gedanken direkt in den Vorlagen ab Seite 10.",
        ]),
        Spacer(1, 12),
        Paragraph("KI darf dir beim Sortieren helfen. Deine Idee, deine Sorgfalt und dein Herz machen daraus ein Buch.", styles["Quote"]),
        Spacer(1, 8),
        Table([[Paragraph(
            "<b>Wichtig:</b> Die Prompts liefern Entwürfe, keine geprüften Tatsachen. Kontrolliere Inhalte, Rechte, Marken, Quellen und die jeweils aktuellen KDP-Regeln vor jeder Veröffentlichung.",
            styles["Tip"],
        )]], colWidths=[16.1 * cm], style=TableStyle([
            ("BACKGROUND", (0, 0), (-1, -1), PINK_WASH),
            ("BOX", (0, 0), (-1, -1), 0.7, ROSE),
            ("LEFTPADDING", (0, 0), (-1, -1), 12),
            ("RIGHTPADDING", (0, 0), (-1, -1), 12),
            ("TOPPADDING", (0, 0), (-1, -1), 10),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
        ])),
        PageBreak(),
    ]

    story += section_header(
        "Bevor du loslegst",
        "Die kleine Seitenfunkeln-Promptformel",
        "Ein guter Prompt muss nicht technisch klingen. Er braucht nur vier klare Zutaten. Je konkreter du sie formulierst, desto hilfreicher wird der erste Entwurf.",
    )
    formula_rows = [
        ["1", "Rolle", "Wer soll die KI für diesen Schritt sein?", "z. B. ein einfühlsamer Buchkonzept-Coach"],
        ["2", "Ausgangslage", "Was weißt du schon?", "z. B. Thema, Zielgruppe, Buchart"],
        ["3", "Aufgabe", "Was genau brauchst du jetzt?", "z. B. 10 Ideen, eine Gliederung, Rückfragen"],
        ["4", "Rahmen", "Wie soll das Ergebnis aussehen?", "z. B. einfach, als Tabelle, ohne Fachsprache"],
    ]
    formula_table = Table(
        [[Paragraph(f"<b>{html.escape(a)}</b>", styles["Body"]), Paragraph(html.escape(b), styles["WorksheetLabel"]), Paragraph(c, styles["Small"]), Paragraph(d, styles["Small"])] for a, b, c, d in formula_rows],
        colWidths=[0.75 * cm, 3.2 * cm, 5.0 * cm, 7.15 * cm],
    )
    formula_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), colors.white),
        ("BOX", (0, 0), (-1, -1), 0.7, LINE),
        ("INNERGRID", (0, 0), (-1, -1), 0.5, LINE),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("TEXTCOLOR", (0, 0), (1, -1), RASPBERRY),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
        ("RIGHTPADDING", (0, 0), (-1, -1), 8),
        ("TOPPADDING", (0, 0), (-1, -1), 9),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 9),
    ]))
    story += [
        formula_table,
        Spacer(1, 15),
        Paragraph("Diese Ergänzung verbessert fast jeden Prompt", styles["H2"]),
        prompt_box(
            "BONUS-PROMPT",
            "Bitte frag mich zuerst",
            "Für alle Situationen, in denen du selbst noch nicht genau weißt, was du brauchst.",
            "Bevor du eine Lösung vorschlägst, stelle mir bitte nacheinander fünf kurze Rückfragen. Hilf mir damit, Zielgruppe, Nutzen, Umfang, Stil und meinen verfügbaren Zeitrahmen zu klären. Fasse meine Antworten danach in einfachen Worten zusammen und nenne mir drei mögliche nächste Schritte.",
            "Beantworte die Rückfragen ehrlich. Ein kleiner, machbarer Plan ist wertvoller als eine riesige Ideensammlung.",
        ),
        PageBreak(),
    ]

    prompt_pages = [
        (
            "Ideen finden",
            "Von deinem Herzensthema zu ersten Möglichkeiten",
            [
                (1, "Deine Ideenfunken sammeln", "Wenn du ein Thema liebst, aber noch keine konkrete Buchidee hast.", "Du bist ein einfühlsamer Buchideen-Coach. Ich interessiere mich für [THEMA] und kenne mich mit [ERFAHRUNG ODER HOBBY] aus. Entwickle 12 kleine, konkrete Buchideen für klar benennbare Zielgruppen. Sortiere sie nach einfach, mittel und aufwendig. Erkläre jede Idee in einem Satz und stelle mir danach drei Fragen, mit denen ich meine Favoriten auswählen kann.", "Markiere nur drei Ideen, die du wirklich gern weiterdenken möchtest."),
                (2, "Die richtige Leserin oder den richtigen Leser verstehen", "Wenn du weißt, worum es geht, aber noch nicht genau für wen.", "Hilf mir, eine konkrete Zielperson für ein Buch über [THEMA] zu beschreiben. Erfinde keine Marktdaten. Zeige mir stattdessen mögliche Lebenssituationen, Wünsche, Schwierigkeiten, bisherige Lösungsversuche und Gründe, warum diese Person ein Buch nutzen würde. Gib mir drei unterschiedliche Zielgruppen-Varianten und erkläre die Unterschiede in einfacher Sprache.", "Wähle die Zielgruppe, deren Alltag du am besten verstehst."),
            ],
        ),
        (
            "Klarheit gewinnen",
            "Aus einer breiten Idee wird ein greifbares Konzept",
            [
                (3, "Eine breite Nische liebevoll verkleinern", "Wenn deine Idee noch für alle und damit für niemanden gedacht ist.", "Meine bisherige Buchidee lautet: [IDEE]. Hilf mir, sie in zehn konkretere Varianten zu verwandeln. Verändere jeweils nur einen Punkt: Zielgruppe, Alter, Situation, Ziel, Dauer, Schwierigkeitsgrad oder Stil. Stelle die Varianten als Tabelle dar und nenne zu jeder Variante eine Frage, die ich vor der Umsetzung prüfen sollte.", "Eine Nische ist nicht automatisch gut, nur weil sie klein ist. Sie braucht weiterhin echten Nutzen."),
                (4, "Die passende Buchart vergleichen", "Wenn du zwischen Journal, Arbeitsbuch, Ratgeber oder anderem Format schwankst.", "Vergleiche für meine Idee [IDEE] die Bucharten [BUCHART 1], [BUCHART 2] und [BUCHART 3]. Beurteile sie anhand von Nutzen für die Zielgruppe, Erstellungsaufwand, nötiger Textmenge, Gestaltungsaufwand und Möglichkeiten für einen kleinen Prototyp. Stelle keine Verkaufsprognose auf. Empfiehl mir am Ende die einfachste sinnvolle Testversion.", "Beginne mit einer Testversion von fünf bis zehn Seiten, bevor du alles ausarbeitest."),
            ],
        ),
        (
            "Ehrlich prüfen",
            "KI unterstützt deine Recherche, ersetzt sie aber nicht",
            [
                (5, "Deine Amazon-Notizen auswerten", "Wenn du echte Suchergebnisse gesammelt hast und Muster erkennen möchtest.", "Ich gebe dir gleich meine eigenen Notizen zu ähnlichen Büchern auf Amazon. Nutze ausschließlich diese Angaben und erfinde nichts hinzu. Ordne Titel, Zielgruppen, Preise, Bewertungen, sichtbare Stärken und mögliche Lücken. Zeige mir wiederkehrende Muster, offene Fragen und drei vorsichtige Schlussfolgerungen. Kennzeichne klar, was sich aus meinen Notizen nicht beurteilen lässt. Meine Notizen: [NOTIZEN EINFÜGEN].", "Die KI kann keine verlässliche aktuelle Marktprüfung vortäuschen. Füttere sie mit deinen echten Beobachtungen."),
                (6, "Einen echten Unterschied formulieren", "Wenn du nicht nur ein weiteres ähnliches Buch machen möchtest.", "Meine Buchidee ist [IDEE]. Ähnliche Bücher bieten häufig [BEOBACHTUNG]. Entwickle zehn mögliche Verbesserungen, die den Nutzen für [ZIELGRUPPE] erhöhen könnten. Denke an Verständlichkeit, Aufbau, Anwendungssituation, Seitengestaltung, Umfang und Motivation. Vermeide bloß kosmetische Unterschiede. Formuliere danach drei Sätze nach dem Muster: Mein Buch hilft [ZIELGRUPPE] besser, weil [KONKRETER UNTERSCHIED].", "Ein anderes Cover ist noch kein anderer Nutzen."),
            ],
        ),
        (
            "Das Konzept bauen",
            "Jetzt bekommt deine Buchidee ein stabiles Zuhause",
            [
                (7, "Das Herz deines Buches in einem Satz", "Wenn du Nutzen und Richtung klar aussprechen möchtest.", "Formuliere aus meinen Angaben zehn einfache Buchversprechen ohne Übertreibung und ohne garantierte Ergebnisse. Zielgruppe: [ZIELGRUPPE]. Buchart: [BUCHART]. Thema: [THEMA]. Gewünschter Nutzen: [NUTZEN]. Besonderheit: [UNTERSCHIED]. Jeder Satz soll verständlich, konkret und höchstens 18 Wörter lang sein. Erkläre anschließend, welcher Satz am klarsten ist und warum.", "Ein gutes Buchversprechen beschreibt Hilfe oder Erfahrung, nicht ein garantiertes Ergebnis."),
                (8, "Das Buchkonzept auf einer Seite", "Wenn du alle wichtigen Entscheidungen an einem Ort sammeln möchtest.", "Erstelle aus meinen Angaben ein kompaktes Buchkonzept mit den Überschriften Zielgruppe, Ausgangssituation, gewünschter Nutzen, Buchart, Umfang, Ton, Inhalte, Besonderheit, Qualitätsprüfung und offene Fragen. Verwende einfache Sprache. Wo eine Angabe fehlt, stelle eine konkrete Rückfrage statt etwas zu erfinden. Meine Angaben: [DEINE NOTIZEN].", "Übertrage das Ergebnis anschließend handschriftlich in die Vorlage auf Seite 11."),
            ],
        ),
        (
            "Inhalte gestalten",
            "Von der Idee zu Seiten, die wirklich gebraucht werden",
            [
                (9, "Eine hilfreiche Gliederung entwerfen", "Wenn dein Konzept steht und du eine klare Reihenfolge brauchst.", "Entwirf für ein [BUCHART] zum Thema [THEMA] für [ZIELGRUPPE] drei mögliche Gliederungen. Jede Gliederung soll einen nachvollziehbaren Weg vom leichten Einstieg zur praktischen Anwendung zeigen. Nenne zu jedem Abschnitt das Ziel für die lesende Person. Vermeide Wiederholungen und frage mich am Ende, welche Struktur am besten zu meinem gewünschten Umfang passt.", "Prüfe, ob jedes Kapitel wirklich zum Buchversprechen beiträgt."),
                (10, "Fünf Beispielseiten für deinen Prototyp", "Wenn du erst testen möchtest, bevor du das ganze Buch baust.", "Entwickle fünf unterschiedliche Beispielseiten für mein [BUCHART] mit dem Ziel [NUTZEN]. Beschreibe pro Seite Überschrift, kurze Anleitung, Inhalt oder Aufgabe und den Platzbedarf. Die Seiten sollen zusammen einen kleinen, nutzbaren Prototyp ergeben. Schreibe klar dazu, welche Angaben ich fachlich oder rechtlich selbst prüfen muss.", "Drucke die Testseiten aus oder zeige sie einer Person aus deiner Zielgruppe."),
            ],
        ),
        (
            "Verfeinern und sichtbar machen",
            "Dein eigener Blick bleibt die wichtigste Qualitätskontrolle",
            [
                (11, "Der freundliche Qualitätscheck", "Wenn ein Entwurf verständlich, nützlich und stimmig werden soll.", "Prüfe den folgenden Entwurf aus Sicht einer Person aus der Zielgruppe [ZIELGRUPPE]. Bewerte Verständlichkeit, Reihenfolge, Wiederholungen, konkreten Nutzen, Ton und mögliche Unklarheiten. Zitiere keine fremden Texte und ergänze keine ungesicherten Fakten. Gib zuerst drei Stärken, dann höchstens fünf konkrete Verbesserungen und zum Schluss drei Rückfragen. Entwurf: [TEXT EINFÜGEN].", "Bitte eine echte Person zusätzlich um Rückmeldung. KI kennt die Nutzungssituation nur aus deiner Beschreibung."),
                (12, "Titel, Coverbriefing und Beschreibung vorbereiten", "Wenn dein Konzept klar ist und du es verständlich nach außen tragen möchtest.", "Erstelle für mein Buchkonzept [KONZEPT] zehn sachliche Titel-Untertitel-Paare, drei Coverbriefings und eine ehrliche Kurzbeschreibung. Der Titel soll auch als kleines Vorschaubild verständlich sein. Das Coverbriefing soll Motiv, Stimmung, Farbwelt und gut lesbare Typografie beschreiben. Vermeide geschützte Marken, bekannte Figuren, Erfolgsgarantien und übertriebene Versprechen. Markiere alle Stellen, die ich vor Nutzung rechtlich oder inhaltlich prüfen sollte.", "Prüfe Titel und Gestaltungsideen auf mögliche Marken- und Rechtekonflikte, bevor du dich festlegst."),
            ],
        ),
    ]

    for eyebrow, title, prompts in prompt_pages:
        story += section_header(eyebrow, title)
        for prompt in prompts:
            story.append(prompt_box(*prompt))
        story.append(PageBreak())

    story += section_header(
        "Vorlage 1",
        "Dein Buchideen-Kompass",
        "Fülle die Felder kurz und spontan aus. Du suchst noch keine perfekte Antwort, sondern eine Richtung, die sich für dich stimmig anfühlt.",
    )
    for label, hint, height in [
        ("Themen, die mich wirklich interessieren", "Meine drei Themen: ________________________________________________", 1.65 * cm),
        ("Menschen, deren Alltag ich verstehe", "Mögliche Zielgruppen: ______________________________________________", 1.65 * cm),
        ("Wobei ich gern helfen oder Freude schenken möchte", "Wunsch oder Problem: ______________________________________________", 1.9 * cm),
        ("Welche Buchart sich gut anfühlt", "Journal, Arbeitsbuch, Ratgeber, Malbuch, Rätselbuch oder: __________________", 1.65 * cm),
        ("Meine drei stärksten Ideen", "1. __________________________  2. __________________________  3. __________________________", 2.0 * cm),
        ("Die Idee, die ich zuerst prüfen möchte", "Meine Wahl: _________________________________________________________", 1.65 * cm),
    ]:
        story += [worksheet_row(label, hint, height), Spacer(1, 7)]
    story += [
        Paragraph("Meine Idee darf sich verändern, während ich mehr lerne.", styles["Quote"]),
        PageBreak(),
    ]

    story += section_header(
        "Vorlage 2",
        "Dein Buchkonzept auf einer Seite",
        "Dieses Blatt ist dein roter Faden. Wenn ein Feld noch leer bleibt, weißt du genau, welche Frage als Nächstes dran ist.",
    )
    concept_rows = [
        ("Arbeitstitel", "____________________________________________________________"),
        ("Buchart und ungefährer Umfang", "____________________________________________________________"),
        ("Für wen ist dieses Buch?", "____________________________________________________________"),
        ("In welcher Situation wird es genutzt?", "____________________________________________________________"),
        ("Welchen konkreten Nutzen bietet es?", "____________________________________________________________"),
        ("Was macht es besonders hilfreich?", "____________________________________________________________"),
        ("Welche Inhalte oder Seitentypen gehören hinein?", "____________________________________________________________\n____________________________________________________________"),
        ("Was muss ich selbst prüfen?", "Fakten / Rechte / Sprache / Lesbarkeit / KDP-Regeln / Sonstiges: __________"),
    ]
    concept_table = Table(
        [[Paragraph(label, styles["WorksheetLabel"]), Paragraph(value.replace("\n", "<br/>"), styles["WorksheetText"])] for label, value in concept_rows],
        colWidths=[5.4 * cm, 10.7 * cm],
        rowHeights=[1.35 * cm] * 6 + [1.9 * cm, 1.55 * cm],
    )
    concept_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (0, -1), PINK_WASH),
        ("BACKGROUND", (1, 0), (1, -1), colors.white),
        ("BOX", (0, 0), (-1, -1), 0.7, LINE),
        ("INNERGRID", (0, 0), (-1, -1), 0.5, LINE),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 9),
        ("RIGHTPADDING", (0, 0), (-1, -1), 9),
        ("TOPPADDING", (0, 0), (-1, -1), 9),
    ]))
    story += [concept_table, PageBreak()]

    story += section_header(
        "Vorlage 3",
        "Deine ruhigen Nischen-Notizen",
        "Trage nur ein, was du selbst in den aktuellen Suchergebnissen beobachtet hast. Diese Seite ist keine Verkaufsprognose, sondern eine Entscheidungshilfe.",
    )
    research_rows = [
        ["Suchbegriff", "Wiederkehrende Muster", "Preise / Formate", "Mögliche Lücke"],
        ["1. __________________", "____________________\n____________________", "____________________", "____________________\n____________________"],
        ["2. __________________", "____________________\n____________________", "____________________", "____________________\n____________________"],
        ["3. __________________", "____________________\n____________________", "____________________", "____________________\n____________________"],
    ]
    research_table = Table(
        [[Paragraph(cell.replace("\n", "<br/>"), styles["WorksheetLabel"] if row == 0 else styles["WorksheetText"]) for cell in values] for row, values in enumerate(research_rows)],
        colWidths=[3.45 * cm, 4.35 * cm, 3.55 * cm, 4.75 * cm],
        rowHeights=[1.15 * cm, 2.35 * cm, 2.35 * cm, 2.35 * cm],
    )
    research_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), RASPBERRY),
        ("TEXTCOLOR", (0, 0), (-1, 0), WHITE),
        ("BACKGROUND", (0, 1), (-1, -1), colors.white),
        ("BOX", (0, 0), (-1, -1), 0.7, LINE),
        ("INNERGRID", (0, 0), (-1, -1), 0.5, LINE),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 7),
        ("RIGHTPADDING", (0, 0), (-1, -1), 7),
        ("TOPPADDING", (0, 0), (-1, -1), 8),
    ]))
    story += [
        research_table,
        Spacer(1, 15),
        Paragraph("Meine Ampelentscheidung", styles["H2"]),
        worksheet_row("[ ] Grün   [ ] Gelb   [ ] Rot", "Warum? ________________________________________________________________", 2.0 * cm),
        Spacer(1, 10),
        worksheet_row("Mein nächster kleiner Prüfschritt", "________________________________________________________________________", 1.8 * cm),
        PageBreak(),
    ]

    story += section_header(
        "Vorlage 4",
        "Dein sanfter 30-Tage-Weg",
        "Du musst in einem Monat noch kein fertiges Buch veröffentlichen. Ein geprüftes Konzept und ein kleiner Prototyp sind ein wunderbarer Anfang.",
    )
    week_data = [
        ("Woche 1", "Traum und Richtung", ["3 Themen sammeln", "1 Zielgruppe wählen", "Nutzen in einem Satz", "kleinste Idee markieren"]),
        ("Woche 2", "Beobachten und prüfen", ["3 Suchbegriffe", "Ergebnisse notieren", "Preise und Formate", "Ampel entscheiden"]),
        ("Woche 3", "Konzept entstehen lassen", ["Buchart wählen", "Umfang schätzen", "Gliederung bauen", "Prüffragen sammeln"]),
        ("Woche 4", "Kleinen Prototyp testen", ["5 Beispielseiten", "Lesbarkeit prüfen", "Feedback einholen", "nächsten Schritt wählen"]),
    ]
    week_rows = []
    for week, theme, tasks in week_data:
        week_rows.append([
            Paragraph(week, styles["WorksheetLabel"]),
            Paragraph(f"<b>{html.escape(theme)}</b><br/>{'<br/>'.join('[ ] ' + html.escape(task) for task in tasks)}", styles["WorksheetText"]),
            Paragraph("Meine Notizen:<br/><br/>________________________<br/>________________________", styles["WorksheetText"]),
        ])
    week_table = Table(week_rows, colWidths=[1.65 * cm, 7.1 * cm, 7.35 * cm], rowHeights=[3.15 * cm] * 4)
    week_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (0, -1), PINK_WASH),
        ("BACKGROUND", (1, 0), (-1, -1), colors.white),
        ("BOX", (0, 0), (-1, -1), 0.7, LINE),
        ("INNERGRID", (0, 0), (-1, -1), 0.5, LINE),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
        ("RIGHTPADDING", (0, 0), (-1, -1), 8),
        ("TOPPADDING", (0, 0), (-1, -1), 9),
    ]))
    story += [week_table, PageBreak()]

    story += section_header(
        "Bevor du veröffentlichst",
        "Dein letzter liebevoller Qualitätsblick",
        "Diese Liste ist bewusst einfach gehalten. Sie ersetzt keine rechtliche Beratung, erinnert dich aber an die wichtigsten eigenen Prüfungen.",
    )
    story += [
        bullet_list([
            "Meine Zielgruppe und der Nutzen des Buches sind klar.",
            "Ich habe Texte, Aufgaben, Bilder und Angaben sorgfältig geprüft.",
            "Ich besitze die nötigen Rechte an allen verwendeten Inhalten.",
            "Ich verwende keine fremden Marken, Figuren oder kopierten Texte ohne Erlaubnis.",
            "Titel, Untertitel und Cover sind auch als kleine Vorschau verständlich.",
            "Mindestens eine andere Person hat meinen Prototyp angesehen.",
            "Format, Seitenzahl, Druckkosten, Preis und mögliche Marge wurden geprüft.",
            "Ich habe die aktuellen KDP-Inhaltsrichtlinien direkt bei Amazon gelesen.",
            "Erforderliche Angaben zu KI-generierten Inhalten mache ich wahrheitsgemäß.",
            "Meine Produktbeschreibung verspricht nichts, was das Buch nicht leisten kann.",
        ]),
        Spacer(1, 12),
        Table([[Paragraph(
            '<b>Offizielle Anlaufstellen:</b><br/><link href="https://kdp.amazon.com/help/topic/G200672390" color="#791844">KDP-Inhaltsrichtlinien</link> &nbsp; | &nbsp; '
            '<link href="https://kdp.amazon.com/help/topic/G200672400" color="#791844">Rechte an Inhalten</link> &nbsp; | &nbsp; '
            '<link href="https://kdp.amazon.com/royalty-calculator" color="#791844">KDP-Tantiemenrechner</link>',
            styles["Tip"],
        )]], colWidths=[16.1 * cm], style=TableStyle([
            ("BACKGROUND", (0, 0), (-1, -1), PINK_WASH),
            ("BOX", (0, 0), (-1, -1), 0.7, ROSE),
            ("LEFTPADDING", (0, 0), (-1, -1), 12),
            ("RIGHTPADDING", (0, 0), (-1, -1), 12),
            ("TOPPADDING", (0, 0), (-1, -1), 11),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 11),
        ])),
        PageBreak(),
    ]

    story += section_header(
        "Dein nächster Schritt",
        "Du darfst deinen Weg begleitet weitergehen.",
        "Mit diesem Starterpaket kannst du eine erste Idee finden, sortieren und prüfen. Vielleicht merkst du dabei, dass du dir für die vollständige Umsetzung einen klaren roten Faden, einfache Erklärungen und Menschen an deiner Seite wünschst.",
    )
    story += [
        Spacer(1, 10),
        Table([[Paragraph(
            "<b>Warum ich Kapitel 2 von Herzen empfehle</b><br/><br/>Mit Kapitel 2 habe ich selbst Ideen umgesetzt und Dinge erschaffen. Der verständliche Aufbau, die herzliche Community, der Support und die motivierenden Songs haben mir geholfen, dranzubleiben. Deshalb lege ich den Kurs allen ans Herz, die ebenfalls von einem eigenen Buch träumen und sich eine liebevolle Begleitung für ihren Anfang wünschen.",
            styles["Body"],
        )]], colWidths=[16.1 * cm], style=TableStyle([
            ("BACKGROUND", (0, 0), (-1, -1), colors.white),
            ("BOX", (0, 0), (-1, -1), 0.9, GOLD),
            ("LEFTPADDING", (0, 0), (-1, -1), 18),
            ("RIGHTPADDING", (0, 0), (-1, -1), 18),
            ("TOPPADDING", (0, 0), (-1, -1), 18),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 18),
        ])),
        Spacer(1, 18),
        Paragraph("Auf Seitenfunkeln findest du meine persönliche Kurserfahrung und kannst in Ruhe prüfen, ob Kapitel 2 zu dir passt.", styles["Quote"]),
        Spacer(1, 10),
        Paragraph(
            "<b>Transparenz:</b> Seitenfunkeln ist ein unabhängiger Empfehlungsblog. Dieses Starterpaket wurde eigenständig erstellt und enthält keine internen Kursunterlagen. Bei einem späteren Kauf über einen gekennzeichneten Affiliate-Link kann ich eine Provision erhalten. Für dich ändert sich der Preis dadurch nicht. Bestimmte Ergebnisse oder Einnahmen werden nicht versprochen.",
            styles["Small"],
        ),
        Spacer(1, 18),
        HRFlowable(width="60%", thickness=0.8, color=GOLD, hAlign="CENTER", spaceAfter=13),
        Paragraph("Deine Idee muss noch nicht groß sein. Sie darf heute einfach ihren ersten Funken bekommen.", styles["Quote"]),
        PageBreak(),
    ]

    story += section_header(
        "Rechtliches",
        "Impressum & Copyright",
        "Anbieterangaben und Rechtehinweise für das Seitenfunkeln-Starterpaket.",
    )
    imprint_rows = [
        ("Anbieterin", "Nicole Feller"),
        ("Anschrift", "c/o SourceArt<br/>Tuttlingerstraße 45<br/>78333 Stockach<br/>Deutschland"),
        ("E-Mail", "zauberaufpapier@gmail.com"),
        ("Inhaltlich verantwortlich", "Nicole Feller gemäß § 18 Abs. 2 MStV"),
    ]
    imprint_table = Table(
        [[Paragraph(label, styles["WorksheetLabel"]), Paragraph(value, styles["WorksheetText"])] for label, value in imprint_rows],
        colWidths=[4.4 * cm, 11.7 * cm],
    )
    imprint_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (0, -1), PINK_WASH),
        ("BACKGROUND", (1, 0), (1, -1), colors.white),
        ("BOX", (0, 0), (-1, -1), 0.7, LINE),
        ("INNERGRID", (0, 0), (-1, -1), 0.5, LINE),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 10),
        ("RIGHTPADDING", (0, 0), (-1, -1), 10),
        ("TOPPADDING", (0, 0), (-1, -1), 10),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
    ]))
    story += [
        imprint_table,
        Spacer(1, 18),
        Paragraph("Copyright", styles["H2"]),
        Paragraph("Copyright © 2025/2026 Nicole Feller. Alle Rechte vorbehalten.", styles["Body"]),
        Paragraph(
            "Alle Texte, Illustrationen und Gestaltungselemente dieses Starterpakets sind urheberrechtlich geschützt. Eine Nutzung außerhalb der gesetzlichen Grenzen des Urheberrechts bedarf der vorherigen schriftlichen Zustimmung.",
            styles["Body"],
        ),
        Spacer(1, 8),
        Paragraph("Weitere Angaben", styles["H2"]),
        Paragraph("Angaben gemäß § 5 DDG.", styles["Body"]),
        Paragraph("Kein Ausweis der Umsatzsteuer gemäß § 19 UStG.", styles["Body"]),
        Paragraph("Dieses Starterpaket wurde mit KI-Unterstützung erstellt.", styles["Body"]),
        Paragraph("Seitenfunkeln ist ein unabhängiger Empfehlungsblog von Nicole Feller.", styles["Body"]),
        Spacer(1, 18),
        Table([[Paragraph(
            "Dieses Starterpaket wurde eigenständig erstellt und enthält keine internen Unterlagen des empfohlenen Kurses. Bestimmte Ergebnisse oder Einnahmen werden nicht versprochen.",
            styles["Tip"],
        )]], colWidths=[16.1 * cm], style=TableStyle([
            ("BACKGROUND", (0, 0), (-1, -1), PINK_WASH),
            ("BOX", (0, 0), (-1, -1), 0.7, ROSE),
            ("LEFTPADDING", (0, 0), (-1, -1), 12),
            ("RIGHTPADDING", (0, 0), (-1, -1), 12),
            ("TOPPADDING", (0, 0), (-1, -1), 11),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 11),
        ])),
    ]
    return story


def generate() -> None:
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    doc = SimpleDocTemplate(
        str(OUTPUT),
        pagesize=A4,
        rightMargin=2.0 * cm,
        leftMargin=2.0 * cm,
        topMargin=1.75 * cm,
        bottomMargin=1.45 * cm,
        title="Seitenfunkeln Starterpaket",
        author="Seitenfunkeln",
    )
    doc.build(build_story(), onFirstPage=draw_cover, onLaterPages=draw_content_page)
    print(f"Starterpaket erstellt: {OUTPUT}")


if __name__ == "__main__":
    generate()
