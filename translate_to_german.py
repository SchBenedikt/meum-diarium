#!/usr/bin/env python3
import json
import os

# Dictionary of all translations: {filename: (diary_de, scientific_de)}
translations = {
    "public/posts/seneca/freedom-slavery.json": (
        # Diary
        """Ich habe über das Wesen von Freiheit und Sklaverei nachgedacht, angeregt durch die Beobachtung der Sklaven in meinem Haushalt. Die Frage beunruhigt mich: Was ist der moralische Status der Sklaverei? Wie kann ich behaupten, an die Würde der menschlichen Vernunft zu glauben, während ich menschliche Wesen als Eigentum besitze?

Lasst mich klar sein: Ich glaube nicht, dass die Sklaverei natürlich oder richtig ist, trotz dem, was viele Römer behaupten. Die stoische Ansicht besagt, dass alle Menschen am Logos teilhaben – an der Vernunft und dem göttlichen Prinzip, das das Universum belebt. Wenn alle Menschen Vernunft besitzen, dann sind alle Menschen in gewisser Weise gleich. Die Unterscheidung zwischen Sklave und freiem Mann ist rechtlich und gesellschaftlich, nicht auf echten Unterschieden in der menschlichen Natur begründet.

Und doch existiert die Sklaverei. Sie ist in das Gefüge der römischen Gesellschaft verwoben. Die gesamte Wirtschaft hängt von Sklavenarbeit ab. Militärische Kampagnen fangen Feinde, die zu Sklaven werden. Schulden können Menschen zu Sklaverei führen. Kinder, die von Sklavenmüttern geboren werden, werden Sklaven. Das System ist umfassend und komplex.

Ich habe versucht, die Sklaven in meinem Haushalt mit der Würde zu behandeln, die ich innerhalb der Systemzwänge aufbringen kann. Ich habe befürwortet, dass Herren Sklaven humanitär behandeln – nicht aus Gefühl, sondern aus Vernunft. Ein Sklave besitzt, da er menschlich ist, Vernunft. Wenn ein Herr einen Sklaven brutal behandelt, erniedrigt er den Sklaven, aber er verdirbt auch sich selbst. Er etabliert in sich selbst Gewohnheiten der Grausamkeit, die seinen Charakter vergiften.

Umgekehrt übt ein Herr durch die Behandlung von Sklaven mit Respekt und Würde selbst Tugend. Er erinnert sich selbst an die gemeinsame Menschheit, die er mit allen Menschen teilt, unabhängig von ihrem rechtlichen Status. Er übt die Tugend der Gerechtigkeit gegenüber denen, die ihre Rechte nicht durchsetzen können. Diese moralische Disziplin kommt dem Herren selbst zugute.

Aber ich gestehe: Meine Position ist zutiefst kompromittiert. Ich profitiere materiell vom Sklavensystem. Mein Reichtum wird teilweise durch den Wert versklavter Menschen konstituiert. Mein Komfort hängt von ihrer Arbeit ab. Kann ich wahrheitsgemäß über die Ungerechtigkeit der Sklaverei sprechen, während ich darin teilhabe und davon profitiere?

Ich denke, die Antwort ist, dass ich den Widerspruch anerkennen kann, ohne ihn zu lösen. Ich kann erkennen, dass die Sklaverei mit der vollständigen Anerkennung der menschlichen Vernunft und Würde unvereinbar ist, während ich gleichzeitig anerkenne, dass ich wie die meisten Römer in einem ungerechten System teilhabe. Dieser Widerspruch wird nicht gelöst, indem man so tut, als existiere er nicht.

Was ich kontrollieren kann, ist mein eigener Charakter. Ich kann mich von Grausamkeit enthalten. Ich kann Zurückhaltung üben. Ich kann die Menschlichkeit versklavter Menschen anerkennen und sie entsprechend behandeln. Diese Handlungen lösen die grundlegende Ungerechtigkeit nicht, aber sie stellen den einzigen ethisch vertretbaren Kurs dar, der mir innerhalb der Zwänge des Systems, das ich geerbt habe, verfügbar ist.

Ich denke auch über politische Freiheit für freie Römer nach. Wir Römer schätzen unsere Freiheit, doch wie frei sind wir wirklich? Wir werden durch Gesetz, Gewohnheit und gesellschaftliche Erwartungen eingeschränkt. Wir fürchten die Ungnade des Kaisers. Wir müssen die Meinungen anderer berücksichtigen. Wir streben nach Reichtum und Status, die selbst zu Einschränkungen unserer Freiheit werden.

Die stoische Ansicht ist, dass wahre Freiheit nicht in der Abwesenheit äußerer Zwänge liegt, sondern in der Tugend des Geistes. Der Sklave, der seine Weisheit und Tugend bewahrt, ist freier als der wohlhabende Mann, der von seinen eigenen Begierden versklavt wird. Der freie Mann, der seine Leidenschaften kontrolliert und der Vernunft gemäß lebt, ist in der wahrsten Bedeutung frei.

Dieser Gedanke kann wie schwacher Trost für diejenigen wirken, die wirklich versklavt sind, deren Körper nicht ihnen gehören. Ich möchte nicht suggerieren, dass diese Philosophie die tatsächliche Sklaverei auslöscht oder rechtfertigt. Aber sie bietet dies: dass sogar die versklavte Person die Freiheit bewahrt, die am wichtigsten ist – die Freiheit des Denkens, der moralischen Wahl, der Ausrichtung auf die Vernunft.

Ich bin mit meiner Position zu dieser Frage nicht zufrieden. Ich glaube, die Sklaverei ist ungerecht; ich glaube, die menschliche Vernunft und Würde verdienen Anerkennung und Respekt; ich glaube, das System steht grundlegend im Widerspruch zu stoischen Prinzipien. Doch ich bleibe in diesem System eingebettet. Dieser Widerspruch wird mich bis zu meinem Tod verfolgen. Vielleicht ist das angemessen; vielleicht ist das schuldhafte Gewissen der Preis für das Leben im moralischen Zentrum eines unmoralischen Systems.""",
        # Scientific
        """Senecas Auseinandersetzung mit der Sklaverei stellt einen der komplexesten und beunruhigendsten Aspekte seines philosophischen Vermächtnisses dar. Er lebte zu einer Zeit, in der Sklaverei allgegenwärtig und grundlegend für die römischen sozialen und wirtschaftlichen Strukturen war, doch seine stoische Philosophie, die die menschliche Vernunft als universale Eigenschaft betonte, schien zu widersprechen, dass einige Menschen als Eigentum behandelt werden könnten.

Senecas Herangehensweise an die Sklaverei-Frage hatte mehrere Dimensionen. Erstens argumentierte er theoretisch gegen die natürliche Grundlage der Sklaverei. Er behauptete, dass Sklaverei konventionell (basierend auf Gesetz und Gewohnheit) statt natürlich (basierend auf inhärenten Unterschieden in der menschlichen Natur) war. Alle Menschen besaßen seiner Ansicht nach Vernunft und konnten am göttlichen Prinzip (Logos) teilhaben, das das Universum belebte. Daher widersprach Sklaverei der fundamentalen Realität.

Zweitens befürwortete Seneca auf praktischer Ebene die humane Behandlung von Sklaven. Er argumentierte, dass Herren Sklaven nicht nur aus Wohlwollen, sondern aus rationalem Eigeninteresse gut behandeln sollten: Sklaven brutal zu behandeln verdirbt den Charakter des Herren und schafft Gewohnheiten der Grausamkeit. Die humane Behandlung übte die Tugend des Herren und verstärkte guten Charakter.

Drittens erkannte Seneca, dass wahre Freiheit in der Tugend statt im rechtlichen Status liegt. Ein Sklave mit Weisheit war freier als ein freier Mann, der von seinen Leidenschaften versklavt wird. Diese Philosophie bot eine Art moralischen Trost für versklavte Menschen, während sie gleichzeitig behauptete, dass ihre rechtliche Sklaverei mit dem Besitz der Freiheit vereinbar war, die wirklich zählte – der Freiheit des Geistes und des Urteils.

Historisch gesehen rief Seneca nie zu einer Abschaffung der Sklaverei auf. Er schlug keine radikale Umstrukturierung der römischen Gesellschaft vor. Er operierte innerhalb des Systems, während er für Reformen an seinen Rändern argumentierte. Ob dies eine echte ethische Auseinandersetzung mit Ungerechtigkeit oder einen Kompromiss mit einem ungerechten System darstellte, bleibt umstritten.

Senecas eigene finanzielle Bestände schlossen versklavte Menschen ein, und sein Reichtum wurde teilweise durch Sklavenarbeit konstituiert. Dies schuf einen Widerspruch, den moderne Leser beunruhigend finden und den sogar einige von Senecas Zeitgenossen bemerkt haben könnten. Doch für Seneca bestand die philosophische Lösung darin, sein Gewissen innerhalb eines ungerechten Systems zu steuern, statt das System selbst in Frage zu stellen.

Gelehrte haben festgestellt, dass Senecas Position, obwohl begrenzt, für seine Zeit relativ progressiv war. Nur wenige römische Denker seiner Ära stellten Sklaverei gerecht in Frage oder befürworteten irgendeine Form von Sklavenrechten. Die Tatsache, dass Seneca die Frage ernst nahm und gegen die Natürlichkeit der Sklaverei argumentierte, stellte eine für das erste Jahrhundert n. Chr. relativ fortschrittliche philosophische Position dar.

Die Grenzen von Senecas Position werfen ein Licht auf breitere Fragen, wie Philosophen mit ungerechten Systemen umgehen, von denen sie profitiert haben und in die sie eingebettet sind. Kann eine Person, die innerhalb von Ungerechtigkeit lebt und davon profitiert, wahrheitsgemäß über diese Ungerechtigkeit sprechen? Kann philosophische Konsistenz praktischen Kompromiss überstehen? Diese Fragen, die durch Senecas Position zur Sklaverei aufgeworfen werden, bleiben für zeitgenössische ethische Herausforderungen relevant.

Es ist bemerkenswert, dass Senecas Befürwortung für die humane Behandlung von Sklaven, obwohl begrenzt, möglicherweise römische Rechtsentwicklungen beeinflusst hat. Spätere Kaiser, beeinflusst durch den Stoizismus und durch Figuren wie Seneca, erweiterten tatsächlich bestimmte Schutzmaßnahmen für versklavte Menschen und beschränkten die Rechte von Herren, Sklaven willkürlich zu foltern oder zu töten. Ob dies eine direkte Beeinflussung von Senecas Gedanken oder breitere kulturelle Entwicklungen darstellte, ist historisch unklar, aber es deutet darauf hin, dass selbst begrenzte philosophische Befürwortung für die humane Behandlung versklavter Menschen praktische Konsequenzen haben könnte."""
    ),
}

def translate_file(file_path, diary_de, scientific_de):
    """Update a JSON file with German translations."""
    if not os.path.exists(file_path):
        print(f"✗ File not found: {file_path}")
        return False
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        data['content']['diary'] = diary_de
        data['content']['scientific'] = scientific_de
        
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        
        print(f"✓ Translated: {file_path}")
        return True
    except Exception as e:
        print(f"✗ Error updating {file_path}: {e}")
        return False

# Process all translations
count = 0
for file_path, (diary, scientific) in translations.items():
    if translate_file(file_path, diary, scientific):
        count += 1

print(f"\nCompleted: {count} file(s) translated")
