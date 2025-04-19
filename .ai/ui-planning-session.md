<conversation_summary>
<decisions>

1. Hierarchia ekranów ustalona: ekran uwierzytelniania (Auth) → dashboard → widok generacji fiszek.
2. Utworzenie jednego widoku generacji fiszek z przełącznikiem między generacją AI a generacją manualną.
3. Widok generacji fiszek nie wymaga opcji filtracji ani sortowania.
4. Widok listy fiszek zawiera modal do edycji, który umożliwia modyfikowanie, bez opcji usuwania – usuwanie realizowane oddzielnie z potwierdzeniem.
5. Formularze walidowane inline: pola "front" i "back" muszą zawierać przynajmniej jeden znak, z limitami 200 znaków dla frontu i 500 znaków dla backu.
6. Mechanizmy asynchroniczne (spinnery) mają reagować na odpowiedzi API.
7. Proces uwierzytelniania zostanie zmockowany na początkowym etapie, z pełną integracją JWT w późniejszym czasie.
8. Panel użytkownika będzie zawierał podstawowe informacje (dane profilu, opcja wylogowania).
9. Zarządzanie stanem oparte na useContext i useState, z możliwością wdrożenia Zustand w razie potrzeby.
   </decisions>
   <matched_recommendations>
10. Rozpocząć projekt od zaprojektowania hierarchii ekranów.
11. Utworzyć widok z przełącznikiem między generacją AI a manualną.
12. Wdrożyć walidację formularzy z natychmiastowym wyświetlaniem inline komunikatów błędów.
13. Zastosować mechanizmy asynchroniczne (spinnery, inline error komunikaty) reagujące na odpowiedzi API.
14. Wykorzystać komponenty z biblioteki shadcn/ui wraz z Tailwind dla spójnego i responsywnego interfejsu.
15. Używać useContext i useState do zarządzania stanem, z potencjalnym przejściem do Zustand przy większej złożoności.
    </matched_recommendations>
    <ui_architecture_planning_summary>
    Główne wymagania dotyczące architektury UI obejmują zaprojektowanie hierarchii ekranów zaczynając od ekranu uwierzytelniania (Auth), następnie dashboardu, a potem widoku generacji fiszek. Kluczowe widoki to:

- Ekran Auth (zmockowany na początek) z podstawowym formularzem logowania.
- Dashboard jako centralny hub z dostępem do funkcji generacji fiszek oraz panelem użytkownika (dane profilu, opcja wylogowania).
- Jeden widok generacji fiszek z przełącznikiem umożliwiającym wybór pomiędzy generacją AI a generacją manualną, bez opcji filtrowania czy sortowania.
- Widok listy fiszek z modalem do edycji, umożliwiającym modyfikację danych, podczas gdy usuwanie jest oddzielną akcją z potwierdzeniem.
  Dodatkowo, walidacja na froncie będzie sprawdzać, czy pola "front" i "back" posiadają przynajmniej jeden znak oraz mieszczą się w limitach (200 i 500 znaków). Mechanizmy asynchroniczne, takie jak spinnery i inline komunikaty błędów, będą integrowane bezpośrednio z odpowiedziami API. Zarządzanie stanem opierać się będzie głównie o useContext i useState, z możliwością przejścia do bardziej zaawansowanych narzędzi w razie potrzeby. Interfejs zostanie stworzony przy użyciu komponentów z biblioteki shadcn/ui oraz Tailwind, zapewniając responsywność na różnych urządzeniach.
  </ui_architecture_planning_summary>
  <unresolved_issues>
  Brak nierozwiązanych kwestii – wszystkie kluczowe zagadnienia zostały ustalone. Dalsze doprecyzowanie elementów panelu użytkownika lub dodatkowych ustawień może być rozważone w przyszłych etapach.
  </unresolved_issues>
  </conversation_summary>
